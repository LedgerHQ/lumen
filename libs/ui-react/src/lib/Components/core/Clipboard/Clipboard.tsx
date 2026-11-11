import { cn } from '@ledgerhq/lumen-design-core/cn';
import { useTemporaryFlag } from '@ledgerhq/lumen-utils-shared';
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
  const [copied, markCopied] = useTemporaryFlag(COPIED_DURATION_MS);
  const Icon = copied ? Check : Copy;

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    markCopied();
    onCopy?.(value);
  };

  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'group flex w-full cursor-pointer items-start gap-8 rounded-sm bg-muted py-6 ps-12 pe-6 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        className,
      )}
      aria-label={`${value}, ${
        copied
          ? t('components.clipboard.copiedAriaLabel')
          : t('components.clipboard.copyAriaLabel')
      }`}
      onClick={handleClick}
      {...props}
    >
      <span className='min-w-0 flex-1 py-2 body-2 wrap-break-word text-base'>
        {value}
      </span>
      <span className='shrink-0 rounded-full p-4 text-base transition-colors group-hover:bg-base-transparent-hover group-active:bg-base-transparent-pressed'>
        <Icon size={16} />
      </span>
    </button>
  );
};
