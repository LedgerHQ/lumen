// Chooses which registry repos get an upgrade run, and in which order.
import type { ConsumerEntry, ConsumerPriority } from '../shared/consumers.js';

export type SelectedRuns = {
  /** Repos another repo consumes a package from; run in a first job. */
  upstream: ConsumerEntry[];
  downstream: ConsumerEntry[];
};

const PRIORITY_RANK: Record<ConsumerPriority | 'none', number> = {
  P1: 0,
  P2: 1,
  P3: 2,
  none: 3,
};

function byPriorityThenRepo(a: ConsumerEntry, b: ConsumerEntry): number {
  return (
    PRIORITY_RANK[a.priority ?? 'none'] - PRIORITY_RANK[b.priority ?? 'none'] ||
    a.repo.localeCompare(b.repo)
  );
}

/**
 * Upstream membership is computed from the whole registry, not just the
 * runnable entries: an ineligible publisher is simply not run, but
 * its downstream repos still start and report `blocked by <package>` themselves.
 */
export function selectRuns(registry: ConsumerEntry[]): SelectedRuns {
  const upstreamRepos = new Set(
    registry.flatMap((entry) =>
      (entry.upstreamPackages ?? []).map(({ repo }) => repo),
    ),
  );
  const runnable = registry
    .filter((entry) => entry.eligible === true)
    .sort(byPriorityThenRepo);

  return {
    upstream: runnable.filter((entry) => upstreamRepos.has(entry.repo)),
    downstream: runnable.filter((entry) => !upstreamRepos.has(entry.repo)),
  };
}
