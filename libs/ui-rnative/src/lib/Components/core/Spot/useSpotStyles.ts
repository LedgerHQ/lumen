import { StyleSheet } from 'react-native';
import type { LumenTypographyTokens } from '../../../../styles';
import { useStyleSheet } from '../../../../styles';
import type { SpotAppearance, SpotFill, SpotSize } from './types';

const numberTypographyMap: Record<SpotSize, keyof LumenTypographyTokens> = {
  32: 'body2SemiBold',
  40: 'body1SemiBold',
  48: 'heading5',
  56: 'heading4',
  72: 'heading2',
};

export const useSpotStyles = ({
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

      const contentColor = disabled
        ? t.colors.text.disabled
        : fill === 'plain'
          ? plainTextColor[appearance]
          : transparentTextColor[appearance];

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
          color: contentColor,
        },
        numberText: StyleSheet.flatten([
          t.typographies[numberTypographyMap[size]],
          { color: contentColor },
        ]),
      };
    },
    [size, appearance, fill, disabled],
  );
};
