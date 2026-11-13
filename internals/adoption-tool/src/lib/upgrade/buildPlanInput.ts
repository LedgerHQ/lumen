// Builds the input one repo's Cairn plan receives, from its registry entry.
import type { LumenPackage } from '../../config.js';
import type { ConsumerEntry, UpstreamPackage } from '../shared/consumers.js';

/** What the repo's `.koda/plans/lumen-upgrade.ts` receives as `inputs`. */
export type PlanInput = {
  targetVersions: Record<LumenPackage, string>;
  pr: { title: string; labels: string[] };
  changeset: boolean;
  upstreamPackages: UpstreamPackage[];
};

export function buildPlanInput(
  entry: ConsumerEntry,
  targetVersions: Record<LumenPackage, string>,
): PlanInput {
  return {
    targetVersions,
    pr: {
      title: `${entry.pr?.titlePrefix ?? ''}chore(deps): upgrade Lumen`,
      labels: entry.pr?.labels ?? [],
    },
    changeset: entry.changeset ?? false,
    upstreamPackages: entry.upstreamPackages ?? [],
  };
}
