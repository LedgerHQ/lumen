import { readFileSync } from 'node:fs';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { parse } from 'yaml';
import type { IndexEntry } from '../index.d.cts';
import { migrationFrontmatter, type MigrationFrontmatter } from './schema.ts';

const rename = {
  change: 'renamed',
  surface: 'member',
  ref: '@ledgerhq/lumen-ui-react#MenuItem.onSelect',
  to: '@ledgerhq/lumen-ui-react#MenuItem.onClick',
  signal: 'silent',
  detect: [{ pattern: String.raw`<MenuItem[^>]*\bonSelect=` }],
};

const valid = { changes: [rename] };

function withChange(overrides: Record<string, unknown>): unknown {
  return { changes: [{ ...rename, ...overrides }] };
}

function issuesFor(frontmatter: unknown): string[] {
  const result = migrationFrontmatter.safeParse(frontmatter);
  return result.success
    ? []
    : result.error.issues.map(
        (issue) => `${issue.path.join('.')}: ${issue.message}`,
      );
}

describe('migrationFrontmatter', () => {
  it('accepts the README example', () => {
    const readme = readFileSync(
      new URL('../README.md', import.meta.url),
      'utf8',
    );
    const example = readme.match(/```md\n---\n([\s\S]*?)\n---/)?.[1];

    expect(example).toBeDefined();
    expect(issuesFor(parse(example ?? ''))).toEqual([]);
  });

  it('accepts a minimal migration', () => {
    expect(issuesFor(valid)).toEqual([]);
  });

  it('defaults detect to source files and zero hits', () => {
    const parsed = migrationFrontmatter.parse(valid);

    expect(parsed.changes[0].detect?.[0]).toMatchObject({
      in: 'source',
      expect: 'none',
    });
  });

  it.each([
    ['a module', 'module', '@ledgerhq/lumen-ui-react/symbols'],
    ['an export', 'export', '@ledgerhq/lumen-ui-react#MenuPortal'],
    ['a value', 'value', '@ledgerhq/lumen-ui-react#Spot.appearance=number'],
    ['a token', 'token', '@ledgerhq/lumen-design-core#bg-muted-subtle'],
    ['a dependency', 'dependency', '@radix-ui/react-switch'],
  ])('accepts %s address', (_, surface, ref) => {
    expect(
      issuesFor(withChange({ change: 'removed', surface, ref, to: undefined })),
    ).toEqual([]);
  });

  it('lets a loud change skip detect', () => {
    expect(
      issuesFor(withChange({ signal: 'loud', detect: undefined })),
    ).toEqual([]);
  });

  it('accepts requires', () => {
    expect(issuesFor({ ...valid, requires: { tailwindcss: '>=4' } })).toEqual(
      [],
    );
  });

  it.each([
    ['no changes', { changes: [] }, 'changes'],
    ['an unknown change', withChange({ change: 'moved' }), 'changes.0.change'],
    [
      'an unknown surface',
      withChange({ surface: 'hook' }),
      'changes.0.surface',
    ],
    [
      'a ref that does not fit its surface',
      withChange({ ref: '@ledgerhq/lumen-ui-react#MenuItem' }),
      'changes.0.ref',
    ],
    ['a rename without to', withChange({ to: undefined }), 'changes.0.to'],
    ['to on a removal', withChange({ change: 'removed' }), 'changes.0.to'],
    [
      'a to that does not fit its surface',
      withChange({ to: 'onClick' }),
      'changes.0.to',
    ],
    [
      'an unknown signal',
      withChange({ signal: 'loudish' }),
      'changes.0.signal',
    ],
    [
      'a silent change without detect',
      withChange({ detect: undefined }),
      'changes.0.detect',
    ],
    [
      'an invalid regex',
      withChange({ detect: [{ pattern: '(unclosed' }] }),
      'changes.0.detect.0.pattern',
    ],
    [
      'an unknown detect target',
      withChange({ detect: [{ pattern: 'x', in: 'lockfile' }] }),
      'changes.0.detect.0.in',
    ],
    [
      'a requires key that is not a package',
      { ...valid, requires: { 'not a package': '>=4' } },
      'requires.not a package',
    ],
    [
      'a requires range that is not semver',
      { ...valid, requires: { tailwindcss: 'latest-ish' } },
      'requires.tailwindcss',
    ],
    [
      'a codemod that is not kebab-case',
      { ...valid, codemod: 'renameProp' },
      'codemod',
    ],
    ['a PR that is not a number', { ...valid, pr: '#401' }, 'pr'],
    ['a hand-written id', { ...valid, id: 'menu-base-ui' }, ''],
    ['a hand-written version', { ...valid, version: '0.1.36' }, ''],
  ])('rejects %s', (_, frontmatter, path) => {
    const issues = issuesFor(frontmatter);

    expect(issues).not.toEqual([]);
    expect(issues.some((issue) => issue.startsWith(`${path}:`))).toBe(true);
  });
});

describe('published index types', () => {
  it('match the frontmatter the schema parses', () => {
    type PublishedFrontmatter = Omit<
      IndexEntry,
      'id' | 'title' | 'pr' | 'commit' | 'introduced'
    >;
    expectTypeOf<PublishedFrontmatter>().toEqualTypeOf<
      Omit<MigrationFrontmatter, 'pr'>
    >();
  });
});
