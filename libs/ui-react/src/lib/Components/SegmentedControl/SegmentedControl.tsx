import { cn } from '@ledgerhq/lumen-utils-shared';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  SegmentedControlContextProvider,
  useSegmentedControlContext,
} from './SegmentedControlContext';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
} from './types';

const ICON_SIZE = 16;

const PILL_TRANSITION_MS = 250;
const PILL_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';

const buttonBaseClass =
  'z-10 flex min-w-0 flex-1 cursor-pointer flex-row items-center justify-center rounded-sm px-16 py-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-default';

export function SegmentedControlButton({
  value,
  children,
  icon: Icon,
  onPress,
  className,
  disabled,
  ...props
}: SegmentedControlButtonProps) {
  const { selectedValue, onSelectedChange } = useSegmentedControlContext();

  const selected = selectedValue === value;

  const handleClick = (): void => {
    onSelectedChange(value);
    onPress?.();
  };

  return (
    <button
      type='button'
      role='radio'
      aria-checked={selected}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        buttonBaseClass,
        selected ? 'body-2-semi-bold text-base' : 'body-2 text-base',
        className,
      )}
      {...props}
    >
      <span className='inline-flex shrink-0 items-center justify-center gap-8'>
        {Icon && (
          <span className='flex items-center'>
            <Icon size={ICON_SIZE} />
          </span>
        )}
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [pillStyle, setPillStyle] = useState<{
    width: number;
    height: number;
    translateX: number;
  }>({ width: 0, height: 0, translateX: 0 });
  const hasLayoutRef = useRef(false);

  const getSelectedIndex = useCallback((): number => {
    return React.Children.toArray(children).findIndex((child) => {
      if (React.isValidElement(child) && child.props != null) {
        return (child.props as { value?: string }).value === selectedValue;
      }
      return false;
    });
  }, [selectedValue, children]);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateLayout = (): void => {
      const { width, height } = el.getBoundingClientRect();
      const count = React.Children.count(children);
      const slotWidth = count > 0 ? width / count : 0;

      setPillStyle((prev) => {
        const index = getSelectedIndex();
        const translateX = index >= 0 ? index * slotWidth : 0;
        if (!hasLayoutRef.current) {
          hasLayoutRef.current = true;
          return { width: slotWidth, height, translateX };
        }
        return { ...prev, width: slotWidth, height, translateX };
      });
    };

    updateLayout();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }
    const observer = new ResizeObserver(updateLayout);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children, getSelectedIndex]);

  useLayoutEffect(() => {
    if (!hasLayoutRef.current || pillStyle.width <= 0) return;
    const index = getSelectedIndex();
    if (index >= 0) {
      setPillStyle((prev) => ({
        ...prev,
        translateX: index * prev.width,
      }));
    }
  }, [selectedValue, getSelectedIndex, pillStyle.width]);

  return (
    <SegmentedControlContextProvider
      value={{ selectedValue, onSelectedChange }}
    >
      <div
        ref={containerRef}
        role='radiogroup'
        className={cn(
          'relative flex w-full flex-row items-center rounded-md bg-surface',
          className,
        )}
        {...props}
      >
        {children}
        <div
          className='pointer-events-none absolute top-0 left-0 z-0 rounded-sm bg-muted-transparent'
          style={{
            width: pillStyle.width,
            height: pillStyle.height,
            transform: `translateX(${pillStyle.translateX}px)`,
            transition: `transform ${PILL_TRANSITION_MS}ms ${PILL_EASING}`,
          }}
          aria-hidden
        />
      </div>
    </SegmentedControlContextProvider>
  );
}

SegmentedControl.displayName = 'SegmentedControl';
