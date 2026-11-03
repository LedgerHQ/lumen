import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const COVERAGE_METRICS = [
  'lines',
  'statements',
  'functions',
  'branches',
] as const;

export type CoverageMetric = (typeof COVERAGE_METRICS)[number];

export type CoverageSummary = Record<CoverageMetric, number>;

const RUNNERS = ['vitest', 'jest'] as const;

/** `root` may be a downloaded artifact laid out like the repo. */
export function readCoverageSummary(
  root: string,
  projectDir: string,
): CoverageSummary | undefined {
  const file = RUNNERS.map((runner) =>
    join(
      root,
      projectDir,
      'test-output',
      runner,
      'coverage',
      'coverage-summary.json',
    ),
  ).find((path) => existsSync(path));
  if (!file) return undefined;

  const { total } = JSON.parse(readFileSync(file, 'utf8'));
  return Object.fromEntries(
    COVERAGE_METRICS.map((metric) => [metric, total[metric].pct]),
  ) as CoverageSummary;
}
