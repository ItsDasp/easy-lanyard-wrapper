/**
 * HTTP client scaffold for Lanyard API calls.
 * Note: API keys are passed via the `Authorization` header when provided.
 */
export interface HttpClient {
  get<T = any>(url: string, apiKey?: string | null): Promise<T>;
}

export class LanyardHttpClient implements HttpClient {
  constructor(private timeoutMs: number = 5000) {}

  async get<T = any>(url: string, apiKey?: string | null): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/json'
    };
    if (apiKey) headers['Authorization'] = apiKey;

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
    const signal = controller ? controller.signal : undefined;
    const timeoutId = controller ? setTimeout(() => controller.abort(), this.timeoutMs) : undefined;

    try {
      // Use global fetch (node >=18) or a polyfill provided by the user environment
      const res = await (globalThis as any).fetch(url, { method: 'GET', headers, signal });
      if (timeoutId) clearTimeout(timeoutId as any);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${res.statusText} ${text}`);
      }
      const json = await res.json();
      return json as T;
    } catch (err: any) {
      // normalize abort error message
      if (err && err.name === 'AbortError') throw new Error('Request timed out');
      throw err;
    }
  }
}

export default LanyardHttpClient;
