export * from './types';

// Expose adapters
export { MemoryCache } from '../../services/cache/memoryAdapter';

import { CacheConfig, CacheAdapter } from './types';
import MemoryCacheImpl from '../../services/cache/memoryAdapter';
import { getConfig } from '../../config';

/**
 * Create a memory cache instance using given config or environment defaults.
 */
export function createMemoryCache<V = any>(config?: CacheConfig): CacheAdapter<V> {
  const cfg = config ?? getConfig().cache;
  return new MemoryCacheImpl<V>(cfg);
}

/**
 * Factory to create a cache adapter based on the `driver` in config.
 * Currently supports `memory`. Redis support can be added later.
 */
export function createCache<V = any>(config?: CacheConfig): CacheAdapter<V> {
  const cfg = config ?? getConfig().cache;
  const driver = cfg?.driver ?? 'memory';
  if (driver === 'memory') return createMemoryCache<V>(cfg);
  // future: if (driver === 'redis') return createRedisCache(cfg)
  throw new Error(`Unsupported cache driver: ${driver}`);
}
