import { gql } from 'apollo-server';

export const typeDefs = gql`
type Query {
  _empty: String
}

  type AIResponse {
    response: String!
  }

  type Mutation {
    askAI(message: String!): AIResponse!
  }
`;
