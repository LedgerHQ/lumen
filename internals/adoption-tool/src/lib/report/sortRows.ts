import { LUMEN_PACKAGES } from '../../config.js';
import type { AdoptionStatus } from './classify.js';
import type { Cell, ReportRow } from './render.js';

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

function rowSeverity(row: ReportRow): number {
  let worst = 0;
  for (const pkg of LUMEN_PACKAGES) {
    const cell = row.cells[pkg];
    if (cell.status === 'not-used') continue;
    worst = Math.max(worst, SEVERITY_RANK[cell.status]);
  }
  return worst;
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
      const diff =
        patchesBehindForSort(a.cells[pkg]) - patchesBehindForSort(b.cells[pkg]);
      if (diff !== 0) return diff;
    }

    return a.repo.localeCompare(b.repo);
  });
}
