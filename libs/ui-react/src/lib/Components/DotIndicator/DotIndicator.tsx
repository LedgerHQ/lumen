import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { DotIndicatorProps } from './types';

const dotIndicatorVariants = cva('pointer-events-none rounded-full', {
  variants: {
    size: {
      sm: 'size-6',
      md: 'size-8',
      lg: 'size-10',
      xl: 'size-12',
    },
    appearance: {
      base: 'bg-interactive',
      red: 'bg-error-strong',
    },
    disabled: {
      true: 'bg-disabled',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    appearance: 'base',
    disabled: false,
  },
});

export function DotIndicator({
  size = 'md',
  appearance = 'base',
  disabled: disabledProp = false,
  children,
  className,
  'aria-label': ariaLabel,
  ref,
  ...props
}: DotIndicatorProps) {
  const disabled = useDisabledContext({
    consumerName: 'DotIndicator',
    mergeWith: { disabled: disabledProp },
  });

  const pinned = !!children;

  return (
    <div
      ref={ref}
      className={cn(pinned && 'relative inline-flex w-fit', className)}
      {...props}
    >
      <div
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel || undefined}
        className={cn(
          dotIndicatorVariants({ size, appearance, disabled }),
          pinned && 'absolute top-0 right-0 z-1',
        )}
      />
      {children}
    </div>
  );
}

DotIndicator.displayName = 'DotIndicator';
