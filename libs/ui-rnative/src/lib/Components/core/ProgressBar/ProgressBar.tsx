import type { TextStyle, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStyleSheet } from '../../../../styles';
import { Box, Text } from '../../primitives';
import type {
  ProgressAppearance,
  ProgressBarProps,
  ProgressLabelPosition,
} from './types';
import { useAnimatedProgressWidth } from './useAnimatedProgressWidth';

const labelLayouts: Record<
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

const useStyles = ({
  appearance,
  labelPosition,
}: {
  appearance: ProgressAppearance;
  labelPosition: ProgressLabelPosition;
}): {
  layout: ViewStyle;
  label: TextStyle;
  track: ViewStyle;
  fill: ViewStyle;
} => {
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
        layout: {
          width: '100%',
          gap: t.spacings.s8,
          ...labelLayouts[labelPosition],
        },
        label: {
          color: t.colors.text.muted,
        },
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
    [appearance, labelPosition],
  );
};

/**
 * A determinate progress bar showing how far along a task is. An optional label
 * can sit above or below the bar. `lx` and `style` target the outermost
 * element: the label wrapper when there is a label, otherwise the bar.
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
  labelPosition = 'start-bottom',
  accessibilityLabel,
  lx,
  style,
  ref,
  ...props
}: ProgressBarProps) => {
  const hasLabel = label != null && typeof label !== 'boolean';
  const clampedValue = Number.isNaN(value)
    ? 0
    : Math.min(100, Math.max(0, value));
  const styles = useStyles({ appearance, labelPosition });
  const animatedFillStyle = useAnimatedProgressWidth(clampedValue);

  const bar = (
    <Box
      {...props}
      ref={ref}
      lx={hasLabel ? undefined : lx}
      style={
        hasLabel ? styles.track : StyleSheet.flatten([styles.track, style])
      }
      accessible
      accessibilityRole='progressbar'
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: clampedValue }}
    >
      <Animated.View style={[styles.fill, animatedFillStyle]} />
    </Box>
  );

  if (!hasLabel) return bar;

  // The label comes first in the tree and flex direction moves it below the bar.
  return (
    <Box lx={lx} style={StyleSheet.flatten([styles.layout, style])}>
      <Text
        typography='body4'
        style={styles.label}
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
      >
        {label}
      </Text>
      {bar}
    </Box>
  );
};
