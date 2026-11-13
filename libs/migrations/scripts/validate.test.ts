import { describe, expect, it } from 'vitest';
import type { MigrationFrontmatter } from './schema.ts';
import { planPackages } from './shared.ts';
import {
  checkMigration,
  checkMigrationChanges,
  parseNameStatus,
  type FileChange,
} from './validate.ts';

const frontmatter = `---
changes:
  - change: renamed
    surface: member
    ref: '@ledgerhq/lumen-ui-react#MenuItem.onSelect'
    to: '@ledgerhq/lumen-ui-react#MenuItem.onClick'
    signal: silent
    detect:
      - { pattern: 'onSelect=' }
---
`;

const before = '```tsx before\n<MenuItem onSelect={close} />\n```';
const after = '```tsx after\n<MenuItem onClick={close} />\n```';

const body = `
## Before → after

${before}

${after}

## Decide

Always rename.

## Verify

No \`onSelect=\` left.
`;

const valid = frontmatter + body;

function plan(...packages: string[]): string {
  const bumps = packages.map((name) => `'${name}': patch`).join('\n');
  return `---\n${bumps}\n---\n\nfeat: something\n`;
}

describe('checkMigration', () => {
  it('accepts a valid migration', () => {
    expect(checkMigration('menu-base-ui.md', valid)).toEqual([]);
  });

  it('ignores headings inside code examples', () => {
    const withCode = valid.replace(
      'Always rename.',
      'Always rename.\n\n```md\n## Not a section\n```',
    );
    expect(checkMigration('menu-base-ui.md', withCode)).toEqual([]);
  });

  it('lets a review pattern match an after example', () => {
    const review = valid.replace(
      "{ pattern: 'onSelect=' }",
      "{ pattern: '<MenuItem', expect: review }",
    );
    expect(checkMigration('menu-base-ui.md', review)).toEqual([]);
  });

  it('does not test manifest patterns against the examples', () => {
    const manifests = valid.replace(
      "{ pattern: 'onSelect=' }",
      '{ pattern: \'"@radix-ui/react-menu"\', in: manifests }',
    );
    expect(checkMigration('menu-base-ui.md', manifests)).toEqual([]);
  });

  it.each([
    [
      'a file name that is not kebab-case',
      'MenuBaseUi.md',
      valid,
      'kebab-case',
    ],
    ['no frontmatter', 'menu-base-ui.md', body, 'frontmatter block'],
    [
      'frontmatter that is not YAML',
      'menu-base-ui.md',
      `---\nchanges: [\n---\n${body}`,
      'frontmatter: invalid YAML',
    ],
    [
      'invalid frontmatter',
      'menu-base-ui.md',
      valid.replace('signal: silent', 'signal: loudish'),
      'changes.0.signal',
    ],
    [
      'a missing section',
      'menu-base-ui.md',
      valid.replace('## Decide', '### Decide'),
      'body sections',
    ],
    [
      'sections out of order',
      'menu-base-ui.md',
      `${frontmatter}\n## Decide\n\nx\n\n## Before → after\n\n${before}\n\n${after}\n\n## Verify\n\nx\n`,
      'body sections',
    ],
    [
      'an empty section',
      'menu-base-ui.md',
      valid.replace('Always rename.', ''),
      '`## Decide` is empty',
    ],
    [
      'no tagged after example',
      'menu-base-ui.md',
      valid.replace('```tsx after', '```tsx'),
      'tagged `after`',
    ],
    [
      'a pattern that misses the before examples',
      'menu-base-ui.md',
      valid.replace('onSelect={close}', 'onPick={close}'),
      'matches no before example',
    ],
    [
      'a pattern that still matches an after example',
      'menu-base-ui.md',
      valid.replace('onClick={close}', 'onSelect={close}'),
      'still matches an after example',
    ],
  ])('rejects %s', (_, fileName, content, expected) => {
    expect(
      checkMigration(fileName, content).some((issue) =>
        issue.includes(expected),
      ),
    ).toBe(true);
  });
});

