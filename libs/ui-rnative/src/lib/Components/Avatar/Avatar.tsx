import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { User } from '../../Symbols';
import { Box } from '../Utility';
import type { AvatarProps } from './types';

type Appearance = NonNullable<AvatarProps['appearance']>;
type Size = NonNullable<AvatarProps['size']>;

const fallbackSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

const useStyles = ({
  appearance,
  size,
}: {
  appearance: Appearance;
  size: Size;
}) => {
  return useStyleSheet(
    (t) => {
      const backgroundColors: Record<Appearance, string> = {
        gray: t.colors.bg.muted,
        transparent: t.colors.bg.mutedTransparent,
      };

      const sizeMap = {
        sm: { size: t.sizes.s40, padding: t.spacings.s4 },
        md: { size: t.sizes.s48, padding: t.spacings.s4 },
        lg: { size: t.sizes.s56, padding: t.spacings.s4 },
        xl: { size: t.sizes.s72, padding: t.spacings.s4 },
      };

      return {
        root: {
          position: 'relative',
          width: sizeMap[size].size,
          height: sizeMap[size].size,
          borderRadius: 9999,
          backgroundColor: backgroundColors[appearance],
          alignItems: 'center',
          justifyContent: 'center',
          padding: sizeMap[size].padding,
        },
        image: {
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 9999,
        },
      };
    },
    [appearance, size],
  );
};

/**
 * A circular avatar component that displays a user image or fallback icon.
 *
 * When the image fails to load or no src is provided, displays a User icon fallback.
 * Supports an optional notification indicator.
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
  appearance = 'transparent',
  size = 'md',
  ref,
  ...props
}: AvatarProps) => {
  const { t } = useCommonTranslation();
  const [error, setError] = useState<boolean>(false);
  const shouldFallback = !src || error;
  const styles = useStyles({ appearance, size });

  const resolvedAlt = alt || t('components.avatar.defaultAriaLabel');

  useEffect(() => {
    setError(false);
  }, [src]);

  const avatarContent = (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      accessibilityRole='image'
      accessibilityLabel={resolvedAlt}
      {...props}
    >
      {shouldFallback ? (
        <User
          size={fallbackSizes[size]}
          accessible={false}
          testID='avatar-fallback-icon'
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
    </Box>
  );

  return avatarContent;
};
