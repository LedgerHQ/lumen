import { cn } from '@ledgerhq/lumen-utils-shared';
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  SegmentedControlContextProvider,
  useSegmentedControlContext,
} from './SegmentedControlContext';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
} from './types';

const ICON_SIZE = 16;
const PILL_TRANSITION = 'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)';

const buttonClass =
  'z-10 flex min-w-0 flex-1 cursor-pointer flex-row items-center justify-center rounded-sm px-16 py-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-default';

export function SegmentedControlButton({
  value,
  children,
  icon: Icon,
  onPress,
  className,
  ...props
}: SegmentedControlButtonProps) {
  const { selectedValue, onSelectedChange } = useSegmentedControlContext();
  const selected = selectedValue === value;

  return (
    <button
      type='button'
      role='radio'
      aria-checked={selected}
      onClick={() => {
        onSelectedChange(value);
        onPress?.();
      }}
      className={cn(
        buttonClass,
        selected ? 'body-2-semi-bold text-base' : 'body-2 text-base',
        className,
      )}
      {...props}
    >
      <span className='inline-flex shrink-0 items-center justify-center gap-8'>
        {Icon && <Icon size={ICON_SIZE} />}
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
  ...props
}: SegmentedControlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState({ width: 0, height: 0, x: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const sync = (): void => {
      const { width, height } = el.getBoundingClientRect();
      const count = React.Children.count(children);
      const slotWidth = count > 0 ? width / count : 0;
      const index = React.Children.toArray(children).findIndex(
        (c) =>
          React.isValidElement(c) &&
          (c.props as { value?: string }).value === selectedValue,
      );
      setPill({
        width: slotWidth,
        height,
        x: index >= 0 ? index * slotWidth : 0,
      });
    };

    sync();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, selectedValue]);

  return (
    <SegmentedControlContextProvider
      value={{ selectedValue, onSelectedChange }}
    >
      <div
        {...props}
        ref={ref}
        role='radiogroup'
        className={cn(
          'relative flex w-full flex-row items-center rounded-full bg-surface',
          className,
        )}
      >
        {children}
        <div
          aria-hidden
          className='pointer-events-none absolute top-0 left-0 z-0 rounded-sm bg-muted-transparent'
          style={{
            width: pill.width,
            height: pill.height,
            transform: `translateX(${pill.x}px)`,
            transition: PILL_TRANSITION,
          }}
        />
      </div>
    </SegmentedControlContextProvider>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
