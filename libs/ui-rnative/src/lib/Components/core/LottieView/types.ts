import type {
  LottieViewBaseProps,
  LottieViewRef,
} from '@ledgerhq/lumen-utils-shared';
import type { Ref } from 'react';
import type { StyledViewProps } from '../../../../styles';

export type LottieViewProps = LottieViewBaseProps & {
  ref?: Ref<LottieViewRef>;
} & Omit<StyledViewProps, 'children' | 'ref'>;
