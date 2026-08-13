import { useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { Linking, StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import type { LumenTypographyTokenName } from '../../../../styles';
import { useHapticFeedbackWithPressIn } from '../../../Haptics';
import type { HapticFeedback } from '../../../Haptics/types';
import { Text } from '../../primitives/Text';
import { ExternalLink } from '../../symbols';
import type { IconSize } from '../../symbols/Icon';
import type { LinkProps } from './types';

type Appearance = NonNullable<LinkProps['appearance']>;
type Size = NonNullable<LinkProps['size']>;

const iconSizeMap: Record<Size, IconSize> = {
  sm: 16,
  md: 20,
};

const typographyMap: Record<Size, LumenTypographyTokenName> = {
  sm: 'body2SemiBold',
  md: 'body1SemiBold',
};

/**
 * Icons nested in a Text are laid out as inline attachments sitting on the
 * baseline, which places them above the text's optical centre. These offsets
 * (`iconSize / 2 - 0.35 * fontSize`, rounded) push them back down.
 */
const iconOffsetMap: Record<Size, number> = {
  sm: 3,
  md: 4,
};

type StyleParams = {
  appearance: Appearance;
  size: Size;
  underline: boolean;
  pressed: boolean;
};

const useStyles = ({ appearance, size, underline, pressed }: StyleParams) => {
  return useStyleSheet(
    (t) => {
      const textColors: Record<Appearance, string> = {
        base: t.colors.text.base,
        accent: t.colors.text.interactive,
      };

      const pressedTextColors: Record<Appearance, string> = {
        base: t.colors.text.basePressed,
        accent: t.colors.text.interactivePressed,
      };

      const color = pressed
        ? pressedTextColors[appearance]
        : textColors[appearance];
      const gap = size === 'sm' ? t.spacings.s4 : t.spacings.s8;
      const iconOffset = iconOffsetMap[size];

      return {
        text: {
          flexShrink: 1,
          color,
          textDecorationLine: underline ? 'underline' : 'none',
        },
        icon: {
          color,
        },
        // Inline attachments only reserve their own layout box, so the spacing
        // has to be padding on a wrapper — a margin on the icon is dropped.
        leadingIconWrapper: {
          paddingRight: gap,
          pointerEvents: 'none',
          transform: [{ translateY: iconOffset }],
        },
        trailingIconWrapper: {
          paddingLeft: gap,
          pointerEvents: 'none',
          transform: [{ translateY: iconOffset }],
        },
      };
    },
    [appearance, size, underline, pressed],
  );
};

/**
 * A customizable link component that supports base and accent color appearances, optional underline, sizes, icons, and external link handling.
 * Opens URLs using React Native's Linking API.
 *
 * Rendered as a `Text`, so it can be nested inside a paragraph of text and flows
 * with it (no extra line height) as well as used on its own.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-link--docs Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the link's core appearance (colors, padding, etc). Use the `appearance` and `underline` props instead.
 *
 * @example
 * import { Link } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Default link with underline
 * <Link href="https://example.com">
 *   Go to Page
 * </Link>
 *
 * // Accent link with icon and external indicator
 * import { ArrowRight } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Link appearance="accent" size="sm" href="https://example.com" isExternal icon={ArrowRight}>
 *   External Site
 * </Link>
 *
 * // Small base link without underline
 * <Link appearance="base" size="sm" underline={false} href="https://example.com">
 *   Simple Link
 * </Link>
 *
 * // Link with custom press handler
 * <Link onPress={() => navigation.navigate('Dashboard')}>
 *   Dashboard
 * </Link>
 */
export const Link = ({
  lx,
  style,
  children,
  appearance = 'base',
  size = 'md',
  underline = true,
  icon,
  isExternal = false,
  href,
  onPress,
  onPressIn,
  onPressOut,
  hapticFeedback,
  numberOfLines = 1,
  suppressHighlighting = true,
  ref,
  ...props
}: LinkProps) => {
  const [pressed, setPressed] = useState(false);
  const styles = useStyles({ appearance, size, underline, pressed });
  const calculatedIconSize = iconSizeMap[size];
  const IconComponent = icon;

  const intensity: HapticFeedback | undefined =
    hapticFeedback === true ? 'medium' : (hapticFeedback ?? undefined);

  const { handlePressIn } = useHapticFeedbackWithPressIn({
    hapticFeedback: intensity,
    onPressIn: (event: GestureResponderEvent) => {
      setPressed(true);
      onPressIn?.(event);
    },
  });

  const handlePressOut = (event: GestureResponderEvent) => {
    setPressed(false);
    onPressOut?.(event);
  };

  const handlePress = async () => {
    if (onPress) {
      onPress();
    } else if (href) {
      await Linking.openURL(href);
    }
  };

  return (
    <Text
      ref={ref}
      lx={lx}
      typography={typographyMap[size]}
      style={StyleSheet.flatten([styles.text, style])}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      suppressHighlighting={suppressHighlighting}
      numberOfLines={numberOfLines}
      accessibilityRole='link'
      {...props}
    >
      {IconComponent && (
        <View style={styles.leadingIconWrapper}>
          <IconComponent size={calculatedIconSize} style={styles.icon} />
        </View>
      )}
      {children}
      {isExternal && (
        <View style={styles.trailingIconWrapper}>
          <ExternalLink
            size={calculatedIconSize}
            style={styles.icon}
            accessible={false}
          />
        </View>
      )}
    </Text>
  );
};
