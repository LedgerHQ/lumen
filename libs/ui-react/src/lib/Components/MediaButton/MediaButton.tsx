import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { ChevronDown } from '../../Symbols';
import { baseButtonVariants } from '../Button/BaseButton';
import type { MediaButtonProps } from './types';

const triggerVariants = cva('gap-8 body-2-semi-bold', {
  variants: {
    size: {
      sm: '',
      md: '',
    },
    leadingContentShape: {
      flat: '',
      rounded: '',
      none: '',
    },
    hasChevron: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    {
      size: 'md',
      leadingContentShape: 'flat',
      hasChevron: true,
      class: 'py-14 pr-12 pl-16',
    },
    {
      size: 'sm',
      leadingContentShape: 'flat',
      hasChevron: true,
      class: 'py-10 pr-8 pl-12',
    },
    {
      size: 'md',
      leadingContentShape: 'rounded',
      hasChevron: true,
      class: 'py-8 pr-12 pl-8',
    },
    {
      size: 'sm',
      leadingContentShape: 'rounded',
      hasChevron: true,
      class: 'p-8',
    },
    {
      size: 'md',
      leadingContentShape: 'none',
      hasChevron: true,
      class: 'py-14 pr-12 pl-16',
    },
    {
      size: 'sm',
      leadingContentShape: 'none',
      hasChevron: true,
      class: 'py-10 pr-8 pl-12',
    },

    {
      size: 'md',
      leadingContentShape: 'flat',
      hasChevron: false,
      class: 'px-16 py-12',
    },
    {
      size: 'sm',
      leadingContentShape: 'flat',
      hasChevron: false,
      class: 'px-12 py-10',
    },
    {
      size: 'md',
      leadingContentShape: 'rounded',
      hasChevron: false,
      class: 'py-8 pr-16 pl-8',
    },
    {
      size: 'sm',
      leadingContentShape: 'rounded',
      hasChevron: false,
      class: 'py-8 pr-10 pl-8',
    },
    {
      size: 'md',
      leadingContentShape: 'none',
      hasChevron: false,
      class: 'px-16 py-14',
    },
    {
      size: 'sm',
      leadingContentShape: 'none',
      hasChevron: false,
      class: 'px-12 py-10',
    },
  ],
  defaultVariants: {
    size: 'md',
    leadingContentShape: 'none',
    hasChevron: true,
  },
});

/**
 * Media button for select/dropdown components. Displays a label with an optional
 * leading icon and a trailing chevron indicator.
 *
 * This component is intended to be used exclusively as the trigger inside a Select or
 * dropdown pattern. It should not be used as a standalone action button — use `Button`
 * or `IconButton` instead.
 *
 * @see {@link https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=6389-45680 Figma}
 *
 * @example
 * import { MediaButton } from '@ledgerhq/lumen-ui-react';
 * import { Settings } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * // With flat interface icon
 * <MediaButton leadingContent={<Settings size={20} />} leadingContentShape="flat">
 *   Network
 * </MediaButton>
 *
 * // With rounded crypto icon
 * <MediaButton leadingContent={<CryptoIcon ledgerId="bitcoin" size={32} />} leadingContentShape="rounded">
 *   Bitcoin
 * </MediaButton>
 *
 * // Without icon
 * <MediaButton>All accounts</MediaButton>
 */
export const MediaButton = ({
  ref,
  className,
  appearance = 'gray',
  size = 'md',
  disabled: disabledProp = false,
  asChild = false,
  leadingContent,
  leadingContentShape = 'flat',
  hideChevron = false,
  children,
  ...props
}: MediaButtonProps) => {
  const disabled = useDisabledContext({
    consumerName: 'MediaButton',
    mergeWith: { disabled: disabledProp },
  });
  const effectiveLeadingContentShape = leadingContent
    ? leadingContentShape
    : 'none';

  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      className={cn(
        baseButtonVariants({
          appearance,
          disabled,
          loading: false,
        }),
        triggerVariants({
          size,
          leadingContentShape: effectiveLeadingContentShape,
          hasChevron: !hideChevron,
        }),
        className,
      )}
      disabled={disabled}
      {...props}
    >
      {leadingContent && (
        <span className='inline-flex shrink-0 items-center'>
          {leadingContent}
        </span>
      )}
      <span className='flex items-center gap-2'>
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className='line-clamp-1 text-left'>{children}</span>
        )}
        {!hideChevron && <ChevronDown size={20} />}
      </span>
    </Comp>
  );
};
