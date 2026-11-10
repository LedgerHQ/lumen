import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { buildIndex, parseSubject } from './build-index.ts';
import { migrationFrontmatter } from './schema.ts';
import { checkBreakingPr } from './validate.ts';

const migration = `---
changes:
  - change: removed
    surface: export
    ref: '@ledgerhq/lumen-ui-react#MenuPortal'
    signal: loud
---

## Before → after
`;

function plan(...packages: string[]): string {
  const bumps = packages.map((name) => `'${name}': patch`).join('\n');
  return `---\n${bumps}\n---\n\nfeat: something\n`;
}

let root: string;

function git(...args: string[]): string {
  return execFileSync(
    'git',
    [
      '-c',
      'user.name=Test',
      '-c',
      'user.email=test@example.com',
      '-c',
      'commit.gpgsign=false',
      '-c',
      'tag.gpgsign=false',
      ...args,
    ],
    { cwd: root, encoding: 'utf8' },
  ).trim();
}

function write(path: string, content: string): void {
  mkdirSync(dirname(join(root, path)), { recursive: true });
  writeFileSync(join(root, path), content);
}

function commit(subject: string): string {
  git('add', '-A');
  git('commit', '--allow-empty', '-m', subject);
  return git('rev-parse', 'HEAD');
}

function addMigration(
  id: string,
  subject: string,
  ...packages: string[]
): string {
  write(`libs/migrations/src/${id}.md`, migration);
  write(
    `.nx/version-plans/${id}-migrations.md`,
    plan('@ledgerhq/lumen-migrations'),
  );
  write(`.nx/version-plans/${id}.md`, plan(...packages));
  return commit(subject);
}

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'build-index-'));
  git('init', '--quiet');
  write('libs/migrations/src/.gitkeep', '');
  commit('chore: init');
});

describe('parseSubject', () => {
  it.each([
    [
      'feat(ui-react): move Menu to Base UI (#716)',
      'move Menu to Base UI',
      716,
    ],
    ['feat!: drop Tailwind v3 (#401)', 'drop Tailwind v3', 401],
    ['Move Menu to Base UI', 'Move Menu to Base UI', null],
    [
      'DLS-1116 chore(ci): gate test coverage at 80% and report it on PRs (#951)',
      'gate test coverage at 80% and report it on PRs',
      951,
    ],
    [
      '[D]DLS-736-feat(AmountDisplay): Add size variant support (#716)',
      'Add size variant support',
      716,
    ],
    [
      '[M][D] DLS-393 fix: align components and the token sync with Figma (#956)',
      'align components and the token sync with Figma',
      956,
    ],
  ])('reads %s', (subject, title, pr) => {
    expect(parseSubject(subject)).toEqual({ title, pr });
  });

  it('reads a merge commit from its body', () => {
    expect(
      parseSubject(
        'Merge pull request #716 from LedgerHQ/menu',
        '\nDLS-12 feat(ui-react): move Menu to Base UI\n',
      ),
    ).toEqual({ title: 'move Menu to Base UI', pr: 716 });
  });
});

