import type { TypographyDefinition } from '@ledgerhq/lumen-design-core';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
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
  borderWidth,
}: {
  size: Size;
  fallbackColor?: string;
  shouldFallback: boolean;
  borderWidth: number;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeMap: Record<Size, { size: number }> = {
        xs: { size: t.sizes.s24 },
        sm: { size: t.sizes.s40 },
        md: { size: t.sizes.s48 },
        lg: { size: t.sizes.s56 },
        xl: { size: t.sizes.s72 },
        '2xl': { size: t.sizes.s128 },
      };

      const fallbackTextTypography: Record<Size, TypographyDefinition> = {
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
          overflow: 'hidden',
          backgroundColor:
            shouldFallback && fallbackColor
              ? fallbackColor
              : t.colors.bg.baseTransparentHover,
          alignItems: 'center',
          justifyContent: 'center',
        },
        fallbackText: {
          ...fallbackTextTypography[size],
          color: fallbackColor ? t.colors.text.black : t.colors.text.base,
        },
        image: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        insetBorder: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 9999,
          borderWidth,
          borderColor: t.colors.border.icon,
        },
      };
    },
    [size, fallbackColor, shouldFallback, borderWidth],
  );
};

const FallbackContent = ({
  size,
  fallbackText,
  fallbackColor,
  styles,
}: {
  size: Size;
  fallbackText?: string;
  fallbackColor?: string;
  styles: ReturnType<typeof useStyles>;
}) =>
  fallbackText ? (
    <Text style={styles.fallbackText} selectable={false}>
      {fallbackText}
    </Text>
  ) : (
    <User
      size={fallbackIconSizes[size]}
      color={fallbackColor ? 'black' : 'base'}
      accessible={false}
      testID='avatar-fallback-icon'
    />
  );

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
  borderWidth = 1,
  ref,
  ...props
}: AvatarProps) => {
  const { t } = useCommonTranslation();
  const [error, setError] = useState<boolean>(false);
  const shouldFallback = !src || error;
  const styles = useStyles({
    size,
    fallbackColor,
    shouldFallback,
    borderWidth,
  });

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
        <FallbackContent
          size={size}
          fallbackText={fallbackText}
          fallbackColor={fallbackColor}
          styles={styles}
        />
      ) : (
        <Image
          source={{ uri: src }}
          style={styles.image}
          accessible={false}
          onError={() => setError(true)}
          testID='avatar-image'
        />
      )}
      <View style={styles.insetBorder} pointerEvents='none' />
    </Box>
  );
};
