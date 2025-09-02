import { beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

// Test-environment Prisma-client
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

// Setup database before each test
export const setupTestDb = async () => {
  // This uses TEST-PRISMA-MIGRATION-URL (Neon test-branch)
  await prisma.$executeRaw`TRUNCATE TABLE "User", "Booking" RESTART IDENTITY CASCADE;`;
};

// Cleanup after test
export const teardownTestDb = async () => {
  await prisma.$disconnect();
};

// Vitest hooks
beforeEach(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await teardownTestDb();
});

export { prisma as testPrisma };
