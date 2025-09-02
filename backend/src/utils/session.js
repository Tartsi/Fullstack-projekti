import { PrismaClient } from "@prisma/client";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import logger from "./logger.js";

const prisma = new PrismaClient();
const PgSession = connectPgSimple(session);

/**
 * Create session table if it doesn't exist
 */
export const createSessionTableIfNotExists = async () => {
  try {
    // First create table if it doesn't exist
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL
      ) WITH (OIDS=FALSE);
    `;

    // Add primary key constraint
    try {
      await prisma.$executeRaw`
        ALTER TABLE "session" ADD CONSTRAINT "session_pkey"
        PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
      `;
    } catch (pkError) {
      // Primary key constraint might already exist
      if (
        !pkError.message.includes("already exists") &&
        !pkError.message.includes("multiple primary key")
      ) {
        logger.warn("Could not add primary key constraint:", pkError.message);
      }
    }

    // Try to create index
    try {
      await prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
      `;
    } catch (idxError) {
      logger.warn("Could not create index:", idxError.message);
    }

    logger.info("Session table initialization completed");
  } catch (error) {
    logger.error("Error ensuring session table exists:", error.message);
    // Don't throw error - server should still start even if session table setup fails
  }
};

/**
 * Configure session middleware
 * @param {string} dbUrl - Optional database URL to use (for testing)
 * @returns {Function} Express session middleware
 */
export const configureSession = (dbUrl = null) => {
  const connectionString = dbUrl || process.env.DATABASE_URL;

  return session({
    store: new PgSession({
      conString: connectionString,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "connect.sid", // Explicitly set cookie name
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    },
  });
};

// Function to clean up expired sessions
export const cleanupExpiredSessions = async () => {
  try {
    // Delete expired sessions directly
    const result = await prisma.$executeRaw`
      DELETE FROM "session"
      WHERE "expire" < NOW();
    `;
    logger.info(
      `Expired sessions cleaned up successfully. Deleted: ${result} sessions`
    );
  } catch (error) {
    logger.error("Failed to cleanup expired sessions:", error.message);
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
