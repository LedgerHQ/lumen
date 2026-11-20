import { cn } from '@ledgerhq/lumen-design-core/cn';
import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { DotIndicatorProps } from './types';

const rootVariants = cva('', {
  variants: {
    pinned: {
      true: 'group/dot-indicator relative inline-flex w-fit',
      false: '',
    },
  },
});

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
    pinned: {
      true: 'absolute end-0 top-0 z-1 group-has-data-popup-open/dot-indicator:z-above-popup-trigger',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    appearance: 'base',
    disabled: false,
    pinned: false,
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
      className={cn(rootVariants({ pinned }), className)}
      {...props}
    >
      <div
        aria-label={ariaLabel}
        aria-hidden={!ariaLabel || undefined}
        className={cn(
          dotIndicatorVariants({ size, appearance, disabled, pinned }),
        )}
      />
      {children}
    </div>
  );
}

DotIndicator.displayName = 'DotIndicator';
