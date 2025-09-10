import { beforeEach, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";

// Test-environment Prisma-client - single instance for all tests
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.TEST_DATABASE_URL,
    },
  },
});

// Setup database before each test
export const setupTestDb = async () => {
  try {
    // Clean up in order due to foreign key constraints
    await prisma.booking.deleteMany({});
    await prisma.user.deleteMany({});

    // Reset auto-increment sequences if needed
    await prisma.$executeRaw`ALTER SEQUENCE "User_id_seq" RESTART WITH 1;`;
    await prisma.$executeRaw`ALTER SEQUENCE "Booking_id_seq" RESTART WITH 1;`;
  } catch (error) {
    // If sequences don't exist (UUID primary keys), ignore the error
    if (!error.message.includes("does not exist")) {
      console.warn("Database cleanup warning:", error.message);
    }
  }
};

// Clean database after all tests
export const teardownTestDb = async () => {
  try {
    // Clean specific tables in order (foreign key constraints)
    await prisma.booking.deleteMany({});
    await prisma.user.deleteMany({});

    // Clean session table if it exists (it might be handled differently)
    try {
      await prisma.$executeRaw`DELETE FROM session WHERE 1=1;`;
    } catch (error) {
      // Session table might not exist or be managed differently
      console.warn("Could not clean session table:", error.message);
    }
  } catch (error) {
    console.error("Error in teardownTestDb:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// Vitest hooks
beforeEach(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await teardownTestDb();
});

export { prisma as testPrisma };
