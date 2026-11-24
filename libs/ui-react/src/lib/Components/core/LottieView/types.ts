import type {
  LottieViewBaseProps,
  LottieViewRef,
} from '@ledgerhq/lumen-utils-shared';
import type { ComponentPropsWithoutRef, Ref } from 'react';

export type LottieViewProps = LottieViewBaseProps & {
  ref?: Ref<LottieViewRef>;
} & Omit<
    ComponentPropsWithoutRef<'div'>,
    keyof LottieViewBaseProps | 'children'
  >;
