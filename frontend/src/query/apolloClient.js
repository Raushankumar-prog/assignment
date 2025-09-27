import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// HTTP link for Queries & Mutations only
const httpLink = new HttpLink({
  uri: "https://assignment-nv38.onrender.com/graphql", 
  headers: {
    "Content-Type": "application/json",
    charset: "utf-8",
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;