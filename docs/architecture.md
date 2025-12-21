# Architecture

This document describes the key architectural decisions and the recommended project layout for the Lanyard Wrapper.

Repository layout (high level):

- `src/lib` — Core wrapper logic, HTTP client, and cache API surface.
- `src/services` — Concrete service adapters and implementations (e.g. in-memory cache, Redis adapter).
- `src/types` — TypeScript type definitions for Lanyard responses and internal models.
- `src/utils` — Small helpers and utility functions (validation, parsing, retries).
- `src/config` — Environment-driven configuration and validation helpers.
- `src/api` — Public wrapper entrypoints and factories.
- `examples` — Small runnable examples demonstrating common usage patterns.
- `tests` — Unit and integration tests (not included yet).

Design principles

- Keep the public API small and predictable. The primary entrypoint is a client factory that returns a compact object with a few methods (`getUser`, `clearCache`, `getCacheStats`).
- Separate concerns: HTTP transport, caching, and projection/formatting are independent so they can be replaced or extended.
- Favor availability: cache failures should not break the API surface; they must be best-effort.

Cache design

- The cache is an independent adapter implementing a small interface (`get`, `set`, `del`, `clear`).
- Drivers: an in-memory LRU+TTL implementation is provided by default. Redis can be added as a pluggable driver.
- The cache stores full responses by default. The wrapper supports field projection (select) that extracts requested fields from the cached response.
- Metrics: adapters may optionally provide `stats()` (hits, misses, sets, evictions) for observability.

HTTP client

- The HTTP client is intentionally minimal and uses `fetch` when available. It accepts an optional `Authorization` header for API keys.
- The client exposes a small interface so it can be substituted in tests or by advanced callers.

Projection and field selection

- The wrapper implements a server-agnostic projection system: callers can request nested fields (dot-notation) and receive a compact result containing only the requested data and a small metadata object describing whether each requested path was present, null, or missing.
- This projection is computed locally from the full response (or from cached response) and does not reduce network transfer unless the upstream API supports field selection.

Extensibility and scaling

- Add Redis adapter for distributed caching.
- Add batching or rate-limiting at the HTTP client if required for high-throughput use cases.
- Consider optional background refresh of cached items for low-latency reads.
