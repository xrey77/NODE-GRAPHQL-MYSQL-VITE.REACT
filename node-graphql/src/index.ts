import "reflect-metadata";
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload-ts";
import { AppDataSource } from "./data-source.js";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import { buildSchema } from "type-graphql";
import { UserRegistration } from './auth/register.js';
import { UserLogin } from "./auth/login.js";
import express from 'express';
import 'dotenv/config'; 
import cors from 'cors';
import http from 'http';
import { GetUsers } from "./users/getusers.js";
import { GetUserId } from "./users/getuserid.js";
import { ChangePassword } from "./users/changepassword.js";
import { UpdateProfile } from "./users/updateprofile.js";
import { UploadPicture } from "./users/uploadpicture.js";
import { ActivateMFA } from "./users/activatemfa.js";
import { VerifyMFA } from "./users/verifymfa.js";
import { ListProducts } from "./products/list.js";

async function bootstrap() {

  // Initialize TypeORM Data Source
  try {
    await AppDataSource.initialize();
    console.log("✅ Data Source has been initialized!");
  } catch (error: any) {
    console.error("❌ Error during Data Source initialization:", error);
    process.exit(1);
  }

  const app = express();
  const httpServer = http.createServer(app); // Needed for graceful shutdown/subscriptions
  const PORT = process.env.PORT || 3000;

  // Build Type-GraphQL Schema
  const schema = await buildSchema({
    resolvers: [
      GetUsers,
      GetUserId,
      UserRegistration,
      UserLogin,
      ChangePassword,
      UpdateProfile,
      UploadPicture,
      ActivateMFA,
      VerifyMFA,
      ListProducts
    ],
    scalarsMap: [
      { 
        type: GraphQLUpload as any, 
        scalar: GraphQLUpload 
      }
    ],  
  });

  // Create Apollo Server Instance
  const server = new ApolloServer({
    schema,
    // uploads: false, 
  });

  // Start Apollo Server before applying middleware
  await server.start();

  // Express Standard Middleware
  app.use(cors());
  app.use(express.static('public'));
  app.use(express.json());

  // GraphQL Middleware
  // This mounts GraphQL on the /graphql endpoint
  app.use(
    '/graphql',
    cors<cors.CorsRequest>(),
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.authorization }),
    }),
  );

  // Start the combined server
  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 REST API ready at http://localhost:${PORT}/api`);
  console.log(`🚀 GraphQL ready at http://localhost:${PORT}/graphql`);
}

bootstrap().catch((err) => console.error(err));