#!/usr/bin/env node
/**
 * Builds `index.json` from git, so nothing in it is written by hand: title and
 * PR come from the PR that shipped the update, packages from the version plans
 * that PR added, and each introduced version from the first release tag
 * containing it. That PR is the one that added the migration, unless the
 * migration names an earlier one in `pr` because it was written late.
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
import { fileURLToPath, pathToFileURL } from 'node:url';
import semver from 'semver';
import type { IndexEntry, MigrationIndex } from '../index.d.ts';
import { migrationFrontmatter, type MigrationFrontmatter } from './schema.ts';
import { frontmatterData, migrationsPackage, planPackages } from './shared.ts';

export const formatVersion = 1;

const srcPath = 'libs/migrations/src';
const plansPath = '.nx/version-plans';
const conventionalSubject =
  /^(?:\[[^\]]*\]\s*)*(?:[A-Z]+-\d+[\s-]+)?\w+(?:\([^)]*\))?!?: (.+)$/;
const prSuffix = /^(.*) \(#(\d+)\)$/;
const mergeSubject = /^Merge pull request #(\d+) from /;

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

type Migration = {
  id: string;
  path: string;
  frontmatter: MigrationFrontmatter;
};

function readCommit(repoRoot: string, sha: string): Commit {
  const [subject, body] = git(repoRoot, [
    'log',
    '-1',
    '--format=%s%x00%b',
    sha,
  ]).split('\0');
  return { sha, subject, body };
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
  return oldest === undefined ? undefined : readCommit(repoRoot, oldest);
}

/** The first-parent commit that merged the PR, squashed or not. */
export function prCommit(repoRoot: string, pr: number): Commit | undefined {
  return lines(
    git(repoRoot, [
      'log',
      '--first-parent',
      '-E',
      `--grep=\\(#${pr}\\)$|^Merge pull request #${pr} from `,
      '--format=%H',
      'HEAD',
    ]),
  )
    .map((sha) => readCommit(repoRoot, sha))
    .find(({ subject, body }) => parseSubject(subject, body).pr === pr);
}

/** Packages bumped by the commit's version plans, under their current names. */
export function brokenPackages(repoRoot: string, sha: string): string[] {
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
  return [...new Set(packages)];
}

function introducedVersions(
  repoRoot: string,
  sha: string,
): Record<string, string | null> {
  return Object.fromEntries(
    brokenPackages(repoRoot, sha).map((name) => [
      name,
      firstRelease(repoRoot, sha, name),
    ]),
  );
}

/** The lowest version tagged for the package after the commit. */
function firstRelease(
  repoRoot: string,
  sha: string,
  name: string,
): string | null {
  const versions = lines(
    git(repoRoot, ['tag', '--contains', sha, '--list', `${name}@*`]),
  ).map((tag) => tag.slice(name.length + 1));
  const [first] = semver.sort(versions.filter((v) => semver.valid(v)));
  return first ?? null;
}

/** Valid migrations, and an issue for each file that isn't one. */
function readMigrations(repoRoot: string): {
  migrations: Migration[];
  issues: string[];
} {
  const migrations: Migration[] = [];
  const issues: string[] = [];
  for (const fileName of readdirSync(join(repoRoot, srcPath))) {
    if (!fileName.endsWith('.md')) continue;
    const id = fileName.replace(/\.md$/, '');
    const path = `${srcPath}/${fileName}`;
    const frontmatter = migrationFrontmatter.safeParse(
      frontmatterData(readFileSync(join(repoRoot, path), 'utf8')),
    );
    if (frontmatter.success) {
      migrations.push({ id, path, frontmatter: frontmatter.data });
    } else {
      issues.push(`${id}: invalid frontmatter, run the validate target`);
    }
  }
  return { migrations, issues };
}

/** Adds what git knows about the migration to its frontmatter. */
function resolveEntry(
  repoRoot: string,
  { id, path, frontmatter: { pr, ...frontmatter } }: Migration,
): IndexEntry {
  const commit =
    pr === undefined ? addingCommit(repoRoot, path) : prCommit(repoRoot, pr);
  if (commit === undefined) {
    return {
      id,
      title: null,
      pr: pr ?? null,
      commit: null,
      introduced: {},
      ...frontmatter,
    };
  }
  return {
    id,
    ...parseSubject(commit.subject, commit.body),
    commit: commit.sha,
    introduced: introducedVersions(repoRoot, commit.sha),
    ...frontmatter,
  };
}

/** What `--strict` rejects: anything a consumer couldn't place in a range. */
function unresolvedIssues({
  id,
  pr,
  commit,
  introduced,
}: IndexEntry): string[] {
  if (commit === null) {
    return [
      pr === null ? `${id}: not committed` : `${id}: PR #${pr} not found`,
    ];
  }
  const versions = Object.entries(introduced);
  if (versions.length === 0) {
    return [`${id}: its commit has no version plan for a broken package`];
  }
  return versions
    .filter(([, version]) => version === null)
    .map(([name]) => `${id}: ${name} not released yet`);
}

/** Oldest landed first, uncommitted last: migrations apply in that order. */
function byLandingOrder(
  repoRoot: string,
): (a: IndexEntry, b: IndexEntry) => number {
  const history = lines(
    git(repoRoot, ['rev-list', '--first-parent', '--reverse', 'HEAD']),
  );
  const positions = new Map(history.map((sha, index) => [sha, index]));
  const position = (sha: string | null): number =>
    (sha === null ? undefined : positions.get(sha)) ?? Infinity;
  return (a, b) =>
    position(a.commit) - position(b.commit) || a.id.localeCompare(b.id);
}

/** @returns the index, and why an entry could not be fully resolved */
export function buildIndex(repoRoot: string): {
  index: MigrationIndex;
  issues: string[];
} {
  const { migrations, issues } = readMigrations(repoRoot);
  const entries = migrations
    .map((migration) => resolveEntry(repoRoot, migration))
    .sort(byLandingOrder(repoRoot));
  return {
    index: { formatVersion, migrations: entries },
    issues: [...issues, ...entries.flatMap(unresolvedIssues)],
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const strict =
    process.argv.includes('--strict') && process.env.NX_DRY_RUN !== 'true';
  const libDir = fileURLToPath(new URL('..', import.meta.url));
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
