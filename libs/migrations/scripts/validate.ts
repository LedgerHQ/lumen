#!/usr/bin/env node
/**
 * CI gate for migration files: valid name, frontmatter and body, examples that
 * prove the `detect` patterns, stable ids, and the version plans that get a
 * change published (the release index also derives packages from them). A
 * migration written late names the PR that shipped the break, whose plans
 * are already on main.
 *
 * Run: node libs/migrations/scripts/validate.ts
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { brokenPackages, prCommit } from './build-index.ts';
import { migrationFrontmatter, type MigrationFrontmatter } from './schema.ts';
import {
  frontmatterData,
  migrationsPackage,
  planPackages,
  splitFrontmatter,
} from './shared.ts';

const libDir = fileURLToPath(new URL('..', import.meta.url));
const repoRoot = join(libDir, '../..');
const srcDir = join(libDir, 'src');

const bodyHeadings = ['Before → after', 'Decide', 'Verify'];
const kebabCaseFile = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const taggedExample = /^```\S*[ \t]+(before|after)[ \t]*\n([\s\S]*?)^```/gm;
const migrationPath = /^libs\/migrations\/src\/[^/]+\.md$/;
const lumenPackage = /^@ledgerhq\/lumen-[^/#]+/;

/** One line of `git diff --name-status`; `from` is set on renames and copies. */
export type FileChange = { status: string; path: string; from?: string };

export function checkMigration(fileName: string, content: string): string[] {
  const issues: string[] = [];
  if (!kebabCaseFile.test(fileName)) {
    issues.push('file name must be kebab-case `.md`');
  }

  const parsed = splitFrontmatter(content);
  if (parsed === undefined) {
    return [...issues, 'must start with a `---` frontmatter block'];
  }
  if ('error' in parsed) {
    return [...issues, `frontmatter: invalid YAML (${parsed.error})`];
  }
  const { data, body } = parsed;

  const result = migrationFrontmatter.safeParse(data);
  if (!result.success) {
    issues.push(
      ...result.error.issues.map(
        (issue) => `${issue.path.join('.') || 'frontmatter'}: ${issue.message}`,
      ),
    );
  }
  issues.push(...checkBody(body));
  if (result.success) issues.push(...checkExamples(result.data, body));

  return issues;
}

function checkBody(body: string): string[] {
  const prose = body.replace(/^```[\s\S]*?^```/gm, '<code>');
  const sections = prose.split(/^## /m).slice(1);
  const headings = sections.map((section) => section.split('\n')[0].trim());

  if (headings.join('|') !== bodyHeadings.join('|')) {
    return [
      `body sections must be ${bodyHeadings.map((h) => `\`## ${h}\``).join(', ')}, in that order`,
    ];
  }
  return sections
    .filter((section) => section.split('\n').slice(1).join('\n').trim() === '')
    .map((section) => `\`## ${section.split('\n')[0].trim()}\` is empty`);
}

/**
 * Code blocks tagged `before` / `after` are the examples agents follow, and
 * the proof that each source `detect` pattern finds the old API and not the
 * new one.
 */
function checkExamples(
  frontmatter: MigrationFrontmatter,
  body: string,
): string[] {
  const examples = { before: [] as string[], after: [] as string[] };
  for (const [, tag, code] of body.matchAll(taggedExample)) {
    examples[tag as keyof typeof examples].push(code);
  }
  if (examples.before.length === 0 || examples.after.length === 0) {
    return ['needs a code block tagged `before` and one tagged `after`'];
  }

  return frontmatter.changes.flatMap(({ ref, detect = [] }) =>
    detect
      .filter((rule) => rule.in === 'source')
      .flatMap((rule) => {
        const regex = new RegExp(rule.pattern);
        const issues: string[] = [];
        if (!examples.before.some((code) => regex.test(code))) {
          issues.push(`${ref}: \`${rule.pattern}\` matches no before example`);
        }
        if (
          rule.expect === 'none' &&
          examples.after.some((code) => regex.test(code))
        ) {
          issues.push(
            `${ref}: \`${rule.pattern}\` still matches an after example`,
          );
        }
        return issues;
      }),
  );
}

export function parseNameStatus(output: string): FileChange[] {
  return output
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [status, ...paths] = line.split('\t');
      const path = paths[paths.length - 1];
      return paths.length > 1
        ? { status: status[0], path, from: paths[0] }
        : { status: status[0], path };
    });
}

/**
 * The Lumen packages a migration's refs point into: their release is when the
 * break reaches consumers. A `dependency` ref names what consumers must
 * install, not what broke, so it doesn't count.
 */
function brokenRefPackages(frontmatter: MigrationFrontmatter): string[] {
  const names = frontmatter.changes
    .filter(({ surface }) => surface !== 'dependency')
    .map(({ ref }) => ref.match(lumenPackage)?.[0])
    .filter((name) => name !== undefined);
  return [...new Set(names)];
}

