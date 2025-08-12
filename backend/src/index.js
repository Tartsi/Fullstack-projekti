import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

import loginRouter from "./controllers/login.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

const PORT = Number(process.env.PORT || 4000);

app.use(express.json());

if (process.env.NODE_ENV === "development" && process.env.CORS_ORIGIN) {
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN.split(",").map((s) => s.trim()),
      credentials: true,
    })
  );
}

app.use("/api/login", loginRouter);

// Basic health check
app.get("/healthz", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Connection to database secured!");
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
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
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
