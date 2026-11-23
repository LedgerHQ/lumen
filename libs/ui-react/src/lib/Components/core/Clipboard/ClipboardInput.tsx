import { cn } from '@ledgerhq/lumen-design-core/cn';
import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import type { ClipboardInputProps } from './types';

/**
 * The input-style surface of `Clipboard`: a full-width button displaying a
 * value with a trailing icon. It holds no copy behavior; render it from
 * `Clipboard`'s `render` prop to wire the copy.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-clipboard--docs Storybook}
 *
 * @example
 * import { Clipboard, ClipboardInput } from '@ledgerhq/lumen-ui-react';
 *
 * <Clipboard
 *   value={address}
 *   render={({ value, handleCopy, Icon, statusLabel }) => (
 *     <ClipboardInput
 *       label={value}
 *       icon={Icon}
 *       aria-label={`${value}, ${statusLabel}`}
 *       onClick={handleCopy}
 *     />
 *   )}
 * />
 */
export const ClipboardInput = ({
  ref,
  className,
  label,
  icon: Icon,
  disabled: disabledProp = false,
  ...props
}: ClipboardInputProps) => {
  const disabled = useDisabledContext({
    consumerName: 'ClipboardInput',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'group flex min-h-48 w-full items-start gap-8 rounded-sm p-8 ps-16 text-start transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
        disabled
          ? 'cursor-not-allowed bg-disabled text-disabled'
          : 'cursor-pointer bg-muted text-base',
        className,
      )}
      disabled={disabled}
      {...props}
    >
      <span className='min-w-0 flex-1 py-4 body-1 wrap-break-word'>
        {label}
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