describe('buildIndex', () => {
  it('derives every field from the commit, its plans and its tags', () => {
    const sha = addMigration(
      'menu-base-ui',
      'feat(ui-react): move Menu to Base UI (#716)',
      '@ledgerhq/lumen-ui-react',
      '@ledgerhq/lumen-ui-rnative',
    );
    git('tag', '@ledgerhq/lumen-ui-react@0.1.36');
    git('tag', '@ledgerhq/lumen-ui-rnative@0.1.37');

    const { index, issues } = buildIndex(root);

    expect(issues).toEqual([]);
    expect(index).toEqual({
      formatVersion: 1,
      migrations: [
        {
          id: 'menu-base-ui',
          title: 'move Menu to Base UI',
          pr: 716,
          commit: sha,
          introduced: {
            '@ledgerhq/lumen-ui-react': '0.1.36',
            '@ledgerhq/lumen-ui-rnative': '0.1.37',
          },
          changes: [
            {
              change: 'removed',
              surface: 'export',
              ref: '@ledgerhq/lumen-ui-react#MenuPortal',
              signal: 'loud',
            },
          ],
        },
      ],
    });
  });

  it('takes the first release that contains the commit', () => {
    git('tag', '@ledgerhq/lumen-ui-react@0.1.9');
    addMigration('menu-base-ui', 'feat: x (#1)', '@ledgerhq/lumen-ui-react');
    commit('chore(release): publish');
    git('tag', '@ledgerhq/lumen-ui-react@0.1.10');
    git('tag', '@ledgerhq/lumen-ui-react@0.1.11');

    const [entry] = buildIndex(root).index.migrations;

    expect(entry.introduced).toEqual({ '@ledgerhq/lumen-ui-react': '0.1.10' });
  });

  it('keeps the adding commit after the file is edited', () => {
    const sha = addMigration(
      'menu-base-ui',
      'feat: x (#1)',
      '@ledgerhq/lumen-ui-react',
    );
    write('libs/migrations/src/menu-base-ui.md', `${migration}\nEdited.\n`);
    commit('docs: edit (#2)');

    expect(buildIndex(root).index.migrations[0]).toMatchObject({
      commit: sha,
      pr: 1,
    });
  });

  it('orders migrations by when they landed', () => {
    addMigration('zeta', 'feat: z (#1)', '@ledgerhq/lumen-ui-react');
    addMigration('alpha', 'feat: a (#2)', '@ledgerhq/lumen-ui-react');

    expect(buildIndex(root).index.migrations.map(({ id }) => id)).toEqual([
      'zeta',
      'alpha',
    ]);
  });

  describe('a migration that names its PR', () => {
    function shipBreak(): string {
      write('libs/ui-react/src/index.ts', 'export {};\n');
      write('.nx/version-plans/401.md', plan('@ledgerhq/lumen-ui-react'));
      const sha = commit('feat!: upgrade Tailwind to v4 (#401)');
      git('tag', '@ledgerhq/lumen-ui-react@0.0.64');
      return sha;
    }

    function addLate(id: string, pr: number): void {
      write(
        `libs/migrations/src/${id}.md`,
        migration.replace('---\n\n', `pr: ${pr}\n---\n\n`),
      );
      write(
        `.nx/version-plans/${id}-migrations.md`,
        plan('@ledgerhq/lumen-migrations'),
      );
      commit(`docs(migrations): add ${id} (#900)`);
    }

    it('takes everything from that PR', () => {
      const sha = shipBreak();
      commit('chore: something else (#500)');
      git('tag', '@ledgerhq/lumen-ui-react@0.0.65');
      addLate('tailwind-v4', 401);

      const { index, issues } = buildIndex(root);

      expect(issues).toEqual([]);
      expect(index.migrations[0]).toMatchObject({
        id: 'tailwind-v4',
        title: 'upgrade Tailwind to v4',
        pr: 401,
        commit: sha,
        introduced: { '@ledgerhq/lumen-ui-react': '0.0.64' },
      });
    });

    it('is ordered by that PR', () => {
      addMigration(
        'menu-base-ui',
        'feat: menu (#300)',
        '@ledgerhq/lumen-ui-react',
      );
      shipBreak();
      addLate('tailwind-v4', 401);
      addMigration('zeta', 'feat: z (#100)', '@ledgerhq/lumen-ui-react');

      expect(buildIndex(root).index.migrations.map(({ id }) => id)).toEqual([
        'menu-base-ui',
        'tailwind-v4',
        'zeta',
      ]);
    });

    it('reports a PR that is not on main', () => {
      addLate('tailwind-v4', 401);

      expect(buildIndex(root).issues).toEqual([
        'tailwind-v4: PR #401 not found',
      ]);
    });

    /** A PR with no plan, released later by another PR's plan. */
    function shipWithoutPlan(): string {
      write(
        'libs/ui-react/package.json',
        '{ "name": "@ledgerhq/lumen-ui-react" }\n',
      );
      write('libs/ui-react/src/index.ts', 'export {};\n');
      const sha = commit('feat: add Popover (#587)');
      write('.nx/version-plans/589.md', plan('@ledgerhq/lumen-ui-react'));
      commit('feat: something else (#589)');
      git('tag', '@ledgerhq/lumen-ui-react@0.1.15');
      return sha;
    }

    it('dates a PR without a plan from the packages its refs name', () => {
      const sha = shipWithoutPlan();
      addLate('menu-portal', 587);

      const { index, issues } = buildIndex(root);

      expect(issues).toEqual([]);
      expect(index.migrations[0]).toMatchObject({
        pr: 587,
        commit: sha,
        introduced: { '@ledgerhq/lumen-ui-react': '0.1.15' },
      });
    });

    it('takes the libs the PR changed for a dependency-only update', () => {
      shipWithoutPlan();
      write(
        'libs/migrations/src/base-ui.md',
        `---
changes:
  - change: required
    surface: dependency
    ref: '@base-ui/react'
    signal: loud
pr: 587
---

## Before → after
`,
      );
      commit('docs(migrations): add base-ui (#900)');

      expect(buildIndex(root).index.migrations[0].introduced).toEqual({
        '@ledgerhq/lumen-ui-react': '0.1.15',
      });
    });
  });

  describe('checkBreakingPr', () => {
    const frontmatter = migrationFrontmatter.parse({
      changes: [
        {
          change: 'removed',
          surface: 'export',
          ref: '@ledgerhq/lumen-ui-react#MenuPortal',
          signal: 'loud',
        },
      ],
    });

    it('accepts a released PR, plan or not', () => {
      commit('feat: remove MenuPortal (#716)');
      git('tag', '@ledgerhq/lumen-ui-react@0.1.36');

      expect(checkBreakingPr(root, 716, frontmatter)).toEqual([]);
    });

    it('rejects a PR that is not released yet', () => {
      commit('feat: remove MenuPortal (#716)');

      expect(checkBreakingPr(root, 716, frontmatter)).toEqual([
        'pr: #716 is not released in @ledgerhq/lumen-ui-react yet',
      ]);
    });

    it('rejects a PR that is not on main', () => {
      expect(checkBreakingPr(root, 716, frontmatter)).toEqual([
        'pr: #716 is not on main',
      ]);
    });
  });

  it('reports a migration that is not released yet', () => {
    addMigration('menu-base-ui', 'feat: x (#1)', '@ledgerhq/lumen-ui-react');

    const { index, issues } = buildIndex(root);

    expect(index.migrations[0].introduced).toEqual({
      '@ledgerhq/lumen-ui-react': null,
    });
    expect(issues).toEqual([
      'menu-base-ui: @ledgerhq/lumen-ui-react not released yet',
    ]);
  });

  it('reports a commit without a plan for a broken package', () => {
    addMigration('menu-base-ui', 'feat: x (#1)');

    expect(buildIndex(root).issues).toEqual([
      'menu-base-ui: its commit has no version plan for a broken package',
    ]);
  });

  it('reports a migration that is not committed', () => {
    write('libs/migrations/src/menu-base-ui.md', migration);

    const { index, issues } = buildIndex(root);

    expect(index.migrations[0]).toMatchObject({
      title: null,
      pr: null,
      commit: null,
      introduced: {},
    });
    expect(issues).toEqual(['menu-base-ui: not committed']);
  });

  it.each([
    ['frontmatter', '---\nchanges: []\n---\n'],
    ['YAML', '---\nchanges: [\n---\n'],
  ])('reports invalid %s', (_, content) => {
    write('libs/migrations/src/broken.md', content);
    commit('feat: broken (#1)');

    expect(buildIndex(root)).toEqual({
      index: { formatVersion: 1, migrations: [] },
      issues: ['broken: invalid frontmatter, run the validate target'],
    });
  });

  it('reads a merged PR as a whole, plans from any of its commits', () => {
    const main = git('rev-parse', '--abbrev-ref', 'HEAD');
    git('checkout', '--quiet', '-b', 'menu');
    write('libs/migrations/src/menu-base-ui.md', migration);
    commit('feat: add the migration');
    write(
      '.nx/version-plans/migrations.md',
      plan('@ledgerhq/lumen-migrations'),
    );
    write('.nx/version-plans/ui-react.md', plan('@ledgerhq/lumen-ui-react'));
    commit('chore: add the version plans');
    git('checkout', '--quiet', main);
    git(
      'merge',
      '--no-ff',
      '--quiet',
      '-m',
      'Merge pull request #716 from LedgerHQ/menu',
      '-m',
      'feat(ui-react): move Menu to Base UI',
      'menu',
    );
    const merge = git('rev-parse', 'HEAD');
    git('tag', '@ledgerhq/lumen-ui-react@0.1.36');

    const { index, issues } = buildIndex(root);

    expect(issues).toEqual([]);
    expect(index.migrations[0]).toMatchObject({
      title: 'move Menu to Base UI',
      pr: 716,
      commit: merge,
      introduced: { '@ledgerhq/lumen-ui-react': '0.1.36' },
    });
  });
});
