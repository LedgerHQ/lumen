import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';
import type { LumenTextStyle } from '../../../../styles';
import { useStyleSheet } from '../../../../styles';
import { Box, Pressable, Text } from '../../primitives';
import type {
  MenuListItemAppearance,
  MenuListItemProps,
  MenuListProps,
} from './types';

const resolveContentColor = (
  disabled: boolean,
  appearance: MenuListItemAppearance,
): NonNullable<LumenTextStyle['color']> => {
  if (disabled) {
    return 'disabled';
  }
  if (appearance === 'red') {
    return 'error';
  }
  return 'base';
};

const useItemStyles = ({
  pressed,
  disabled,
  appearance,
}: {
  pressed: boolean;
  disabled: boolean;
  appearance: MenuListItemAppearance;
}) =>
  useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: t.spacings.s12,
          paddingHorizontal: t.spacings.s8,
          gap: t.spacings.s12,
          borderRadius: t.borderRadius.sm,
          backgroundColor: t.colors.bg.baseTransparent,
        },
        pressed && { backgroundColor: t.colors.bg.baseTransparentPressed },
      ]),
      label: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          flex: 1,
          color: t.colors.text[resolveContentColor(disabled, appearance)],
        },
      ]),
    }),
    [pressed, disabled, appearance],
  );

/**
 * A container for a set of tappable actions, rendered as `MenuListItem`s.
 *
 * `MenuList` is a content primitive: it owns no open/close state, so compose it
 * inside a `BottomSheet` (or any other surface) to build a menu experience.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-menulist--docs Storybook}
 *
 * @example
 * <MenuList>
 *   <MenuListItem icon={Unlink} label="Unlink" onPress={handleUnlink} />
 *   <MenuListItem icon={Trash} label="Remove" appearance="red" onPress={handleRemove} />
 * </MenuList>
 */
export const MenuList = ({
  children,
  lx,
  style,
  ref,
  ...props
}: MenuListProps) => (
  <Box lx={lx} style={style} ref={ref} {...props}>
    {children}
  </Box>
);

/**
 * A single action inside a `MenuList`: a label, an optional leading icon and a
 * press handler.
 *
 * Place destructive (`appearance="red"`) items last, per platform convention.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-menulist--docs Storybook}
 *
 * @example
 * <MenuListItem icon={Trash} label="Remove" appearance="red" onPress={handleRemove} />
 */
export const MenuListItem = ({
  label,
  icon: Icon,
  appearance = 'base',
  disabled: disabledProp = false,
  onPress,
  accessibilityState,
  lx,
  style,
  ref,
  ...props
}: MenuListItemProps) => {
  const disabled = useDisabledContext({
    consumerName: 'MenuListItem',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <Pressable
      ref={ref}
      lx={lx}
      style={style}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ ...accessibilityState, disabled }}
      {...props}
    >
      {({ pressed }) => (
        <MenuListItemInner
          label={label}
          icon={Icon}
          appearance={appearance}
          pressed={pressed}
          disabled={disabled}
        />
      )}
    </Pressable>
  );
};

const MenuListItemInner = ({
  label,
  icon: Icon,
  appearance,
  pressed,
  disabled,
}: {
  label: string;
  icon: MenuListItemProps['icon'];
  appearance: MenuListItemAppearance;
  pressed: boolean;
  disabled: boolean;
}) => {
  const styles = useItemStyles({ pressed, disabled, appearance });

  return (
    <Box style={styles.container}>
      {Icon && (
        <Icon size={24} color={resolveContentColor(disabled, appearance)} />
      )}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Box>
  );
};
