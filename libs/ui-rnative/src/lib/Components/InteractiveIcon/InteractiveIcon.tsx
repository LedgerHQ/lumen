import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import type { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../styles';

import type { IconProps, IconSize } from '../Icon';
import { Pressable } from '../Utility';
import type { InteractiveIconProps } from './types';
import { HIT_SLOP_MAP } from './types';

type IconType = InteractiveIconProps['iconType'];
type Appearance = NonNullable<InteractiveIconProps['appearance']>;

const useStyles = ({
  iconType,
  appearance,
  pressed,
  disabled,
}: {
  iconType: IconType;
  appearance: Appearance;
  pressed: boolean;
  disabled: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const backgroundStyle = {
        filled: { backgroundColor: t.colors.bg.base },
        stroked: { backgroundColor: t.colors.bg.baseTransparent },
      };
      const appearanceColors = {
        base: {
          default: t.colors.text.base,
          pressed: t.colors.text.basePressed,
        },
        muted: {
          default: t.colors.text.muted,
          pressed: t.colors.text.mutedPressed,
        },
        white: {
          default: t.colors.text.white,
          pressed: t.colors.text.whitePressed,
        },
      };
      const colorSet = appearanceColors[appearance];

      return {
        container: StyleSheet.flatten([
          {
            borderRadius: t.borderRadius.full,
          },
          backgroundStyle[iconType],
          iconType === 'stroked' &&
            pressed && { backgroundColor: t.colors.bg.baseTransparentPressed },
        ]),
        icon: {
          color: disabled
            ? t.colors.text.disabled
            : pressed
              ? colorSet.pressed
              : colorSet.default,
        },
      };
    },
    [iconType, appearance, pressed, disabled],
  );
};

/**
 * A specialized interactive component designed specifically for displaying pressable icons.
 *
 * The InteractiveIcon provides two visual styles - 'filled' and 'stroked' - optimized for different icon types and use cases.
 * It ensures proper pressed states and accessibility features while maintaining a minimal footprint.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/components-interactiveicon-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/components-interactiveicon-implementation--docs#dos-and-donts Guidelines}
 *
 * @component
 *
 * @warning Always provide an `accessibilityLabel` prop to ensure screen reader accessibility, as the component contains only an icon without visible text.
 * @warning The `style` prop should only be used for layout adjustments like margins or positioning. Do not use it to modify the component's core appearance (colors, padding, etc).
 *
 * @example
 * import { InteractiveIcon } from '@ledgerhq/lumen-ui-rnative';
 * import { DeleteCircleFill, Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * // Filled interactive icon for destructive actions
 * <InteractiveIcon iconType="filled" icon={DeleteCircleFill} size={20} accessibilityLabel="Delete item" onPress={handleDelete} />
 *
 * // Stroked interactive icon for secondary actions
 * <InteractiveIcon iconType="stroked" icon={Settings} size={20} accessibilityLabel="Open settings" onPress={handleSettings} />
 */
export const InteractiveIcon = ({
  iconType,
  icon,
  size = 24,
  disabled: disabledProp = false,
  hitSlop: hitSlopProp,
  hitSlopType = 'comfortable',
  appearance = 'muted',
  style,
  lx,
  ...props
}: InteractiveIconProps) => {
  const disabled = useDisabledContext({
    consumerName: 'InteractiveIcon',
    mergeWith: { disabled: disabledProp },
  });

  const resolvedHitSlop = hitSlopProp ?? HIT_SLOP_MAP[hitSlopType]?.[size];

  return (
    <Pressable
      lx={lx}
      style={[style, { alignItems: 'center', justifyContent: 'center' }]}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={resolvedHitSlop}
      {...props}
    >
      {({ pressed }) => (
        <InteractiveIconContent
          iconType={iconType}
          appearance={appearance}
          pressed={pressed}
          disabled={disabled}
          icon={icon}
          size={size}
        />
      )}
    </Pressable>
  );
};

const InteractiveIconContent = ({
  iconType,
  appearance,
  pressed,
  disabled,
  icon: Icon,
  size,
}: {
  iconType: IconType;
  appearance: Appearance;
  pressed: boolean;
  disabled: boolean;
  icon: ComponentType<Omit<IconProps, 'children'>>;
  size: IconSize;
}) => {
  const styles = useStyles({ iconType, appearance, pressed, disabled });

  return (
    <View style={styles.container}>
      <Icon size={size} style={styles.icon} />
    </View>
  );
};
