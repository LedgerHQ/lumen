import { useEffect } from 'react';
import type { TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  type AnimatedStyle,
} from 'react-native-reanimated';
import type { LumenStyleSheetTheme } from '../../../../styles';
import { useStyleSheet, useTheme } from '../../../../styles';
import { useTimingConfig } from '../../animations/useTimingConfig';
import type { BaseInputLabelProps } from './types';

const useAnimatedFloatingLabel = ({
  isFloatingLabel,
  theme,
}: {
  isFloatingLabel: boolean;
  theme: LumenStyleSheetTheme;
}): { animatedStyle: AnimatedStyle<TextStyle> } => {
  const floatingAnimation = useSharedValue(isFloatingLabel ? 1 : 0);
  const timingConfig = useTimingConfig({
    duration: 150,
    easing: 'linear',
  });

  useEffect(() => {
    floatingAnimation.value = withTiming(isFloatingLabel ? 1 : 0, timingConfig);

    return () => cancelAnimation(floatingAnimation);
  }, [isFloatingLabel, timingConfig, floatingAnimation]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      top: interpolate(
        floatingAnimation.value,
        [0, 1],
        [theme.spacings.s14, theme.spacings.s6],
      ),
      fontSize: interpolate(
        floatingAnimation.value,
        [0, 1],
        [theme.typographies.body2.fontSize, theme.typographies.body4.fontSize],
      ),
    }),
    [floatingAnimation, theme],
  );

  return { animatedStyle };
};

const useFloatingLabelStyles = ({
  isFocused,
  hasContent,
  showClearButton,
  status,
  isEditable,
  labelStaysFloatedWithPlaceholder,
}: {
  isFocused: boolean;
  hasContent: boolean;
  showClearButton: boolean;
  status: 'error' | 'success' | undefined;
  isEditable: boolean;
  labelStaysFloatedWithPlaceholder: boolean;
}): { label: TextStyle; animatedStyle: AnimatedStyle<TextStyle> } => {
  const { theme } = useTheme();

  const { label } = useStyleSheet(
    (t) => ({
      label: StyleSheet.flatten([
        {
          position: 'absolute',
          left: t.spacings.s16,
          width: t.sizes.full,
          color: t.colors.text.muted,
        },
        hasContent &&
          showClearButton && {
            width: '92%',
          },
        status === 'error' && {
          color: t.colors.text.error,
        },
        !isEditable && {
          color: t.colors.text.disabled,
        },
      ]),
    }),
    [hasContent, showClearButton, status, isEditable],
  );

  const { animatedStyle } = useAnimatedFloatingLabel({
    theme,
    isFloatingLabel:
      isFocused || hasContent || labelStaysFloatedWithPlaceholder,
  });

  return { label, animatedStyle };
};

/**
 * Floating label rendered over the control inside `BaseInput`.
 *
 * @internal
 */
export const BaseInputLabel = ({
  isFocused,
  hasContent,
  showClearButton,
  status,
  isEditable,
  labelStaysFloatedWithPlaceholder,
  style,
  children,
}: BaseInputLabelProps) => {
  const styles = useFloatingLabelStyles({
    isFocused,
    hasContent,
    showClearButton,
    status,
    isEditable,
    labelStaysFloatedWithPlaceholder,
  });

  return (
    <Animated.Text
      style={[styles.label, styles.animatedStyle, style]}
      numberOfLines={1}
    >
      {children}
    </Animated.Text>
  );
};
