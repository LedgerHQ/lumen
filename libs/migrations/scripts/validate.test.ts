import { describe, expect, it } from 'vitest';
import { checkMigration, checkVersionPlans, planPackages } from './validate.ts';

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

describe('checkVersionPlans', () => {
  it('passes when no migration was added', () => {
    expect(checkVersionPlans([], [])).toEqual([]);
  });

  it('accepts plans for the migrations package and the broken one', () => {
    expect(
      checkVersionPlans(
        ['libs/migrations/src/menu-base-ui.md'],
        [plan('@ledgerhq/lumen-migrations'), plan('@ledgerhq/lumen-ui-react')],
      ),
    ).toEqual([]);
  });

  it('requires a plan for the migrations package', () => {
    expect(
      checkVersionPlans(
        ['libs/migrations/src/menu-base-ui.md'],
        [plan('@ledgerhq/lumen-ui-react')],
      ),
    ).toEqual([expect.stringContaining('@ledgerhq/lumen-migrations')]);
  });

  it('requires a plan for the package that breaks', () => {
    expect(
      checkVersionPlans(
        ['libs/migrations/src/menu-base-ui.md'],
        [plan('@ledgerhq/lumen-migrations')],
      ),
    ).toEqual([expect.stringContaining('the package that breaks')]);
  });
});
