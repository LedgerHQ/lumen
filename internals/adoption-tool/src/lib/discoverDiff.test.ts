import { describe, expect, it } from 'vitest';
import { diffRegistry } from './discoverDiff.js';

const found = (entries: Record<string, string[]>): Map<string, Set<string>> =>
  new Map(
    Object.entries(entries).map(([repo, paths]) => [repo, new Set(paths)]),
  );

describe('diffRegistry', () => {
  it('reports no change when every registry path is still found', () => {
    const diff = diffRegistry(
      [{ repo: 'o/a', packageJsonPath: 'package.json' }],
      found({ 'o/a': ['package.json', 'apps/x/package.json'] }),
    );
    expect(diff).toEqual({ newRepos: [], missingRepos: [], stalePaths: [] });
  });

  it('flags a known repo whose registry path moved', () => {
    const diff = diffRegistry(
      [{ repo: 'o/a', packageJsonPath: 'old/package.json' }],
      found({ 'o/a': ['new/package.json'] }),
    );
    expect(diff.stalePaths).toEqual([
      {
        repo: 'o/a',
        path: 'old/package.json',
        foundPaths: ['new/package.json'],
      },
    ]);
  });

  it('checks per-package override paths too', () => {
    const diff = diffRegistry(
      [
        {
          repo: 'o/a',
          packageJsonPath: 'package.json',
          packageJsonPaths: {
            '@ledgerhq/lumen-ui-react': 'apps/web/package.json',
          },
        },
      ],
      found({ 'o/a': ['package.json'] }),
    );
    expect(diff.stalePaths.map((stale) => stale.path)).toEqual([
      'apps/web/package.json',
    ]);
  });

  it('lists new repos with all their paths and missing repos', () => {
    const diff = diffRegistry(
      [{ repo: 'o/gone', packageJsonPath: 'package.json' }],
      found({ 'o/new': ['b/package.json', 'a/package.json'] }),
    );
    expect(diff.newRepos).toEqual([
      { repo: 'o/new', paths: ['a/package.json', 'b/package.json'] },
    ]);
    expect(diff.missingRepos).toEqual(['o/gone']);
    expect(diff.stalePaths).toEqual([]);
  });
});
