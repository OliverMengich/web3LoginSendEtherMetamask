const {buildSchema} = require('graphql');
module.exports = buildSchema(`
    type User{
        _id: ID!
        email: String!
        password: String
        address: String
        phone: String
    }
    type AuthData{
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }
    type User{
        _id: ID!
        name: String!
        address: String!
        
    }
    type RootQuery {
        loginMetamask(email: String!, password: String!): AuthData!
        login(email: String!, password: String!): AuthData!
    }
    type RootMutation {
        register(eventInput: EventInput): User
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
