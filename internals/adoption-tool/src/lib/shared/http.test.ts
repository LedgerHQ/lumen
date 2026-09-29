import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchWithRetry, retryDelayMs } from './http.js';

const NOW = 1_700_000_000_000;

function response(
  status: number,
  headers: Record<string, string> = {},
): Response {
  return new Response(status === 204 ? null : 'body', { status, headers });
}

describe('retryDelayMs', () => {
  it('does not retry success, redirects or client errors', () => {
    for (const status of [200, 301, 400, 401, 404, 422]) {
      expect(retryDelayMs(response(status), 1, NOW)).toBeUndefined();
    }
  });

  it('retries 5xx with exponential backoff', () => {
    expect(retryDelayMs(response(502), 1, NOW)).toBe(1_000);
    expect(retryDelayMs(response(500), 2, NOW)).toBe(2_000);
    expect(retryDelayMs(response(503), 3, NOW)).toBe(4_000);
  });

  it('honours retry-after on 429 and on rate-limit 403s', () => {
    expect(retryDelayMs(response(429, { 'retry-after': '7' }), 1, NOW)).toBe(
      7_000,
    );
    expect(retryDelayMs(response(403, { 'retry-after': '30' }), 1, NOW)).toBe(
      30_000,
    );
  });

  it('waits for the primary limit reset (plus a second) when the quota is exhausted', () => {
    const reset = String(NOW / 1000 + 10);
    const limited = response(403, {
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': reset,
    });
    expect(retryDelayMs(limited, 1, NOW)).toBe(11_000);
  });

  it('falls back to backoff for a 429 without any timing header', () => {
    expect(retryDelayMs(response(429), 2, NOW)).toBe(2_000);
  });

  it('never retries a plain 403 (a permission problem)', () => {
    expect(retryDelayMs(response(403), 1, NOW)).toBeUndefined();
    expect(
      retryDelayMs(response(403, { 'x-ratelimit-remaining': '4999' }), 1, NOW),
    ).toBeUndefined();
  });

  it('gives up when the limit will not lift soon', () => {
    const hourLater = String(NOW / 1000 + 3_600);
    const limited = response(403, {
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': hourLater,
    });
    expect(retryDelayMs(limited, 1, NOW)).toBeUndefined();
    expect(
      retryDelayMs(response(429, { 'retry-after': '600' }), 1, NOW),
    ).toBeUndefined();
  });
});

describe('fetchWithRetry', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  function setup(results: (Response | Error)[]): {
    fetchImpl: ReturnType<typeof vi.fn>;
    sleep: ReturnType<typeof vi.fn>;
    options: {
      fetchImpl: typeof fetch;
      sleep: (ms: number) => Promise<void>;
      now: () => number;
    };
  } {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const queue = [...results];
    const fetchImpl = vi.fn(async () => {
      const next = queue.shift();
      if (next === undefined) throw new Error('unexpected extra fetch');
      if (next instanceof Error) throw next;
      return next;
    });
    const sleep = vi.fn(async () => undefined);
    return {
      fetchImpl,
      sleep,
      options: {
        fetchImpl: fetchImpl as unknown as typeof fetch,
        sleep,
        now: () => NOW,
      },
    };
  }

  it('returns a successful response without sleeping', async () => {
    const { fetchImpl, sleep, options } = setup([response(200)]);
    const result = await fetchWithRetry('https://x.test/a', {}, options);
    expect(result.status).toBe(200);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(sleep).not.toHaveBeenCalled();
  });

  it('passes the init through and adds an abort signal', async () => {
    const { fetchImpl, options } = setup([response(200)]);
    await fetchWithRetry(
      'https://x.test/a',
      { headers: { Accept: 'text/plain' } },
      options,
    );
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://x.test/a');
    expect(init.headers).toEqual({ Accept: 'text/plain' });
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('retries a 5xx and returns the eventual success', async () => {
    const { fetchImpl, sleep, options } = setup([
      response(502),
      response(503),
      response(200),
    ]);
    const result = await fetchWithRetry('https://x.test/a', {}, options);
    expect(result.status).toBe(200);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(sleep.mock.calls.map(([ms]) => ms)).toEqual([1_000, 2_000]);
  });

  it('waits for retry-after on a secondary rate limit', async () => {
    const { sleep, options } = setup([
      response(403, { 'retry-after': '5' }),
      response(200),
    ]);
    const result = await fetchWithRetry('https://x.test/a', {}, options);
    expect(result.status).toBe(200);
    expect(sleep).toHaveBeenCalledWith(5_000);
  });

  it('returns a plain 403 immediately so the caller can report it', async () => {
    const { fetchImpl, options } = setup([response(403)]);
    const result = await fetchWithRetry('https://x.test/a', {}, options);
    expect(result.status).toBe(403);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('returns a 404 untouched', async () => {
    const { fetchImpl, options } = setup([response(404)]);
    const result = await fetchWithRetry('https://x.test/a', {}, options);
    expect(result.status).toBe(404);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('retries network errors', async () => {
    const { fetchImpl, options } = setup([
      new TypeError('fetch failed'),
      response(200),
    ]);
    const result = await fetchWithRetry('https://x.test/a', {}, options);
    expect(result.status).toBe(200);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('throws with the url and attempt count once network errors exhaust the attempts', async () => {
    const { fetchImpl, options } = setup([
      new TypeError('fetch failed'),
      new TypeError('fetch failed'),
      new TypeError('fetch failed'),
    ]);
    await expect(
      fetchWithRetry('https://x.test/a', {}, { ...options, maxAttempts: 3 }),
    ).rejects.toThrow('https://x.test/a: fetch failed (after 3 attempts)');
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it('hands back the last failing response after maxAttempts', async () => {
    const { fetchImpl, options } = setup([
      response(500),
      response(500),
      response(500),
    ]);
    const result = await fetchWithRetry(
      'https://x.test/a',
      {},
      { ...options, maxAttempts: 3 },
    );
    expect(result.status).toBe(500);
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });
});
