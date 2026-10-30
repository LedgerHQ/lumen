#!/usr/bin/env node
/**
 * Coverage runners emit `SF:` paths relative to their own project, so SonarCloud
 * cannot find the sources. Rewrite them to be workspace-root-relative.
 *
 * Replaces two hand-maintained loops in `pr.yml` that listed the libs, and their
 * runner, by hand — a list that had already drifted from the one in
 * `sonar-project.properties`. The runner is now detected from whichever report
 * exists on disk.
 *
 * Run: node internals/repo-tools/src/ci/fix-lcov-paths/fixLcovPaths.ts
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ok, skip, step } from '../../shared/logging.ts';
import { libs, workspaceRoot } from '../../shared/workspaceProjects.ts';

const RUNNERS = ['vitest', 'jest'] as const;

/**
 * Prefix every `SF:` record with the lib's directory, once. Already-prefixed
 * reports are left alone so the script is safe to run twice.
 */
export function prefixSourceFiles(content: string, dir: string): string {
  return content.replace(/^SF:(?!\/|[A-Za-z]:)(.*)$/gm, (line, rest) =>
    rest.startsWith(`${dir}/`) ? line : `SF:${dir}/${rest}`,
  );
}

/** @returns the reports that were rewritten, root-relative */
export function fixLcovPaths(): string[] {
  const rewritten: string[] = [];

  for (const lib of libs()) {
    const report = RUNNERS.map(
      (runner) => `${lib.dir}/test-output/${runner}/coverage/lcov.info`,
    ).find((rel) => existsSync(join(workspaceRoot, rel)));

    if (!report) {
      skip(`${lib.name} — no coverage report`);
      continue;
    }

    const abs = join(workspaceRoot, report);
    const before = readFileSync(abs, 'utf8');
    const after = prefixSourceFiles(before, lib.dir);
    if (after !== before) writeFileSync(abs, after);
    ok(`${lib.name} — ${report}`);
    rewritten.push(report);
  }

  return rewritten;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  step('Rewriting lcov source paths');
  const rewritten = fixLcovPaths();
  step(`${rewritten.length} report(s) rewritten.`);
}
