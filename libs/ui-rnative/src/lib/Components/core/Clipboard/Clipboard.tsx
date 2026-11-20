import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useState } from 'react';
import { useCommonTranslation } from '../../../../translations';
import { useClipboard } from '../../../utils/useClipboard/useClipboard';
import { Check, Copy } from '../../symbols';
import { ClipboardInput } from './ClipboardInput';
import type { ClipboardProps, ClipboardRenderProps } from './types';

const renderClipboardInput = ({
  value,
  handleCopy,
  Icon,
  statusLabel,
}: ClipboardRenderProps) => (
  <ClipboardInput
    label={value}
    icon={Icon}
    accessibilityLabel={`${value}, ${statusLabel}`}
    onPress={handleCopy}
  />
);

/**
 * Copies a value to the user's clipboard and exposes the copy state to the
 * element it renders. The icon switches from copy to check for a few seconds
 * to confirm the copy. Renders a `ClipboardInput` by default; use `render` to
 * trigger the copy from any other component.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-clipboard--docs Guidelines}
 *
 * @example
 * import { Clipboard, IconButton, toast } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Clipboard
 *   value='0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
 *   onCopy={() => toast.info({ title: 'Copied to clipboard' })}
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
  resetAfterMs,
  render = renderClipboardInput,
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

  const handleCopy = async (): Promise<void> => {
    if (disabled) {
      return;
    }
    await copy(value);
  };

  return render({
    value,
    handleCopy,
    Icon: copied ? Check : Copy,
    isCopied: copied,
    statusLabel: copied
      ? t('components.clipboard.copiedAriaLabel')
      : t('components.clipboard.copyAriaLabel'),
  });
};
