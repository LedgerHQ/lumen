// Turns the selected runs into the GitHub Actions matrix the workflow feeds to Cairn.
import type { LumenPackage } from '../../config.js';
import type { ConsumerEntry } from '../shared/consumers.js';
import { buildPlanInput } from './buildPlanInput.js';
import { selectRuns } from './selectRuns.js';

/** One GitHub Actions matrix item; `inputs` is compact JSON, ready to inline. */
export type RunMatrixItem = { name: string; inputs: string };

export type RunMatrix = {
  upstream: RunMatrixItem[];
  downstream: RunMatrixItem[];
};

export function buildMatrix(
  registry: ConsumerEntry[],
  targetVersions: Record<LumenPackage, string>,
): RunMatrix {
  const toItem = (entry: ConsumerEntry): RunMatrixItem => ({
    name: entry.repo,
    inputs: JSON.stringify(buildPlanInput(entry, targetVersions)),
  });
  const { upstream, downstream } = selectRuns(registry);
  return { upstream: upstream.map(toItem), downstream: downstream.map(toItem) };
}
