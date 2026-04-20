import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { useCallback } from 'react';
import type { TileButtonProps } from './types';

const tileButtonVariants = cva(
  [
    'flex flex-col items-center gap-8 rounded-md p-12',
    'bg-surface body-2-semi-bold text-base transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  ],
  {
    variants: {
      disabled: {
        true: 'bg-disabled text-disabled cursor-not-allowed',
        false:
          'hover:bg-surface-hover active:bg-surface-pressed cursor-pointer',
      },
      isFull: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      disabled: false,
      isFull: false,
    },
  },
);

const iconVariants = cva('shrink-0', {
  variants: {
    disabled: {
      true: 'text-disabled',
      false: 'text-base',
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

/**
 * A compact button component displaying an icon above a label in a vertical layout.
 * Ideal for grids, toolbars, or quick action menus.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/action-tilebutton--docs Storybook}
 *
 * @example
 * import { TileButton } from '@ledgerhq/lumen-ui-react';
 * import { Settings } from '@ledgerhq/lumen-ui-react/symbols';
 *
 * <TileButton icon={Settings} onClick={() => console.log('clicked')}>
 *   Settings
 * </TileButton>
 *
 * @example
 * // Using with router (asChild pattern)
 * import { Link } from 'react-router-dom';
 *
 * <TileButton asChild icon={Settings}>
 *   <Link to="/settings">Settings</Link>
 * </TileButton>
 */
export const TileButton = ({
  ref,
  icon: Icon,
  children,
  onClick,
  disabled: disabledProp = false,
  isFull = false,
  className,
  asChild = false,
  'aria-label': ariaLabel,
  ...props
}: TileButtonProps) => {
  const disabled = useDisabledContext({
    consumerName: 'TileButton',
    mergeWith: { disabled: disabledProp },
  });
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    },
    [disabled, onClick],
  );

  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      type={asChild ? undefined : 'button'}
      className={cn(tileButtonVariants({ disabled, isFull }), className)}
      onClick={handleClick}
      disabled={disabled}
      data-disabled={disabled || undefined}
      aria-label={ariaLabel}
      {...props}
    >
      <Icon size={20} className={iconVariants({ disabled })} />
      {asChild ? (
        <Slottable>{children}</Slottable>
      ) : (
        <span className='line-clamp-2 text-center'>{children}</span>
      )}
    </Comp>
  );
};
