import { LUMEN_PACKAGES, type LumenPackage } from '../../config.js';
import type { AdoptionStatus } from './classify.js';
import { rowSeverityTier } from './sortRows.js';
import type { Cell, LatestVersions, ReportRow } from './types.js';

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
  if (cell.status === 'unresolved')
    return `${emoji} unresolved (${cell.reason})`;
  if (cell.status === 'diverged')
    return `${emoji} ${cell.version} (major/minor mismatch)`;
  if (cell.status === 'current') return `${emoji} ${cell.version}`;
  return `${emoji} ${cell.version} (${cell.patchesBehind} behind)`;
}

function shortPackageName(packageName: LumenPackage): string {
  return packageName.replace('@ledgerhq/lumen-', '');
}

function countStatuses(rows: ReportRow[]): Record<AdoptionStatus, number> {
  const counts: Record<AdoptionStatus, number> = {
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
  return counts;
}

export function renderSummaryLine(
  rows: ReportRow[],
  latestVersions: LatestVersions,
): string {
  const counts = countStatuses(rows);

  const latestLine = LUMEN_PACKAGES.map(
    (pkg) => `${shortPackageName(pkg)}@${latestVersions[pkg]}`,
  ).join(', ');

  return [
    `Latest: ${latestLine}`,
    `🟢 ${counts.current} current · 🟡 ${counts.behind} behind · 🔴 ${counts['far-behind'] + counts.diverged} far behind/diverged · ⚪ ${counts.unresolved} unresolved`,
  ].join('\n');
}

/** Code-point count, not UTF-16 length — a single emoji is one code point.
 * Doesn't account for terminal font rendering width (see the README note on
 * status emoji), but is the right unit for "characters" everywhere else. */
function codePointLength(text: string): number {
  return [...text].length;
}

function padCell(text: string, width: number): string {
  return text + ' '.repeat(Math.max(0, width - codePointLength(text)));
}

// Backslash first: an unescaped `\` before a `|` would otherwise cancel the
// pipe's escape and split the cell.
function escapeMarkdownTableCell(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\|/g, '\\|');
}

export function renderMarkdownTable(rows: ReportRow[]): string {
  const headerCells = ['Repo', ...LUMEN_PACKAGES.map(shortPackageName)];
  const bodyCells = rows.map((row) => [
    row.repo,
    ...LUMEN_PACKAGES.map((pkg) =>
      escapeMarkdownTableCell(cellText(row.cells[pkg])),
    ),
  ]);

  const columnWidths = headerCells.map((header, columnIndex) =>
    Math.max(
      codePointLength(header),
      ...bodyCells.map((cells) => codePointLength(cells[columnIndex])),
    ),
  );

  const formatRow = (cells: string[]): string =>
    `| ${cells.map((cell, columnIndex) => padCell(cell, columnWidths[columnIndex])).join(' | ')} |`;
  const separator = `|${columnWidths.map((width) => '-'.repeat(width + 2)).join('|')}|`;

  return [formatRow(headerCells), separator, ...bodyCells.map(formatRow)].join(
    '\n',
  );
}

const VERSION_SOURCE_NOTE =
  "Versions come from each repo's declared dependency (package.json or pnpm catalog), not its lockfile — a `^`/`~` range shows its lower bound.";

export function renderMarkdownReport(
  rows: ReportRow[],
  latestVersions: LatestVersions,
): string {
  return [
    renderSummaryLine(rows, latestVersions),
    '',
    renderMarkdownTable(rows),
    '',
    `_${VERSION_SOURCE_NOTE}_`,
  ].join('\n');
}

/** One package's status as a fragment for the Slack bullet line, e.g.
 * `ui-react 20 behind` — `undefined` for `not-used`/`current` cells, since a
 * repo's Slack line only calls out what needs attention. */
function cellFragment(
  packageName: LumenPackage,
  cell: Cell,
): string | undefined {
  if (cell.status === 'not-used' || cell.status === 'current') return undefined;

  const short = shortPackageName(packageName);
  if (cell.status === 'unresolved') return `${short} unresolved`;
  if (cell.status === 'diverged') return `${short} major/minor mismatch`;
  return `${short} ${cell.patchesBehind} behind`;
}

function currentBullet(row: ReportRow): string {
  const used = LUMEN_PACKAGES.filter(
    (pkg) => row.cells[pkg].status !== 'not-used',
  ).map(shortPackageName);
  return `• ${row.repo} — ${used.join(', ')}`;
}

function rowBullet(row: ReportRow): string {
  const fragments = LUMEN_PACKAGES.map((pkg) =>
    cellFragment(pkg, row.cells[pkg]),
  ).filter((fragment): fragment is string => fragment !== undefined);
  return `• ${row.repo} — ${fragments.join(', ')}`;
}

const TIER_HEADING: Record<'red' | 'behind' | 'current', string> = {
  red: '🔴 Far behind / diverged',
  behind: '🟡 Behind',
  current: '🟢 On track',
};

/**
 * Slack's mrkdwn doesn't render markdown tables — even fenced, a wide table
 * wraps badly in a narrow message pane (especially on mobile), which is what
 * made the first version of this report hard to read. A bulleted list
 * grouped by severity uses only Slack's native bold/bullet formatting, so it
 * never depends on column alignment surviving Slack's renderer. Worst
 * sections come first so what needs attention is read before the green list.
 */
export function renderSlackReport(
  rows: ReportRow[],
  latestVersions: LatestVersions,
): string {
  const summary = renderSummaryLine(rows, latestVersions);

  const tierRows = (tier: 'red' | 'behind' | 'current'): ReportRow[] =>
    rows.filter((row) => rowSeverityTier(row) === tier);
  const redRows = tierRows('red');
  const behindRows = tierRows('behind');
  const currentRows = tierRows('current');

  const sections = [
    redRows.length > 0 &&
      [TIER_HEADING.red, ...redRows.map(rowBullet)].join('\n'),
    behindRows.length > 0 &&
      [TIER_HEADING.behind, ...behindRows.map(rowBullet)].join('\n'),
    currentRows.length > 0 &&
      [TIER_HEADING.current, ...currentRows.map(currentBullet)].join('\n'),
  ].filter((section): section is string => section !== false);

  const allCurrent = redRows.length === 0 && behindRows.length === 0;
  return [
    summary,
    '',
    ...(allCurrent
      ? ['All tracked repos are on the latest version. 🎉', '']
      : []),
    sections.join('\n\n'),
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
  latestVersions: LatestVersions,
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
<p><small>${htmlEscape(VERSION_SOURCE_NOTE)}</small></p>
</body>
</html>
`;
}

/** Machine-readable snapshot for diffing runs over time — the markdown table
 * is for people, this is what a dashboard or trend script should read. */
export function renderJsonReport(
  rows: ReportRow[],
  latestVersions: LatestVersions,
  generatedAt: Date,
): string {
  return JSON.stringify(
    {
      generatedAt: generatedAt.toISOString(),
      latest: latestVersions,
      summary: countStatuses(rows),
      rows,
    },
    null,
    2,
  );
}
