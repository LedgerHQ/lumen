import { useMemo } from 'react';

import type { Series } from '../../../utils/types';

/**
 * Stable signature of every series' data points, memoized on the `series`
 * reference. Used to key the reveal-clip provider so the reveal animation only
 * replays when the underlying data actually changes — not on unrelated
 * re-renders such as scrubbing or hover.
 */
export const useDataFingerprint = (series: Series[]): string => {
  return useMemo(
    () => series.map((s) => s.data?.join(',') ?? '').join('|'),
    [series],
  );
};
