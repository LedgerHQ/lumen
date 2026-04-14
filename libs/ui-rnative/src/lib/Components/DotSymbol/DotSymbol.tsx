import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { IconSize } from '../Icon';
import { MediaImageSize } from '../MediaImage';
import { SpotSize } from '../Spot';
import { Box } from '../Utility';
import {
  DotSymbolAppearance,
  DotSymbolIconSize,
  DotSymbolPin,
  DotSymbolProps,
  DotSymbolSize,
} from './types';

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

const dotIconSizeMap: Record<DotSymbolIconSize, IconSize> = {
  16: 12,
  20: 12,
  24: 16,
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

export const iconDotSizeMap = {
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  64: 24,
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

const appearanceBgMap: Record<
  DotSymbolAppearance,
  'successStrong' | 'mutedStrong' | 'errorStrong'
> = {
  success: 'successStrong',
  muted: 'mutedStrong',
  error: 'errorStrong',
};

const useStyles = ({
  size,
  shape,
  pin,
  appearance,
}: {
  size: DotSymbolSize;
  shape: 'square' | 'circle';
  pin: DotSymbolPin;
  appearance?: DotSymbolAppearance;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeValue = t.sizes[`s${size}` as keyof typeof t.sizes] as number;
      const radius =
        shape === 'circle'
          ? t.borderRadius.full
          : t.borderRadius[shapeRadiusMap[size]];
      const pinOffset = getPinOffset(pin, size);
      const bgColor = appearance
        ? t.colors.bg[appearanceBgMap[appearance]]
        : t.colors.bg.muted;

      return {
        dot: {
          position: 'absolute',
          zIndex: 10,
          width: sizeValue,
          height: sizeValue,
          borderRadius: radius,
          borderWidth: 1,
          backgroundColor: bgColor,
          borderColor: t.colors.border.baseInverted,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          ...pinOffset,
        },
        image: {
          width: '100%',
          height: '100%',
        },
        icon: {
          color: t.colors.text.onInteractive,
        },
      };
    },
    [size, shape, pin, appearance],
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
 * import { DotSymbol } from '@ledgerhq/lumen-ui-rnative';
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
    lx = {},
    style,
    ref,
    ...rest
  } = props;

  const isIcon = props.type === 'icon';
  const styles = useStyles({
    size,
    shape,
    pin,
    appearance: isIcon ? props.appearance : undefined,
  });
  const [error, setError] = useState(false);
  const imgSrc = !isIcon ? props.src : undefined;

  useEffect(() => {
    setError(false);
  }, [imgSrc]);

  const renderDotContent = () => {
    if (isIcon) {
      const { icon: Icon, size: iconSize = 20 } = props;
      return <Icon size={dotIconSizeMap[iconSize]} style={styles.icon} />;
    }

    if (error) return null;

    return (
      <Image
        source={{ uri: props.src }}
        style={styles.image}
        accessible={false}
        onError={() => setError(true)}
        testID='dot-symbol-img'
      />
    );
  };

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([{ position: 'relative' }, style])}
      accessibilityRole='image'
      accessibilityLabel={!isIcon ? props.alt : undefined}
      {...rest}
    >
      {children}
      <Box style={styles.dot}>{renderDotContent()}</Box>
    </Box>
  );
};

DotSymbol.displayName = 'DotSymbol';
