import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { DotCountProps } from './types';

const dotCountVariants = cva(
  'flex items-center justify-center rounded-full pointer-events-none',
  {
    variants: {
      size: {
        lg: 'min-h-24 min-w-24 px-8 py-2',
        md: 'min-h-16 min-w-16 px-4',
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
  },
);

const textVariants = cva('', {
  variants: {
    size: {
      lg: 'body-2-semi-bold',
      md: 'body-4-semi-bold',
    },
    appearance: {
      base: 'text-on-interactive',
      red: 'text-on-error-strong',
    },
    disabled: {
      true: 'text-disabled',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    appearance: 'base',
    disabled: false,
  },
});

export function DotCount({
  value,
  size = 'md',
  max = 99,
  appearance = 'base',
  disabled: disabledProp = false,
  children,
  className,
  'aria-label': ariaLabel,
  ref,
  ...props
}: DotCountProps) {
  const disabled = useDisabledContext({
    consumerName: 'DotCount',
    mergeWith: { disabled: disabledProp },
  });

  const cappedMax = Math.max(1, Math.min(max, 99));
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
          dotCountVariants({ size, appearance, disabled }),
          pinned && 'absolute top-0 right-0 z-[1]',
        )}
      >
        {value > 0 && (
          <span className={cn(textVariants({ size, appearance, disabled }))}>
            {value <= cappedMax ? value : `${cappedMax}+`}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

DotCount.displayName = 'DotCount';
