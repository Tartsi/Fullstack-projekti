import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

// Load .env-file
dotenv.config();

export default defineConfig({
  test: {
    env: {
      NODE_ENV: "test",
      TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,
      TEST_PRISMA_MIGRATION_URL: process.env.TEST_PRISMA_MIGRATION_URL,
      SESSION_SECRET: process.env.SESSION_SECRET,
      CORS_ORIGIN: process.env.CORS_ORIGIN,
    },
    setupFiles: ["./src/tests/testSetup.js"],
    globals: true,
    environment: "node",
  },
});
