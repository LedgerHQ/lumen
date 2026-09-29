import { describe, expect, it, vi } from 'vitest';
import type { LumenPackage } from '../../config.js';
import type { ConsumerEntry } from '../shared/consumers.js';
import { buildConsumerRow, failedConsumerRow } from './buildConsumerRow.js';
import type { FileFetcher } from './buildConsumerRow.js';

const UI_REACT: LumenPackage = '@ledgerhq/lumen-ui-react';
const UI_RNATIVE: LumenPackage = '@ledgerhq/lumen-ui-rnative';
const DESIGN_CORE: LumenPackage = '@ledgerhq/lumen-design-core';

const latest: Record<LumenPackage, string> = {
  [UI_REACT]: '0.1.60',
  [UI_RNATIVE]: '0.1.62',
  [DESIGN_CORE]: '0.1.29',
};

const consumer: ConsumerEntry = {
  repo: 'LedgerHQ/app',
  packageJsonPath: 'package.json',
};

const pkg = (dependencies: Record<string, string>): string =>
  JSON.stringify({ dependencies });

function fetcher(files: Record<string, string>): {
  fetchFile: FileFetcher;
  spy: ReturnType<typeof vi.fn>;
} {
  const spy = vi.fn(async (_repo: string, path: string) => files[path]);
  return { fetchFile: spy as unknown as FileFetcher, spy };
}

