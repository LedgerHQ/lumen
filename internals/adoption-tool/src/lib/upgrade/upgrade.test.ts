import { describe, expect, it } from 'vitest';
import type { LumenPackage } from '../../config.js';
import type { ConsumerEntry } from '../shared/consumers.js';
import { buildMatrix } from './buildMatrix.js';
import { buildPlanInput } from './buildPlanInput.js';
import { selectRuns } from './selectRuns.js';

const versions: Record<LumenPackage, string> = {
  '@ledgerhq/lumen-ui-react': '0.1.51',
  '@ledgerhq/lumen-ui-rnative': '0.1.40',
  '@ledgerhq/lumen-design-core': '0.1.24',
  '@ledgerhq/lumen-lint-plugin': '0.1.5',
};

function entry(
  repo: string,
  extra: Partial<ConsumerEntry> = {},
): ConsumerEntry {
  return {
    repo: `LedgerHQ/${repo}`,
    status: 'production',
    packageJsonPath: 'package.json',
    eligible: true,
    ...extra,
  };
}

const names = (entries: ConsumerEntry[]): string[] =>
  entries.map((e) => e.repo.replace('LedgerHQ/', ''));

describe('selectRuns', () => {
  it('skips repos that are not eligible', () => {
    const { upstream, downstream } = selectRuns([
      entry('a'),
      entry('off', { eligible: false }),
      entry('unset', { eligible: undefined }),
    ]);
    expect(upstream).toEqual([]);
    expect(names(downstream)).toEqual(['a']);
  });

  it('puts upstream repos in their own group', () => {
    const { upstream, downstream } = selectRuns([
      entry('app', {
        upstreamPackages: [{ package: '@ledgerhq/kit', repo: 'LedgerHQ/kit' }],
      }),
      entry('kit'),
    ]);
    expect(names(upstream)).toEqual(['kit']);
    expect(names(downstream)).toEqual(['app']);
  });

  it('orders each group by priority, then repo name', () => {
    const { downstream } = selectRuns([
      entry('z-none'),
      entry('b-p2', { priority: 'P2' }),
      entry('a-p3', { priority: 'P3' }),
      entry('y-p1', { priority: 'P1' }),
      entry('x-p1', { priority: 'P1' }),
    ]);
    expect(names(downstream)).toEqual([
      'x-p1',
      'y-p1',
      'b-p2',
      'a-p3',
      'z-none',
    ]);
  });

  it('still runs a downstream repo whose upstream is not eligible', () => {
    const { upstream, downstream } = selectRuns([
      entry('app', {
        upstreamPackages: [{ package: '@ledgerhq/kit', repo: 'LedgerHQ/kit' }],
      }),
      entry('kit', { eligible: false }),
    ]);
    expect(upstream).toEqual([]);
    expect(names(downstream)).toEqual(['app']);
  });
});

describe('buildPlanInput', () => {
  it('uses the default title and no extras', () => {
    expect(buildPlanInput(entry('a'), versions)).toEqual({
      targetVersions: versions,
      pr: { title: 'chore(deps): upgrade Lumen', labels: [] },
      changeset: false,
      upstreamPackages: [],
    });
  });

  it('applies the repo conventions', () => {
    const upstreamPackages = [
      { package: '@ledgerhq/kit', repo: 'LedgerHQ/kit' },
    ];
    const input = buildPlanInput(
      entry('a', {
        pr: { titlePrefix: 'LIVE-1 ', labels: ['deps'] },
        changeset: true,
        upstreamPackages,
      }),
      versions,
    );
    expect(input.pr).toEqual({
      title: 'LIVE-1 chore(deps): upgrade Lumen',
      labels: ['deps'],
    });
    expect(input.changeset).toBe(true);
    expect(input.upstreamPackages).toEqual(upstreamPackages);
  });
});

describe('buildMatrix', () => {
  it('serializes each run input as compact JSON', () => {
    const { downstream } = buildMatrix([entry('a')], versions);
    expect(downstream).toHaveLength(1);
    expect(downstream[0].name).toBe('LedgerHQ/a');
    expect(JSON.parse(downstream[0].inputs).pr.title).toBe(
      'chore(deps): upgrade Lumen',
    );
    expect(downstream[0].inputs).not.toContain('\n');
  });
});
