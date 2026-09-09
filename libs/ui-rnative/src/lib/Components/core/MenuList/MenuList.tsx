import {
  DisabledProvider,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
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
    <DisabledProvider value={{ disabled }}>
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
    </DisabledProvider>
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
