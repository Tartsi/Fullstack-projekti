import express from "express";
import { configureCors } from "../utils/server.js";
import {
  configureSession,
  createSessionTableIfNotExists,
} from "../utils/session.js";
import usersRouter, { setPrismaInstance } from "../controllers/users.js";
import { testPrisma } from "./testSetup.js";

// Test-application that uses test-database
export const createTestApp = () => {
  const app = express();

  // Set the test Prisma instance for the users controller
  setPrismaInstance(testPrisma);

  // Middleware
  app.use(express.json());
  configureCors(app);

  // Session middleware that uses TEST-DATABASE
  app.use(configureSession(process.env.TEST_DATABASE_URL));

  // Routes
  app.use("/users", usersRouter);

  return app;
};

// Test-database initialization
export const initTestDatabase = async () => {
  // Create session-table into the database if it does not already exist
  await createSessionTableIfNotExists();
};
