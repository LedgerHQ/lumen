#!/usr/bin/env node
/**
 * CI gate for migration files: valid name, frontmatter and body, examples that
 * prove the `detect` patterns, and version plans for every new migration (the
 * release index derives its packages from them).
 *
 * Run: node libs/migrations/scripts/validate.ts
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { migrationFrontmatter, type MigrationFrontmatter } from './schema.ts';
import { migrationsPackage, planPackages, splitFrontmatter } from './shared.ts';

const libDir = new URL('..', import.meta.url).pathname;
const repoRoot = join(libDir, '../..');
const srcDir = join(libDir, 'src');

const bodyHeadings = ['Before → after', 'Decide', 'Verify'];
const kebabCaseFile = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const taggedExample = /^```\S*[ \t]+(before|after)[ \t]*\n([\s\S]*?)^```/gm;

export function checkMigration(fileName: string, content: string): string[] {
  const issues: string[] = [];
  if (!kebabCaseFile.test(fileName)) {
    issues.push('file name must be kebab-case `.md`');
  }

  const parsed = splitFrontmatter(content);
  if (parsed === undefined) {
    return [...issues, 'must start with a `---` frontmatter block'];
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

/**
 * The release index takes a migration's packages from the version plans of
 * the commit that added it, so both must land in the same PR.
 */
export function checkVersionPlans(
  addedMigrations: string[],
  addedPlans: string[],
): string[] {
  if (addedMigrations.length === 0) return [];
  const packages = new Set(addedPlans.flatMap(planPackages));
  const issues: string[] = [];
  if (!packages.has(migrationsPackage)) {
    issues.push(`new migrations need a version plan for ${migrationsPackage}`);
  }
  if ([...packages].every((name) => name === migrationsPackage)) {
    issues.push(
      'new migrations need a version plan for the package that breaks',
    );
  }
  return issues;
}

/** Files added since the base Nx affected compares against. */
function addedFiles(): string[] {
  const base = process.env.NX_BASE ?? 'origin/main';
  return execFileSync(
    'git',
    ['diff', '--name-only', '--diff-filter=A', `${base}...HEAD`],
    { cwd: repoRoot, encoding: 'utf8' },
  )
    .split('\n')
    .filter(Boolean);
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
    report(
      fileName,
      checkMigration(fileName, readFileSync(join(srcDir, fileName), 'utf8')),
    );
  }

  console.log('\nVersion plans');
  const added = addedFiles();
  report(
    'new migrations have version plans',
    checkVersionPlans(
      added.filter((path) => /^libs\/migrations\/src\/[^/]+\.md$/.test(path)),
      added
        .filter((path) => path.startsWith('.nx/version-plans/'))
        .map((path) => readFileSync(join(repoRoot, path), 'utf8')),
    ),
  );

  return failed;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const failed = validate();
  if (failed > 0) {
    console.error(`\nmigrations check failed for ${failed} item(s).`);
    process.exit(1);
  }
  console.log('\nmigrations check passed.');
}
