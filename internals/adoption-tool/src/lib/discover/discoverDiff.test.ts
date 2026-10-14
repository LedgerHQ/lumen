import { describe, expect, it } from 'vitest';
import { diffRegistry } from './discoverDiff.js';

const found = (entries: Record<string, string[]>): Map<string, Set<string>> =>
  new Map(
    Object.entries(entries).map(([repo, paths]) => [repo, new Set(paths)]),
  );

describe('diffRegistry', () => {
  it('reports no change when the found paths are exactly the registry paths', () => {
    const diff = diffRegistry(
      [{ repo: 'o/a', status: 'production', packageJsonPath: 'package.json' }],
      found({ 'o/a': ['package.json'] }),
    );
    expect(diff).toEqual({
      newRepos: [],
      skippedRepos: [],
      missingRepos: [],
      stalePaths: [],
      untrackedPaths: [],
    });
  });

  it('flags paths found in a tracked repo that the registry does not read', () => {
    const diff = diffRegistry(
      [
        {
          repo: 'o/a',
          status: 'production',
          packageJsonPath: 'package.json',
          packageJsonPaths: {
            '@ledgerhq/lumen-ui-react': ['apps/web/package.json'],
          },
        },
      ],
      found({
        'o/a': [
          'package.json',
          'apps/web/package.json',
          'apps/new/package.json',
          'apps/another/package.json',
        ],
      }),
    );
    expect(diff.untrackedPaths).toEqual([
      {
        repo: 'o/a',
        paths: ['apps/another/package.json', 'apps/new/package.json'],
      },
    ]);
    expect(diff.stalePaths).toEqual([]);
  });

  it('flags a known repo whose registry path moved', () => {
    const diff = diffRegistry(
      [
        {
          repo: 'o/a',
          status: 'production',
          packageJsonPath: 'old/package.json',
        },
      ],
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
          status: 'production',
          packageJsonPath: 'package.json',
          packageJsonPaths: {
            '@ledgerhq/lumen-ui-react': [
              'apps/web/package.json',
              'apps/docs/package.json',
            ],
          },
        },
      ],
      found({ 'o/a': ['package.json', 'apps/docs/package.json'] }),
    );
    expect(diff.stalePaths.map((stale) => stale.path)).toEqual([
      'apps/web/package.json',
    ]);
  });

  it('lists new repos with all their paths and missing repos', () => {
    const diff = diffRegistry(
      [
        {
          repo: 'o/gone',
          status: 'production',
          packageJsonPath: 'package.json',
        },
      ],
      found({ 'o/new': ['b/package.json', 'a/package.json'] }),
    );
    expect(diff.newRepos).toEqual([
      { repo: 'o/new', paths: ['a/package.json', 'b/package.json'] },
    ]);
    expect(diff.missingRepos).toEqual(['o/gone']);
    expect(diff.stalePaths).toEqual([]);
    expect(diff.untrackedPaths).toEqual([]);
  });

  it('skips ignored repos instead of reporting them as new', () => {
    const diff = diffRegistry(
      [{ repo: 'o/a', status: 'production', packageJsonPath: 'package.json' }],
      found({
        'o/a': ['package.json'],
        'o/hackathon': ['package.json'],
        'o/new': ['package.json'],
      }),
      new Set(['o/hackathon']),
    );
    expect(diff.newRepos).toEqual([{ repo: 'o/new', paths: ['package.json'] }]);
    expect(diff.skippedRepos).toEqual(['o/hackathon']);
  });
});
