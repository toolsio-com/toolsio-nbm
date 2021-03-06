import Sequelize from "sequelize";

const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/config.json")[env];

const sequelize = new Sequelize(config);

const models = {
  Account: sequelize.import("./account"),
  User: sequelize.import("./user"),
  Customer: sequelize.import("./customer"),
  Project: sequelize.import("./project"),
  Task: sequelize.import("./task"),
  Sale: sequelize.import("./sale"),
  Item: sequelize.import("./item"),
  Invoice: sequelize.import("./invoice"),
  Channel: sequelize.import("./conversation/channel"),
  ChannelMessage: sequelize.import("./conversation/channelMessage"),
  DirectMessage: sequelize.import("./conversation/directMessage"),
  Member: sequelize.import("./conversation/member"),
  Event: sequelize.import("./event"),
  Invitation: sequelize.import("./invitation")
};

Object.keys(models).forEach(modelName => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

export default models;
