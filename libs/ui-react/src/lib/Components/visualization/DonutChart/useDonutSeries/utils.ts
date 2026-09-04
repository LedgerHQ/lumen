import { chartConfig } from '../../config';

import type {
  DonutSegment,
  DonutSeriesOptions,
  DonutSeriesResult,
} from '../types';

const {
  maxSegments: defaultMaxSegments,
  otherId: defaultOtherId,
  minGroupedSegments,
  minKeptSegments,
} = chartConfig.donut.series;

/** Total of the drawable values, matching how the ring computes its percents. */
const getTotal = (segments: DonutSegment[]): number =>
  segments.reduce((sum, segment) => sum + Math.max(segment.value, 0), 0);

/**
 * Where the tail starts in a descending-sorted series: the first segment below
 * `groupBelowShare` of the total, capped by `maxSegments`. Both cutoffs are
 * monotonic on a sorted series, so a single index splits kept segments from the
 * tail.
 *
 * Floored at `minKeptSegments`: a `groupBelowShare` of `1` or above puts every
 * segment in the tail, and a lone aggregate segment worth 100% is not a chart.
 */
const getTailStart = (
  sorted: DonutSegment[],
  groupBelowShare: number,
  maxSegments: number,
): number => {
  const total = getTotal(sorted);
  const minValue =
    groupBelowShare > 0 && total > 0 ? groupBelowShare * total : 0;
  const firstBelowShare =
    minValue > 0
      ? sorted.findIndex((segment) => Math.max(segment.value, 0) < minValue)
      : -1;

  return Math.max(
    minKeptSegments,
    Math.min(
      maxSegments,
      firstBelowShare === -1 ? sorted.length : firstBelowShare,
    ),
  );
};

/**
 * Sorts a raw series by value descending and folds its long tail into a single
 * aggregate segment. Pure counterpart of `useDonutSeries`. The aggregate keeps
 * its color unset unless `other.color` is given, so the ring paints it with the
 * neutral default like any colorless segment.
 */
export const prepareDonutSeries = (
  segments: DonutSegment[],
  options: DonutSeriesOptions,
): DonutSeriesResult => {
  const {
    groupBelowShare = 0,
    maxSegments = defaultMaxSegments,
    other,
  } = options;
  const sorted = [...segments].sort((a, b) => b.value - a.value);

  if (maxSegments <= 0) {
    return { segments: sorted, others: [] };
  }

  const tailStart = getTailStart(sorted, groupBelowShare, maxSegments);
  const others = sorted.slice(tailStart);

  // A tail of one would render an aggregate worth exactly that one segment,
  // which is strictly less informative than the segment itself.
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
