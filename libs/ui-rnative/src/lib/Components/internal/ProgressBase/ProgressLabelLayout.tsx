import type { TextStyle, ViewStyle } from 'react-native';
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
  children,
}: ProgressLabelLayoutProps) => {
  const styles = useLabelStyles({ labelPosition });

  if (label == null || label === false) return children;

  return (
    <Box style={styles.layout}>
      <Text typography='body4' style={styles.label}>
        {label}
      </Text>
      {children}
    </Box>
  );
};
