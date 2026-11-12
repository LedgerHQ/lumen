import { describe, expect, it } from 'vitest';
import { diffEntries, isBreaking, markdownReport } from './diffReport.js';

const entries = (record: Record<string, string>) =>
  new Map(Object.entries(record));

describe('diffEntries', () => {
  it('sorts entries into added, removed, changed and renamed', () => {
    const diff = diffEntries(
      entries({ a: '1', b: '2', c: '3', old: '4' }),
      entries({ a: '1', b: '20', d: '5', new: '4' }),
    );

    expect(diff).toEqual({
      added: ['d'],
      removed: ['c'],
      changed: ['b'],
      renamed: [['old', 'new']],
    });
    expect(isBreaking(diff)).toBe(true);
  });

  it('does not guess a rename when two new ids share the content', () => {
    const diff = diffEntries(
      entries({ old: '4' }),
      entries({ x: '4', y: '4' }),
    );

    expect(diff.renamed).toEqual([]);
    expect(diff.removed).toEqual(['old']);
  });
});

describe('markdownReport', () => {
  it('lists breaking changes first', () => {
    const report = markdownReport({
      Tokens: {
        added: ['spacing.2'],
        removed: ['spacing.1'],
        changed: [],
        renamed: [],
      },
      Icons: { added: [], removed: [], changed: [], renamed: [] },
    });

    expect(report).toBe(
      '### Tokens: 2 change(s)\n\n**Removed (1)** — breaking for consumers\n- `spacing.1`\n\n**Added (1)**\n- `spacing.2`\n\n### Icons: no change\n',
    );
  });
});
