import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import type {
  ComponentType,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from 'react';
import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from '../../symbols';
import type { IconSize } from '../../symbols/Icon/types';
import {
  SegmentedControlContextProvider,
  useSegmentedControlContext,
} from './SegmentedControlContext';
import type {
  SegmentedControlButtonProps,
  SegmentedControlProps,
  SegmentedControlValue,
} from './types';
import type { PillLayout } from './usePillElementLayoutEffect';
import {
  usePillElementLayoutEffect,
  useSegmentedControlSelectedIndex,
} from './usePillElementLayoutEffect';
import { useScrollArrows, useScrollSelectedIntoView } from './useScrollArrows';

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
  scrollArea: cva('relative rounded-sm', {
    variants: {
      appearance: {
        background: 'bg-surface',
        'no-background': 'bg-transparent',
      },
    },
  }),
  arrow: cva(
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

/**
 * Fades the segments out under the arrow buttons, on the sides that can scroll.
 */
function getScrollMaskImage(
  canScrollLeft: boolean,
  canScrollRight: boolean,
): string {
  const left = canScrollLeft
    ? 'transparent 0px, transparent 40px, black 72px'
    : 'black 0px';
  const right = canScrollRight
    ? 'black calc(100% - 72px), transparent calc(100% - 40px), transparent 100%'
    : 'black 100%';

  return `linear-gradient(to right, ${left}, ${right})`;
}

type SegmentedControlArrowProps = {
  side: 'left' | 'right';
  icon: ComponentType<{ size?: IconSize }>;
  label: string;
  /**
   * Whether there is still content to scroll towards on that side.
   */
  visible: boolean;
  onClick: () => void;
};

function SegmentedControlArrow({
  side,
  icon: Icon,
  label,
  visible,
  onClick,
}: SegmentedControlArrowProps) {
  return (
    <button
      type='button'
      aria-label={label}
      aria-hidden={!visible}
      // The segments themselves are the tab stops: arrows are a pointer-only affordance.
      tabIndex={-1}
      disabled={!visible}
      onClick={onClick}
      className={segmentedControlStyles.arrow({ visible, side })}
    >
      <Icon size={20} />
    </button>
  );
}

type SegmentedControlScrollAreaProps = HTMLAttributes<HTMLDivElement> & {
  appearance: SegmentedControlProps['appearance'];
  selectedIndex: number;
  children: ReactNode;
};

function SegmentedControlScrollArea({
  appearance = 'background',
  className,
  selectedIndex,
  children,
  ...props
}: SegmentedControlScrollAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight, scrollBy } =
    useScrollArrows(scrollRef);

  useScrollSelectedIntoView(scrollRef, selectedIndex);

  const maskImage = getScrollMaskImage(canScrollLeft, canScrollRight);

  return (
    <div
      {...props}
      className={cn(
        segmentedControlStyles.scrollArea({ appearance }),
        className,
      )}
    >
      <div
        ref={scrollRef}
        className='scrollbar-none overflow-x-auto'
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        {children}
      </div>
      <SegmentedControlArrow
        side='left'
        icon={ChevronLeft}
        label='Scroll left'
        visible={canScrollLeft}
        onClick={() => scrollBy('left')}
      />
      <SegmentedControlArrow
        side='right'
        icon={ChevronRight}
        label='Scroll right'
        visible={canScrollRight}
        onClick={() => scrollBy('right')}
      />
    </div>
  );
}

type SegmentedControlPillProps = {
  layout: PillLayout;
  isReady: boolean;
  disabled: boolean;
};

function SegmentedControlPill({
  layout,
  isReady,
  disabled,
}: SegmentedControlPillProps) {
  return (
    <div
      aria-hidden
      className={segmentedControlStyles.pill({ disabled, isReady })}
      style={{
        width: layout.width,
        height: layout.height,
        transform: `translateX(${layout.x}px)`,
      }}
    />
  );
}

type SegmentedControlRadioGroupProps = HTMLAttributes<HTMLDivElement> & {
  appearance: NonNullable<SegmentedControlProps['appearance']>;
  tabLayout: NonNullable<SegmentedControlProps['tabLayout']>;
  disabled: boolean;
  selectedIndex: number;
  children: ReactNode;
};

function SegmentedControlRadioGroup({
  appearance,
  tabLayout,
  disabled,
  selectedIndex,
  className,
  children,
  ...props
}: SegmentedControlRadioGroupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { pill, isReady } = usePillElementLayoutEffect({
    ref,
    selectedIndex,
    children,
  });

  return (
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
      {/* Must stay the last child: the pill layout measures its siblings. */}
      <SegmentedControlPill
        layout={pill}
        isReady={isReady}
        disabled={disabled}
      />
    </div>
  );
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
        tabLayout === 'fit' && 'focus-visible:-outline-offset-2',
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

  const selectedIndex = useSegmentedControlSelectedIndex(
    selectedValue,
    children,
  );

  const showControls = tabLayout === 'fit';

  // When arrows are shown the scroll area owns the background and the outer props.
  const radioGroup = (
    <SegmentedControlRadioGroup
      {...(showControls ? {} : props)}
      appearance={showControls ? 'no-background' : appearance}
      tabLayout={tabLayout}
      disabled={disabled}
      selectedIndex={selectedIndex}
      className={showControls ? undefined : className}
    >
      {children}
    </SegmentedControlRadioGroup>
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
        <SegmentedControlScrollArea
          {...props}
          appearance={appearance}
          className={className}
          selectedIndex={selectedIndex}
        >
          {radioGroup}
        </SegmentedControlScrollArea>
      ) : (
        radioGroup
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
