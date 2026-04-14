import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useEffect, useMemo, useState } from 'react';
import { IconSize } from '../Icon';
import { MediaImageSize } from '../MediaImage';
import { SpotSize } from '../Spot';
import {
  DotSymbolAppearance,
  DotSymbolIconSize,
  DotSymbolPin,
  DotSymbolProps,
  DotSymbolImageSize,
} from './types';

const dotVariants = cva(
  'absolute z-10 box-content flex items-center justify-center overflow-hidden border-base-inverted',
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
      appearance: {
        image: 'bg-muted',
        success: 'bg-success-strong',
        muted: 'bg-muted-strong',
        error: 'bg-error-strong',
      },
    },
    defaultVariants: {
      appearance: 'image',
    },
    compoundVariants: [
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

const dotIconSizeMap: Record<DotSymbolIconSize, IconSize> = {
  16: 12,
  20: 12,
  24: 16,
};

const offsetBySize: Record<DotSymbolImageSize, number> = {
  8: -2,
  10: -2,
  12: -2,
  16: -3,
  20: -3,
  24: -3,
};

export const mediaImageDotSizeMap: Record<MediaImageSize, DotSymbolImageSize> =
  {
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

export const spotDotSizeMap: Record<SpotSize, DotSymbolImageSize> = {
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  72: 24,
} as const;

export const iconDotSizeMap = {
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  64: 24,
} as const satisfies Record<number, DotSymbolImageSize>;

const pinAxisMap: Record<DotSymbolPin, [vertical: string, horizontal: string]> =
  {
    'top-start': ['top', 'left'],
    'top-end': ['top', 'right'],
    'bottom-start': ['bottom', 'left'],
    'bottom-end': ['bottom', 'right'],
  };

const getPinOffset = (
  pin: DotSymbolPin,
  size: DotSymbolImageSize,
): Record<string, number> => {
  const [v, h] = pinAxisMap[pin];
  const offset = offsetBySize[size];
  return { [v]: offset, [h]: offset };
};

/**
 * A wrapper component that positions a small indicator at a configurable
 * corner of a child element like MediaImage or Spot.
 *
 * Supports two content modes:
 * - **image** (default): renders an image from a URL
 * - **icon**: renders an SVG icon with a semantic background color
 *
 * @example
 * import { DotSymbol } from '@ledgerhq/lumen-ui-react';
 *
 * <DotSymbol src="https://example.com/eth.png" alt="Ethereum" pin="bottom-end">
 *   <MediaImage src="https://example.com/usdc.png" alt="USDC" size={48} />
 * </DotSymbol>
 *
 * <DotSymbol type="icon" appearance="success" icon={ArrowDown} pin="bottom-end">
 *   <MediaImage src="https://example.com/usdc.png" alt="USDC" size={48} />
 * </DotSymbol>
 */
export const DotSymbol = (props: DotSymbolProps) => {
  const {
    children,
    pin = 'bottom-end',
    size = 20,
    shape = 'circle',
    className,
    ref,
    ...rest
  } = props;

  const isIcon = props.type === 'icon';
  const dotAppearance: DotSymbolAppearance | 'image' = isIcon
    ? props.appearance
    : 'image';

  const style = useMemo(() => getPinOffset(pin, size), [pin, size]);
  const [error, setError] = useState(false);
  const imgSrc = !isIcon ? props.src : undefined;

  useEffect(() => {
    setError(false);
  }, [imgSrc]);

  const renderDotContent = () => {
    if (isIcon) {
      const { icon: Icon, size: iconSize = 20 } = props;
      return (
        <Icon size={dotIconSizeMap[iconSize]} className='text-on-interactive' />
      );
    }

    if (error) return null;

    return (
      <img
        alt={props.alt}
        src={props.src}
        loading={props.imgLoading ?? 'eager'}
        aria-hidden='true'
        onError={() => setError(true)}
      />
    );
  };

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex w-fit', className)}
      {...rest}
    >
      <div className='inline-flex'>{children}</div>
      <div
        className={dotVariants({
          size,
          shape,
          pin,
          appearance: dotAppearance,
        })}
        style={style}
      >
        {renderDotContent()}
      </div>
    </div>
  );
};

DotSymbol.displayName = 'DotSymbol';
