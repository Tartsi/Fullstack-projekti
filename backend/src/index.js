import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import helmet from "helmet";

import usersRouter from "./controllers/users.js";
import { requestLogger, errorLogger } from "./utils/middleware.js";
import logger from "./utils/logger.js";
import { startSessionCleanup } from "./utils/sessionCleanup.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();
const PgSession = connectPgSimple(session);

const PORT = Number(process.env.PORT || 4000);

// Security middleware
app.use(helmet());

// Request logging
app.use(requestLogger);

app.use(express.json());

// Session configuration
app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

if (process.env.NODE_ENV === "development" && process.env.CORS_ORIGIN) {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    })
  );
}

app.use("/api/users", usersRouter);

// Error logging middleware
app.use(errorLogger);

// Basic health check
app.get("/healthz", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connection test successful");
    res.json({ ok: true, message: "Database connection successful" });
  } catch (e) {
    logger.error("Database connection failed:", e);
    res.status(500).json({ ok: false, error: "Database connection failed" });
  }
});

// Serve static files - check if we're in Docker container or development
const distPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../static") // In Docker container
    : path.resolve(__dirname, "../../frontend/dist"); // In development

app.use(express.static(distPath));

app.listen(PORT, "0.0.0.0", () => {
  logger.info(`Server running on http://0.0.0.0:${PORT}`);

  // Start automatic session cleanup
  startSessionCleanup();
});
