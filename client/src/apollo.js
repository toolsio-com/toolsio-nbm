import { ApolloClient } from 'apollo-client'
import { createUploadLink } from 'apollo-upload-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

// Authorization utils
import { getSubdomain, getCookie } from './utils'

const httpLink = createUploadLink({
  uri: `${process.env.SERVER_HTTP_PROTOCOL}${process.env.SERVER_HOST}/graphql`,
  headers: {
    'subdomain': getSubdomain() // Parse subdomain 
  },
  credentials: 'include'
})

console.log('Cookie: ', getCookie('userId'))
// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `${process.env.SERVER_WS_PROTOCOL}${process.env.SERVER_HOST}/subscriptions`,
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: {
      subdomain: getSubdomain(),
      userId: getCookie('userId')
    }
  }
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const terminatingLink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const link = ApolloLink.from([terminatingLink]);

export default new ApolloClient({
  link,
  cache: new InMemoryCache()
})
