import { PrismaClient } from "@prisma/client";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import lusca from "lusca";
import logger from "./logger.js";

const prisma = new PrismaClient();
const PgSession = connectPgSimple(session);

/**
 * Create session table if it doesn't exist using direct PostgreSQL connection
 */
export const createSessionTableIfNotExists = async () => {
  const client = new pg.Client({
    connectionString:
      process.env.PRISMA_MIGRATION_URL || process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    logger.info("Connected to database for session table setup");

    // Create session table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      ) WITH (OIDS=FALSE);
    `);

    // Add primary key constraint if it doesn't exist
    try {
      await client.query(`
        ALTER TABLE "session" ADD CONSTRAINT "session_pkey"
        PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
      `);
    } catch (pkError) {
      // Primary key constraint might already exist
      if (
        !pkError.message.includes("already exists") &&
        !pkError.message.includes("multiple primary key")
      ) {
        logger.warn("Could not add primary key constraint:", pkError.message);
      }
    }

    // Create index for expire column if it doesn't exist
    await client.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);

    logger.info("Session table and indexes created successfully");
  } catch (error) {
    logger.error("Error creating session table:", error.message);
    throw error; // Throw error to prevent server from starting with broken session setup
  } finally {
    await client.end();
  }
};

/**
 * Configure session and CSRF protection middleware
 * @param {string} dbUrl - Optional database URL to use (for testing)
 * @returns {Array} Array of Express middleware [session, csrf]
 */
export const configureSession = (dbUrl = null) => {
  const connectionString = dbUrl || process.env.DATABASE_URL;

  const sessionMiddleware = session({
    store: new PgSession({
      conString: connectionString,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "connect.sid", // Explicitly set cookie name
    cookie: {
      secure:
        process.env.NODE_ENV === "production" &&
        !process.env.CORS_ORIGIN?.includes("localhost"),
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite:
        process.env.NODE_ENV === "production" &&
        !process.env.CORS_ORIGIN?.includes("localhost")
          ? "strict"
          : "lax",
    },
  });

  // CSRF protection middleware - only in production
  const middleware = [sessionMiddleware];

  if (process.env.NODE_ENV === "production") {
    const csrfMiddleware = lusca.csrf();
    middleware.push(csrfMiddleware);
  }

  // Return array of middleware for use with app.use(...configureSession())
  return middleware;
};

// Function to clean up expired sessions
export const cleanupExpiredSessions = async () => {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Delete expired sessions directly
    const result = await client.query(`
      DELETE FROM "session"
      WHERE "expire" < NOW();
    `);

    logger.info(
      `Expired sessions cleaned up successfully. Deleted: ${result.rowCount} sessions`
    );
  } catch (error) {
    logger.error("Failed to cleanup expired sessions:", error.message);
  } finally {
    await client.end();
  }
};

// Function to start automatic session cleanup (runs every hour)
export const startSessionCleanup = () => {
  // Run cleanup immediately on startup
  cleanupExpiredSessions();

  // Set up interval to run cleanup every hour (3600000 ms)
  setInterval(cleanupExpiredSessions, 3600000);

  logger.info("Session cleanup scheduler started (runs every hour)");
};

export default {
  cleanupExpiredSessions,
  startSessionCleanup,
  createSessionTableIfNotExists,
  configureSession,
};
