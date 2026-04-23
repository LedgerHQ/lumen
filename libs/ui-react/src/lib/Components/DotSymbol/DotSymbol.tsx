import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useEffect, useMemo, useState } from 'react';
import type { MediaImageSize } from '../MediaImage';
import type { SpotSize } from '../Spot';
import type { DotSymbolPin, DotSymbolProps, DotSymbolSize } from './types';

const dotVariants = cva(
  'absolute z-10 box-content overflow-hidden border-base-inverted bg-muted',
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

export const mediaImageDotSizeMap: Record<MediaImageSize, DotSymbolSize> = {
  12: 8,
  16: 8,
  20: 8,
  24: 10,
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  64: 24,
} as const;

export const spotDotSizeMap: Record<SpotSize, DotSymbolSize> = {
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  72: 24,
} as const;

const pinAxisMap: Record<DotSymbolPin, [vertical: string, horizontal: string]> =
  {
    'top-start': ['top', 'left'],
    'top-end': ['top', 'right'],
    'bottom-start': ['bottom', 'left'],
    'bottom-end': ['bottom', 'right'],
  };

const getPinOffset = (
  pin: DotSymbolPin,
  size: DotSymbolSize,
): Record<string, number> => {
  const [v, h] = pinAxisMap[pin];
  const offset = offsetBySize[size];
  return { [v]: offset, [h]: offset };
};

/**
 * A wrapper component that positions a small image indicator at a configurable
 * corner of a child element like MediaImage or Spot.
 *
 * @example
 * import { DotSymbol } from '@ledgerhq/lumen-ui-react';
 *
 * <DotSymbol src="https://example.com/eth.png" alt="Ethereum" pin="bottom-end">
 *   <MediaImage src="https://example.com/usdc.png" alt="USDC" size={48} />
 * </DotSymbol>
 */
export const DotSymbol = ({
  children,
  src,
  alt,
  pin = 'bottom-end',
  size = 20,
  shape = 'circle',
  imgLoading = 'eager',
  className,
  ref,
  ...rest
}: DotSymbolProps) => {
  const style = useMemo(() => getPinOffset(pin, size), [pin, size]);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex w-fit', className)}
      {...rest}
    >
      <div className='inline-flex'>{children}</div>
      <div className={dotVariants({ size, shape, pin })} style={style}>
        {!error && (
          <img
            alt={alt}
            src={src}
            loading={imgLoading}
            aria-hidden='true'
            onError={() => setError(true)}
          />
        )}
      </div>
    </div>
  );
};

DotSymbol.displayName = 'DotSymbol';
