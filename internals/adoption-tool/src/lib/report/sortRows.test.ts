import { describe, expect, it } from 'vitest';
import { sortRowsByAdoption, worstCell } from './sortRows.js';
import type { Cell, ReportRow } from './types.js';

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
      '@ledgerhq/lumen-ui-react': {
        status: 'unresolved',
        reason: 'catalog: not in pnpm catalog',
      },
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

describe('sortRowsByAdoption tie-breaks', () => {
  it('falls through to the next column and the repo name when two rows are unresolved on the same package', () => {
    const unresolved: Cell = { status: 'unresolved', reason: 'spec "latest"' };
    const b = row('b', { '@ledgerhq/lumen-ui-react': unresolved });
    const a = row('a', {
      '@ledgerhq/lumen-ui-react': unresolved,
      '@ledgerhq/lumen-design-core': {
        status: 'behind',
        version: '0.1.28',
        patchesBehind: 1,
      },
    });
    const c = row('c', { '@ledgerhq/lumen-ui-react': unresolved });

    // Same first column (Infinity vs Infinity): the design-core column then
    // puts the 1-behind row after the untouched ones, and ties go by name.
    expect(sortRowsByAdoption([c, a, b]).map((r) => r.repo)).toEqual([
      'b',
      'c',
      'a',
    ]);
  });
});

describe('worstCell', () => {
  const current: Cell = {
    status: 'current',
    version: '0.1.7',
    patchesBehind: 0,
  };
  const behind: Cell = { status: 'behind', version: '0.1.5', patchesBehind: 2 };
  const farBehind: Cell = {
    status: 'far-behind',
    version: '0.1.0',
    patchesBehind: 7,
  };
  const evenFurther: Cell = {
    status: 'far-behind',
    version: '0.0.1',
    patchesBehind: 30,
  };
  const unresolved: Cell = { status: 'unresolved', reason: 'spec "latest"' };

  it('is not-used when nothing declares the package', () => {
    expect(worstCell([])).toEqual({ status: 'not-used' });
    expect(worstCell([{ status: 'not-used' }, { status: 'not-used' }])).toEqual(
      { status: 'not-used' },
    );
  });

  it('ignores not-used cells when another path declares the package', () => {
    expect(worstCell([{ status: 'not-used' }, current])).toBe(current);
  });

  it('picks the highest severity', () => {
    expect(worstCell([current, farBehind, behind])).toBe(farBehind);
    expect(worstCell([farBehind, unresolved, behind])).toBe(unresolved);
  });

  it('picks the most patches behind within the same severity', () => {
    expect(worstCell([farBehind, evenFurther])).toBe(evenFurther);
    expect(worstCell([evenFurther, farBehind])).toBe(evenFurther);
  });
});
