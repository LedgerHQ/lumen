import { describe, expect, it } from 'vitest';
import type { ReportRow } from './render.js';
import { sortRowsByAdoption } from './sortRows.js';

function row(repo: string, cells: Partial<ReportRow['cells']>): ReportRow {
  return {
    repo,
    cells: {
      '@ledgerhq/lumen-ui-react': { status: 'not-used' },
      '@ledgerhq/lumen-ui-rnative': { status: 'not-used' },
      '@ledgerhq/lumen-design-core': { status: 'not-used' },
      ...cells,
    },
  };
}

describe('sortRowsByAdoption', () => {
  it('orders green before yellow before red', () => {
    const red = row('red', {
      '@ledgerhq/lumen-ui-react': {
        status: 'far-behind',
        version: '0.1.0',
        patchesBehind: 10,
      },
    });
    const yellow = row('yellow', {
      '@ledgerhq/lumen-ui-react': {
        status: 'behind',
        version: '0.1.5',
        patchesBehind: 2,
      },
    });
    const green = row('green', {
      '@ledgerhq/lumen-ui-react': {
        status: 'current',
        version: '0.1.7',
        patchesBehind: 0,
      },
    });

    expect(sortRowsByAdoption([red, green, yellow]).map((r) => r.repo)).toEqual(
      ['green', 'yellow', 'red'],
    );
  });

  it('within the same tier, sorts by patches behind ascending (4 before 32)', () => {
    const farBehind = row('far-behind-32', {
      '@ledgerhq/lumen-ui-react': {
        status: 'far-behind',
        version: '0.1.0',
        patchesBehind: 32,
      },
    });
    const behind = row('behind-4', {
      '@ledgerhq/lumen-ui-react': {
        status: 'behind',
        version: '0.1.28',
        patchesBehind: 4,
      },
    });

    // Both are non-green, but "behind" (yellow) is a lower severity tier than
    // "far-behind" (red) regardless of patch count — tier wins first.
    expect(sortRowsByAdoption([farBehind, behind]).map((r) => r.repo)).toEqual([
      'behind-4',
      'far-behind-32',
    ]);
  });

  it('breaks ties within the same tier by ui-react, then ui-rnative, then design-core', () => {
    const worseOnReact = row('worse-on-react', {
      '@ledgerhq/lumen-ui-react': {
        status: 'behind',
        version: '0.1.0',
        patchesBehind: 4,
      },
      '@ledgerhq/lumen-design-core': {
        status: 'behind',
        version: '0.1.28',
        patchesBehind: 1,
      },
    });
    const worseOnDesignCore = row('worse-on-design-core', {
      '@ledgerhq/lumen-ui-react': {
        status: 'behind',
        version: '0.1.28',
        patchesBehind: 1,
      },
      '@ledgerhq/lumen-design-core': {
        status: 'behind',
        version: '0.1.0',
        patchesBehind: 4,
      },
    });

    expect(
      sortRowsByAdoption([worseOnReact, worseOnDesignCore]).map((r) => r.repo),
    ).toEqual(['worse-on-design-core', 'worse-on-react']);
  });

  it('treats diverged and unresolved as worst-in-tier, sorted after any patch count', () => {
    const farBehind = row('far-behind', {
      '@ledgerhq/lumen-ui-react': {
        status: 'far-behind',
        version: '0.1.0',
        patchesBehind: 99,
      },
    });
    const diverged = row('diverged', {
      '@ledgerhq/lumen-ui-react': { status: 'diverged', version: '1.0.0' },
    });
    const unresolved = row('unresolved', {
      '@ledgerhq/lumen-ui-react': { status: 'unresolved', version: 'catalog:' },
    });

    expect(
      sortRowsByAdoption([unresolved, diverged, farBehind]).map((r) => r.repo),
    ).toEqual(['far-behind', 'diverged', 'unresolved']);
  });

  it('ignores not-used packages when computing a row severity', () => {
    const greenWithGaps = row('green-with-gaps', {
      '@ledgerhq/lumen-design-core': {
        status: 'current',
        version: '0.1.29',
        patchesBehind: 0,
      },
    });

    expect(sortRowsByAdoption([greenWithGaps]).map((r) => r.repo)).toEqual([
      'green-with-gaps',
    ]);
  });
});
