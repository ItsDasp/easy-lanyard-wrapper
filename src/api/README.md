# API Wrapper (usage)

Quick usage example:

- Create a default client (uses in-memory cache by default):

## API reference

The `src/api` module exposes the public client factory and related helpers. The primary convenience factory is `createDefaultClient()` which wires the built-in in-memory cache and the HTTP client.

createDefaultClient(options?)
- `options.cacheConfig` — optional cache configuration object (driver, defaultTtl, maxEntries).
- `options.httpTimeoutMs` — timeout value in milliseconds for HTTP requests.

Returned client methods

- `getUser(discordId: string, apiKey?: string | null, select?: string[])` — fetches presence data for the provided Discord ID. If `select` is provided, it must be an array of dot-notation paths (for example: `['data.discord_user.username', 'data.spotify.track_id']`). The returned object will contain only those paths and a `__selection` map describing the presence of each path (`ok | null | missing`).
- `clearCache()` — clears the underlying cache.
- `getCacheStats()` — returns cache statistics when available. The structure includes `{ hits, misses, sets, deletes, evictions, entries }`.

Notes
- The wrapper caches full responses by default and computes projections locally. This keeps network traffic and caching logic straightforward while still allowing callers to receive only the fields they need.

Detailed API contract

getUser(discordId, apiKey?, select?)
- Input:
	- `discordId: string` — required Discord user id.
	- `apiKey?: string | null` — optional API key passed directly as the `Authorization` header.
	- `select?: string[]` — optional array of dot-notation paths to return.

- Behavior and return shape:
	- If `select` is not provided, the method returns the full parsed JSON response returned by Lanyard: `{ success: boolean, data: object | null }`.
	- If `select` is provided, the method returns an object that contains only the requested nested fields and a `__selection` object describing the state of each requested path. The wrapper will return `null` for keys that are missing or null in the original response so that callers can unambiguously know the status of each path.

Examples

1) Full response (no `select`):

```ts
const full = await client.getUser('1234567890');
// full -> { success: true, data: { discord_user: {...}, spotify: {...} } }
```

2) Projection example:

```ts
const partial = await client.getUser('1234567890', null, ['data.discord_user.username','data.spotify.track_id']);
/* partial -> {
	data: { discord_user: { username: 'alice' }, spotify: { track_id: null } },
	__selection: { 'data.discord_user.username': 'ok', 'data.spotify.track_id': 'null' }
} */
```

Cache keys

- The wrapper uses the cache key template `lanyard:{discordId}:{apiKeyOrNoKey}`. This makes cache entries safe to use when the same Discord id is requested under different authorization contexts.

Errors and failure modes

- Network or upstream errors will be surfaced as thrown errors from `getUser` (the HTTP client throws on non-200 responses). The wrapper itself will not mask network errors.
- Cache failures (get/set) are suppressed and treated as best-effort. The wrapper prefers availability: if the cache is down the wrapper will still attempt to fetch from the API.

Extensibility

- The HTTP client and cache are injectable via options to `getUser` and via `createDefaultClient`. This makes the wrapper easy to test and extend.
- API keys, when provided, are sent using the `Authorization` header.
await client.clearCache();
