import { useTemporaryFlag } from '@ledgerhq/lumen-utils-shared';
import * as ExpoClipboard from 'expo-clipboard';
import type { GestureResponderEvent } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { useCommonTranslation } from '../../../../translations';
import { Pressable, Text } from '../../primitives';
import { Check, Copy } from '../../symbols';
import type { ClipboardProps } from './types';

const COPIED_DURATION_MS = 3000;

const useStyles = ({ pressed }: { pressed: boolean }) => {
  return useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: t.spacings.s8,
        paddingVertical: t.spacings.s6,
        paddingLeft: t.spacings.s12,
        paddingRight: t.spacings.s6,
        borderRadius: t.borderRadius.sm,
        backgroundColor: t.colors.bg.muted,
      },
      value: StyleSheet.flatten([
        t.typographies.body2,
        {
          flex: 1,
          paddingVertical: t.spacings.s2,
          color: t.colors.text.base,
        },
      ]),
      iconWrapper: StyleSheet.flatten([
        {
          flexShrink: 0,
          padding: t.spacings.s4,
          borderRadius: t.borderRadius.full,
        },
        pressed && { backgroundColor: t.colors.bg.baseTransparentPressed },
      ]),
    }),
    [pressed],
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
  onPress,
  ...props
}: ClipboardProps) => {
  const { t } = useCommonTranslation();
  const [copied, markCopied] = useTemporaryFlag(COPIED_DURATION_MS);

  const handlePress = async (event: GestureResponderEvent) => {
    onPress?.(event);

    try {
      await ExpoClipboard.setStringAsync(value);
    } catch {
      return;
    }
    markCopied();
    onCopy?.(value);
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
      onPress={handlePress}
      {...props}
    >
      {({ pressed }) => (
        <ClipboardContent value={value} copied={copied} pressed={pressed} />
      )}
    </Pressable>
  );
};

const ClipboardContent = ({
  value,
  copied,
  pressed,
}: {
  value: string;
  copied: boolean;
  pressed: boolean;
}) => {
  const styles = useStyles({ pressed });
  const Icon = copied ? Check : Copy;

  return (
    <View style={styles.container}>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.iconWrapper}>
        <Icon size={16} />
      </View>
    </View>
  );
};
