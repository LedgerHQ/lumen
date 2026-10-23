import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStyleSheet } from '../../../../styles';
import {
  ProgressLabelLayout,
  useAnimatedProgressWidth,
} from '../../internal/ProgressBase';
import { Box } from '../../primitives';
import type { ProgressAppearance, ProgressBarProps } from './types';

const useStyles = ({
  appearance,
}: {
  appearance: ProgressAppearance;
}): { track: ViewStyle; fill: ViewStyle } => {
  return useStyleSheet(
    (t) => {
      const fillColors: Record<ProgressAppearance, string> = {
        base: t.colors.bg.interactive,
        accent: t.colors.bg.accent,
        success: t.colors.bg.successStrong,
        error: t.colors.bg.errorStrong,
        warning: t.colors.bg.warningStrong,
        'decorative-blue': t.colors.bg.decorativeBlue,
        'decorative-pink': t.colors.bg.decorativePink,
        'decorative-purple': t.colors.bg.decorativePurple,
        'decorative-green': t.colors.bg.decorativeGreen,
        'decorative-turquoise': t.colors.bg.decorativeTurquoise,
        'decorative-yellow': t.colors.bg.decorativeYellow,
        'decorative-orange': t.colors.bg.decorativeOrange,
        'decorative-red': t.colors.bg.decorativeRed,
      };

      return {
        track: {
          width: '100%',
          height: t.sizes.s6,
          borderRadius: t.borderRadius.full,
          backgroundColor: t.colors.bg.muted,
          overflow: 'hidden',
        },
        fill: {
          height: '100%',
          borderRadius: t.borderRadius.full,
          backgroundColor: fillColors[appearance],
        },
      };
    },
    [appearance],
  );
};

/**
 * A determinate progress bar showing how far along a task is. An optional label
 * can sit above or below the bar.
 *
 * @example
 * <ProgressBar value={40} accessibilityLabel='Upload progress' />
 * <ProgressBar
 *   value={72}
 *   accessibilityLabel='Sync progress'
 *   label='Syncing accounts'
 *   labelPosition='start-top'
 * />
 */
export const ProgressBar = ({
  value,
  appearance = 'base',
  label,
  labelPosition,
  accessibilityLabel,
  lx = {},
  style,
  ref,
  ...props
}: ProgressBarProps) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const styles = useStyles({ appearance });
  const animatedFillStyle = useAnimatedProgressWidth(clampedValue);

  return (
    <ProgressLabelLayout label={label} labelPosition={labelPosition}>
      <Box
        {...props}
        ref={ref}
        lx={lx}
        style={StyleSheet.flatten([styles.track, style])}
        accessible
        accessibilityRole='progressbar'
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
      >
        <Animated.View style={[styles.fill, animatedFillStyle]} />
      </Box>
    </ProgressLabelLayout>
  );
};
