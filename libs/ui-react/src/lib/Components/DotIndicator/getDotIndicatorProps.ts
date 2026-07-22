import { createPropsResolver } from '@ledgerhq/lumen-utils-shared';
import type { AvatarSize } from '../Avatar/types';
import type { DotIndicatorProps } from './types';

export const getDotIndicatorProps = createPropsResolver({
  avatar: {
    xs: { size: 'sm', appearance: 'red' },
    sm: { size: 'lg', appearance: 'red' },
    md: { size: 'xl', appearance: 'red' },
    lg: { size: 'xl', appearance: 'red' },
    xl: { size: 'xl', appearance: 'red' },
    '2xl': { size: 'xl', appearance: 'red' },
  } satisfies Record<AvatarSize, DotIndicatorProps>,
});
