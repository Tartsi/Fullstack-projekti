import express from "express";
import { configureCors } from "../utils/server.js";
import {
  configureSession,
  createSessionTableIfNotExists,
} from "../utils/session.js";
import usersRouter, {
  setPrismaInstance as setUsersPrisma,
} from "../controllers/users.js";
import bookingsRouter, {
  setPrismaInstance as setBookingsPrisma,
} from "../controllers/bookings.js";
import { testPrisma } from "./testSetup.js";

// Test-application that uses single shared test-database instance
export const createTestApp = () => {
  const app = express();

  // Set the shared test Prisma instance for both controllers
  // This ensures all controllers use the same database connection
  setUsersPrisma(testPrisma);
  setBookingsPrisma(testPrisma);

  // Middleware
  app.use(express.json());
  configureCors(app);

  // Session middleware that uses TEST-DATABASE
  app.use(configureSession(process.env.TEST_DATABASE_URL));

  // Routes
  app.use("/users", usersRouter);
  app.use("/bookings", bookingsRouter);

  return app;
};

// Test-database initialization
export const initTestDatabase = async () => {
  // Create session-table into the database if it does not already exist
  await createSessionTableIfNotExists();
};
