# Example: basic

This directory contains a minimal example that demonstrates how to use the wrapper to fetch a user presence and request specific fields.

How to run

1. Copy the example environment file and edit values if required:

```powershell
copy .\examples\basic\.env.example .\.env
notepad .\.env
```

2. Install developer tooling (one-time):

```powershell
npm install --save-dev ts-node typescript dotenv @types/node
```

3. Run the example:

```powershell
npm run example
```

What the example shows

- Fetching a full presence response for a given Discord ID.
- Demonstrating cache behavior (first call misses, second call hits).
- Requesting a projection using `select` to return only specific nested fields.
