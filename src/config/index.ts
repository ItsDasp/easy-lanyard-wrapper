import { CacheConfig } from '../lib/cache/types';

export interface AppConfig {
  cache: CacheConfig;
}

export function getConfig(): AppConfig {
  const env = process.env;
  const cacheDriver = env.CACHE_DRIVER === 'redis' ? 'redis' : 'memory';
  const defaultTtl = env.CACHE_DEFAULT_TTL ? Number(env.CACHE_DEFAULT_TTL) : 30;
  const maxEntries = env.CACHE_MAX_ENTRIES ? Number(env.CACHE_MAX_ENTRIES) : 1000;
  const redisUrl = env.REDIS_URL || undefined;

  const cache: CacheConfig = {
    driver: cacheDriver,
    defaultTtl,
    maxEntries,
    redisUrl,
  };

  return { cache };
}

export default getConfig;
