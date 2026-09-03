import { getRedis } from "./redis";

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  SHORT: 30, // 30 seconds - for frequently changing data
  MEDIUM: 60, // 1 minute - for moderately changing data
  LONG: 300, // 5 minutes - for rarely changing data
  HOUR: 3600, // 1 hour - for static data
} as const;

// Cache key prefixes for organization
export const CACHE_KEYS = {
  RUANG_LAB: "ruang-lab",
  MEJA: "meja",
  PETUGAS: "petugas",
  BARANG: "barang",
  UNIT_BARANG: "unit-barang",
  MUTASI_STOK: "mutasi-stok",
  ASSIGNMENTS: "assignments",
  DASHBOARD: "dashboard",
} as const;

interface CacheOptions {
  ttl?: number;
  prefix?: string;
}

/**
 * Get a value from cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;

  try {
    const data = await redis.get(key);
    if (!data) return null;

    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`[Cache] Get error for key "${key}":`, error);
    return null;
  }
}

/**
 * Set a value in cache with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.SHORT
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const serialized = JSON.stringify(value);
    await redis.setex(key, ttl, serialized);
  } catch (error) {
    console.error(`[Cache] Set error for key "${key}":`, error);
  }
}

/**
 * Delete a specific cache key
 */
export async function deleteCache(key: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    await redis.del(key);
  } catch (error) {
    console.error(`[Cache] Delete error for key "${key}":`, error);
  }
}

/**
 * Delete multiple cache keys matching a pattern
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error(`[Cache] Delete pattern error for "${pattern}":`, error);
  }
}

/**
 * Get or set cache - fetch data if not cached
 */
export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL.SHORT
): Promise<T> {
  // Try to get from cache first
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();

  // Store in cache
  await setCache(key, data, ttl);

  return data;
}

/**
 * Invalidate all cache entries for a specific entity type
 * e.g., invalidateEntityCache("ruang-lab") clears all ruang-lab related caches
 */
export async function invalidateEntityCache(
  entityType: string
): Promise<void> {
  await deleteCachePattern(`${entityType}:*`);
}

/**
 * Build a cache key with optional parameters
 */
export function buildCacheKey(
  prefix: string,
  params?: Record<string, string | number | undefined>
): string {
  let key = prefix;

  if (params) {
    const sortedParams = Object.entries(params)
      .filter(([, value]) => value !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join(":");

    if (sortedParams) {
      key += `:${sortedParams}`;
    }
  }

  return key;
}

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
  const redis = getRedis();
  if (!redis) return false;

  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
