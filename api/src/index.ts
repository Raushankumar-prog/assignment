import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { schema } from './graphql/schema.js';


// Initialize Express
const app = express();
app.use(cors());

// Create HTTP Server
const httpServer = http.createServer(app);

// Create Apollo Server
const server = new ApolloServer({
  schema,
});

// Start Apollo Server
async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();