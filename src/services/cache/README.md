# Cache Adapters (placeholder)

Descripción: adaptadores para diferentes backends de caché.

Adaptadores a crear más adelante:
- `memoryAdapter.ts`: implementación in-memory (LRU / Map + TTL).
- `redisAdapter.ts`: implementación para Redis (ioredis/redis client).

Requisitos:
- Interfaz común `get(key)`, `set(key, value, ttl?)`, `del(key)`, `clear()`.
- Manejo de serialización y compatibilidad con TTL.
