import { cn } from '@ledgerhq/lumen-utils-shared';
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  SegmentedControlContextProvider,
  useSegmentedControlContext,
} from './SegmentedControlContext';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
} from './types';

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
        'z-10 flex min-w-0 flex-1 cursor-pointer flex-row items-center justify-center rounded-sm px-16 py-8 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed',
        selected
          ? 'body-2-semi-bold text-base'
          : 'body-2 text-muted hover:body-2-semi-bold hover:text-muted-hover',
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
  disabled,
  appearance = 'background',
  ...props
}: SegmentedControlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ width: 0, height: 0, x: 0 });

  const selectedIndex = useMemo(
    () =>
      React.Children.toArray(children).findIndex(
        (c) =>
          React.isValidElement(c) &&
          (c.props as { value?: string }).value === selectedValue,
      ),
    [selectedValue, children],
  );

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = (): void => {
      const { width, height } = el.getBoundingClientRect();
      const count = React.Children.count(children);
      const slotWidth = count > 0 ? width / count : 0;
      setPill({
        width: slotWidth,
        height,
        x: selectedIndex >= 0 ? selectedIndex * slotWidth : 0,
      });
    };

    sync();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, selectedIndex]);

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
          'relative flex w-full flex-row items-center rounded-sm',
          appearance === 'background' && 'bg-surface',
          className,
        )}
      >
        {children}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute top-0 left-0 z-0 rounded-sm',
            disabled ? 'bg-base-transparent-pressed' : 'bg-muted-transparent',
          )}
          style={{
            width: pill.width,
            height: pill.height,
            transform: `translateX(${pill.x}px)`,
            transition: 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </SegmentedControlContextProvider>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
