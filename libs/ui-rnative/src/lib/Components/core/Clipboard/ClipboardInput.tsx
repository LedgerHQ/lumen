import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { Pressable, Text } from '../../primitives';
import type { ClipboardInputProps } from './types';

const useStyles = ({
  pressed,
  disabled,
}: {
  pressed: boolean;
  disabled: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const foregroundColor = disabled
        ? t.colors.text.disabled
        : t.colors.text.base;

      return {
        container: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: t.spacings.s8,
          minHeight: t.sizes.s48,
          padding: t.spacings.s8,
          paddingStart: t.spacings.s16,
          borderRadius: t.borderRadius.sm,
          backgroundColor: disabled ? t.colors.bg.disabled : t.colors.bg.muted,
        },
        label: StyleSheet.flatten([
          t.typographies.body1,
          {
            flex: 1,
            paddingVertical: t.spacings.s4,
            color: foregroundColor,
          },
        ]),
        iconWrapper: StyleSheet.flatten([
          {
            flexShrink: 0,
            padding: t.spacings.s8,
            borderRadius: t.borderRadius.full,
          },
          pressed &&
            !disabled && {
              backgroundColor: t.colors.bg.baseTransparentPressed,
            },
        ]),
        icon: {
          color: foregroundColor,
        },
      };
    },
    [pressed, disabled],
  );
};

/**
 * The input-style surface of `Clipboard`: a full-width pressable displaying a
 * value with a trailing icon. It holds no copy behavior; render it from
 * `Clipboard`'s `render` prop to wire the copy.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-clipboard--docs Guidelines}
 *
 * @example
 * import { Clipboard, ClipboardInput } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Clipboard
 *   value={address}
 *   render={({ value, handleCopy, Icon, statusLabel }) => (
 *     <ClipboardInput
 *       label={value}
 *       icon={Icon}
 *       accessibilityLabel={`${value}, ${statusLabel}`}
 *       onPress={handleCopy}
 *     />
 *   )}
 * />
 */
export const ClipboardInput = ({
  ref,
  lx,
  style,
  label,
  icon,
  ...props
}: ClipboardInputProps) => {
  const disabled = useDisabledContext({ consumerName: 'ClipboardInput' });

  return (
    <Pressable
      ref={ref}
      lx={lx}
      style={style}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      disabled={disabled}
      {...props}
    >
      {({ pressed }) => (
        <ClipboardInputContent
          label={label}
          icon={icon}
          pressed={pressed}
          disabled={disabled}
        />
      )}
    </Pressable>
  );
};

const ClipboardInputContent = ({
  label,
  icon: Icon,
  pressed,
  disabled,
}: Pick<ClipboardInputProps, 'label' | 'icon'> & {
  pressed: boolean;
  disabled: boolean;
}) => {
  const styles = useStyles({ pressed, disabled });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.iconWrapper}>
        <Icon size={16} style={styles.icon} />
      </View>
    </View>
  );
};
