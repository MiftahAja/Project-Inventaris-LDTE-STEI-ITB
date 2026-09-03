import { PrismaClient } from "@prisma/client";

// Optimize BigInt serialization for JSON responses
(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized settings
function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    // Connection pool is managed by Prisma automatically
    // For PostgreSQL, Prisma uses pgBouncer-compatible pooling
    // The connection pool size can be tuned via DATABASE_URL parameters:
    // e.g., postgresql://...?connection_limit=20&pool_timeout=20
  });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

// Prevent multiple instances in development (hot reload)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// Graceful shutdown - disconnect on process exit
if (typeof process !== "undefined") {
  process.on("beforeExit", async () => {
    await db.$disconnect();
  });
}
