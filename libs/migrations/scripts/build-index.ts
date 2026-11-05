#!/usr/bin/env node
/**
 * Builds `index.json` from git, so nothing in it is written by hand: title and
 * PR come from the PR that added the migration, packages from the version
 * plans that PR added, and each introduced version from the first release tag
 * containing it.
 *
 * A PR is one commit on main's first-parent history: the squash commit, or the
 * merge commit compared with its first parent. That is the same set of changes
 * `validate` checks on the PR (`base...HEAD`), whatever the merge strategy.
 *
 * Run: node libs/migrations/scripts/build-index.ts [--strict]
 * `--strict` fails on anything unresolved. The release publish runs it after
 * tagging (`build-release` target); `build` only warns, for dev tarballs.
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { migrationFrontmatter, type MigrationFrontmatter } from './schema.ts';
import { frontmatterData, migrationsPackage, planPackages } from './shared.ts';

export const formatVersion = 1;

const srcPath = 'libs/migrations/src';
const plansPath = '.nx/version-plans';
const conventionalSubject =
  /^(?:\[[^\]]*\]\s*)*(?:[A-Z]+-\d+\s+)?\w+(?:\([^)]*\))?!?: (.+)$/;
const prSuffix = /^(.*) \(#(\d+)\)$/;
const mergeSubject = /^Merge pull request #(\d+) from /;

export type IndexEntry = {
  id: string;
  title: string | null;
  pr: number | null;
  commit: string | null;
  /** Package → first version that ships the change, `null` until released. */
  introduced: Record<string, string | null>;
} & MigrationFrontmatter;

export type MigrationIndex = {
  formatVersion: number;
  migrations: IndexEntry[];
};

type Commit = { sha: string; subject: string; body: string };

function git(repoRoot: string, args: string[]): string {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function lines(output: string): string[] {
  return output.split('\n').filter(Boolean);
}

/**
 * Squash commits read `feat(scope): title (#123)`. Merge commits read
 * `Merge pull request #123 from …`, with the PR title as the body.
 */
export function parseSubject(
  subject: string,
  body = '',
): { title: string; pr: number | null } {
  const [, mergedPr] = subject.match(mergeSubject) ?? [];
  const firstBodyLine = body.split('\n').find((line) => line.trim() !== '');
  const line =
    mergedPr !== undefined && firstBodyLine !== undefined
      ? firstBodyLine.trim()
      : subject;
  const [, withoutPr = line, squashedPr] = line.match(prSuffix) ?? [];
  const [, title = withoutPr] = withoutPr.match(conventionalSubject) ?? [];
  const pr = mergedPr ?? squashedPr;
  return { title, pr: pr === undefined ? null : Number(pr) };
}

/** The oldest first-parent commit that added the file, surviving later edits. */
function addingCommit(repoRoot: string, path: string): Commit | undefined {
  const [oldest] = lines(
    git(repoRoot, [
      'log',
      '--first-parent',
      '--diff-filter=A',
      '--format=%H',
      '--',
      path,
    ]),
  ).reverse();
  if (oldest === undefined) return undefined;
  return {
    sha: oldest,
    subject: git(repoRoot, ['log', '-1', '--format=%s', oldest]),
    body: git(repoRoot, ['log', '-1', '--format=%b', oldest]),
  };
}

function introducedVersions(
  repoRoot: string,
  sha: string,
): Record<string, string | null> {
  const plans = lines(
    git(repoRoot, [
      'diff',
      '--name-only',
      '--diff-filter=A',
      `${sha}^1`,
      sha,
      '--',
      plansPath,
    ]),
  );
  const packages = plans
    .flatMap((plan) => planPackages(git(repoRoot, ['show', `${sha}:${plan}`])))
    .filter((name) => name !== migrationsPackage);

  return Object.fromEntries(
    [...new Set(packages)].map((name) => {
      const [first] = lines(
        git(repoRoot, [
          'tag',
          '--contains',
          sha,
          '--list',
          `${name}@*`,
          '--sort=version:refname',
        ]),
      );
      return [name, first === undefined ? null : first.slice(name.length + 1)];
    }),
  );
}

/** @returns the index, and why an entry could not be fully resolved */
export function buildIndex(repoRoot: string): {
  index: MigrationIndex;
  issues: string[];
} {
  const issues: string[] = [];
  const history = lines(
    git(repoRoot, ['rev-list', '--first-parent', '--reverse', 'HEAD']),
  );
  const position = (sha: string | null): number =>
    sha === null ? Infinity : history.indexOf(sha);

  const entries: IndexEntry[] = [];
  for (const fileName of readdirSync(join(repoRoot, srcPath))) {
    if (!fileName.endsWith('.md')) continue;
    const id = fileName.replace(/\.md$/, '');
    const content = readFileSync(join(repoRoot, srcPath, fileName), 'utf8');
    const frontmatter = migrationFrontmatter.safeParse(
      frontmatterData(content),
    );
    if (!frontmatter.success) {
      issues.push(`${id}: invalid frontmatter, run the validate target`);
      continue;
    }

    const commit = addingCommit(repoRoot, `${srcPath}/${fileName}`);
    if (commit === undefined) issues.push(`${id}: not committed`);
    const introduced =
      commit === undefined ? {} : introducedVersions(repoRoot, commit.sha);
    if (commit !== undefined && Object.keys(introduced).length === 0) {
      issues.push(`${id}: its commit has no version plan for a broken package`);
    }
    for (const [name, version] of Object.entries(introduced)) {
      if (version === null) issues.push(`${id}: ${name} not released yet`);
    }

    entries.push({
      id,
      ...(commit === undefined
        ? { title: null, pr: null }
        : parseSubject(commit.subject, commit.body)),
      commit: commit?.sha ?? null,
      introduced,
      ...frontmatter.data,
    });
  }

  entries.sort(
    (a, b) =>
      position(a.commit) - position(b.commit) || a.id.localeCompare(b.id),
  );
  return { index: { formatVersion, migrations: entries }, issues };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const strict =
    process.argv.includes('--strict') && process.env.NX_DRY_RUN !== 'true';
  const libDir = new URL('..', import.meta.url).pathname;
  const { index, issues } = buildIndex(join(libDir, '../..'));

  writeFileSync(
    join(libDir, 'index.json'),
    `${JSON.stringify(index, null, 2)}\n`,
  );
  console.log(`index.json: ${index.migrations.length} migration(s)`);
  for (const issue of issues) console.error(`  ✗ ${issue}`);
  if (strict && issues.length > 0) {
    console.error(`\nindex has ${issues.length} unresolved item(s).`);
    process.exit(1);
  }
}
