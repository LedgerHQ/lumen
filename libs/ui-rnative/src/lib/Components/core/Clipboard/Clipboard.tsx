import {
  DisabledProvider,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useCommonTranslation } from '../../../../translations';
import { useClipboard } from '../../../utils/useClipboard/useClipboard';
import { Check, Copy } from '../../symbols';
import type { ClipboardProps } from './types';

/**
 * Copies a value to the user's clipboard and exposes the copy state to the
 * element it renders. The icon switches from copy to check for a few seconds
 * to confirm the copy. Use `render` to trigger the copy from a
 * `ClipboardInput` or any other component.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-clipboard--docs Guidelines}
 *
 * @example
 * import { Clipboard, ClipboardInput, IconButton, toast } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Clipboard
 *   value='0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
 *   onCopy={() => toast.info({ title: 'Copied to clipboard' })}
 *   render={({ value, handleCopy, Icon, statusLabel }) => (
 *     <ClipboardInput
 *       label={value}
 *       icon={Icon}
 *       accessibilityLabel={`${value}, ${statusLabel}`}
 *       onPress={handleCopy}
 *     />
 *   )}
 * />
 *
 * <Clipboard
 *   value='0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
 *   render={({ handleCopy, Icon, statusLabel }) => (
 *     <IconButton icon={Icon} accessibilityLabel={statusLabel} onPress={handleCopy} />
 *   )}
 * />
 */
export const Clipboard = ({
  value,
  onCopy,
  resetDelay,
  disabled: disabledProp = false,
  render,
}: ClipboardProps) => {
  const { t } = useCommonTranslation();
  const disabled = useDisabledContext({
    consumerName: 'Clipboard',
    mergeWith: { disabled: disabledProp },
  });
  const [copiedValue, setCopiedValue] = useState<string>();
  const { copy, isCopied } = useClipboard({
    resetDelay,
    onCopy: (copied) => {
      setCopiedValue(copied);
      // VoiceOver and TalkBack don't re-read the focused trigger's changed label
      AccessibilityInfo.announceForAccessibility(
        t('components.clipboard.copiedAriaLabel'),
      );
      onCopy?.(copied);
    },
  });

  const copied = isCopied && copiedValue === value;

  const handleCopy = async (): Promise<boolean> => {
    if (disabled) {
      return false;
    }
    return copy(value);
  };

  return (
    <DisabledProvider value={{ disabled }}>
      {render({
        value,
        handleCopy,
        Icon: copied ? Check : Copy,
        isCopied: copied,
        statusLabel: copied
          ? t('components.clipboard.copiedAriaLabel')
          : t('components.clipboard.copyAriaLabel'),
      })}
    </DisabledProvider>
  );
};
