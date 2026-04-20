import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { MediaImageSize } from '../MediaImage';
import { SpotSize } from '../Spot';
import { Box } from '../Utility';
import { DotSymbolPin, DotSymbolProps, DotSymbolSize } from './types';

type BorderRadiusKey = 'xs' | 'sm' | 'md' | 'lg' | 'full';

const shapeRadiusMap: Record<DotSymbolSize, BorderRadiusKey> = {
  8: 'xs',
  10: 'xs',
  12: 'xs',
  16: 'sm',
  20: 'sm',
  24: 'md',
};

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
};

export const spotDotSizeMap: Record<SpotSize, DotSymbolSize> = {
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  72: 24,
};

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

const useStyles = ({
  size,
  shape,
  pin,
}: {
  size: DotSymbolSize;
  shape: 'square' | 'circle';
  pin: DotSymbolPin;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeValue = t.sizes[`s${size}` as keyof typeof t.sizes] as number;
      const radius =
        shape === 'circle'
          ? t.borderRadius.full
          : t.borderRadius[shapeRadiusMap[size]];
      const pinOffset = getPinOffset(pin, size);

      return {
        dot: {
          position: 'absolute',
          zIndex: 10,
          width: sizeValue,
          height: sizeValue,
          borderRadius: radius,
          borderWidth: 1,
          backgroundColor: t.colors.bg.muted,
          borderColor: t.colors.border.baseInverted,
          overflow: 'hidden',
          ...pinOffset,
        },
        image: {
          width: '100%',
          height: '100%',
        },
      };
    },
    [size, shape, pin],
  );
};

/**
 * A wrapper component that positions a small image indicator at a configurable
 * corner of a child element like MediaImage or Spot.
 *
 * @example
 * import { DotSymbol } from '@ledgerhq/lumen-ui-rnative';
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
  lx = {},
  style,
  ref,
  ...rest
}: DotSymbolProps) => {
  const styles = useStyles({ size, shape, pin });
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([{ position: 'relative' }, style])}
      accessibilityRole='image'
      accessibilityLabel={alt}
      {...rest}
    >
      {children}
      <Box style={styles.dot}>
        {!error && (
          <Image
            source={{ uri: src }}
            style={styles.image}
            accessible={false}
            onError={() => setError(true)}
            testID='dot-symbol-img'
          />
        )}
      </Box>
    </Box>
  );
};

DotSymbol.displayName = 'DotSymbol';
