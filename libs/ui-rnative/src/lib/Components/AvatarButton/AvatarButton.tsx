import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Avatar } from '../Avatar/Avatar';
import { Pressable } from '../Utility';
import type { AvatarButtonProps } from './types';

/**
 * An {@link Avatar} wrapped in a Pressable, for use as an interactive trigger.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-avatar-button--docs Storybook}
 *
 * @example
 * import { AvatarButton } from '@ledgerhq/lumen-ui-rnative';
 *
 * <AvatarButton src="https://example.com/photo.jpg" alt="Open user menu" onPress={openMenu} />
 */
export const AvatarButton = ({
  src,
  alt,
  size,
  fallbackText,
  fallbackColor,
  disabled: disabledProp = false,
  style,
  ...props
}: AvatarButtonProps) => {
  const disabled = useDisabledContext({
    consumerName: 'AvatarButton',
    mergeWith: { disabled: disabledProp },
  });
  const styles = useStyles({ disabled });

  return (
    <Pressable
      accessibilityRole='button'
      disabled={disabled}
      style={[styles.container, style]}
      {...props}
    >
      {({ pressed }) => (
        <>
          <Avatar
            src={src}
            alt={alt}
            size={size}
            fallbackText={fallbackText}
            fallbackColor={fallbackColor}
          />
          <View
            style={[styles.overlay, pressed && styles.overlayPressed]}
            pointerEvents='none'
          />
        </>
      )}
    </Pressable>
  );
};

const useStyles = ({ disabled }: { disabled: boolean }) =>
  useStyleSheet(
    (t) => ({
      container: {
        ...(disabled && { opacity: 0.3 }),
      },
      overlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 9999,
      },
      overlayPressed: {
        backgroundColor: t.colors.bg.baseTransparentPressed,
      },
    }),
    [disabled],
  );
