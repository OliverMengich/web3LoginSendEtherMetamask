const {buildSchema} = require('graphql');
module.exports = buildSchema(`
    type User{
        id: ID!
        email: String!
        password: String
        address: String!
        nonce: Int!
    }
    input UserInput{
        email: String!
        password: String!
        address: String!
    }
    type AuthData{
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }
    type RootQuery {
        loginMetamask(address: String!): AuthData!
        login(email: String!, password: String!): AuthData!
        users: [User!]
    }
    type RootMutation {
        register(userInput: UserInput): User!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
