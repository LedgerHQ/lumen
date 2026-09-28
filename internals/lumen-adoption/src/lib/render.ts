import { LUMEN_PACKAGES, type LumenPackage } from '../config.js';
import type { AdoptionStatus } from './classify.js';

export type Cell =
  | { status: 'not-used' }
  | { status: AdoptionStatus; version: string; patchesBehind?: number };

export type ReportRow = {
  repo: string;
  cells: Record<LumenPackage, Cell>;
};

const STATUS_EMOJI: Record<AdoptionStatus, string> = {
  current: '🟢',
  behind: '🟡',
  'far-behind': '🔴',
  diverged: '🔴',
  unresolved: '⚪',
};

function cellText(cell: Cell): string {
  if (cell.status === 'not-used') return '—';

  const emoji = STATUS_EMOJI[cell.status];
  if (cell.status === 'unresolved') return `${emoji} unresolved`;
  if (cell.status === 'diverged')
    return `${emoji} ${cell.version} (major/minor mismatch)`;
  if (cell.status === 'current') return `${emoji} ${cell.version}`;
  return `${emoji} ${cell.version} (${cell.patchesBehind} behind)`;
}

function shortPackageName(packageName: LumenPackage): string {
  return packageName.replace('@ledgerhq/lumen-', '');
}

export function renderSummaryLine(
  rows: ReportRow[],
  latestVersions: Record<LumenPackage, string>,
): string {
  const counts = {
    current: 0,
    behind: 0,
    'far-behind': 0,
    diverged: 0,
    unresolved: 0,
  };
  for (const row of rows) {
    for (const pkg of LUMEN_PACKAGES) {
      const cell = row.cells[pkg];
      if (cell.status === 'not-used') continue;
      counts[cell.status] += 1;
    }
  }

  const latestLine = LUMEN_PACKAGES.map(
    (pkg) => `${shortPackageName(pkg)}@${latestVersions[pkg]}`,
  ).join(', ');

  return [
    `Latest: ${latestLine}`,
    `🟢 ${counts.current} current · 🟡 ${counts.behind} behind · 🔴 ${counts['far-behind'] + counts.diverged} far behind/diverged · ⚪ ${counts.unresolved} unresolved`,
  ].join('\n');
}

export function renderMarkdownTable(rows: ReportRow[]): string {
  const header = `| Repo | ${LUMEN_PACKAGES.map(shortPackageName).join(' | ')} |`;
  const separator = `|---|${LUMEN_PACKAGES.map(() => '---').join('|')}|`;
  const body = rows.map((row) => {
    const cells = LUMEN_PACKAGES.map((pkg) => cellText(row.cells[pkg]));
    return `| ${row.repo} | ${cells.join(' | ')} |`;
  });
  return [header, separator, ...body].join('\n');
}

export function renderMarkdownReport(
  rows: ReportRow[],
  latestVersions: Record<LumenPackage, string>,
): string {
  return [
    renderSummaryLine(rows, latestVersions),
    '',
    renderMarkdownTable(rows),
  ].join('\n');
}

const STATUS_COLOR: Record<AdoptionStatus, string> = {
  current: '#1e7d32',
  behind: '#8a6100',
  'far-behind': '#b3261e',
  diverged: '#b3261e',
  unresolved: '#666666',
};

const STATUS_BACKGROUND: Record<AdoptionStatus, string> = {
  current: '#e6f4ea',
  behind: '#fff4e0',
  'far-behind': '#fbe4e2',
  diverged: '#fbe4e2',
  unresolved: '#f0f0f0',
};

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function htmlCell(cell: Cell): string {
  if (cell.status === 'not-used') return '<td>—</td>';
  const color = STATUS_COLOR[cell.status];
  const background = STATUS_BACKGROUND[cell.status];
  return `<td style="background:${background};color:${color}">${htmlEscape(cellText(cell))}</td>`;
}

export function renderHtmlReport(
  rows: ReportRow[],
  latestVersions: Record<LumenPackage, string>,
): string {
  const header = LUMEN_PACKAGES.map(
    (pkg) => `<th>${shortPackageName(pkg)}</th>`,
  ).join('');
  const body = rows
    .map((row) => {
      const cells = LUMEN_PACKAGES.map((pkg) => htmlCell(row.cells[pkg])).join(
        '',
      );
      return `<tr><td>${htmlEscape(row.repo)}</td>${cells}</tr>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Lumen adoption report</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 14px; }
  th { background: #f5f5f5; }
  pre { white-space: pre-wrap; font-size: 14px; }
</style>
</head>
<body>
<pre>${htmlEscape(renderSummaryLine(rows, latestVersions))}</pre>
<table>
<thead><tr><th>Repo</th>${header}</tr></thead>
<tbody>
${body}
</tbody>
</table>
</body>
</html>
`;
}
