"use client";

import { ApolloProvider } from "@apollo/client";
import client from "../query/apolloClient";


export default function Providers({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}