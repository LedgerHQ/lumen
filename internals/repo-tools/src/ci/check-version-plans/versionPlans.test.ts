import { describe, expect, it } from 'vitest';
import { checkMessage, checkPlan, parsePlan } from './versionPlans.ts';

const plan = (frontmatter: string, message: string): string =>
  `---\n${frontmatter}\n---\n\n${message}\n`;

const react = "'@ledgerhq/lumen-ui-react': patch";

describe('parsePlan', () => {
  it('reads the entries and the message lines', () => {
    expect(parsePlan(plan(react, 'feat(Button): add `green`'))).toEqual({
      entries: [{ name: '@ledgerhq/lumen-ui-react', bump: 'patch' }],
      message: ['feat(Button): add `green`'],
    });
  });

  it('returns undefined without frontmatter', () => {
    expect(parsePlan('feat(Button): add `green`')).toBeUndefined();
  });
});

describe('checkMessage', () => {
  it.each([
    'feat(Button): add the `green` appearance',
    'feat(Link)!: rename `isExternal` to `external`',
    'fix(Switch, Checkbox): center vertically within its span container',
    'chore(deps): require react-native-reanimated ^4.3.0',
  ])('accepts `%s`', (line) => {
    expect(checkMessage(line)).toEqual([]);
  });

  it.each([
    ['Sync interface icons from Figma', 'must be `type(Scope): summary`'],
    ['refactor: move cn', 'must be `type(Scope): summary`'],
    ['BREAKING_CHANGE(DataTable): remove x', 'type `BREAKING_CHANGE`'],
    ['test(Button): add cases', 'type `test`'],
    ['feat(Button): Add green', 'starts with a capital'],
    ['feat(Button): add green.', 'ends with a period'],
    [`feat(Button): ${'a'.repeat(101)}`, 'over 100 characters'],
  ])('rejects `%s`', (line, issue) => {
    expect(checkMessage(line).join('\n')).toContain(issue);
  });
});

describe('checkPlan', () => {
  it('passes a well-formed plan', () => {
    expect(checkPlan(plan(react, 'fix(Dialog): animate the height'))).toEqual(
      [],
    );
  });

  it('rejects several packages in one file', () => {
    const content = plan(
      `${react}\n'@ledgerhq/lumen-ui-rnative': patch`,
      'feat(tokens): sync tokens from Figma',
    );
    expect(checkPlan(content)).toEqual([
      'lists 2 packages: write one file per package',
    ]);
  });

  it('rejects a bump other than patch', () => {
    const content = plan(
      "'@ledgerhq/lumen-ui-react': minor",
      'feat(Button): add `green`',
    );
    expect(checkPlan(content)).toEqual([
      '@ledgerhq/lumen-ui-react: bump is `minor`, use `patch`',
    ]);
  });

  it('rejects a multi-line message', () => {
    const content = plan(
      react,
      'feat(DataTable)!: remove `paginationMode`\n\nDelete `paginationMode`.',
    );
    expect(checkPlan(content)).toEqual([
      'message has 2 lines: write one line, how to update goes in the migration',
    ]);
  });

  it('rejects a file without frontmatter', () => {
    expect(checkPlan('feat(Button): add `green`')).toEqual([
      'must start with a `---` frontmatter block',
    ]);
  });
});
