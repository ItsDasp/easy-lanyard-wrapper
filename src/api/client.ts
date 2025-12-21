import { createCache } from '../lib/cache';
import { LanyardHttpClient } from '../lib/httpClient';
import { getUser as getUserFromApi } from './main';
import { CacheConfig, CacheStats, CacheAdapterWithStats } from '../lib/cache/types';

export interface WrapperClient {
  getUser(discordId: string, apiKey?: string | null, select?: string[]): Promise<any>;
  clearCache(): Promise<void>;
  getCacheStats(): Promise<CacheStats | null>;
}

export function createDefaultClient(options?: { cacheConfig?: CacheConfig; httpTimeoutMs?: number }): WrapperClient {
  const cache = createCache(options?.cacheConfig);
  const http = new LanyardHttpClient(options?.httpTimeoutMs ?? 5000);

  return {
    async getUser(discordId: string, apiKey?: string | null, select?: string[]) {
      return getUserFromApi(discordId, { apiKey: apiKey ?? null, cache, http, select });
    },
    async clearCache() {
      try {
        await cache.clear();
      } catch {
        // ignore
      }
    }
    ,
    async getCacheStats() {
      // cache may implement optional stats()
      const c = cache as CacheAdapterWithStats;
      try {
        if (typeof c.stats === 'function') {
          const s = await c.stats();
          return s as CacheStats;
        }
      } catch {
        // ignore errors from stats
      }
      return null;
    }
  };
}

export default createDefaultClient;
