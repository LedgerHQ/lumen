import { useState, useEffect } from 'react';
import { StyleSheet, Image } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { User } from '../../Symbols';
import { DotIndicator } from '../DotIndicator';
import { Box } from '../Utility';
import type { AvatarProps } from './types';

type Size = NonNullable<AvatarProps['size']>;

const fallbackSizes = {
  sm: 16,
  md: 24,
  lg: 32,
} as const;

const dotSizeMap: Record<
  Size,
  NonNullable<React.ComponentProps<typeof DotIndicator>['size']>
> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

const useStyles = ({ size }: { size: Size }) => {
  return useStyleSheet(
    (t) => {
      const sizeMap = {
        sm: { size: t.sizes.s40, padding: t.spacings.s4 },
        md: { size: t.sizes.s48, padding: t.spacings.s4 },
        lg: { size: t.sizes.s72, padding: t.spacings.s4 },
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
  testID,
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

  const avatarContent = (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      accessibilityRole='image'
      accessibilityLabel={accessibilityLabel}
      testID={showNotification ? undefined : testID}
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

  if (showNotification) {
    return (
      <DotIndicator size={dotSizeMap[size]} appearance='red' testID={testID}>
        {avatarContent}
      </DotIndicator>
    );
  }

  return avatarContent;
};
