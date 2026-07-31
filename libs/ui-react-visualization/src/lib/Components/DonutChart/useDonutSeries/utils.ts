import { chartConfig } from '../../../config';

import type {
  DonutSegment,
  DonutSeriesOptions,
  DonutSeriesResult,
} from '../types';

const {
  maxSegments: defaultMaxSegments,
  otherId: defaultOtherId,
  minGroupedSegments,
} = chartConfig.donut.series;

/** Total of the drawable values, matching how the ring computes its percents. */
const getTotal = (segments: DonutSegment[]): number =>
  segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0);

/**
 * Where the tail starts in a descending-sorted series: the first segment below
 * `minShare` of the total, capped by `maxSegments`. Both cutoffs are monotonic
 * on a sorted series, so a single index splits kept slices from the tail.
 */
const getTailStart = (
  sorted: DonutSegment[],
  minShare: number,
  maxSegments: number,
): number => {
  const total = getTotal(sorted);
  const minValue = minShare > 0 && total > 0 ? minShare * total : 0;
  const firstBelowMinShare =
    minValue > 0
      ? sorted.findIndex((segment) => Math.max(segment.value, 0) < minValue)
      : -1;

  return Math.min(
    maxSegments,
    firstBelowMinShare === -1 ? sorted.length : firstBelowMinShare,
  );
};

/**
 * Sorts a raw series by value descending and folds its long tail into a single
 * aggregate segment. Pure counterpart of `useDonutSeries`.
 */
export const prepareDonutSeries = (
  segments: DonutSegment[],
  options: DonutSeriesOptions,
): DonutSeriesResult => {
  const { minShare = 0, maxSegments = defaultMaxSegments, other } = options;
  const sorted = [...segments].sort((a, b) => b.value - a.value);

  if (maxSegments <= 0) {
    return { segments: sorted, others: [] };
  }

  const tailStart = getTailStart(sorted, minShare, maxSegments);
  const others = sorted.slice(tailStart);

  // A tail of one would render an aggregate slice worth exactly that one
  // segment, which is strictly less informative than the segment itself.
  if (others.length < minGroupedSegments) {
    return { segments: sorted, others: [] };
  }

  const { id = defaultOtherId, label, color } = other;

  return {
    segments: [
      ...sorted.slice(0, tailStart),
      {
        id,
        label,
        color,
        value: others.reduce(
          (sum, segment) => sum + Math.max(segment.value, 0),
          0,
        ),
      },
    ],
    others,
  };
};
