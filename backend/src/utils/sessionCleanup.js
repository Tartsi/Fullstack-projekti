import { PrismaClient } from "@prisma/client";
import logger from "./logger.js";

const prisma = new PrismaClient();

// Function to clean up expired sessions
export const cleanupExpiredSessions = async () => {
  try {
    // Call the database function we created
    await prisma.$executeRaw`SELECT cleanup_expired_sessions();`;
    logger.info("Expired sessions cleaned up successfully");
  } catch (error) {
    logger.error("Failed to cleanup expired sessions:", error);
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
};
