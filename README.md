# Lanyard Wrapper

![npm (version)](https://img.shields.io/npm/v/easy-lanyard-wrapper.svg)
![GitHub Workflow Status](https://github.com/itsdasp/easy-lanyard-wrapper/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)

Easy Lanyard Wrapper
================

Easy Lanyard Wrapper is a compact TypeScript SDK for interacting with the Lanyard Discord presence API. It bundles a minimal HTTP client, an optional cache layer (in-memory by default), and a small ergonomic wrapper API that supports field projection and basic metrics.

Key features
- Lightweight HTTP client with optional `Authorization` header support for API keys.
- Adapter-based cache (in-memory LRU+TTL included). Cache adapters may expose runtime metrics.
- Field projection: callers can request only the nested fields they need using dot-notation paths.
- Simple factory API: `createDefaultClient()` returns a ready-to-use client with cache and HTTP wired.

Quick status and runtime metrics

The library exposes cache metrics (when supported by the adapter) through the client API. Available metrics include:

- `hits` — number of cache hits
- `misses` — number of cache misses
- `sets` — number of cache writes
- `deletes` — number of cache deletions
- `evictions` — number of LRU evictions
- `entries` — current number of entries in cache

Call `client.getCacheStats()` to retrieve these metrics (returns `null` if the adapter does not provide stats).

Quick start

Install dependencies and developer tooling:

```powershell
npm install
npm install --save-dev ts-node typescript dotenv @types/node
```

Run the basic example (PowerShell):

```powershell
npm run example
```

Basic usage (TypeScript)

```ts
import createDefaultClient from './src/api/client';

const client = createDefaultClient();

// full response
const full = await client.getUser('94490510688792576');

// request selected fields only
const partial = await client.getUser('94490510688792576', null, ['data.discord_user.username','data.spotify.track_id']);

// read cache metrics
const stats = await client.getCacheStats();
```

Documentation and links

- Usage / Quick start: [docs/usage.md](docs/usage.md)
- Architecture: [docs/architecture.md](docs/architecture.md)
- API reference: [src/api/README.md](src/api/README.md)
- Examples: [examples/basic/README.md](examples/basic/README.md)
- Contribution guide: [CONTRIBUTING.md](CONTRIBUTING.md)

Publishing and repository

This project is prepared for npm publishing. Before publishing, ensure you have built the project (`npm run build`), and that `package.json` contains the correct `name`, `version`, `author`, and `repository` fields.

But if you're going to post what we already have, please refrain from doing so; if the changes are minimal, it's better to make a pull request.

License

This project is licensed under MIT. See the `LICENSE` file for details.
