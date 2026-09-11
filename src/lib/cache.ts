// In-memory cache for serverless (no Redis needed)
// Each serverless function instance gets its own cache
// Cache is cleared when the instance is recycled

const cache = new Map<string, { value: unknown; expiry: number }>();

// Cache TTL constants (in seconds)
export const CACHE_TTL = {
  SHORT: 30,
  MEDIUM: 60,
  LONG: 300,
  HOUR: 3600,
} as const;

// Cache key prefixes
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

/**
 * Get value from in-memory cache
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }

  return entry.value as T;
}

/**
 * Set value in in-memory cache with TTL
 */
export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = CACHE_TTL.SHORT
): Promise<void> {
  cache.set(key, {
    value,
    expiry: Date.now() + ttl * 1000,
  });
}

/**
 * Delete a specific cache key
 */
export async function deleteCache(key: string): Promise<void> {
  cache.delete(key);
}

/**
 * Delete multiple cache keys matching a prefix
 */
export async function deleteCachePattern(pattern: string): Promise<void> {
  const prefix = pattern.replace("*", "");
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
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
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fetchFn();
  await setCache(key, data, ttl);
  return data;
}

/**
 * Invalidate all cache entries for a specific entity type
 */
export async function invalidateEntityCache(entityType: string): Promise<void> {
  await deleteCachePattern(`${entityType}:`);
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
