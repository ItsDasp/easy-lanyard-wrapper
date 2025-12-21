# Configuración de Caché (placeholder)

Variables de configuración sugeridas para implementar:

- `CACHE_DRIVER` — `memory` | `redis` (default: memory)
- `CACHE_DEFAULT_TTL` — TTL por defecto en segundos (ej. 30)
- `CACHE_MAX_ENTRIES` — máximo de entradas en caché para memory LRU
- `REDIS_URL` — URL de conexión si `CACHE_DRIVER=redis`

La implementación debe validar y documentar estas opciones.
