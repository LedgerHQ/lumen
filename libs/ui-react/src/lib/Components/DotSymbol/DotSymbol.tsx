import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useMemo } from 'react';
import { DotSymbolPin, DotSymbolProps, DotSymbolSize } from './types';

const dotVariants = cva(
  'absolute z-10 box-content overflow-hidden border-muted-subtle',
  {
    variants: {
      size: {
        8: 'size-8 border',
        10: 'size-10 border',
        12: 'size-12 border',
        16: 'size-16 border',
        20: 'size-20 border',
        24: 'size-24 border',
      },
      overlap: {
        circle: '',
        square: '',
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
    },
    compoundVariants: [
      /**
       * Rounded radius by size & shape
       */
      { size: 8, shape: 'square', className: 'rounded-[2px]' },
      { size: 10, shape: 'square', className: 'rounded-[3px]' },
      { size: 12, shape: 'square', className: 'rounded-[4px]' },
      { size: 16, shape: 'square', className: 'rounded-[5px]' },
      { size: 20, shape: 'square', className: 'rounded-[6px]' },
      { size: 24, shape: 'square', className: 'rounded-[8px]' },
      { shape: 'circle', className: 'rounded-full' },
      { shape: 'circle', className: 'rounded-full' },
      { shape: 'circle', className: 'rounded-full' },
      { shape: 'circle', className: 'rounded-full' },
      { shape: 'circle', className: 'rounded-full' },
      { shape: 'circle', className: 'rounded-full' },
    ],
  },
);

const offsetBySize: Record<DotSymbolSize, number> = {
  8: -2,
  10: -2,
  12: -2,
  16: -3,
  20: -3,
  24: -3,
};

const getPinOffsetMap = (pin: DotSymbolPin, size: DotSymbolSize) => {
  const offsetMap = {
    'top-start': { top: offsetBySize[size], left: offsetBySize[size] },
    'top-end': { top: offsetBySize[size], right: offsetBySize[size] },
    'bottom-start': { bottom: offsetBySize[size], left: offsetBySize[size] },
    'bottom-end': { bottom: offsetBySize[size], right: offsetBySize[size] },
  };
  return offsetMap[pin];
};

/**
 * A wrapper component that positions a small image indicator at a configurable
 * corner of a child element like MediaImage or Spot.
 *
 * @example
 * import { DotSymbol } from '@ledgerhq/lumen-ui-react';
 *
 * <DotSymbol imgUrl="https://example.com/eth.png" imgAlt="Ethereum" pin="bottom-end">
 *   <MediaImage src="https://example.com/usdc.png" alt="USDC" size={48} />
 * </DotSymbol>
 */
export const DotSymbol = ({
  children,
  src,
  alt,
  overlap = 'circle',
  pin = 'bottom-end',
  size = 16,
  shape = 'circle',
  className,
  ref,
  ...rest
}: DotSymbolProps) => {
  const style = useMemo(() => getPinOffsetMap(pin, size), [pin, size]);

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex w-fit', className)}
      {...rest}
    >
      <div className='inline-flex'>{children}</div>
      <div className={dotVariants({ size, shape, pin, overlap })} style={style}>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
};

DotSymbol.displayName = 'DotSymbol';
