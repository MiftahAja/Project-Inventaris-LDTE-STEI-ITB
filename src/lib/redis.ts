import Redis from "ioredis";

// Redis connection configuration
const REDIS_URL = process.env.REDIS_URL;

// Global Redis client singleton
const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

/**
 * Create a new Redis connection with optimized settings
 */
function createRedisClient(): Redis | null {
  if (!REDIS_URL) {
    // No Redis configured - gracefully degrade to no caching
    console.warn(
      "[Redis] REDIS_URL not configured. Running without Redis caching."
    );
    return null;
  }

  try {
    const client = new Redis(REDIS_URL, {
      // Connection pool settings
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      // Lazy connect - don't connect until first command
      lazyConnect: true,
      // Enable offline queue for when connection is not ready
      enableOfflineQueue: true,
      // Connection timeout
      connectTimeout: 5000,
      // Keep-alive
      keepAlive: 30000,
      // Enable ready check
      enableReadyCheck: true,
      // DB selection (optional)
      db: 0,
    });

    // Log connection events in development
    if (process.env.NODE_ENV === "development") {
      client.on("connect", () => {
        console.log("[Redis] Connected successfully");
      });
      client.on("ready", () => {
        console.log("[Redis] Ready to accept commands");
      });
      client.on("error", (err) => {
        console.error("[Redis] Error:", err.message);
      });
      client.on("close", () => {
        console.log("[Redis] Connection closed");
      });
    }

    return client;
  } catch (error) {
    console.error("[Redis] Failed to create client:", error);
    return null;
  }
}

/**
 * Get Redis client (singleton pattern)
 */
export function getRedis(): Redis | null {
  if (!REDIS_URL) return null;

  if (globalForRedis.redis) {
    return globalForRedis.redis;
  }

  globalForRedis.redis = createRedisClient() ?? undefined;
  return globalForRedis.redis ?? null;
}

/**
 * Gracefully disconnect Redis on process exit
 */
if (typeof process !== "undefined") {
  process.on("beforeExit", async () => {
    if (globalForRedis.redis) {
      await globalForRedis.redis.quit();
    }
  });
}
