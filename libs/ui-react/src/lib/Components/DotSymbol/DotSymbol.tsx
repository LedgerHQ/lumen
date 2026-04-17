import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useEffect, useMemo, useState } from 'react';
import { IconSize } from '../Icon';
import { DotSymbolPin, DotSymbolProps, DotSymbolSize } from './types';

const dotVariants = cva(
  'absolute z-10 box-content flex items-center justify-center overflow-hidden border-base-inverted bg-muted',
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

const dotIconSizeMap: Record<DotSymbolSize, IconSize> = {
  16: 12,
  20: 12,
  24: 16,
};

const offsetBySize: Record<DotSymbolSize, number> = {
  16: -3,
  20: -3,
  24: -3,
};

export const mediaImageDotSizeMap = {
  40: 16,
  48: 20,
  56: 24,
  64: 24,
} as const satisfies Record<number, DotSymbolSize>;

export const spotDotSizeMap = {
  40: 16,
  48: 20,
  56: 24,
  72: 24,
} as const satisfies Record<number, DotSymbolSize>;

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

const DotContent = ({
  isIcon,
  dotProps,
  error,
  onImageError,
}: {
  isIcon: boolean;
  dotProps: DotSymbolProps;
  error: boolean;
  onImageError: () => void;
}) => {
  if (isIcon) {
    const { icon: Icon, size: iconSize = 20 } = dotProps as Extract<
      DotSymbolProps,
      { type: 'icon' }
    >;
    return (
      <Icon size={dotIconSizeMap[iconSize]} className='text-on-interactive' />
    );
  }

  if (error) return null;

  const { alt, src, imgLoading } = dotProps as Extract<
    DotSymbolProps,
    { type?: 'image' }
  >;

  return (
    <img
      alt={alt}
      src={src}
      loading={imgLoading ?? 'eager'}
      aria-hidden='true'
      onError={onImageError}
    />
  );
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
    type: _type,
    src: _src,
    alt: _alt,
    imgLoading: _imgLoading,
    icon: _icon,
    appearance: _appearance,
    ...rest
  } = props;

  const isIcon = props.type === 'icon';

  const style = useMemo(() => getPinOffset(pin, size), [pin, size]);
  const [error, setError] = useState(false);
  const imgSrc = !isIcon ? props.src : undefined;

  useEffect(() => {
    setError(false);
  }, [imgSrc]);

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex w-fit', className)}
      {...rest}
    >
      <div className='inline-flex'>{children}</div>
      <div
        className={cn(
          dotVariants({
            size,
            shape,
            pin,
            appearance: isIcon ? props.appearance : undefined,
          }),
        )}
        style={style}
      >
        <DotContent
          isIcon={isIcon}
          dotProps={props}
          error={error}
          onImageError={() => setError(true)}
        />
      </div>
    </div>
  );
};

DotSymbol.displayName = 'DotSymbol';
