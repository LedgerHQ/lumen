import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type { ReactElement, RefObject } from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from '../../symbols';
import {
  SegmentedControlContextProvider,
  useSegmentedControlContext,
} from './SegmentedControlContext';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
  SegmentedControlValue,
} from './types';
import {
  usePillElementLayoutEffect,
  useSegmentedControlSelectedIndex,
} from './usePillElementLayoutEffect';

const segmentedControlStyles = {
  root: cva('relative flex flex-row items-center rounded-sm', {
    variants: {
      appearance: {
        background: 'bg-surface',
        'no-background': 'bg-transparent',
      },
      tabLayout: {
        fit: 'inline-flex',
        fixed: 'w-full',
      },
    },
  }),
  pill: cva('pointer-events-none absolute top-0 left-0 z-0 rounded-sm', {
    variants: {
      disabled: {
        true: 'bg-base-transparent-pressed',
        false: 'bg-muted-transparent',
      },
      isReady: {
        true: 'transition-[transform,width] duration-250 ease-in-out',
        false: 'transition-none',
      },
    },
  }),
  item: cva(
    'z-10 flex cursor-pointer flex-row items-center justify-center rounded-sm px-16 py-8 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:cursor-not-allowed',
    {
      variants: {
        selected: {
          true: 'body-2-semi-bold',
          false: 'body-2',
        },
        disabled: {
          true: 'text-muted',
          false: '',
        },
      },
      compoundVariants: [
        { selected: true, disabled: false, className: 'text-base' },
        {
          selected: false,
          disabled: false,
          className: 'text-muted hover:text-muted-hover',
        },
      ],
    },
  ),
  arrowButton: cva(
    'absolute inset-y-0 z-20 flex cursor-pointer items-center justify-center rounded-sm py-8 text-muted transition-opacity duration-200 hover:text-muted-hover',
    {
      variants: {
        visible: {
          true: 'opacity-100',
          false: 'pointer-events-none opacity-0',
        },
        side: {
          left: 'left-0 pr-16 pl-8',
          right: 'right-0 pr-8 pl-16',
        },
      },
    },
  ),
};

function useScrollArrows(
  scrollRef: RefObject<HTMLDivElement | null>,
  enabled: boolean,
): {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollBy: (direction: 'left' | 'right') => void;
} {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, [scrollRef]);

  useLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    update();
    el.addEventListener('scroll', update, { passive: true });

    const ro = new ResizeObserver(update);
    ro.observe(el);

    if (el.firstElementChild instanceof HTMLElement) {
      ro.observe(el.firstElementChild);
    }

    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [enabled, update, scrollRef]);

  const scrollBy = useCallback(
    (direction: 'left' | 'right') => {
      const el = scrollRef.current;
      if (!el) {
        return;
      }
      const amount = el.clientWidth / 2;
      el.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    },
    [scrollRef],
  );

  return { canScrollLeft, canScrollRight, scrollBy };
}

export function SegmentedControlButton<
  T extends SegmentedControlValue = SegmentedControlValue,
>({
  value,
  children,
  icon: Icon,
  trailingContent,
  onClick,
  className,
  ...props
}: SegmentedControlButtonProps<T>) {
  const { selectedValue, onSelectedChange, disabled, tabLayout } =
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
        segmentedControlStyles.item({ selected, disabled: !!disabled }),
        tabLayout === 'fixed' && 'min-w-0 flex-1',
        className,
      )}
      {...props}
    >
      <span className='inline-flex min-w-0 items-center justify-center gap-8'>
        {Icon && <Icon size={16} className='shrink-0' />}
        <span className='min-w-0 truncate'>{children}</span>
        {trailingContent}
      </span>
    </button>
  );
}

export function SegmentedControl<
  T extends SegmentedControlValue = SegmentedControlValue,
>({
  selectedValue,
  onSelectedChange,
  children,
  className,
  disabled: disabledProp,
  appearance = 'background',
  tabLayout = 'fixed',
  ...props
}: SegmentedControlProps<T>) {
  const disabled = useDisabledContext({
    consumerName: 'SegmentedControl',
    mergeWith: { disabled: disabledProp },
  });

  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedIndex = useSegmentedControlSelectedIndex(
    selectedValue,
    children,
  );
  const { pill: pillState, isReady } = usePillElementLayoutEffect({
    ref,
    selectedIndex,
    children,
  });

  const showControls = tabLayout === 'fit-controls';

  const { canScrollLeft, canScrollRight, scrollBy } = useScrollArrows(
    scrollRef,
    showControls,
  );

  useLayoutEffect(() => {
    if (!showControls || selectedIndex < 0) {
      return;
    }
    const container = scrollRef.current;
    if (!container) {
      return;
    }
    const buttons = container.querySelectorAll('button[role="radio"]');
    const target = buttons[selectedIndex] as HTMLElement | undefined;

    // scroll the selected item into view in case of "fit-controls" on mount
    target?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pill = (
    <div
      aria-hidden
      className={segmentedControlStyles.pill({ disabled, isReady })}
      style={{
        width: pillState.width,
        height: pillState.height,
        transform: `translateX(${pillState.x}px)`,
      }}
    />
  );

  return (
    <SegmentedControlContextProvider
      value={{
        selectedValue,
        onSelectedChange: (value) => onSelectedChange(value as T),
        disabled,
        tabLayout,
      }}
    >
      {showControls ? (
        <div
          className={cn(
            'relative rounded-sm',
            appearance === 'background' ? 'bg-surface' : 'bg-transparent',
            className,
          )}
        >
          <div
            ref={scrollRef}
            className='scrollbar-none overflow-x-auto'
            style={{
              maskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent 0px, transparent 40px, black 72px' : 'black 0px'}, ${canScrollRight ? 'black calc(100% - 72px), transparent calc(100% - 40px), transparent 100%' : 'black 100%'})`,
              WebkitMaskImage: `linear-gradient(to right, ${canScrollLeft ? 'transparent 0px, transparent 40px, black 72px' : 'black 0px'}, ${canScrollRight ? 'black calc(100% - 72px), transparent calc(100% - 40px), transparent 100%' : 'black 100%'})`,
            }}
          >
            <div
              {...props}
              ref={ref}
              role='radiogroup'
              aria-disabled={disabled}
              className={segmentedControlStyles.root({
                appearance: 'no-background',
                tabLayout: 'fit',
              })}
            >
              {children}
              {pill}
            </div>
          </div>
          <button
            type='button'
            aria-label='Scroll left'
            tabIndex={-1}
            disabled={!canScrollLeft}
            onClick={() => scrollBy('left')}
            className={segmentedControlStyles.arrowButton({
              visible: canScrollLeft,
              side: 'left',
            })}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type='button'
            aria-label='Scroll right'
            tabIndex={-1}
            disabled={!canScrollRight}
            onClick={() => scrollBy('right')}
            className={segmentedControlStyles.arrowButton({
              visible: canScrollRight,
              side: 'right',
            })}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      ) : (
        <div
          {...props}
          ref={ref}
          role='radiogroup'
          aria-disabled={disabled}
          className={cn(
            segmentedControlStyles.root({ appearance, tabLayout }),
            className,
          )}
        >
          {children}
          {pill}
        </div>
      )}
    </SegmentedControlContextProvider>
  );
}

export function createSegmentedControl<
  T extends SegmentedControlValue = never,
>(): {
  SegmentedControl: (props: SegmentedControlProps<T>) => ReactElement;
  SegmentedControlButton: (
    props: SegmentedControlButtonProps<T>,
  ) => ReactElement;
} {
  return { SegmentedControl, SegmentedControlButton };
}
