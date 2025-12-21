import { CacheAdapter, CacheConfig } from '../../lib/cache/types';

/**
 * In-memory LRU cache with TTL per entry.
 * - Uses a Map to preserve insertion/access order (LRU by moving used keys to the end).
 * - TTL is in seconds.
 */
export class MemoryCache<V = any> implements CacheAdapter<V> {
  private store = new Map<string, { value: V; expiresAt?: number }>();
  private defaultTtl: number | undefined;
  private maxEntries: number | undefined;

  // metrics
  private hits = 0;
  private misses = 0;
  private sets = 0;
  private deletes = 0;
  private evictions = 0;

  constructor(private config?: CacheConfig) {
    this.defaultTtl = config?.defaultTtl;
    this.maxEntries = config?.maxEntries;
  }

  private isExpired(expiresAt?: number) {
    return typeof expiresAt === 'number' && Date.now() > expiresAt;
  }

  async get(key: string): Promise<V | null> {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }
    if (this.isExpired(entry.expiresAt)) {
      this.store.delete(key);
      this.misses++;
      return null;
    }
    this.hits++;
    // Move to the end to mark as recently used
    this.store.delete(key);
    this.store.set(key, entry);
    return entry.value;
  }

  async set(key: string, value: V, ttl?: number): Promise<void> {
    const ttlSeconds = ttl ?? this.defaultTtl;
    const expiresAt = typeof ttlSeconds === 'number' ? Date.now() + ttlSeconds * 1000 : undefined;

    if (this.store.has(key)) this.store.delete(key);
    this.store.set(key, { value, expiresAt });
    this.sets++;

    if (typeof this.maxEntries === 'number' && this.store.size > this.maxEntries) {
      // delete oldest (first) entry
      const firstKey = this.store.keys().next().value;
      if (firstKey !== undefined) {
        this.store.delete(firstKey);
        this.evictions++;
      }
    }
  }

  async del(key: string): Promise<void> {
    if (this.store.delete(key)) this.deletes++;
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async stats() {
    return {
      hits: this.hits,
      misses: this.misses,
      sets: this.sets,
      deletes: this.deletes,
      evictions: this.evictions,
      entries: this.store.size,
    };
  }
}

export default MemoryCache;
