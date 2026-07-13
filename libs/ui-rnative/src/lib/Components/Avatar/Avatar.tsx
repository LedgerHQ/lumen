import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { User } from '../../Symbols';
import type { IconSize } from '../Icon';
import { Box } from '../Utility';
import type { AvatarProps } from './types';

type Size = NonNullable<AvatarProps['size']>;

const fallbackIconSizes: Record<Size, IconSize> = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 56,
};

const useStyles = ({
  size,
  fallbackColor,
  shouldFallback,
}: {
  size: Size;
  fallbackColor?: string;
  shouldFallback: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeMap: Record<Size, { size: number; padding: number }> = {
        xs: { size: t.sizes.s24, padding: t.spacings.s4 },
        sm: { size: t.sizes.s40, padding: t.spacings.s4 },
        md: { size: t.sizes.s48, padding: t.spacings.s4 },
        lg: { size: t.sizes.s56, padding: t.spacings.s4 },
        xl: { size: t.sizes.s72, padding: t.spacings.s4 },
        '2xl': { size: t.sizes.s128, padding: t.spacings.s4 },
      };

      const fallbackTextTypography = {
        xs: t.typographies.body4SemiBold,
        sm: t.typographies.body1SemiBold,
        md: t.typographies.heading5SemiBold,
        lg: t.typographies.heading4SemiBold,
        xl: t.typographies.heading2SemiBold,
        '2xl': t.typographies.heading1SemiBold,
      };

      return {
        root: {
          position: 'relative',
          width: sizeMap[size].size,
          height: sizeMap[size].size,
          borderRadius: 9999,
          backgroundColor:
            shouldFallback && fallbackColor
              ? fallbackColor
              : t.colors.bg.baseTransparentHover,
          borderWidth: 1,
          borderColor: t.colors.border.icon,
          alignItems: 'center',
          justifyContent: 'center',
          padding: sizeMap[size].padding,
        },
        fallbackText: {
          ...fallbackTextTypography[size],
          color: fallbackColor ? t.colors.text.black : t.colors.text.base,
        },
        image: {
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 9999,
        },
      };
    },
    [size, fallbackColor, shouldFallback],
  );
};

/**
 * A circular avatar component that displays a user image or fallback icon.
 *
 * When the image fails to load or no src is provided, displays either the
 * `fallbackText` (e.g. initials) or a User icon fallback.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-avatar--docs Storybook}
 *
 * @example
 * import { Avatar } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Avatar src="https://example.com/photo.jpg" size="md" />
 */
export const Avatar = ({
  lx,
  style,
  src,
  alt = 'avatar',
  size = 'md',
  fallbackText,
  fallbackColor,
  ref,
  ...props
}: AvatarProps) => {
  const { t } = useCommonTranslation();
  const [error, setError] = useState<boolean>(false);
  const shouldFallback = !src || error;
  const styles = useStyles({ size, fallbackColor, shouldFallback });

  const resolvedAlt = alt || t('components.avatar.defaultAriaLabel');

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      accessibilityRole='image'
      accessibilityLabel={resolvedAlt}
      {...props}
    >
      {shouldFallback ? (
        fallbackText ? (
          <Text style={styles.fallbackText} selectable={false}>
            {fallbackText}
          </Text>
        ) : (
          <User
            size={fallbackIconSizes[size]}
            accessible={false}
            testID='avatar-fallback-icon'
          />
        )
      ) : (
        <Image
          source={{ uri: src }}
          style={styles.image}
          accessible={false}
          onError={() => setError(true)}
          testID='avatar-image'
        />
      )}
    </Box>
  );
};
