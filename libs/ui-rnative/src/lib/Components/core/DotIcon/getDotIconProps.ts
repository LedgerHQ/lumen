import { createPropsResolver } from '@ledgerhq/lumen-utils-shared';
import type { MediaImageSize } from '../MediaImage';
import type { SpotSize } from '../Spot';
import type { DotIconProps } from './types';

export const getDotIconProps = createPropsResolver({
  mediaImage: {
    40: { size: 16 },
    48: { size: 20 },
    56: { size: 24 },
    64: { size: 24 },
    72: { size: 32 },
  } satisfies Partial<Record<MediaImageSize, Partial<DotIconProps>>>,
  spot: {
    40: { size: 16 },
    48: { size: 20 },
    56: { size: 24 },
    72: { size: 32 },
  } satisfies Partial<Record<SpotSize, Partial<DotIconProps>>>,
});
