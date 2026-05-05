import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import type { IconSize } from '../Icon';
import type { DotIconPin, DotIconProps, DotIconSize } from './types';

const dotVariants = cva(
  'absolute z-10 box-content flex items-center justify-center overflow-hidden border-base-inverted',
  {
    variants: {
      size: {
        16: 'size-16 border',
        20: 'size-20 border',
        24: 'size-24 border',
      },
      shape: {
        square: '',
        circle: '',
      },
      pin: {
        'top-start': '',
        'top-end': '',
        'bottom-start': '',
        'bottom-end': '',
      },
      appearance: {
        success: 'bg-success-strong',
        muted: 'bg-muted-strong',
        error: 'bg-error-strong',
      },
    },
    compoundVariants: [
      { size: 16, shape: 'square', className: 'rounded-[5px]' },
      { size: 20, shape: 'square', className: 'rounded-[6px]' },
      { size: 24, shape: 'square', className: 'rounded-[8px]' },
      { shape: 'circle', className: 'rounded-full' },
    ],
  },
);

export const mediaImageDotIconSizeMap = {
  40: 16,
  48: 20,
  56: 24,
  64: 24,
} as const satisfies Record<number, DotIconSize>;

export const spotDotIconSizeMap = {
  40: 16,
  48: 20,
  56: 24,
  72: 24,
} as const satisfies Record<number, DotIconSize>;

export const dotIconSizeMap: Record<DotIconSize, IconSize> = {
  16: 12,
  20: 16,
  24: 16,
};

const pinAxisMap: Record<DotIconPin, [vertical: string, horizontal: string]> = {
  'top-start': ['top', 'left'],
  'top-end': ['top', 'right'],
  'bottom-start': ['bottom', 'left'],
  'bottom-end': ['bottom', 'right'],
};

const DOT_OFFSET = -3;

const getPinOffset = (pin: DotIconPin): Record<string, number> => {
  const [v, h] = pinAxisMap[pin];
  return { [v]: DOT_OFFSET, [h]: DOT_OFFSET };
};

/**
 * A wrapper component that positions a small icon indicator at a configurable
 * corner of a child element like MediaImage or Spot. The dot background uses a
 * semantic color (`success`, `muted`, or `error`).
 *
 * @example
 * import { DotIcon } from '@ledgerhq/lumen-ui-react';
 *
 * <DotIcon appearance="success" icon={ArrowDown} pin="bottom-end">
 *   <MediaImage src="https://example.com/usdc.png" alt="USDC" size={48} />
 * </DotIcon>
 */
export const DotIcon = ({
  children,
  icon: Icon,
  appearance,
  pin = 'bottom-end',
  size = 20,
  shape = 'circle',
  className,
  ref,
  ...rest
}: DotIconProps) => {
  const style = useMemo(() => getPinOffset(pin), [pin]);

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex w-fit', className)}
      {...rest}
    >
      <div className='inline-flex'>{children}</div>
      <div
        className={cn(dotVariants({ size, shape, pin, appearance }))}
        style={style}
      >
        <Icon size={dotIconSizeMap[size]} className='text-on-interactive' />
      </div>
    </div>
  );
};

DotIcon.displayName = 'DotIcon';
