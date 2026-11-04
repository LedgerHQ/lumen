#!/usr/bin/env node
/**
 * Post every PR report section as one sticky comment. How to add a section:
 * `## PR report` in the repo-tools README.
 *
 * Run: node internals/repo-tools/src/ci/pr-report/postPrReport.ts <sectionsDir>
 */
import { appendFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { fail, ok, skip, step } from '../../shared/logging.ts';

export const REPORT_MARKER = '<!-- lumen-pr-report -->';

export type Section = { id: string; body: string };

export function readSections(dir: string): Section[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => ({
      id: basename(file, '.md'),
      body: readFileSync(join(dir, file), 'utf8').trim(),
    }))
    .filter((section) => section.body.length > 0);
}

export function assembleReport(sections: Section[]): string {
  const ordered = [...sections].sort((a, b) => a.id.localeCompare(b.id));
  return [
    REPORT_MARKER,
    '## Lumen PR report',
    ...ordered.map((section) => section.body),
  ].join('\n\n');
}

type Comment = { id: number; body?: string };

async function github(
  path: string,
  token: string,
  init: { method?: string; body?: unknown } = {},
): Promise<Response> {
  return fetch(`https://api.github.com${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
}

async function findReportComment(
  repo: string,
  pr: string,
  token: string,
): Promise<Comment | undefined> {
  for (let page = 1; ; page++) {
    const res = await github(
      `/repos/${repo}/issues/${pr}/comments?per_page=100&page=${page}`,
      token,
    );
    if (!res.ok) throw new Error(`listing comments: HTTP ${res.status}`);
    const comments = (await res.json()) as Comment[];
    const found = comments.find((c) => c.body?.startsWith(REPORT_MARKER));
    if (found || comments.length < 100) return found;
  }
}

export async function upsertReportComment(
  repo: string,
  pr: string,
  token: string,
  body: string,
): Promise<void> {
  const existing = await findReportComment(repo, pr, token);
  const res = existing
    ? await github(`/repos/${repo}/issues/comments/${existing.id}`, token, {
        method: 'PATCH',
        body: { body },
      })
    : await github(`/repos/${repo}/issues/${pr}/comments`, token, {
        method: 'POST',
        body: { body },
      });
  if (!res.ok) throw new Error(`writing comment: HTTP ${res.status}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [sectionsDir] = process.argv.slice(2);
  const { GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER, GITHUB_STEP_SUMMARY } =
    process.env;

  step('Assembling the PR report');
  const sections = readSections(sectionsDir ?? '');
  if (sections.length === 0) {
    skip('no sections — nothing to post');
    process.exit(0);
  }
  const report = assembleReport(sections);
  ok(sections.map((section) => section.id).join(', '));

  if (GITHUB_STEP_SUMMARY) appendFileSync(GITHUB_STEP_SUMMARY, `${report}\n`);

  if (!GITHUB_TOKEN || !GITHUB_REPOSITORY || !PR_NUMBER) {
    skip('not a pull request run — job summary only');
    process.exit(0);
  }

  try {
    await upsertReportComment(
      GITHUB_REPOSITORY,
      PR_NUMBER,
      GITHUB_TOKEN,
      report,
    );
    ok(`comment updated on #${PR_NUMBER}`);
  } catch (error) {
    // Most likely a fork PR's read-only token; the job summary still has it.
    fail(`could not post the comment (${(error as Error).message})`);
  }
}
