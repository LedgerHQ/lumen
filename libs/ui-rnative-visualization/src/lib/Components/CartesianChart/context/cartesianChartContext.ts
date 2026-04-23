import { createSafeContext } from '@ledgerhq/lumen-utils-shared';

import type { CartesianChartContextValue } from '../../../utils/types';

const [CartesianChartProvider, _useCartesianChartSafeContext] =
  createSafeContext<CartesianChartContextValue>('CartesianChart');

export const useCartesianChartContext = () =>
  _useCartesianChartSafeContext({
    consumerName: 'useCartesianChartContext',
    contextRequired: true,
  });

export { CartesianChartProvider };
