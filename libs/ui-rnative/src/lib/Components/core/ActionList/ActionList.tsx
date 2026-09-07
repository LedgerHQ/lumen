import {
  DisabledProvider,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';
import type { LumenTextStyle } from '../../../../styles';
import { useStyleSheet } from '../../../../styles';
import { Box, Pressable, Text } from '../../primitives';
import type {
  ActionListItemAppearance,
  ActionListItemProps,
  ActionListProps,
} from './types';

const resolveIconColor = (
  disabled: boolean,
  appearance: ActionListItemAppearance,
): LumenTextStyle['color'] => {
  if (disabled) {
    return 'disabled';
  }
  if (appearance === 'destructive') {
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
  appearance: ActionListItemAppearance;
}) =>
  useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: t.sizes.s56,
          paddingHorizontal: t.spacings.s8,
          gap: t.spacings.s12,
          borderRadius: t.borderRadius.md,
          backgroundColor: t.colors.bg.baseTransparent,
        },
        pressed && { backgroundColor: t.colors.bg.baseTransparentPressed },
      ]),
      label: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          flex: 1,
          color: disabled
            ? t.colors.text.disabled
            : appearance === 'destructive'
              ? t.colors.text.error
              : t.colors.text.base,
        },
      ]),
    }),
    [pressed, disabled, appearance],
  );

export const ActionList = ({
  children,
  lx,
  style,
  ref,
  ...props
}: ActionListProps) => (
  <Box lx={lx} style={style} ref={ref} {...props}>
    {children}
  </Box>
);

export const ActionListItem = ({
  label,
  icon: Icon,
  appearance = 'primary',
  disabled: disabledProp = false,
  onPress,
  lx,
  style,
  ref,
  ...props
}: ActionListItemProps) => {
  const disabled = useDisabledContext({
    consumerName: 'ActionListItem',
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
        accessibilityState={{ disabled }}
        {...props}
      >
        {({ pressed }) => (
          <ActionListItemInner
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

const ActionListItemInner = ({
  label,
  icon: Icon,
  appearance,
  pressed,
  disabled,
}: {
  label: string;
  icon: ActionListItemProps['icon'];
  appearance: ActionListItemAppearance;
  pressed: boolean;
  disabled: boolean;
}) => {
  const styles = useItemStyles({ pressed, disabled, appearance });

  return (
    <Box style={styles.container}>
      {Icon && (
        <Icon size={24} color={resolveIconColor(disabled, appearance)} />
      )}
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Box>
  );
};
