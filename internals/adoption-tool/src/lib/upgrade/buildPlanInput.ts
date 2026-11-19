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

/**
 * The Cairn action reads any input string starting with `@` as a file path
 * and fails when it is missing, so a scoped package name can't be sent as is.
 * The plan strips the prefix.
 */
const NPM_PREFIX = 'npm:';

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
    upstreamPackages: (entry.upstreamPackages ?? []).map((upstream) => ({
      ...upstream,
      package: `${NPM_PREFIX}${upstream.package}`,
    })),
  };
}
