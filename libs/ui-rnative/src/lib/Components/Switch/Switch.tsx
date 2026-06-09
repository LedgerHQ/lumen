import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useCallback } from 'react';
import { View, type GestureResponderEvent, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useStyleSheet, useTheme } from '../../../styles';
import { useTimingConfig } from '../../Animations/useTimingConfig';
import { useControllableState } from '../../utils';
import { Pressable } from '../Utility';

import type { SwitchProps, SwitchSize } from './types';

export const useSwitchStyles = ({
  checked,
  disabled,
  size,
}: {
  checked: boolean;
  disabled: boolean;
  size: SwitchSize;
}) => {
  const { theme } = useTheme();

  const styles = useStyleSheet(
    (t) => {
      const sizes: Record<SwitchSize, { width: number; height: number }> = {
        sm: { width: t.sizes.s24, height: t.sizes.s16 },
        md: { width: t.sizes.s40, height: t.sizes.s24 },
      };

      const thumbSizes: Record<SwitchSize, number> = {
        sm: t.sizes.s12,
        md: t.sizes.s20,
      };

      return {
        root: StyleSheet.flatten([
          {
            borderRadius: t.borderRadius.full,
            padding: t.spacings.s2,
            overflow: 'hidden',
            ...sizes[size],
            minWidth: sizes[size].width,
            maxWidth: sizes[size].width,
            minHeight: sizes[size].height,
            maxHeight: sizes[size].height,
          },
          !checked &&
            !disabled && {
              backgroundColor: t.colors.bg.mutedStrong,
            },
          checked &&
            !disabled && {
              backgroundColor: t.colors.bg.active,
            },
          disabled && {
            backgroundColor: t.colors.bg.disabled,
          },
        ]),
        thumbWrapper: {
          position: 'absolute',
          top: t.spacings.s2,
          left: t.spacings.s2,
        },
        thumb: StyleSheet.flatten([
          {
            borderRadius: t.borderRadius.full,
            backgroundColor: 'white',
            width: thumbSizes[size],
            height: thumbSizes[size],
          },
          disabled && {
            backgroundColor: t.colors.bg.base,
          },
        ]),
      };
    },
    [checked, disabled, size],
  );

  const thumbTranslations: Record<SwitchSize, number> = {
    sm: theme.spacings.s8,
    md: theme.spacings.s16,
  };

  return { ...styles, thumbTranslate: thumbTranslations[size] };
};

const useAnimatedThumb = (checked: boolean, translate: number) => {
  const timing = useTimingConfig({ duration: 200, easing: 'easeInOut' });

  // Reanimated best practice: derive the animation reactively by calling
  // `withTiming` inside `useAnimatedStyle`. When `checked` (or `translate`)
  // changes the worklet re-runs and animates from the current value to the
  // new target -- no shared value or effect required.
  return useAnimatedStyle(
    () => ({
      transform: [{ translateX: withTiming(checked ? translate : 0, timing) }],
    }),
    [checked, translate, timing],
  );
};

/**
 * The switch follows the design system tokens and supports checked, unchecked,
 * disabled, and focus states with proper active interactions.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_selection-switch--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_selection-switch--docs#dos-and-donts Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the switch's core appearance.
 *
 * @example
 * import { Switch } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic controlled switch
 * const [checked, setChecked] = useState(false);
 * <Switch
 *   checked={checked}
 *   onCheckedChange={setChecked}
 * />
 *
 * // Uncontrolled switch with default state
 * <Switch defaultChecked={true} onCheckedChange={handleChange} />
 */
export const Switch = ({
  lx,
  style,
  checked: checkedProp,
  onCheckedChange: onCheckedChangeProp,
  defaultChecked = false,
  disabled: disabledProp,
  size = 'md',
  onPress: onPressProp,
  ref,
  ...props
}: SwitchProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Switch',
    mergeWith: { disabled: disabledProp },
  });
  const [checked, onCheckedChange] = useControllableState({
    prop: checkedProp,
    onChange: onCheckedChangeProp,
    defaultProp: defaultChecked,
  });

  const styles = useSwitchStyles({
    checked: !!checked,
    disabled: !!disabled,
    size,
  });
  const animatedStyle = useAnimatedThumb(!!checked, styles.thumbTranslate);

  const onPress = useCallback(
    (ev: GestureResponderEvent) => {
      if (disabled) return;
      onCheckedChange(!checked);
      onPressProp?.(ev);
    },
    [disabled, checked, onCheckedChange, onPressProp],
  );

  return (
    <Pressable
      ref={ref}
      lx={lx}
      role='switch'
      aria-checked={checked}
      aria-disabled={disabled}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.root, style]}
      {...props}
    >
      <Animated.View style={[styles.thumbWrapper, animatedStyle]}>
        <View style={styles.thumb} />
      </Animated.View>
    </Pressable>
  );
};
