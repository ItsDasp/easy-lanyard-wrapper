# Cache Layer (placeholder)

Propósito: implementar una capa de caché separada del cliente HTTP para reducir llamadas a la API de Lanyard.

Opciones a soportar (implementación posterior):
- Estrategias: in-memory LRU, Redis (opcional para distribuidos).
- TTL por recurso y configuración global (ej. 5s/30s/1m según tipo).
- Invalidación: manual (por ID), expiración y políticas de escritura (write-through, write-back).
- Tamaño máximo y métricas (hits/misses).
- Integración con el cliente: middleware o adaptador que primero consulta la caché.

Archivos esperados:
- `src/lib/cache/index.ts` — implementación del cliente de caché (no creada aún).
- `src/services/cache/redisAdapter.ts` — adaptador Redis opcional.
- `src/services/cache/memoryAdapter.ts` — adaptador in-memory.
