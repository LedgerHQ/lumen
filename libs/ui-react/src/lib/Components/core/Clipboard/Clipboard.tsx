import { cn } from '@ledgerhq/lumen-design-core/cn';
import {
  useDisabledContext,
  useTemporaryFlag,
} from '@ledgerhq/lumen-utils-shared';
import { useState } from 'react';
import type { MouseEvent } from 'react';
import { useCommonTranslation } from '../../../../translations';
import { Check, Copy } from '../../symbols';
import type { ClipboardProps } from './types';

const COPIED_DURATION_MS = 3000;

/**
 * Displays a value that is copied to the user's clipboard when the whole
 * surface is clicked. The copy icon switches to a check icon for a few
 * seconds to confirm the copy.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-clipboard--docs Storybook}
 *
 * @example
 * import { Clipboard } from '@ledgerhq/lumen-ui-react';
 *
 * <Clipboard
 *   value='0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
 *   onCopy={() => toast.info('Copied to clipboard')}
 * />
 */
export const Clipboard = ({
  ref,
  className,
  value,
  onCopy,
  onClick,
  ...props
}: ClipboardProps) => {
  const { t } = useCommonTranslation();
  const disabled = useDisabledContext({ consumerName: 'Clipboard' });
  const [copyConfirmed, markCopied] = useTemporaryFlag(COPIED_DURATION_MS);
  const [copiedValue, setCopiedValue] = useState<string>();

  const copied = copyConfirmed && copiedValue === value;
  const Icon = copied ? Check : Copy;

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopiedValue(value);
    markCopied();
    onCopy?.(value);
  };

  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'group flex min-h-48 w-full items-center gap-8 rounded-sm p-8 ps-16 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        disabled
          ? 'cursor-not-allowed bg-disabled text-disabled'
          : 'cursor-pointer bg-muted text-base',
        className,
      )}
      aria-label={`${value}, ${
        copied
          ? t('components.clipboard.copiedAriaLabel')
          : t('components.clipboard.copyAriaLabel')
      }`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <span className='min-w-0 flex-1 py-4 body-1 wrap-break-word'>
        {value}
      </span>
      <span
        className={cn(
          'flex shrink-0 rounded-full p-8 transition-colors',
          !disabled &&
            'group-hover:bg-base-transparent-hover group-active:bg-base-transparent-pressed',
        )}
      >
        <Icon size={16} />
      </span>
    </button>
  );
};
