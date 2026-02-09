import { useState, useEffect } from 'react';
import { StyleSheet, Image, View } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { User } from '../../Symbols';
import { Box } from '../Utility';
import { AvatarProps } from './types';

type Size = NonNullable<AvatarProps['size']>;

const fallbackSizes = {
  sm: 16,
  md: 24,
} as const;

const useStyles = ({ size }: { size: Size }) => {
  return useStyleSheet(
    (t) => {
      const sizeMap = {
        sm: { size: t.sizes.s40, padding: t.spacings.s4 },
        md: { size: t.sizes.s48, padding: t.spacings.s4 },
      };

      const notificationsMap = {
        sm: t.sizes.s10,
        md: t.sizes.s12,
      };

      return {
        root: {
          position: 'relative',
          width: sizeMap[size].size,
          height: sizeMap[size].size,
          borderRadius: 9999,
          backgroundColor: t.colors.bg.muted,
          alignItems: 'center',
          justifyContent: 'center',
          padding: sizeMap[size].padding,
        },
        notification: {
          position: 'absolute',
          top: 0,
          right: 0,
          width: notificationsMap[size],
          height: notificationsMap[size],
          borderRadius: 9999,
          backgroundColor: t.colors.bg.errorStrong,
          zIndex: 1,
        },
        image: {
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: 9999,
        },
      };
    },
    [size],
  );
};

/**
 * A circular avatar component that displays a user image or fallback icon.
 *
 * When the image fails to load or no src is provided, displays a User icon fallback.
 * Supports an optional notification indicator.
 *
 * @see {@link https://lumen-ldls.vercel.app/?path=/docs/react-native_communication-avatar--docs Storybook}
 *
 * @example
 * import { Avatar } from '@ledgerhq/lumen-ui-react';
 *
 * <Avatar src="https://example.com/photo.jpg" size="md" />
 *
 * // With notification indicator
 * <Avatar src="https://example.com/photo.jpg" showNotification />
 */
export const Avatar = ({
  lx,
  style,
  src,
  alt = 'avatar',
  size = 'md',
  showNotification = false,
  ref,
  ...props
}: AvatarProps) => {
  const { t } = useCommonTranslation();
  const [error, setError] = useState<boolean>(false);
  const shouldFallback = !src || error;
  const styles = useStyles({ size });

  const resolvedAlt = alt || t('components.avatar.defaultAlt');

  const accessibilityLabel = showNotification
    ? `${resolvedAlt}, ${t('components.avatar.notificationAriaLabel')}`
    : resolvedAlt;

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      accessibilityRole='image'
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      {showNotification && (
        <View style={styles.notification} accessible={false} />
      )}
      {shouldFallback ? (
        <User size={fallbackSizes[size]} accessible={false} />
      ) : (
        <Image
          source={{ uri: src }}
          style={styles.image}
          accessible={false}
          onError={() => setError(true)}
        />
      )}
    </Box>
  );
};
