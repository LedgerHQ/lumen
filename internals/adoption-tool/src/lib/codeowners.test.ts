import { describe, expect, it } from 'vitest';
import {
  parseCodeowners,
  primaryOwners,
  summarizeOwners,
} from './codeowners.js';

describe('parseCodeowners', () => {
  it('reads pattern and owners, skipping comments and blanks', () => {
    const rules = parseCodeowners(
      [
        '# header',
        '',
        '*  @org/team-a @alice',
        'apps/web/ @org/team-b # trailing',
      ].join('\n'),
    );
    expect(rules).toEqual([
      { pattern: '*', owners: ['@org/team-a', '@alice'] },
      { pattern: 'apps/web/', owners: ['@org/team-b'] },
    ]);
  });

  it('drops rules with no owner', () => {
    expect(parseCodeowners('docs/\n*.js @org/js')).toEqual([
      { pattern: '*.js', owners: ['@org/js'] },
    ]);
  });

  it('keeps email owners', () => {
    expect(parseCodeowners('* dev@example.com')).toEqual([
      { pattern: '*', owners: ['dev@example.com'] },
    ]);
  });
});

describe('summarizeOwners', () => {
  it('ranks catch-all owners first, then by rule count', () => {
    const summaries = summarizeOwners([
      { pattern: 'a/', owners: ['@org/b'] },
      { pattern: 'b/', owners: ['@org/b', '@org/c'] },
      { pattern: '*', owners: ['@org/a'] },
    ]);
    expect(summaries.map((s) => s.owner)).toEqual([
      '@org/a',
      '@org/b',
      '@org/c',
    ]);
    expect(summaries[0].isDefault).toBe(true);
    expect(summaries[1].rules).toBe(2);
  });
});

describe('primaryOwners', () => {
  it('returns only the catch-all owners when there are any', () => {
    const summaries = summarizeOwners([
      { pattern: '*', owners: ['@org/a'] },
      { pattern: 'x/', owners: ['@org/b'] },
    ]);
    expect(primaryOwners(summaries)).toEqual(['@org/a']);
  });

  it('falls back to the three most-referenced owners without a catch-all', () => {
    const summaries = summarizeOwners(
      ['@a', '@b', '@c', '@d'].map((owner) => ({
        pattern: 'x/',
        owners: [owner],
      })),
    );
    expect(primaryOwners(summaries)).toHaveLength(3);
  });

  it('returns nothing for a repo with no rules', () => {
    expect(primaryOwners([])).toEqual([]);
  });
});
