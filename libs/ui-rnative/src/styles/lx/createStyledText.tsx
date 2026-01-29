import { memo } from 'react';
import { StyleSheet } from 'react-native';
import type { Text, TextStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { StyledTextProps } from '../types';
import { areLxPropsEqual } from './areLxPropsEqual';
import { useResolveTextStyle } from './resolveStyle';

/**
 * Factory function to create a styled Text component.
 *
 * ```tsx
 * // Create a basic Text
 * const StyledText = createStyledText(Text);
 * ```
 */
export const createStyledText = (Component: typeof Text) => {
  const StyledComponent = memo(
    ({
      typography = 'body3',
      lx = {},
      ref,
      style,
      ...props
    }: StyledTextProps) => {
      const { theme } = useTheme();
      const resolvedStyle = useResolveTextStyle(lx);
      const typographyStyle = theme.typographies[typography] as TextStyle;

      const finalStyle = StyleSheet.flatten([
        typographyStyle,
        style,
        resolvedStyle,
      ]);

      return <Component ref={ref} {...props} style={finalStyle} />;
    },

    areLxPropsEqual,
  );

  // Set display name for debugging
  const componentName =
    (Component as { displayName?: string }).displayName ||
    (Component as { name?: string }).name ||
    'Component';
  StyledComponent.displayName = `StyledText(${componentName})`;

  return StyledComponent;
};
