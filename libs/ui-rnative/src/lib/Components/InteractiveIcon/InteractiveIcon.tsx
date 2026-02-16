import { Children, isValidElement, PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../styles';

import { InjectStylesIntoChildren } from '../../utils/components/InjectStylesIntoChildren';
import { IconProps, IconSize } from '../Icon';
import { Pressable } from '../Utility';
import { HIT_SLOP_MAP, InteractiveIconProps } from './types';

type IconType = InteractiveIconProps['iconType'];

const useStyles = ({
  iconType,
  pressed,
  disabled,
}: {
  iconType: IconType;
  pressed: boolean;
  disabled: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const backgroundStyle = {
        filled: { backgroundColor: t.colors.bg.base },
        stroked: { backgroundColor: t.colors.bg.baseTransparent },
      };

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
              ? t.colors.text.mutedPressed
              : t.colors.text.muted,
        },
      };
    },
    [iconType, pressed, disabled],
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
 * @warning Always provide an `aria-label` prop to ensure screen reader accessibility, as the component contains only an icon without visible text.
 * @warning The icon size should be controlled by the icon component itself, not through styles. Use the appropriate size prop on the icon component (e.g., `size={20}`).
 * @warning The `style` prop should only be used for layout adjustments like margins or positioning. Do not use it to modify the component's core appearance (colors, padding, etc).
 *
 * @example
 * import { InteractiveIcon } from '@ledgerhq/lumen-ui-rnative';
 * import { DeleteCircleFill, Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * // Filled interactive icon for destructive actions
 * <InteractiveIcon iconType="filled" accessibilityLabel="Delete item" onPress={handleDelete}>
 *   <DeleteCircleFill size={20} />
 * </InteractiveIcon>
 *
 * // Stroked interactive icon for secondary actions
 * <InteractiveIcon iconType="stroked" accessibilityLabel="Open settings" onPress={handleSettings}>
 *   <Settings size={20} />
 * </InteractiveIcon>
 */
export const InteractiveIcon = ({
  iconType,
  children,
  disabled = false,
  hitSlop: hitSlopProp,
  hitSlopType = 'comfortable',
  style,
  lx,
  ...props
}: InteractiveIconProps) => {
  const child = Children.only(children);

  let iconSize: IconSize = 20;
  if (isValidElement<IconProps>(child) && 'size' in child.props) {
    iconSize = child.props.size ?? 20;
  }

  const resolvedHitSlop = hitSlopProp ?? HIT_SLOP_MAP[hitSlopType]?.[iconSize];

  return (
    <Pressable
      lx={lx}
      style={[style, { alignItems: 'center', justifyContent: 'center' }]}
      accessibilityRole='button'
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      hitSlop={resolvedHitSlop}
      {...props}
    >
      {({ pressed }) => (
        <InteractiveIconContent
          iconType={iconType}
          pressed={pressed}
          disabled={!!disabled}
        >
          {children}
        </InteractiveIconContent>
      )}
    </Pressable>
  );
};

const InteractiveIconContent = ({
  iconType,
  pressed,
  disabled,
  children,
}: PropsWithChildren<{
  iconType: IconType;
  pressed: boolean;
  disabled: boolean;
}>) => {
  const styles = useStyles({ iconType, pressed, disabled });

  return (
    <View style={styles.container}>
      <InjectStylesIntoChildren style={styles.icon}>
        {children}
      </InjectStylesIntoChildren>
    </View>
  );
};
InteractiveIcon.displayName = 'InteractiveIcon';
