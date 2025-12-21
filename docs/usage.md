# Usage

This document shows how to install and run the Lanyard Wrapper example and provides a short reference for the public API.

Requirements
- Node.js 18+ is recommended (includes global `fetch`). If you use Node <18, provide a `fetch` polyfill (for example `node-fetch`).
- A working npm toolchain.

Quick start

1. Install project dependencies and developer tools:

```powershell
npm install
npm install --save-dev ts-node typescript dotenv @types/node
```

2. Copy the example environment file and edit if needed:

```powershell
copy .\examples\basic\.env.example .\.env
notepad .\.env
```

3. Run the example (PowerShell helper):

```powershell
npm run example
```

If you prefer to run the compiled code, build and run the `dist` entrypoint after configuring `tsconfig.json` and a build step.

Public API (short)

- `createDefaultClient(options?)` — returns a client with methods below.

Client methods

- `getUser(discordId: string, apiKey?: string | null, select?: string[])` — fetch presence for `discordId`. If `select` is provided (array of dot-notation paths), the wrapper returns a projection containing only those fields plus a `__selection` metadata object that marks each path as `ok | null | missing`.
- `clearCache()` — clear the in-memory cache.
- `getCacheStats()` — return cache metrics when available (hits, misses, sets, evictions, entries).

Notes

- The wrapper caches full responses by default and computes projections from cache when possible. This optimizes for fewer network calls while still returning only requested data to the caller.
- If you need to use an API key, pass it to `getUser` as the second argument. The key is sent as the `Authorization` header.

Detailed reference

Overview

The wrapper exposes a small client surface intended to be simple to integrate and predictable in behavior. The primary function is to retrieve presence data for a Discord user via Lanyard and optionally return only a subset of fields requested by the caller. The wrapper is responsible for three distinct concerns:

- Transport: perform HTTP requests to the Lanyard API and return parsed JSON.
- Caching: optional adapter-based cache (in-memory by default) stores full responses to reduce network traffic and latency.
- Projection: optionally return a compact subset of the response based on dot-notation paths supplied by the caller.

Configuration (environment)

The following environment variables are supported by the built-in helpers:

- `CACHE_DRIVER` — `memory` or `redis` (default `memory`).
- `CACHE_DEFAULT_TTL` — default cache TTL in seconds (default `30`).
- `CACHE_MAX_ENTRIES` — maximum number of entries for in-memory LRU cache (default `1000`).
- `REDIS_URL` — URL to connect to Redis when `CACHE_DRIVER=redis`.

Client factory

`createDefaultClient(options?)` returns an object with the methods described below. `options.cacheConfig` can override cache driver and TTL and `options.httpTimeoutMs` sets HTTP timeout in milliseconds.

Method: getUser

Signature:

```ts
getUser(discordId: string, apiKey?: string | null, select?: string[]): Promise<any>
```

Behavior:

- `discordId` is required and must be a Discord user ID string.
- `apiKey` is optional. When provided it is sent as the `Authorization` header unchanged.
- `select` is optional. If omitted the method returns the full Lanyard response (same structure as the upstream API). If provided, the method returns a compact object containing only the requested paths and a `__selection` map describing whether each path was present (`ok`), present but `null` (`null`) or not found (`missing`).

Return values and examples

- Full response (default): the method returns the parsed JSON response received from Lanyard, typically shaped as `{ success: boolean, data: { ... } }`.

Example (simplified full response):

```json
{
	"success": true,
	"data": {
		"discord_user": { "id": "123", "username": "alice" },
		"discord_status": "online",
		"activities": [],
		"spotify": null
	}
}
```

- Projected response (when `select` provided): returns only the requested nested fields plus `__selection` metadata. Keys that are missing or null are included with `null` values so the caller can distinguish between missing data and omitted keys.

Example (select): request `['data.discord_user.username', 'data.spotify.track_id']`

```json
{
	"data": {
		"discord_user": { "username": "alice" },
		"spotify": { "track_id": null }
	},
	"__selection": {
		"data.discord_user.username": "ok",
		"data.spotify.track_id": "null"
	}
}
```

Cache behavior

- The wrapper stores the full parsed response under an internal cache key of the form `lanyard:{discordId}:{apiKeyOrNoKey}`. This key includes the API key (or `no-key`) to isolate cached responses that might differ by authorization context.
- When `getUser` is called and a cached full response exists, the wrapper will compute the projection from the cached response if `select` is provided.
- Cache adapters must implement `get`, `set`, `del`, and `clear`. Adapters may optionally expose `stats()` to report `{ hits, misses, sets, deletes, evictions, entries }`.

Projection semantics and error handling

- Projection is computed locally from the full parsed response (or from cache). This means network transfer is not reduced by projection unless the upstream API supports a field selection parameter.
- If a requested path refers to a field that exists but has value `null`, the projection includes the key with a `null` value and `__selection` marks it as `null`.
- If a requested path is not present anywhere in the response, the projection includes the key with `null` and `__selection` marks it as `missing`.
- Cache errors and projection errors are considered non-fatal: the wrapper will fall back to performing the HTTP request or returning the available data rather than throwing for cache failures.

Timeouts and retries

- The built-in HTTP client uses an abort timeout (configurable by `httpTimeoutMs`). The wrapper does not perform automatic retries by default; callers may wrap the client if retries are required.

Best practices

- Use `select` to limit the shape of the returned object to what your application needs. This reduces downstream parsing and memory use even if it does not reduce network transfer.
- When high read throughput is required consider using Redis as the cache backend so multiple processes can share cached responses.
- Provide an API key only when necessary; keys change the cache key and can produce duplicate cached entries for the same user under different authorization contexts.

Examples

See `examples/basic/example.ts` for a runnable demonstration of fetching full and projected responses and reading cache metrics.