describe('buildConsumerRow', () => {
  it('classifies each declared package and marks the others not-used', async () => {
    const { fetchFile } = fetcher({
      'package.json': pkg({ [UI_REACT]: '0.1.58', [DESIGN_CORE]: '0.1.29' }),
    });
    const row = await buildConsumerRow(consumer, latest, fetchFile);

    expect(row.repo).toBe('LedgerHQ/app');
    expect(row.cells[UI_REACT]).toEqual({
      status: 'behind',
      version: '0.1.58',
      patchesBehind: 2,
    });
    expect(row.cells[UI_RNATIVE]).toEqual({ status: 'not-used' });
    expect(row.cells[DESIGN_CORE]).toMatchObject({ status: 'current' });
  });

  it('treats a missing package.json as unresolved with the path, never not-used', async () => {
    const { fetchFile } = fetcher({});
    const row = await buildConsumerRow(consumer, latest, fetchFile);
    for (const name of [UI_REACT, UI_RNATIVE, DESIGN_CORE]) {
      expect(row.cells[name]).toEqual({
        status: 'unresolved',
        reason: 'package.json not found',
      });
    }
  });

  it('treats an unparseable package.json as unresolved', async () => {
    const { fetchFile } = fetcher({ 'package.json': '{ not json' });
    const row = await buildConsumerRow(consumer, latest, fetchFile);
    expect(row.cells[UI_REACT]).toEqual({
      status: 'unresolved',
      reason: 'package.json is not valid JSON',
    });
  });

  it('keeps the raw spec in the reason when the range cannot be resolved', async () => {
    const { fetchFile } = fetcher({
      'package.json': pkg({ [UI_REACT]: 'latest' }),
    });
    const row = await buildConsumerRow(consumer, latest, fetchFile);
    expect(row.cells[UI_REACT]).toEqual({
      status: 'unresolved',
      reason: 'spec "latest"',
    });
  });

  it('resolves catalog: references through pnpm-workspace.yaml', async () => {
    const { fetchFile } = fetcher({
      'package.json': pkg({ [UI_REACT]: 'catalog:' }),
      'pnpm-workspace.yaml': `catalog:\n  "${UI_REACT}": 0.1.56\n`,
    });
    const row = await buildConsumerRow(consumer, latest, fetchFile);
    expect(row.cells[UI_REACT]).toMatchObject({
      status: 'behind',
      version: '0.1.56',
      patchesBehind: 4,
    });
  });

  it('is unresolved when a catalog: reference has no catalog entry', async () => {
    const { fetchFile } = fetcher({
      'package.json': pkg({ [UI_REACT]: 'catalog:' }),
      'pnpm-workspace.yaml': 'packages:\n  - apps/*\n',
    });
    const row = await buildConsumerRow(consumer, latest, fetchFile);
    expect(row.cells[UI_REACT]).toEqual({
      status: 'unresolved',
      reason: 'catalog: not in pnpm catalog',
    });
  });

  it('only fetches pnpm-workspace.yaml when a catalog: reference exists', async () => {
    const plain = fetcher({ 'package.json': pkg({ [UI_REACT]: '0.1.60' }) });
    await buildConsumerRow(consumer, latest, plain.fetchFile);
    expect(plain.spy.mock.calls.map(([, path]) => path)).toEqual([
      'package.json',
    ]);

    const catalog = fetcher({
      'package.json': pkg({ [UI_REACT]: 'catalog:', [UI_RNATIVE]: 'catalog:' }),
      'pnpm-workspace.yaml': '',
    });
    await buildConsumerRow(consumer, latest, catalog.fetchFile);
    const paths = catalog.spy.mock.calls.map(([, path]) => path);
    expect(paths.filter((path) => path === 'pnpm-workspace.yaml')).toHaveLength(
      1,
    );
  });

  it('fetches each file once even when several packages read it', async () => {
    const { fetchFile, spy } = fetcher({
      'package.json': pkg({ [UI_REACT]: '0.1.60', [UI_RNATIVE]: '0.1.62' }),
    });
    await buildConsumerRow(consumer, latest, fetchFile);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('takes the worst status across every package.json listed for a package', async () => {
    const monorepo: ConsumerEntry = {
      repo: 'LedgerHQ/mono',
      packageJsonPath: 'package.json',
      packageJsonPaths: {
        [UI_REACT]: [
          'apps/a/package.json',
          'apps/b/package.json',
          'apps/c/package.json',
        ],
      },
    };
    const { fetchFile } = fetcher({
      'package.json': pkg({}),
      'apps/a/package.json': pkg({ [UI_REACT]: '0.1.60' }),
      'apps/b/package.json': pkg({ [UI_REACT]: '0.1.40' }),
      'apps/c/package.json': pkg({}),
    });
    const row = await buildConsumerRow(monorepo, latest, fetchFile);
    expect(row.cells[UI_REACT]).toMatchObject({
      status: 'far-behind',
      version: '0.1.40',
      patchesBehind: 20,
    });
    expect(row.cells[UI_RNATIVE]).toEqual({ status: 'not-used' });
  });

  it('surfaces a moved workspace package.json instead of hiding it behind a healthy one', async () => {
    const monorepo: ConsumerEntry = {
      repo: 'LedgerHQ/mono',
      packageJsonPath: 'package.json',
      packageJsonPaths: {
        [UI_REACT]: ['apps/a/package.json', 'apps/moved/package.json'],
      },
    };
    const { fetchFile } = fetcher({
      'apps/a/package.json': pkg({ [UI_REACT]: '0.1.60' }),
    });
    const row = await buildConsumerRow(monorepo, latest, fetchFile);
    expect(row.cells[UI_REACT]).toEqual({
      status: 'unresolved',
      reason: 'apps/moved/package.json not found',
    });
  });

  it('rejects when a fetch fails so the caller can isolate the repo', async () => {
    const fetchFile: FileFetcher = async () => {
      throw new Error('rate limited');
    };
    await expect(buildConsumerRow(consumer, latest, fetchFile)).rejects.toThrow(
      'rate limited',
    );
  });
});

describe('failedConsumerRow', () => {
  it('marks every package unresolved so the repo still shows up in the worst tier', () => {
    const row = failedConsumerRow('LedgerHQ/app');
    expect(row.repo).toBe('LedgerHQ/app');
    for (const name of [UI_REACT, UI_RNATIVE, DESIGN_CORE]) {
      expect(row.cells[name]).toEqual({
        status: 'unresolved',
        reason: 'fetch failed',
      });
    }
  });
});
