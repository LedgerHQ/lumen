// Turns the selected runs into the GitHub Actions matrix the workflow feeds to Cairn.
import type { LumenPackage } from '../../config.js';
import type { ConsumerEntry } from '../shared/consumers.js';
import { buildPlanInput } from './buildPlanInput.js';
import { selectRuns } from './selectRuns.js';

/** One GitHub Actions matrix item; `ref` is the branch Cairn clones, `inputs` compact JSON, ready to inline. */
export type RunMatrixItem = { name: string; ref: string; inputs: string };

export type RunMatrix = {
  upstream: RunMatrixItem[];
  downstream: RunMatrixItem[];
};

/** Cairn updates whatever an image left checked out unless told a branch, and fails on a detached one. */
function refOf(entry: ConsumerEntry): string {
  if (!entry.baseBranch) {
    throw new Error(
      `${entry.repo}: "baseBranch" is required to run an upgrade`,
    );
  }
  return entry.baseBranch;
}

export function buildMatrix(
  registry: ConsumerEntry[],
  targetVersions: Record<LumenPackage, string>,
): RunMatrix {
  const toItem = (entry: ConsumerEntry): RunMatrixItem => ({
    name: entry.repo,
    ref: refOf(entry),
    inputs: JSON.stringify(buildPlanInput(entry, targetVersions)),
  });
  const { upstream, downstream } = selectRuns(registry);
  return { upstream: upstream.map(toItem), downstream: downstream.map(toItem) };
}
