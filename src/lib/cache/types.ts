export interface CacheAdapter<V = any> {
  get(key: string): Promise<V | null>;
  set(key: string, value: V, ttl?: number): Promise<void>;
  del(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  evictions: number;
  entries: number;
}

// Optional extension: adapters may implement `stats()` to expose metrics
export interface CacheAdapterWithStats<V = any> extends CacheAdapter<V> {
  stats?(): Promise<CacheStats> | CacheStats;
}

export interface CacheConfig {
  driver?: 'memory' | 'redis';
  defaultTtl?: number; // seconds
  maxEntries?: number; // for memory driver
  redisUrl?: string;
}
