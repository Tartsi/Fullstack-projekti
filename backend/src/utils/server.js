import logger from "./logger.js";
import { startSessionCleanup } from "./session.js";
import { createSessionTableIfNotExists } from "./session.js";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();

/**
 * Configure CORS middleware
 * @param {Object} app - Express app instance
 */
export const configureCors = (app) => {
  if (process.env.NODE_ENV === "development") {
    app.use(
      cors({
        origin: process.env.CORS_ORIGIN
          ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
          : ["http://localhost:5173", "http://localhost:3000"],
        credentials: true,
      })
    );
  } else {
    // In production, allow same origin requests
    app.use(
      cors({
        origin: true, // Allow same origin
        credentials: true,
      })
    );
  }
};

/**
 * Start server with async initialization
 * @param {Object} app - Express app instance
 * @param {number} port - Port number
 */
export const startServer = async (app, port) => {
  try {
    // Initialize session table before starting the server
    await createSessionTableIfNotExists();

    app.listen(port, "0.0.0.0", () => {
      logger.info(`Server running on http://0.0.0.0:${port}`);

      // Start automatic session cleanup
      startSessionCleanup();
    });
  } catch (error) {
    logger.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

/**
 * Health check endpoint handler
 * Required only DURING DEVELOPMENT!
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const healthCheckHandler = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connection test successful");
    res.json({ ok: true, message: "Database connection successful" });
  } catch (error) {
    logger.error("Database connection failed:", error);
    res.status(500).json({ ok: false, error: "Database connection failed" });
  }
};

/**
 * Register health check routes
 * @param {Object} app - Express app instance
 */
export const registerHealthCheck = (app) => {
  app.get("/healthz", healthCheckHandler);
};

export default {
  healthCheckHandler,
  registerHealthCheck,
  startServer,
  configureCors,
};
