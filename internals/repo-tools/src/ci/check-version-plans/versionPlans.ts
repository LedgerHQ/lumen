#!/usr/bin/env node
/**
 * Version plans added or edited since the base must follow the format in the
 * `release-plan` skill: one package, a `patch` bump, and a one-line
 * `type(Scope): summary` message. Nx copies that message unparsed into the
 * GitHub Release, so the shape (and `!` for a breaking change) is for readers.
 *
 * Run: node internals/repo-tools/src/ci/check-version-plans/versionPlans.ts
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fail, ok, step } from '../../shared/logging.ts';
import { workspaceRoot } from '../../shared/workspaceProjects.ts';

export const planTypes = ['feat', 'fix', 'refactor', 'perf', 'chore', 'docs'];
const maxSummaryLength = 100;

const planMessage = new RegExp(
  String.raw`^(?<type>\w+)\((?<scope>[^()]+)\)!?: (?<summary>.+)$`,
);
const planEntry = /^\s*['"]?(?<name>[^'":\s]+)['"]?\s*:\s*(?<bump>\S+)\s*$/;

type Plan = { entries: { name: string; bump: string }[]; message: string[] };

/** Splits a plan into its frontmatter entries and its non-empty message lines. */
export function parsePlan(content: string): Plan | undefined {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (match === null) return undefined;
  const entries = match[1]
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => line.match(planEntry)?.groups)
    .map((groups) => ({
      name: groups?.name ?? '?',
      bump: groups?.bump ?? '?',
    }));
  const message = match[2].split(/\r?\n/).filter((line) => line.trim() !== '');
  return { entries, message };
}

function checkEntries(entries: Plan['entries']): string[] {
  if (entries.length !== 1) {
    return [`lists ${entries.length} packages: write one file per package`];
  }
  const [{ name, bump }] = entries;
  return bump === 'patch'
    ? []
    : [`${name}: bump is \`${bump}\`, use \`patch\``];
}

/** Issues with a one-line `type(Scope): summary` message. */
export function checkMessage(line: string): string[] {
  const groups = line.match(planMessage)?.groups;
  if (groups === undefined) {
    return [`message \`${line}\` must be \`type(Scope): summary\``];
  }
  const { type, summary } = groups;
  const issues: string[] = [];
  if (!planTypes.includes(type)) {
    issues.push(`type \`${type}\` must be one of ${planTypes.join(', ')}`);
  }
  if (/^[A-Z]/.test(summary)) issues.push('summary starts with a capital');
  if (summary.endsWith('.')) issues.push('summary ends with a period');
  if (summary.length > maxSummaryLength) {
    issues.push(`summary is over ${maxSummaryLength} characters`);
  }
  return issues;
}

/** Every format issue in one plan file's content. */
export function checkPlan(content: string): string[] {
  const plan = parsePlan(content);
  if (plan === undefined) return ['must start with a `---` frontmatter block'];
  const { entries, message } = plan;
  if (message.length !== 1) {
    return [
      ...checkEntries(entries),
      `message has ${message.length} lines: write one line, how to update goes in the migration`,
    ];
  }
  return [...checkEntries(entries), ...checkMessage(message[0])];
}

/**
 * Plans added, edited, renamed or copied since the base Nx affected compares
 * against. A renamed plan is listed under its new path, so it is checked too.
 */
function changedPlans(): string[] {
  const base = process.env.NX_BASE ?? 'origin/main';
  return execFileSync(
    'git',
    [
      'diff',
      '--name-only',
      '--diff-filter=ACMR',
      `${base}...HEAD`,
      '--',
      '.nx/version-plans/*.md',
    ],
    { cwd: workspaceRoot, encoding: 'utf8' },
  )
    .split('\n')
    .filter(Boolean);
}

/** @returns how many plans failed */
export function checkVersionPlans(paths: string[] = changedPlans()): number {
  step('Version plans');
  if (paths.length === 0) ok('none');
  let failed = 0;
  for (const path of paths) {
    const issues = checkPlan(
      readFileSync(resolve(workspaceRoot, path), 'utf8'),
    );
    if (issues.length === 0) {
      ok(path);
      continue;
    }
    failed += 1;
    fail(path);
    issues.forEach((issue) => console.error(`      ${issue}`));
  }
  return failed;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const paths = process.argv.slice(2);
  const failed = checkVersionPlans(paths.length > 0 ? paths : undefined);
  if (failed > 0) {
    console.error(
      `\nversion plan check failed for ${failed} plan(s). See the format in .claude/skills/release-plan/SKILL.md.`,
    );
    process.exit(1);
  }
  console.log('\nversion plan check passed.');
}
