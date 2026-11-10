import { describe, expect, it } from 'vitest';
import {
  loadConsumers,
  packageJsonPathsFor,
  parseConsumers,
  registryPaths,
  type ConsumerEntry,
} from './consumers.js';

const valid: ConsumerEntry = {
  repo: 'LedgerHQ/app',
  status: 'production',
  packageJsonPath: 'package.json',
};

describe('parseConsumers', () => {
  it('accepts a minimal entry, per-package paths and notes', () => {
    const entries = parseConsumers([
      valid,
      {
        repo: 'LedgerHQ/mono',
        status: 'production',
        packageJsonPath: 'package.json',
        packageJsonPaths: {
          '@ledgerhq/lumen-ui-react': [
            'apps/a/package.json',
            'apps/b/package.json',
          ],
        },
        notes: 'monorepo',
      },
    ]);
    expect(entries).toHaveLength(2);
  });

  it('requires a known status', () => {
    const { status: _status, ...withoutStatus } = valid;
    expect(() => parseConsumers([withoutStatus])).toThrow(
      '"status" must be one of: production, internal-tool',
    );
    expect(() => parseConsumers([{ ...valid, status: 'prototype' }])).toThrow(
      '"status" must be one of',
    );
    expect(
      parseConsumers([{ ...valid, status: 'internal-tool' }]),
    ).toHaveLength(1);
  });

  it('accepts an optional known priority', () => {
    expect(parseConsumers([{ ...valid, priority: 'P1' }])).toHaveLength(1);
    expect(() => parseConsumers([{ ...valid, priority: 'P4' }])).toThrow(
      '"priority" must be one of: P1, P2, P3',
    );
  });

  it('accepts the upgrade pipeline fields', () => {
    expect(
      parseConsumers([
        {
          ...valid,
          eligible: true,
          changeset: true,
          pr: { titlePrefix: 'LIVE-1 ', labels: ['deps'] },
          upstreamPackages: [
            { package: '@ledgerhq/kit', repo: 'LedgerHQ/kit' },
          ],
        },
        { ...valid, repo: 'LedgerHQ/kit' },
      ]),
    ).toHaveLength(2);
  });

  it('rejects malformed upgrade pipeline fields', () => {
    expect(() => parseConsumers([{ ...valid, eligible: 'yes' }])).toThrow(
      '"eligible" must be a boolean',
    );
    expect(() => parseConsumers([{ ...valid, pr: { title: 'x' } }])).toThrow(
      '"pr" has unknown key "title"',
    );
    expect(() => parseConsumers([{ ...valid, pr: { labels: [''] } }])).toThrow(
      '"pr.labels" must be an array of non-empty strings',
    );
    expect(() =>
      parseConsumers([{ ...valid, upstreamPackages: [{ package: 'x' }] }]),
    ).toThrow('"upstreamPackages[0]".repo must look like "Org/name"');
  });

  it('requires upstream repos to be registered and distinct from the repo', () => {
    const upstream = (repo: string) => ({
      ...valid,
      upstreamPackages: [{ package: '@ledgerhq/kit', repo }],
    });
    expect(() => parseConsumers([upstream('LedgerHQ/missing')])).toThrow(
      'upstream repo "LedgerHQ/missing" is not in the registry',
    );
    expect(() => parseConsumers([upstream('LedgerHQ/app')])).toThrow(
      'cannot reference itself',
    );
  });

  it('rejects a registry that is not an array', () => {
    expect(() => parseConsumers({})).toThrow('must be a JSON array');
  });

  it('rejects unknown keys, so a typo cannot silently drop an override', () => {
    expect(() => parseConsumers([{ ...valid, packageJsonPth: 'x' }])).toThrow(
      'unknown key "packageJsonPth"',
    );
  });

  it('rejects a misspelled package key in packageJsonPaths', () => {
    expect(() =>
      parseConsumers([
        {
          ...valid,
          packageJsonPaths: { '@ledgerhq/lumen-ui-reakt': ['a/package.json'] },
        },
      ]),
    ).toThrow('unknown package "@ledgerhq/lumen-ui-reakt"');
  });

  it('rejects a per-package value that is not a non-empty array of relative paths', () => {
    for (const bad of [
      'apps/a/package.json',
      [],
      [''],
      ['/abs/package.json'],
      [1],
    ]) {
      expect(() =>
        parseConsumers([
          { ...valid, packageJsonPaths: { '@ledgerhq/lumen-ui-react': bad } },
        ]),
      ).toThrow('must be a non-empty array of relative file paths');
    }
  });

  it('rejects a malformed repo and a missing or absolute packageJsonPath', () => {
    expect(() => parseConsumers([{ ...valid, repo: 'not-a-repo' }])).toThrow(
      '"repo" must look like "Org/name"',
    );
    expect(() => parseConsumers([{ repo: 'LedgerHQ/app' }])).toThrow(
      '"packageJsonPath" must be a non-empty relative file path',
    );
    expect(() =>
      parseConsumers([{ ...valid, packageJsonPath: '/package.json' }]),
    ).toThrow('"packageJsonPath"');
  });

  it('rejects duplicate repos', () => {
    expect(() => parseConsumers([valid, valid])).toThrow('duplicate repo');
  });

  it('reports every problem at once, prefixed by the repo', () => {
    let message = '';
    try {
      parseConsumers([
        { ...valid, notes: 5 },
        { repo: 'LedgerHQ/other', status: 'production', packageJsonPath: '' },
      ]);
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toContain('LedgerHQ/app: "notes" must be a string');
    expect(message).toContain('LedgerHQ/other: "packageJsonPath"');
  });

  it('rejects entries that are not objects', () => {
    expect(() => parseConsumers(['LedgerHQ/app'])).toThrow(
      '#0: must be an object',
    );
  });
});

describe('packageJsonPathsFor / registryPaths', () => {
  const entry: ConsumerEntry = {
    repo: 'LedgerHQ/mono',
    status: 'production',
    packageJsonPath: 'package.json',
    packageJsonPaths: {
      '@ledgerhq/lumen-ui-react': [
        'apps/a/package.json',
        'apps/b/package.json',
      ],
      '@ledgerhq/lumen-design-core': ['apps/a/package.json'],
    },
  };

  it('uses the override when present and the default path otherwise', () => {
    expect(packageJsonPathsFor(entry, '@ledgerhq/lumen-ui-react')).toEqual([
      'apps/a/package.json',
      'apps/b/package.json',
    ]);
    expect(packageJsonPathsFor(entry, '@ledgerhq/lumen-ui-rnative')).toEqual([
      'package.json',
    ]);
  });

  it('lists every distinct path the registry reads', () => {
    expect(registryPaths(entry)).toEqual([
      'package.json',
      'apps/a/package.json',
      'apps/b/package.json',
    ]);
    expect(registryPaths(valid)).toEqual(['package.json']);
  });
});

describe('the checked-in registry', () => {
  it('parses cleanly', () => {
    // Tests run with cwd at the project, the data path is workspace-relative.
    const entries = loadConsumers('data/consumers.json');
    expect(entries.length).toBeGreaterThan(0);
  });
});
