import type {
  LottieViewBaseProps,
  LottieViewRef,
} from '@ledgerhq/lumen-utils-shared';
import type { ComponentPropsWithoutRef, Ref } from 'react';

type DivProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

export type LottieViewProps = LottieViewBaseProps & {
  ref?: Ref<LottieViewRef>;
} & Omit<DivProps, keyof LottieViewBaseProps>;
