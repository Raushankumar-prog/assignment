import { gql } from 'apollo-server';

export const typeDefs = gql`

  type AIResponse {
    response: String!
  }

  type Mutation {
    askAI(message: String!,chatId:String!): AIResponse!
  }
`;
