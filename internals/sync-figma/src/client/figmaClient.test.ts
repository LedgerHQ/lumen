import { describe, expect, it, vi } from 'vitest';
import { createFigmaClient } from './figmaClient.js';

const jsonResponse = (status: number, body: unknown, headers = {}): Response =>
  new Response(JSON.stringify(body), { status, headers });

describe('createFigmaClient', () => {
  it('sends the token and parses the response', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, { meta: {} }));
    const client = createFigmaClient({ token: 'secret', fetch });

    await expect(client.getLocalVariables('FILE')).resolves.toEqual({
      meta: {},
    });
    expect(fetch).toHaveBeenCalledWith(
      'https://api.figma.com/v1/files/FILE/variables/local',
      expect.objectContaining({
        method: 'GET',
        headers: { 'X-Figma-Token': 'secret' },
      }),
    );
  });

  it('requests SVG renders for a batch of node ids', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, { images: {} }));
    const client = createFigmaClient({ token: 't', fetch });

    await client.getSvgUrls('FILE', ['1:2', '3:4']);

    expect(fetch.mock.calls[0][0]).toBe(
      'https://api.figma.com/v1/images/FILE?ids=1%3A2%2C3%3A4&format=svg',
    );
  });

  it('retries rate limits, honoring Retry-After', async () => {
    const fetch = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(429, {}, { 'retry-after': '3' }))
      .mockResolvedValueOnce(jsonResponse(503, {}))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));
    const sleep = vi.fn().mockResolvedValue(undefined);
    const client = createFigmaClient({ token: 't', fetch, sleep });

    await expect(client.getFile('FILE')).resolves.toEqual({ ok: true });
    expect(sleep.mock.calls).toEqual([[3000], [2000]]);
  });

  it('gives up after the retry budget and names the failing call', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(429, {}));
    const client = createFigmaClient({
      token: 't',
      fetch,
      maxRetries: 1,
      sleep: async () => undefined,
    });

    await expect(client.getFile('FILE')).rejects.toThrow(
      'Figma GET v1/files/FILE failed: 429',
    );
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('retries network failures, then gives up', async () => {
    const fetch = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('fetch failed'))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));
    const sleep = vi.fn().mockResolvedValue(undefined);
    const client = createFigmaClient({ token: 't', fetch, sleep });

    await expect(client.getFile('FILE')).resolves.toEqual({ ok: true });
    expect(sleep).toHaveBeenCalledOnce();

    const failing = createFigmaClient({
      token: 't',
      fetch: vi.fn().mockRejectedValue(new TypeError('fetch failed')),
      maxRetries: 1,
      sleep,
    });
    await expect(failing.getFile('FILE')).rejects.toThrow('fetch failed');
  });

  it('does not retry client errors', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(403, {}));
    const client = createFigmaClient({ token: 't', fetch });

    await expect(client.getFile('FILE')).rejects.toThrow('403');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('posts JSON bodies', async () => {
    const fetch = vi.fn().mockResolvedValue(jsonResponse(200, {}));
    const client = createFigmaClient({ token: 't', fetch });

    await client.postVariables('FILE', { variables: [] });

    expect(fetch.mock.calls[0][1]).toEqual({
      method: 'POST',
      headers: { 'X-Figma-Token': 't', 'Content-Type': 'application/json' },
      body: '{"variables":[]}',
    });
  });
});
