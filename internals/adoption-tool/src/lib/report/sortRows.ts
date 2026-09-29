import { LUMEN_PACKAGES } from '../../config.js';
import type { AdoptionStatus } from './classify.js';
import type { Cell, ReportRow } from './types.js';

/** green < yellow < red, matching the emoji tiers in render.ts (`diverged`
 * shares the red emoji with `far-behind`; `unresolved` is worse than both —
 * it means we couldn't verify the version at all, not just that it's old). */
const SEVERITY_RANK: Record<AdoptionStatus, number> = {
  current: 0,
  behind: 1,
  'far-behind': 2,
  diverged: 2,
  unresolved: 3,
};

function cellSeverity(cell: Cell): number {
  return cell.status === 'not-used' ? 0 : SEVERITY_RANK[cell.status];
}

function rowSeverity(row: ReportRow): number {
  return Math.max(
    0,
    ...LUMEN_PACKAGES.map((pkg) => cellSeverity(row.cells[pkg])),
  );
}

export type SeverityTier = 'current' | 'behind' | 'red';

/** Same three-tier grouping `sortRowsByAdoption` sorts by, exposed for
 * renderers that group rows (e.g. the Slack report) rather than just order
 * them. `far-behind`, `diverged` and `unresolved` all collapse to `red`. */
export function rowSeverityTier(row: ReportRow): SeverityTier {
  const rank = rowSeverity(row);
  if (rank === 0) return 'current';
  if (rank === 1) return 'behind';
  return 'red';
}

/** A patch count to sort by: `not-used`/`current` are 0 (nothing to flag),
 * `diverged`/`unresolved` sort last within their tier since there's no
 * meaningful "how many patches behind" for them. */
function patchesBehindForSort(cell: Cell): number {
  if (cell.status === 'not-used' || cell.status === 'current') return 0;
  if (cell.status === 'behind' || cell.status === 'far-behind') {
    return cell.patchesBehind ?? 0;
  }
  return Number.POSITIVE_INFINITY;
}

// Plain subtraction yields NaN for Infinity - Infinity, which would end the
// tie-break chain early instead of falling through to the next column.
function compareNumbers(a: number, b: number): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/**
 * The cell a package should report when several package.json files declare
 * it: the worst used one, since a single stale workspace is what needs
 * attention. `not-used` only wins when nothing declares the package.
 */
export function worstCell(cells: Cell[]): Cell {
  let worst: Cell = { status: 'not-used' };
  for (const cell of cells) {
    if (cell.status === 'not-used') continue;
    if (worst.status === 'not-used') {
      worst = cell;
      continue;
    }
    const severity = compareNumbers(cellSeverity(cell), cellSeverity(worst));
    const patches = compareNumbers(
      patchesBehindForSort(cell),
      patchesBehindForSort(worst),
    );
    if (severity > 0 || (severity === 0 && patches > 0)) worst = cell;
  }
  return worst;
}

/**
 * Orders rows green → yellow → red (worst status among a row's used
 * packages), then — within the same tier — by patches behind, checked
 * column-by-column in `LUMEN_PACKAGES` order (ui-react, then ui-rnative,
 * then design-core), so a row 4 patches behind on ui-react sorts before one
 * 32 patches behind, before either compares on rnative/design-core.
 */
export function sortRowsByAdoption(rows: ReportRow[]): ReportRow[] {
  return [...rows].sort((a, b) => {
    const severityDiff = rowSeverity(a) - rowSeverity(b);
    if (severityDiff !== 0) return severityDiff;

    for (const pkg of LUMEN_PACKAGES) {
      const diff = compareNumbers(
        patchesBehindForSort(a.cells[pkg]),
        patchesBehindForSort(b.cells[pkg]),
      );
      if (diff !== 0) return diff;
    }

    return a.repo.localeCompare(b.repo);
  });
}
