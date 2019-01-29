// Setup express
import express from "express";

import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
import cors from "cors";
import DataLoader from "dataloader";

// Authentication packages
import session from "express-session";
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import passport from "passport";
import jwt from "jsonwebtoken";

// Subscription packages
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

// Init app
const app = express();
const RedisStore = connectRedis(session)

// env
require("dotenv").config();

// Models
import models from "./models";

// Batch functions
import {
  userBatcher,
  customerBatcher,
  projectBatcher,
  saleBatcher
} from "./utils/batchFunctions";

// Schema
const types = fileLoader(path.join(__dirname + "/types"), { recursive: true });
const typeDefs = mergeTypes(types);

// Resolvers
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname + "/resolvers"), { recursive: true })
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

// View Engine
//app.set('view engine', 'jade')
//app.set('views', [__dirname + '/app/views', __dirname + '/app/views/auth', __dirname + '/app/views/projects'])

// Allow CORS
//app.use(cors("*"));
app.use(cors({
  credentials: true,
  origin: ["http://lvh.me:3000", /\.lvh.me:3000$/]
}))

// BodyParser and Cookie parser Middleware(Setup code)
app.use(logger("dev"));

const apolloServer = new ApolloServer({
  schema,
  context: async ({ req, res }) => {
    // Added this: To remove  The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. 
    res.header('Access-Control-Allow-Origin', req.headers.origin)

    const subdomain = req.headers.subdomain ? req.headers.subdomain : "public"

    let user
    if (req && req.session && req.session.userId) {
      user = await models.User.findOne({ where: { id: req.session.userId }, searchPath: subdomain }, { raw: true }) 
    }

    return {
      models,
      req,
      subdomain,
      //subdomain: 'testa',
      user,
      //user: { id: 1 },
      SECRET: process.env.JWTSECRET1,
      SECRET2: process.env.JWTSECRET2,
      userLoader: new DataLoader(usersId =>
        userBatcher(usersId, models, subdomain)
      ),
      customerLoader: new DataLoader(customersId =>
        customerBatcher(customersId, models, subdomain)
      ),
      projectLoader: new DataLoader(projectsId =>
        projectBatcher(projectsId, models, subdomain)
      ),
      saleLoader: new DataLoader(salesId =>
        saleBatcher(salesId, models, subdomain)
      )
    };
  }
});

app.use("/uploads", express.static("uploads"));

app.use(
  session({
    store: new RedisStore({
      client: process.env.NODE_ENV === 'production' ? new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST) : new Redis(),
      prefix: "sess:"
    }),
    name: "qid",
    secret: process.env.JWTSECRET1,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
)

apolloServer.applyMiddleware({ app });

// Middleware function
app.use((req, res) => {
  res.status(404).json({
    errors: {
      confirmation: "fail",
      message: "Route not yet implemented"
    }
  });
});

if (process.env.NODE_ENV === "development") {
  app.locals.pretty = true;
}

// Set port
app.set("port", process.env.SERVER_PORT || 8080);

const httpServer = createServer(app);
// apolloServer.installSubscriptionHandlers(httpServer);

// httpServer.listen(app.get('port'), () => {
//   console.log(`🚀 Server ready at http://localhost:${app.get('port')}${apolloServer.graphqlPath}`);
//   console.log(`🚀 Subscriptions ready at ws://localhost:${app.get('port')}${apolloServer.subscriptionsPath}`);
// });

// Flash Redis on test env
// if (process.env.NODE_ENV === "test") {
//   new Redis.flushall();
// }


httpServer.listen(app.get("port"), () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: schema,
      onConnect: async ({subdomain, userId }) => {
    
        if(userId && subdomain) {
          const user = await models.User.findOne({ where: { id: userId }, searchPath: subdomain }, { raw: true })
          return { models, subdomain, user };
        }

        return { models };
      }
    },
    {
      server: httpServer,
      path: "/subscriptions"
    }
  );
  console.log(`🚀 Server ready at http://localhost:${app.get('port')}${apolloServer.graphqlPath}`)
  console.log(`🚀 Subscriptions ready at ws://localhost:${app.get('port')}${'/subscriptions'}`)

  if (process.env.NODE_ENV === "test") {
    new Redis.flushall();
  }
});

