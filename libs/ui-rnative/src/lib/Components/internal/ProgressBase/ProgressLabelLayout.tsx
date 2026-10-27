import type { ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { Box, Text } from '../../primitives';
import type { ProgressLabelLayoutProps, ProgressLabelPosition } from './types';

const positionLayouts: Record<
  ProgressLabelPosition,
  {
    flexDirection: 'column' | 'column-reverse';
    alignItems: 'flex-start' | 'flex-end';
  }
> = {
  'start-top': { flexDirection: 'column', alignItems: 'flex-start' },
  'start-bottom': { flexDirection: 'column-reverse', alignItems: 'flex-start' },
  'end-top': { flexDirection: 'column', alignItems: 'flex-end' },
  'end-bottom': { flexDirection: 'column-reverse', alignItems: 'flex-end' },
};

export const hasProgressLabel = (label: ReactNode): boolean =>
  label != null && typeof label !== 'boolean';

export const clampProgress = (value: number): number =>
  Number.isNaN(value) ? 0 : Math.min(100, Math.max(0, value));

const useLabelStyles = ({
  labelPosition,
}: {
  labelPosition: ProgressLabelPosition;
}): { layout: ViewStyle; label: TextStyle } => {
  return useStyleSheet(
    (t) => ({
      layout: {
        width: '100%',
        gap: t.spacings.s8,
        ...positionLayouts[labelPosition],
      },
      label: {
        color: t.colors.text.muted,
      },
    }),
    [labelPosition],
  );
};

/**
 * Places an optional label above or below a progress bar. Without a label it
 * renders the bar alone, so the tree stays a single element.
 *
 * The label always comes first in the tree, and the flex direction moves it
 * below the bar when needed.
 */
export const ProgressLabelLayout = ({
  label,
  labelPosition = 'start-bottom',
  style,
  children,
  ...props
}: ProgressLabelLayoutProps) => {
  const styles = useLabelStyles({ labelPosition });

  if (!hasProgressLabel(label)) return children;

  return (
    <Box {...props} style={StyleSheet.flatten([styles.layout, style])}>
      <Text typography='body4' style={styles.label}>
        {label}
      </Text>
      {children}
    </Box>
  );
};
