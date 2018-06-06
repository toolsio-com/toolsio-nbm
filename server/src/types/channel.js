export default `

  type Channel {
    id: Int!
    name: String!
    users: [User!]!
  }

  type GetChannelsUsersCountResponse {
    id: Int!
    name: String!
    usersCount: Int!
  }

  type CreateChannelResponse {
    success: Boolean!
    channel: Channel
    errors: [Error!]
  }

  type AddMemberResponse {
    success: Boolean!
    members: [Int!] 
    errors: [Error!]
  }

  type Query {
    getChannel(id: Int!): Channel!
    
    getChannelsUsersCount: [GetChannelsUsersCountResponse!]!
  }

  type Mutation {
    createChannel(name: String): CreateChannelResponse!
    
    addMember(members: [Int!], channelId: Int!): AddMemberResponse!
  }

`
