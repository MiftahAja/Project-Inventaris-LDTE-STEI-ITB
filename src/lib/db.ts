import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

// Optimize BigInt serialization for JSON responses
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// Create connection pool with optimized settings for serverless
function createPool() {
  return new Pool({
    connectionString,
    // Pool settings optimized for Vercel serverless
    max: 5,                    // Max connections in pool
    min: 0,                    // Min connections (0 for serverless)
    idleTimeoutMillis: 10000,  // Close idle connections after 10s
    connectionTimeoutMillis: 5000, // Timeout for new connections
    allowExitOnIdle: true,     // Allow process to exit when all connections idle
  });
}

// Create Prisma client with pg adapter for serverless Postgres compatibility
function createPrismaClient() {
  const pool = createPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances in development (hot reload)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Graceful shutdown - disconnect on process exit
if (typeof process !== "undefined") {
  process.on("beforeExit", async () => {
    await db.$disconnect();
  });
}