/**
 * The plans a new migration lacks: one per Lumen package its refs break, or
 * any package at all when it only touches external dependencies.
 */
function missingPlans(
  frontmatter: MigrationFrontmatter,
  planned: string[],
): string[] {
  const broken = brokenRefPackages(frontmatter);
  if (broken.length === 0) {
    return planned.length > 0 ? [] : ['the package that breaks'];
  }
  return broken.filter((name) => !planned.includes(name));
}

/**
 * Any change to a migration ships only when this package is released, so it
 * needs its plan. A new migration also needs the plans of the packages it
 * breaks, unless it names the earlier PR that shipped the break: the release
 * index takes its packages from that PR. Consumers rely on the file name as
 * the id, so a migration is never renamed or deleted.
 */
export function checkMigrationChanges(
  changes: FileChange[],
  addedPlans: string[],
  frontmatterAt: (path: string) => MigrationFrontmatter | undefined,
): string[] {
  const migrations = changes.filter(
    ({ path, from }) =>
      migrationPath.test(path) ||
      (from !== undefined && migrationPath.test(from)),
  );
  if (migrations.length === 0) return [];

  const issues = migrations.flatMap(({ status, path, from }) => {
    if (status === 'R') {
      return [
        `${from} → ${path}: a migration's file name is its id and can't change`,
      ];
    }
    if (status === 'D') {
      return [`${path}: a migration can't be deleted, its id is permanent`];
    }
    return [];
  });

  const packages = [...new Set(addedPlans.flatMap(planPackages))];
  if (!packages.includes(migrationsPackage)) {
    issues.push(
      `changed migrations need a version plan for ${migrationsPackage}`,
    );
  }
  const planned = packages.filter((name) => name !== migrationsPackage);
  for (const { status, path } of migrations) {
    const frontmatter = status === 'A' ? frontmatterAt(path) : undefined;
    if (frontmatter === undefined || frontmatter.pr !== undefined) continue;
    issues.push(
      ...missingPlans(frontmatter, planned).map(
        (name) => `${path}: needs a version plan for ${name}`,
      ),
    );
  }
  return issues;
}

/** A named PR must be on main and bump the broken packages, like a new PR. */
export function checkBreakingPr(
  repoRoot: string,
  pr: number,
  frontmatter: MigrationFrontmatter,
): string[] {
  const commit = prCommit(repoRoot, pr);
  if (commit === undefined) return [`pr: #${pr} is not on main`];
  return missingPlans(frontmatter, brokenPackages(repoRoot, commit.sha)).map(
    (name) => `pr: #${pr} has no version plan for ${name}`,
  );
}

function parsedFrontmatter(content: string): MigrationFrontmatter | undefined {
  const result = migrationFrontmatter.safeParse(frontmatterData(content));
  return result.success ? result.data : undefined;
}

/** Changes since the base Nx affected compares against. */
function changedFiles(): FileChange[] {
  const base = process.env.NX_BASE ?? 'origin/main';
  return parseNameStatus(
    execFileSync(
      'git',
      ['diff', '--name-status', '--find-renames', `${base}...HEAD`],
      { cwd: repoRoot, encoding: 'utf8' },
    ),
  );
}

/** @returns how many checks failed */
function validate(): number {
  let failed = 0;
  const report = (label: string, issues: string[]): void => {
    if (issues.length === 0) {
      console.log(`  ✓ ${label}`);
      return;
    }
    failed += 1;
    console.error(`  ✗ ${label}`);
    for (const issue of issues) console.error(`      ${issue}`);
  };

  console.log('\nMigration files');
  for (const fileName of readdirSync(srcDir)) {
    if (!fileName.endsWith('.md')) continue;
    const content = readFileSync(join(srcDir, fileName), 'utf8');
    const frontmatter = parsedFrontmatter(content);
    report(fileName, [
      ...checkMigration(fileName, content),
      ...(frontmatter?.pr === undefined
        ? []
        : checkBreakingPr(repoRoot, frontmatter.pr, frontmatter)),
    ]);
  }

  console.log('\nChanges since the base');
  const changes = changedFiles();
  report(
    'ids kept, version plans present',
    checkMigrationChanges(
      changes,
      changes
        .filter(
          ({ status, path }) =>
            status === 'A' && path.startsWith('.nx/version-plans/'),
        )
        .map(({ path }) => readFileSync(join(repoRoot, path), 'utf8')),
      (path) => parsedFrontmatter(readFileSync(join(repoRoot, path), 'utf8')),
    ),
  );

  return failed;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const failed = validate();
  if (failed > 0) {
    console.error(`\nmigrations check failed for ${failed} item(s).`);
    process.exit(1);
  }
  console.log('\nmigrations check passed.');
}
