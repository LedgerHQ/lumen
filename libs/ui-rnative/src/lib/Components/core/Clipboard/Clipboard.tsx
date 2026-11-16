import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { useCommonTranslation } from '../../../../translations';
import { useClipboard } from '../../../utils/useClipboard/useClipboard';
import { Pressable, Text } from '../../primitives';
import { Check, Copy } from '../../symbols';
import type { ClipboardProps } from './types';

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
        value: StyleSheet.flatten([
          t.typographies.body1,
          {
            flex: 1,
            paddingVertical: t.spacings.s4,
            textAlign: 'left',
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
 * Displays a value that is copied to the user's clipboard when the whole
 * surface is pressed. The copy icon switches to a check icon for a few
 * seconds to confirm the copy.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-clipboard--docs Guidelines}
 *
 * @example
 * import { Clipboard } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Clipboard
 *   value='0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
 *   onCopy={() => toast.info({ title: 'Copied to clipboard' })}
 * />
 */
export const Clipboard = ({
  ref,
  lx,
  style,
  value,
  onCopy,
  resetAfterMs,
  onPress,
  ...props
}: ClipboardProps) => {
  const { t } = useCommonTranslation();
  const disabled = useDisabledContext({ consumerName: 'Clipboard' });
  const [copiedValue, setCopiedValue] = useState<string>();
  const { copy, isCopied } = useClipboard({
    resetAfterMs,
    onCopy: (copied) => {
      setCopiedValue(copied);
      onCopy?.(copied);
    },
  });

  const copied = isCopied && copiedValue === value;

  const handlePress = async (event: GestureResponderEvent) => {
    onPress?.(event);

    await copy(value);
  };

  return (
    <Pressable
      ref={ref}
      lx={lx}
      style={style}
      accessibilityRole='button'
      accessibilityLabel={`${value}, ${
        copied
          ? t('components.clipboard.copiedAriaLabel')
          : t('components.clipboard.copyAriaLabel')
      }`}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handlePress}
      {...props}
    >
      {({ pressed }) => (
        <ClipboardContent
          value={value}
          copied={copied}
          pressed={pressed}
          disabled={disabled}
        />
      )}
    </Pressable>
  );
};

const ClipboardContent = ({
  value,
  copied,
  pressed,
  disabled,
}: {
  value: string;
  copied: boolean;
  pressed: boolean;
  disabled: boolean;
}) => {
  const styles = useStyles({ pressed, disabled });
  const Icon = copied ? Check : Copy;

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.iconWrapper}>
        <Icon size={16} style={styles.icon} />
      </View>
    </View>
  );
};
