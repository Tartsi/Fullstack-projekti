import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

import usersRouter from "./controllers/users.js";
import bookingsRouter from "./controllers/bookings.js";

import { requestLogger, errorLogger } from "./utils/middleware.js";
import { sanitizeInput } from "./utils/sanitization.js";
import { startServer } from "./utils/server.js";
import { configureSession } from "./utils/session.js";
import { configureCors } from "./utils/server.js";
import { registerHealthCheck } from "./utils/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT || 4000);

// Trust proxy if behind one (for session cookies to work correctly)
if (
  process.env.NODE_ENV === "development" ||
  process.env.CORS_ORIGIN?.includes("localhost")
) {
  app.set("trust proxy", 1);
}

// Security middleware
app.use(helmet());
// Request logging
app.use(requestLogger);
app.use(express.json());

// Input sanitization middleware
app.use(sanitizeInput);

// Session and CSRF protection configuration
app.use(...configureSession());

// CORS configuration
configureCors(app);

// CSRF token endpoint
app.get("/api/csrf-token", (req, res) => {
  if (process.env.NODE_ENV === "production") {
    // In production, return the CSRF token
    res.json({ csrfToken: req.csrfToken() });
  } else {
    // In development, return a dummy token
    res.json({ csrfToken: "dev-mode-no-csrf" });
  }
});

app.use("/api/users", usersRouter);
app.use("/api/bookings", bookingsRouter);

// Error logging middleware
app.use(errorLogger);

// Health check endpoint
registerHealthCheck(app);

// Serve static files - check if we're in Docker container or development
const distPath =
  process.env.NODE_ENV === "production"
    ? path.resolve(__dirname, "../static") // In Docker container
    : path.resolve(__dirname, "../../frontend/dist"); // In development

app.use(express.static(distPath));

// Start the server
startServer(app, PORT);
