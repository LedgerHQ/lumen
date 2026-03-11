import { memo } from 'react';
import { StyleSheet } from 'react-native';
import type {
  Pressable,
  PressableStateCallbackType,
  ViewStyle,
} from 'react-native';
import { useHapticFeedbackWithPressIn } from '../../lib/Haptics';
import type { HapticFeedback } from '../../lib/Haptics/types';
import { StyledPressableProps, PressableStyleItem } from '../types';
import { areLxPropsEqual } from './areLxPropsEqual';
import { useResolveViewStyle } from './resolveStyle';

/**
 * Check if any style item (including nested arrays) is a function
 */
const hasStyleFunction = (style: PressableStyleItem): boolean => {
  if (Array.isArray(style)) {
    return style.some((s) => hasStyleFunction(s));
  }
  return typeof style === 'function';
};

/**
 * Resolve all style functions in a style tree
 */
const resolveStyleFunctions = (
  style: PressableStyleItem,
  state: PressableStateCallbackType,
): ViewStyle | (ViewStyle | null | undefined)[] | null | undefined => {
  if (Array.isArray(style)) {
    return style.map((s) => resolveStyleFunctions(s, state)) as (
      | ViewStyle
      | null
      | undefined
    )[];
  }
  return typeof style === 'function' ? style(state) : style;
};

/**
 * Factory function to create a styled Pressable component.
 *
 * Supports `style` as an object, function, or array of objects/functions (including nested).
 * Supports `hapticFeedback` to trigger vibration on press-in (`true` = medium, or an impact style string).
 *
 * ```tsx
 * // Create a styled Pressable
 * const Pressable = createStyledPressable(RNPressable);
 *
 * // Usage with haptic feedback
 * <Pressable hapticFeedback onPress={handlePress} />
 * <Pressable hapticFeedback="light" onPress={handlePress} />
 *
 * // Usage with array of styles
 * <Pressable style={[props.style, ({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })]} />
 * ```
 */
export const createStyledPressable = (Component: typeof Pressable) => {
  const StyledComponent = memo(
    ({
      lx = {},
      ref,
      style,
      hapticFeedback,
      onPressIn,
      ...props
    }: StyledPressableProps) => {
      const resolvedStyle = useResolveViewStyle(lx);
      const intensity: HapticFeedback | undefined =
        hapticFeedback === true ? 'medium' : (hapticFeedback ?? undefined);

      const { handlePressIn } = useHapticFeedbackWithPressIn({
        hapticFeedback: intensity,
        onPressIn: onPressIn ?? undefined,
      });

      if (!hasStyleFunction(style)) {
        const finalStyle = StyleSheet.flatten([
          style as ViewStyle,
          resolvedStyle,
        ]);
        return (
          <Component
            ref={ref}
            {...props}
            {...(handlePressIn !== undefined && { onPressIn: handlePressIn })}
            style={finalStyle}
          />
        );
      }

      const mergedStyle = (state: PressableStateCallbackType): ViewStyle => {
        const resolvedBareStyle = resolveStyleFunctions(style, state);
        return StyleSheet.flatten([resolvedBareStyle, resolvedStyle]);
      };

      return (
        <Component
          ref={ref}
          {...props}
          {...(handlePressIn !== undefined && { onPressIn: handlePressIn })}
          style={mergedStyle}
        />
      );
    },
    areLxPropsEqual,
  );

  // Set display name for debugging
  const componentName =
    (Component as { displayName?: string }).displayName ||
    (Component as { name?: string }).name ||
    'Component';
  StyledComponent.displayName = `StyledPressable(${componentName})`;

  return StyledComponent;
};
