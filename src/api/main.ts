import { LanyardResponse } from '../types';
import { CacheAdapter } from '../lib/cache/types';
import { HttpClient, LanyardHttpClient } from '../lib/httpClient';

const BASE_URI = 'https://api.lanyard.rest/v1/users/';

export function getLanyardUri(discordId: string) {
    return `${BASE_URI}${discordId}`;
}

/**
 * High-level wrapper function to retrieve a user presence from Lanyard.
 * Scaffold only — implementation will use a `HttpClient` and optional `CacheAdapter`.
 */


export async function getUser(
    discordId: string,
    options?: { apiKey?: string | null; cache?: CacheAdapter; http?: HttpClient; cacheTtl?: number; select?: string[] }
): Promise<any> {
    const http: HttpClient = options?.http ?? new LanyardHttpClient();
    const cache = options?.cache;
    const apiKey = options?.apiKey ?? null;

    const cacheKey = `lanyard:${discordId}:${apiKey ?? 'no-key'}`;

    if (cache) {
        try {
            const cached = await cache.get(cacheKey);
            if (cached) {
                // If select is provided, project from cache; otherwise return full cached response
                const sel = options?.select;
                if (Array.isArray(sel) && sel.length > 0) {
                    return pickPaths(cached, sel);
                }
                return cached as LanyardResponse;
            }
        } catch {
            // lets just ignore cache errors hehe
        }
    }

    const uri = getLanyardUri(discordId);
    const resp = await http.get<LanyardResponse>(uri, apiKey);

    if (cache) {
        const ttl = options?.cacheTtl ?? 30;
        try {
            await cache.set(cacheKey, resp, ttl);
        } catch {
            // let's just ignore cache errors hehe
        }
    }

    // If select is provided, project only requested paths from the response
    const select = options?.select;
    if (Array.isArray(select) && select.length > 0) {
        return pickPaths(resp, select);
    }

    return resp;
}

/**
 * Pick specific dot-notation paths from an object and return a new object
 * with the nested structure for the selected paths.
 */
function pickPaths(obj: any, paths: string[]) {
    const out: any = {};
    const meta: Record<string, 'ok' | 'null' | 'missing'> = {};

    for (const path of paths) {
        if (!path) continue;
        const parts = path.split('.');
        let src = obj as any;
        let found = true;
        for (const p of parts) {
            if (src == null || !(p in src)) {
                found = false;
                break;
            }
            src = src[p];
        }

        // Determine status: missing | null | ok
        if (!found) {
            meta[path] = 'missing';
        } else if (src === null) {
            meta[path] = 'null';
        } else {
            meta[path] = 'ok';
        }

        // build into out (set null when missing/null so user sees the key)
        let cur = out;
        for (let i = 0; i < parts.length; i++) {
            const key = parts[i];
            if (i === parts.length - 1) {
                cur[key] = found ? src : null;
            } else {
                if (!(key in cur) || typeof cur[key] !== 'object') cur[key] = {};
                cur = cur[key];
            }
        }
    }

    // attach selection meta so caller knows which paths were missing/null
    out.__selection = meta;
    return out;
}