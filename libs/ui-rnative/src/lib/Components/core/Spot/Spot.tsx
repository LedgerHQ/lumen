import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { Box } from '../../primitives';
import type { IconSize } from '../../symbols/Icon';
import type { SpotAppearance, SpotFill, SpotProps, SpotSize } from './types';

const iconSizeMap: Record<SpotSize, IconSize> = {
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  72: 40,
};

const useSpotStyles = ({
  size,
  appearance,
  fill,
  disabled,
}: {
  size: SpotSize;
  appearance: SpotAppearance;
  fill: SpotFill;
  disabled?: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const transparentTextColor: Record<SpotAppearance, string> = {
        base: t.colors.text.base,
        success: t.colors.text.success,
        error: t.colors.text.error,
        warning: t.colors.text.warning,
        muted: t.colors.text.muted,
        'decorative-blue': t.colors.text.decorativeBlue,
        'decorative-pink': t.colors.text.decorativePink,
        'decorative-purple': t.colors.text.decorativePurple,
        'decorative-green': t.colors.text.decorativeGreen,
        'decorative-turquoise': t.colors.text.decorativeTurquoise,
        'decorative-yellow': t.colors.text.decorativeYellow,
        'decorative-orange': t.colors.text.decorativeOrange,
        'decorative-red': t.colors.text.decorativeRed,
      };

      const plainTextColor: Record<SpotAppearance, string> = {
        base: t.colors.text.base,
        success: t.colors.text.successStrong,
        error: t.colors.text.errorStrong,
        warning: t.colors.text.warningStrong,
        muted: t.colors.text.muted,
        'decorative-blue': t.colors.text.decorativeStrongBlue,
        'decorative-pink': t.colors.text.decorativeStrongPink,
        'decorative-purple': t.colors.text.decorativeStrongPurple,
        'decorative-green': t.colors.text.decorativeStrongGreen,
        'decorative-turquoise': t.colors.text.decorativeStrongTurquoise,
        'decorative-yellow': t.colors.text.decorativeStrongYellow,
        'decorative-orange': t.colors.text.decorativeStrongOrange,
        'decorative-red': t.colors.text.decorativeStrongRed,
      };

      const plainBackgroundColor: Record<SpotAppearance, string> = {
        base: t.colors.bg.muted,
        success: t.colors.bg.success,
        error: t.colors.bg.error,
        warning: t.colors.bg.warning,
        muted: t.colors.bg.mutedPressed,
        'decorative-blue': t.colors.bg.decorativeBlue,
        'decorative-pink': t.colors.bg.decorativePink,
        'decorative-purple': t.colors.bg.decorativePurple,
        'decorative-green': t.colors.bg.decorativeGreen,
        'decorative-turquoise': t.colors.bg.decorativeTurquoise,
        'decorative-yellow': t.colors.bg.decorativeYellow,
        'decorative-orange': t.colors.bg.decorativeOrange,
        'decorative-red': t.colors.bg.decorativeRed,
      };

      const spotSize: Record<SpotSize, number> = {
        32: t.sizes.s32,
        40: t.sizes.s40,
        48: t.sizes.s48,
        56: t.sizes.s56,
        72: t.sizes.s72,
      };

      return {
        root: {
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: t.borderRadius.full,
          backgroundColor:
            fill === 'plain'
              ? plainBackgroundColor[appearance]
              : t.colors.bg.mutedTransparent,
          width: spotSize[size],
          height: spotSize[size],
          flexShrink: 0,
        },
        icon: {
          color: disabled
            ? t.colors.text.disabled
            : fill === 'plain'
              ? plainTextColor[appearance]
              : transparentTextColor[appearance],
        },
      };
    },
    [size, appearance, fill, disabled],
  );
};

/**
 * A circular icon container. `appearance` selects the color palette and `fill` selects whether that palette paints only the icon or the circle as well.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-spot--docs Storybook}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the spot's core appearance (colors, size, etc). Use the `appearance` and `fill` props instead.
 *
 * @example
 * import { Spot } from '@ledgerhq/lumen-ui-rnative';
 * import { Settings, CheckmarkCircleFill } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Spot icon={Settings} />
 * <Spot appearance="success" icon={CheckmarkCircleFill} />
 * <Spot appearance="success" fill="plain" icon={Settings} />
 */
export const Spot = ({
  appearance = 'base',
  fill = 'transparent',
  icon: Icon,
  disabled: disabledProp = false,
  size = 48,
  lx = {},
  style,
  ...rest
}: SpotProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Spot',
    mergeWith: { disabled: disabledProp },
  });
  const styles = useSpotStyles({ size, appearance, fill, disabled });

  return (
    <Box
      testID='spot-container'
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...rest}
    >
      <Icon size={iconSizeMap[size]} style={styles.icon} />
    </Box>
  );
};