describe('planPackages', () => {
  it('reads the bumped packages', () => {
    expect(
      planPackages(
        plan('@ledgerhq/lumen-ui-react', '@ledgerhq/lumen-migrations'),
      ),
    ).toEqual(['@ledgerhq/lumen-ui-react', '@ledgerhq/lumen-migrations']);
  });
});

describe('parseNameStatus', () => {
  it('reads plain changes and renames', () => {
    expect(
      parseNameStatus('A\tnew.md\nM\tedited.md\nR100\told.md\trenamed.md\n'),
    ).toEqual([
      { status: 'A', path: 'new.md' },
      { status: 'M', path: 'edited.md' },
      { status: 'R', path: 'renamed.md', from: 'old.md' },
    ]);
  });
});

describe('checkMigrationChanges', () => {
  const path = 'libs/migrations/src/menu-base-ui.md';
  const migrationsPlan = plan('@ledgerhq/lumen-migrations');
  const brokenPlan = plan('@ledgerhq/lumen-ui-react');
  const breaking: MigrationFrontmatter = {
    changes: [
      {
        change: 'removed',
        surface: 'export',
        ref: '@ledgerhq/lumen-ui-react#MenuPortal',
        signal: 'loud',
      },
    ],
  };
  const check = (
    changes: FileChange[],
    plans: string[],
    frontmatter: MigrationFrontmatter = breaking,
  ): string[] => checkMigrationChanges(changes, plans, () => frontmatter);

  it('passes when no migration changed', () => {
    expect(check([{ status: 'M', path: 'libs/ui-react/x.ts' }], [])).toEqual(
      [],
    );
  });

  it('accepts a new migration with both plans', () => {
    expect(
      check([{ status: 'A', path }], [migrationsPlan, brokenPlan]),
    ).toEqual([]);
  });

  it('accepts an edit with the migrations plan only', () => {
    expect(check([{ status: 'M', path }], [migrationsPlan])).toEqual([]);
  });

  it.each([
    ['a new migration', 'A'],
    ['an edit', 'M'],
  ])('requires the migrations plan for %s', (_, status) => {
    expect(check([{ status, path }], [brokenPlan])).toEqual([
      expect.stringContaining('@ledgerhq/lumen-migrations'),
    ]);
  });

  it('requires the plan of each Lumen package its refs break', () => {
    expect(
      check(
        [{ status: 'A', path }],
        [migrationsPlan, plan('@ledgerhq/lumen-utils-shared')],
      ),
    ).toEqual([`${path}: needs a version plan for @ledgerhq/lumen-ui-react`]);
  });

  it('accepts any package plan for an external dependency change', () => {
    const external: MigrationFrontmatter = {
      changes: [
        {
          change: 'required',
          surface: 'dependency',
          ref: '@base-ui/react',
          signal: 'loud',
        },
      ],
    };

    expect(
      check([{ status: 'A', path }], [migrationsPlan, brokenPlan], external),
    ).toEqual([]);
    expect(check([{ status: 'A', path }], [migrationsPlan], external)).toEqual([
      `${path}: needs a version plan for the package that breaks`,
    ]);
  });

  it('needs no package plan when a new migration names its PR', () => {
    expect(
      check([{ status: 'A', path }], [migrationsPlan], {
        ...breaking,
        pr: 401,
      }),
    ).toEqual([]);
  });

  it('rejects a rename', () => {
    expect(
      check(
        [{ status: 'R', path: 'libs/migrations/src/menu.md', from: path }],
        [migrationsPlan],
      ),
    ).toEqual([
      `${path} → libs/migrations/src/menu.md: a migration's file name is its id and can't change`,
    ]);
  });

  it('rejects a deletion, even next to an addition', () => {
    expect(
      check(
        [
          { status: 'D', path },
          { status: 'A', path: 'libs/migrations/src/menu.md' },
        ],
        [migrationsPlan, brokenPlan],
      ),
    ).toEqual([`${path}: a migration can't be deleted, its id is permanent`]);
  });
});
