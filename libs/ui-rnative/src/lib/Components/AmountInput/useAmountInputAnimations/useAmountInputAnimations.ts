import { getFontSize } from '@ledgerhq/lumen-utils-shared';
import { useEffect } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../../styles';
import type { AmountInputSize } from '../types';

type UseAmountInputAnimationsArgs = {
  formattedValue: string;
  size: AmountInputSize;
  isFocused: boolean;
  disabled: boolean;
};

type UseAmountInputAnimationsReturn = {
  animatedInputStyle: ReturnType<typeof useAnimatedStyle>;
  animatedCurrencyStyle: ReturnType<typeof useAnimatedStyle>;
  animatedCaretStyle: ReturnType<typeof useAnimatedStyle>;
};

export const useAmountInputAnimations = ({
  formattedValue,
  size,
  isFocused,
  disabled,
}: UseAmountInputAnimationsArgs): UseAmountInputAnimationsReturn => {
  const { theme } = useTheme();
  const caretFixedHeight = size === 'sm' ? theme.sizes.s28 : 0;

  const translateX = useSharedValue(0);
  const animatedFontSize = useSharedValue(getFontSize(formattedValue, size));
  const caretOpacity = useSharedValue(0);

  const animatedInputStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: translateX.value }],
      fontSize: animatedFontSize.value,
      letterSpacing: 0,
    }),
    [translateX, animatedFontSize],
  );

  const animatedCurrencyStyle = useAnimatedStyle(
    () => ({
      fontSize: animatedFontSize.value,
      letterSpacing: 0,
    }),
    [animatedFontSize],
  );

  const animatedCaretStyle = useAnimatedStyle(
    () => ({
      opacity: caretOpacity.value,
      height: size === 'sm' ? caretFixedHeight : animatedFontSize.value,
    }),
    [caretOpacity, animatedFontSize, size, caretFixedHeight],
  );

  useEffect(() => {
    const newSize = getFontSize(formattedValue, size);

    translateX.value = withSequence(
      withTiming(4, { duration: 0 }),
      withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
    );

    animatedFontSize.value = withTiming(newSize, {
      duration: 250,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });
  }, [formattedValue, size, animatedFontSize, translateX]);

  useEffect(() => {
    if (isFocused && !disabled) {
      caretOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 150, easing: Easing.ease }),
          withTiming(1, { duration: 500 }),
          withTiming(0, { duration: 150, easing: Easing.ease }),
          withTiming(0, { duration: 500 }),
        ),
        -1,
        false,
      );
    } else {
      caretOpacity.value = 0;
    }
  }, [isFocused, disabled, caretOpacity]);

  return { animatedInputStyle, animatedCurrencyStyle, animatedCaretStyle };
};
