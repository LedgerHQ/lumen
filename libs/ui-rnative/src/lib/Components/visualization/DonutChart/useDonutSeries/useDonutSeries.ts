import { useMemo } from 'react';

import type {
  DonutSegment,
  DonutSeriesOptions,
  DonutSeriesResult,
} from '../types';

import { prepareDonutSeries } from './utils';

/**
 * Prepares a raw series for the ring: sorts by value descending and folds the
 * long tail into a single aggregate segment.
 *
 * The result is memoized on `segments` identity, so hoist or memoize the array
 * you pass in if you rely on a stable `segments` reference downstream.
 */
export const useDonutSeries = (
  segments: DonutSegment[],
  options: DonutSeriesOptions,
): DonutSeriesResult => {
  const { groupBelowShare, maxSegments, other } = options;
  const { id, label, color } = other;

  // Keyed on the option values rather than the `options`/`other` object
  // identity, so an inline options object doesn't defeat the memo.
  return useMemo(
    () =>
      prepareDonutSeries(segments, {
        groupBelowShare,
        maxSegments,
        other: { id, label, color },
      }),
    [segments, groupBelowShare, maxSegments, id, label, color],
  );
};
