import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getRepoFileContent,
  listRepoFiles,
  searchPackageJsonUsage,
} from './github.js';

type Call = { url: string; headers: Record<string, string> };

function stubFetch(handler: (url: string) => Response): { calls: Call[] } {
  const calls: Call[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, headers: init?.headers as Record<string, string> });
      return handler(url);
    }),
  );
  return { calls };
}

const json = (body: unknown): Response =>
  new Response(JSON.stringify(body), { status: 200 });

describe('github helpers', () => {
  beforeEach(() => {
    // A token in the env keeps the tests from shelling out to `gh auth token`.
    vi.stubEnv('GITHUB_TOKEN', 'test-token');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe('getRepoFileContent', () => {
    it('returns the raw file text and asks for the raw media type', async () => {
      const { calls } = stubFetch(
        () => new Response('{"name":"x"}', { status: 200 }),
      );

      await expect(
        getRepoFileContent('LedgerHQ/app', 'package.json'),
      ).resolves.toBe('{"name":"x"}');

      expect(calls[0].url).toBe(
        'https://api.github.com/repos/LedgerHQ/app/contents/package.json',
      );
      expect(calls[0].headers.Accept).toBe('application/vnd.github.raw+json');
      expect(calls[0].headers.Authorization).toBe('Bearer test-token');
    });

    it('returns undefined for a missing file', async () => {
      stubFetch(() => new Response('Not Found', { status: 404 }));
      await expect(
        getRepoFileContent('LedgerHQ/app', 'pnpm-workspace.yaml'),
      ).resolves.toBeUndefined();
    });

    it('encodes each path segment but keeps the slashes', async () => {
      const { calls } = stubFetch(() => new Response('', { status: 200 }));
      await getRepoFileContent('LedgerHQ/app', 'apps/my app/#1/package.json');
      expect(calls[0].url).toBe(
        'https://api.github.com/repos/LedgerHQ/app/contents/apps/my%20app/%231/package.json',
      );
    });

    it('throws with the status and a snippet of the body on other failures', async () => {
      stubFetch(
        () =>
          new Response('Bad credentials', {
            status: 401,
            statusText: 'Unauthorized',
          }),
      );
      await expect(
        getRepoFileContent('LedgerHQ/app', 'package.json'),
      ).rejects.toThrow(
        'GitHub contents LedgerHQ/app/package.json: 401 Unauthorized — Bad credentials',
      );
    });
  });

  describe('listRepoFiles', () => {
    it('returns only blob paths', async () => {
      stubFetch(() =>
        json({
          truncated: false,
          tree: [
            { path: 'package.json', type: 'blob' },
            { path: 'apps', type: 'tree' },
            { path: 'apps/web/package.json', type: 'blob' },
          ],
        }),
      );
      await expect(listRepoFiles('LedgerHQ/app')).resolves.toEqual([
        'package.json',
        'apps/web/package.json',
      ]);
    });

    it('throws on a truncated tree rather than reporting a partial file list', async () => {
      stubFetch(() => json({ truncated: true, tree: [] }));
      await expect(listRepoFiles('LedgerHQ/app')).rejects.toThrow('truncated');
    });
  });

  describe('searchPackageJsonUsage', () => {
    const item = (repo: string, path: string) => ({
      path,
      repository: { full_name: repo },
    });

    it('follows pages until the results run out', async () => {
      const firstPage = Array.from({ length: 100 }, (_, i) =>
        item('LedgerHQ/mono', `apps/${i}/package.json`),
      );
      const { calls } = stubFetch((url) => {
        const page = Number(new URL(url).searchParams.get('page'));
        return json({
          total_count: 101,
          items:
            page === 1 ? firstPage : [item('LedgerHQ/other', 'package.json')],
        });
      });

      const hits = await searchPackageJsonUsage(
        'LedgerHQ',
        '@ledgerhq/lumen-ui-react',
      );

      expect(hits).toHaveLength(101);
      expect(hits.at(-1)).toEqual({
        repo: 'LedgerHQ/other',
        path: 'package.json',
      });
      expect(calls).toHaveLength(2);
    });

    it('stops after a single short page', async () => {
      const { calls } = stubFetch(() =>
        json({ total_count: 1, items: [item('LedgerHQ/a', 'package.json')] }),
      );
      await searchPackageJsonUsage('LedgerHQ', '@ledgerhq/lumen-ui-react');
      expect(calls).toHaveLength(1);
      expect(decodeURIComponent(calls[0].url)).toContain(
        'org:LedgerHQ "@ledgerhq/lumen-ui-react" filename:package.json',
      );
    });

    it('throws when the search fails', async () => {
      stubFetch(
        () =>
          new Response('nope', { status: 422, statusText: 'Unprocessable' }),
      );
      await expect(
        searchPackageJsonUsage('LedgerHQ', '@ledgerhq/lumen-ui-react'),
      ).rejects.toThrow('code search for @ledgerhq/lumen-ui-react: 422');
    });
  });
});
