import { createPropsResolver } from '@ledgerhq/lumen-utils-shared';
import type { MediaImageSize } from '../MediaImage';
import type { SpotSize } from '../Spot';
import type { DotSymbolProps } from './types';

export const getDotSymbolProps = createPropsResolver({
  mediaImage: {
    12: { size: 8 },
    16: { size: 8 },
    20: { size: 8 },
    24: { size: 10 },
    32: { size: 12 },
    40: { size: 16 },
    48: { size: 20 },
    56: { size: 24 },
    64: { size: 24 },
    72: { size: 32 },
  } satisfies Record<MediaImageSize, Partial<DotSymbolProps>>,
  spot: {
    32: { size: 12 },
    40: { size: 16 },
    48: { size: 20 },
    56: { size: 24 },
    72: { size: 32 },
  } satisfies Record<SpotSize, Partial<DotSymbolProps>>,
});
