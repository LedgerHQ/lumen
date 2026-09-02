import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

import type { DonutSize } from './types';

type DonutSizeContextValue = {
  size: DonutSize;
};

/**
 * Carries the donut ring's `size` down to `DonutChartTitle` /
 * `DonutChartDescription` (rendered via `renderCenter`), which pick their
 * typography off it.
 */
export const [DonutSizeProvider, useDonutSizeContext] =
  createSafeContext<DonutSizeContextValue>('DonutChart', { size: 'md' });
