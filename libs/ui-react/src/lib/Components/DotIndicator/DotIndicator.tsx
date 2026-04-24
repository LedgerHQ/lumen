import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { DotIndicatorProps } from './types';

const dotIndicatorVariants = cva('rounded-full pointer-events-none', {
  variants: {
    size: {
      xs: 'size-10',
      sm: 'size-12',
      md: 'size-16',
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
    size: 'sm',
    appearance: 'base',
    disabled: false,
  },
});

export function DotIndicator({
  size = 'sm',
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
      className={cn(pinned && 'relative', className)}
      {...props}
    >
      <div
        role='img'
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel || undefined}
        className={cn(
          dotIndicatorVariants({ size, appearance, disabled }),
          pinned && 'absolute top-0 right-0 z-[1]',
        )}
      />
      {children}
    </div>
  );
}

DotIndicator.displayName = 'DotIndicator';
