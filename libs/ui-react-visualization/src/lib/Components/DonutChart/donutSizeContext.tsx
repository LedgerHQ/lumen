import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

import type { DonutSize } from './types';

type DonutSizeContextValue = {
  size: DonutSize;
};

/**
 * Carries the donut ring's `size` down to `DonutChartTitle` /
 * `DonutChartDescription` (rendered via `renderCenter`), which pick their
 * typography off it. Defaults to `md` so the sub-components also work
 * standalone, outside a `DonutChart`.
 */
export const [DonutSizeProvider, useDonutSizeContext] =
  createSafeContext<DonutSizeContextValue>('DonutChart', { size: 'md' });
