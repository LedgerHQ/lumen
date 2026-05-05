import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import type { LumenStyleSheetTheme } from '../../../styles';
import { Skeleton } from '../Skeleton';
import { Box, Text } from '../Utility';
import type { MediaImageProps, MediaImageSize, MediaImageShape } from './types';

type BorderRadiusKey = keyof LumenStyleSheetTheme['borderRadius'];

const borderRadiusMap: Record<MediaImageSize, BorderRadiusKey> = {
  12: 'xs',
  16: 'xs',
  20: 'xs',
  24: 'sm',
  32: 'sm',
  40: 'md',
  48: 'md',
  56: 'lg',
  64: 'lg',
};

export const fontSizeMap: Record<MediaImageSize, number> = {
  12: 10,
  16: 10,
  20: 12,
  24: 14,
  32: 16,
  40: 18,
  48: 24,
  56: 24,
  64: 24,
};

const useStyles = ({
  size,
  shape,
}: {
  size: MediaImageSize;
  shape: MediaImageShape;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeValue = t.sizes[`s${size}` as keyof typeof t.sizes] as number;
      const radius =
        shape === 'circle'
          ? t.borderRadius.full
          : t.borderRadius[borderRadiusMap[size]];

      return {
        root: {
          width: sizeValue,
          height: sizeValue,
          borderRadius: radius,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: t.colors.bg.muted,
          outlineColor: t.colors.border.icon,
          outlineWidth: 1,
          outlineOffset: -1,
          outlineStyle: 'solid',
        },
        image: {
          width: '100%',
          height: '100%',
        },
      };
    },
    [size, shape],
  );
};

/**
 * A generic media image component that displays an image with optional shape variants.
 * Supports square and circular appearances with consistent sizing.
 *
 * When the image fails to load or no src is provided, displays a fallback letter (if `fallback`
 * is provided) or a muted background placeholder.
 *
 * While `loading` is true, a pulsing skeleton overlay is shown regardless of `src`.
 *
 * @example
 * import { MediaImage } from '@ledgerhq/lumen-ui-rnative';
 *
 * <MediaImage src="https://example.com/icon.png" alt="Bitcoin" size={32} />
 * <MediaImage fallback="Bitcoin" size={32} />
 * <MediaImage loading size={32} />
 */
export const MediaImage = ({
  src,
  alt,
  size = 48,
  shape = 'square',
  fallback,
  loading = false,
  lx = {},
  style,
  ref,
  ...props
}: MediaImageProps) => {
  const [error, setError] = useState(false);
  const shouldFallback = !src || error;
  const styles = useStyles({ size, shape });

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      accessibilityRole='image'
      accessibilityLabel={alt}
      {...props}
    >
      {loading && <Skeleton style={StyleSheet.absoluteFillObject} />}
      {!loading && shouldFallback && fallback && (
        <Text
          style={{ fontSize: fontSizeMap[size] }}
          lx={{ color: 'base' }}
          accessible={false}
        >
          {fallback[0]?.toUpperCase()}
        </Text>
      )}
      {!loading && !shouldFallback && (
        <Image
          source={{ uri: src }}
          style={styles.image}
          accessible={false}
          onError={() => setError(true)}
          testID='media-image-img'
        />
      )}
    </Box>
  );
};
