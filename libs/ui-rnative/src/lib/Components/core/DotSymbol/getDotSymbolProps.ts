import { createPropsResolver } from '@ledgerhq/lumen-utils-shared';
import type { SpotSize } from '../Spot';
import type { DotSymbolProps } from './types';

export const getDotSymbolProps = createPropsResolver({
  spot: {
    32: { size: 12 },
    40: { size: 16 },
    48: { size: 20 },
    56: { size: 24 },
    72: { size: 40 },
  } satisfies Record<SpotSize, Partial<DotSymbolProps>>,
});
