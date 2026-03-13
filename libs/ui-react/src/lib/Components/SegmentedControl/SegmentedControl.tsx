import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useRef } from 'react';
import {
  SegmentedControlContextProvider,
  useSegmentedControlContext,
} from './SegmentedControlContext';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
} from './types';
import {
  usePillElementLayoutEffect,
  useSegmentedControlSelectedIndex,
} from './usePillElementLayoutEffect';

const segmentedControlStyles = {
  root: cva('relative flex w-full flex-row items-center rounded-sm', {
    variants: {
      appearance: {
        background: 'bg-surface',
        'no-background': 'bg-transparent',
      },
    },
  }),
  pill: cva(
    'pointer-events-none absolute top-0 left-0 z-0 rounded-sm transition-transform duration-250 ease-in-out',
    {
      variants: {
        disabled: {
          true: 'bg-base-transparent-pressed',
          false: 'bg-muted-transparent',
        },
      },
    },
  ),
  item: cva(
    'z-10 flex min-w-0 flex-1 cursor-pointer flex-row items-center justify-center rounded-sm px-16 py-8 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed',
    {
      variants: {
        selected: {
          true: 'body-2-semi-bold text-base',
          false:
            'body-2 text-muted hover:body-2-semi-bold hover:text-muted-hover',
        },
      },
    },
  ),
};

export function SegmentedControlButton({
  value,
  children,
  icon: Icon,
  onClick,
  className,
  ...props
}: SegmentedControlButtonProps) {
  const { selectedValue, onSelectedChange, disabled } =
    useSegmentedControlContext();
  const selected = selectedValue === value;

  return (
    <button
      type='button'
      role='radio'
      aria-checked={selected}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={(e) => {
        if (!disabled) {
          onSelectedChange(value);
          onClick?.(e);
        }
      }}
      className={cn(
        segmentedControlStyles.item({
          selected,
        }),
        className,
      )}
      {...props}
    >
      <span className='inline-flex shrink-0 items-center justify-center gap-8'>
        {Icon && <Icon size={16} />}
        <span>{children}</span>
      </span>
    </button>
  );
}

SegmentedControlButton.displayName = 'SegmentedControlButton';

export function SegmentedControl({
  selectedValue,
  onSelectedChange,
  children,
  className,
  disabled: disabledProp,
  appearance = 'background',
  ...props
}: SegmentedControlProps) {
  const disabled = useDisabledContext({
    consumerName: 'SegmentedControl',
    mergeWith: { disabled: disabledProp },
  });
  const ref = useRef<HTMLDivElement>(null);
  const selectedIndex = useSegmentedControlSelectedIndex(
    selectedValue,
    children,
  );
  const { pill } = usePillElementLayoutEffect({
    ref,
    selectedIndex,
    children,
  });

  return (
    <SegmentedControlContextProvider
      value={{ selectedValue, onSelectedChange, disabled }}
    >
      <div
        {...props}
        ref={ref}
        role='radiogroup'
        aria-disabled={disabled}
        className={cn(
          segmentedControlStyles.root({
            appearance,
          }),
          className,
        )}
      >
        {children}
        <div
          aria-hidden
          className={segmentedControlStyles.pill({
            disabled,
          })}
          style={{
            width: pill.width,
            height: pill.height,
            transform: `translateX(${pill.x}px)`,
          }}
        />
      </div>
    </SegmentedControlContextProvider>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
