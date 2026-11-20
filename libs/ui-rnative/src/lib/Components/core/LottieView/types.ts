import type {
  LottieViewBaseProps,
  LottieViewRef,
} from '@ledgerhq/lumen-utils-shared';
import type { Ref } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { LumenViewStyle } from '../../../../styles';

export type LottieViewProps = LottieViewBaseProps & {
  ref?: Ref<LottieViewRef>;
  testID?: string;
  lx?: LumenViewStyle;
  style?: StyleProp<ViewStyle>;
};
