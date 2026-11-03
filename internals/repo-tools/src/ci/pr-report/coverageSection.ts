#!/usr/bin/env node
/**
 * The coverage section of the PR report. Projects not affected by the PR keep
 * a row with `main`'s numbers, so the table always covers the whole repo.
 *
 * Run: node internals/repo-tools/src/ci/pr-report/coverageSection.ts <baselineDir> <outFile>
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  COVERAGE_METRICS,
  readCoverageSummary,
} from '../../shared/coverage.ts';
import type { CoverageSummary } from '../../shared/coverage.ts';
import { ok, step } from '../../shared/logging.ts';
import {
  internals,
  libs,
  workspaceRoot,
} from '../../shared/workspaceProjects.ts';
import type { Lib } from '../../shared/workspaceProjects.ts';

export type CoverageRow = {
  slug: string;
  current?: CoverageSummary;
  baseline?: CoverageSummary;
};

export type CoverageReport = {
  libs: CoverageRow[];
  internals: CoverageRow[];
  hasBaseline: boolean;
};

const HEADER_METRICS = COVERAGE_METRICS.map(
  (metric) => metric[0].toUpperCase() + metric.slice(1),
);

const percent = (value: number): string => `${value.toFixed(2)}%`;

export function formatDelta(current: number, baseline?: number): string {
  if (baseline === undefined) return '';
  const delta = current - baseline;
  if (Math.abs(delta) < 0.005) return ' (±0)';
  return delta > 0 ? ` (+${delta.toFixed(2)})` : ` (−${(-delta).toFixed(2)})`;
}

function metricCells(row: CoverageRow): string[] {
  const { current, baseline } = row;
  if (!current) {
    return COVERAGE_METRICS.map((metric) =>
      baseline ? `_${percent(baseline[metric])}_` : '—',
    );
  }
  return COVERAGE_METRICS.map(
    (metric) =>
      `${percent(current[metric])}${formatDelta(current[metric], baseline?.[metric])}`,
  );
}

const tableRow = (cells: string[]): string => `| ${cells.join(' | ')} |`;

export function renderCoverageSection(report: CoverageReport): string {
  const lines = [
    '### Test coverage',
    '',
    `A lib below its coverage thresholds fails \`Unit Testing\`. Δ is against the latest green \`main\`; _italic_ rows did not run in this PR and show \`main\`'s numbers.`,
    '',
    tableRow(['Lib', ...HEADER_METRICS]),
    tableRow(['---', ...HEADER_METRICS.map(() => '---:')]),
    ...report.libs.map((row) =>
      tableRow([`\`${row.slug}\``, ...metricCells(row)]),
    ),
  ];

  if (report.internals.length > 0) {
    lines.push(
      '',
      '<details><summary>Internals (reported, not gated)</summary>',
      '',
      tableRow(['Project', ...HEADER_METRICS]),
      tableRow(['---', ...HEADER_METRICS.map(() => '---:')]),
      ...report.internals.map((row) =>
        tableRow([`\`${row.slug}\``, ...metricCells(row)]),
      ),
      '',
      '</details>',
    );
  }

  if (!report.hasBaseline) {
    lines.push(
      '',
      '> No coverage baseline from `main` yet, so no Δ. It appears once `main` has published one.',
    );
  }

  return `${lines.join('\n')}\n`;
}

export function collectCoverage(baselineRoot?: string): CoverageReport {
  const hasBaseline = baselineRoot !== undefined && existsSync(baselineRoot);
  const row = (project: Lib): CoverageRow => ({
    slug: project.slug,
    current: readCoverageSummary(workspaceRoot, project.dir),
    baseline: hasBaseline
      ? readCoverageSummary(baselineRoot, project.dir)
      : undefined,
  });

  return {
    libs: libs().map(row),
    internals: internals().map(row),
    hasBaseline,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [baselineRoot, outFile] = process.argv.slice(2);
  if (!outFile) {
    console.error('Usage: coverageSection.ts <baselineDir> <outFile>');
    process.exit(1);
  }

  step('Building the coverage section of the PR report');
  const section = renderCoverageSection(collectCoverage(baselineRoot));
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, section);
  ok(outFile);
}
