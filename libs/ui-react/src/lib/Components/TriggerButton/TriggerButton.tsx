import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { ChevronDown } from '../../Symbols';
import { baseButtonVariants } from '../Button/BaseButton';
import type { TriggerButtonProps } from './types';

const triggerVariants = cva('gap-8 body-2-semi-bold', {
  variants: {
    size: {
      sm: '',
      md: '',
    },
    iconType: {
      flat: '',
      rounded: '',
      none: '',
    },
  },
  compoundVariants: [
    { size: 'md', iconType: 'flat', class: 'px-16 py-12' },
    { size: 'md', iconType: 'rounded', class: 'py-8 pr-16 pl-8' },
    { size: 'md', iconType: 'none', class: 'px-16 py-14' },
    { size: 'sm', iconType: 'flat', class: 'px-12 py-10' },
    { size: 'sm', iconType: 'rounded', class: 'py-8 pr-10 pl-8' },
    { size: 'sm', iconType: 'none', class: 'px-12 py-10' },
  ],
  defaultVariants: {
    size: 'md',
    iconType: 'none',
  },
});

/**
 * Trigger button for select/dropdown components. Displays a label with an optional
 * leading icon and a trailing chevron indicator.
 *
 * This component is intended to be used exclusively as the trigger inside a Select or
 * dropdown pattern. It should not be used as a standalone action button — use `Button`
 * or `IconButton` instead.
 *
 * @see {@link https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=6389-45680 Figma}
 *
 * @example
 * import { TriggerButton } from '@ledgerhq/lumen-ui-react';
 * import { Settings } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * // With flat interface icon
 * <TriggerButton icon={<Settings size={20} />} iconType="flat">
 *   Network
 * </TriggerButton>
 *
 * // With rounded crypto icon
 * <TriggerButton icon={<CryptoIcon ledgerId="bitcoin" size="32px" />} iconType="rounded">
 *   Bitcoin
 * </TriggerButton>
 *
 * // Without icon
 * <TriggerButton>All accounts</TriggerButton>
 */
export const TriggerButton = ({
  ref,
  className,
  appearance = 'gray',
  size = 'md',
  disabled: disabledProp = false,
  asChild = false,
  icon,
  iconType = 'flat',
  children,
  ...props
}: TriggerButtonProps) => {
  const disabled = useDisabledContext({
    consumerName: 'TriggerButton',
    mergeWith: { disabled: disabledProp },
  });
  const effectiveIconType = icon ? iconType : 'none';
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
        triggerVariants({ size, iconType: effectiveIconType }),
        className,
      )}
      data-disabled={disabled || undefined}
      disabled={disabled}
      {...props}
    >
      {icon && <span className='shrink-0'>{icon}</span>}
      <span className='flex items-center gap-2'>
        {asChild ? (
          <Slottable>{children}</Slottable>
        ) : (
          <span className='line-clamp-1 text-left'>{children}</span>
        )}
        <ChevronDown size={20} className='shrink-0' />
      </span>
    </Comp>
  );
};

TriggerButton.displayName = 'TriggerButton';
