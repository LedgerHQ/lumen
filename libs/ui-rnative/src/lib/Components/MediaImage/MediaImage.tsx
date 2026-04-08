import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import { MediaImageProps, MediaImageSize, MediaImageShape } from './types';

type BorderRadiusKey = 'xs' | 'sm' | 'md' | 'lg' | 'full';

const borderRadiusMap: Record<MediaImageSize, BorderRadiusKey> = {
  12: 'xs',
  16: 'xs',
  20: 'xs',
  24: 'sm',
  32: 'sm',
  40: 'md',
  48: 'md',
  56: 'lg',
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
          overflow: 'hidden' as const,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          backgroundColor: t.colors.bg.mutedTransparent,
        },
        image: {
          width: '100%' as const,
          height: '100%' as const,
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
 * When the image fails to load or no src is provided, displays a background placeholder.
 *
 * @example
 * import { MediaImage } from '@ledgerhq/lumen-ui-rnative';
 *
 * <MediaImage src="https://example.com/icon.png" alt="Bitcoin" size={32} />
 */
export const MediaImage = ({
  src,
  alt,
  size = 48,
  shape = 'square',
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
      {!shouldFallback && (
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
