# Lanyard Wrapper

Lanyard Wrapper is a small, focused TypeScript SDK for interacting with the Lanyard Discord presence API. The project provides a lightweight HTTP client, an optional cache layer (in-memory by default), and a simple, ergonomically designed wrapper API so callers can request exactly the fields they need.

Goals:
- Provide a fast, minimal wrapper around Lanyard that is easy to integrate.
- Reduce repeated API calls through an optional cache with TTL and metrics.
- Offer field projection (select specific nested fields) so consumers receive only what they ask for.

See the architecture and usage documentation in the `docs/` folder for design details and examples.
