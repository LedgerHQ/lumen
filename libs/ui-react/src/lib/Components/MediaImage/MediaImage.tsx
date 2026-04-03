import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useEffect, useState } from 'react';
import { MediaImageProps } from './types';

const mediaImageVariants = {
  root: cva(
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-muted-transparent',
    {
      variants: {
        size: {
          12: 'size-12 rounded-xs',
          16: 'size-16 rounded-xs',
          20: 'size-20 rounded-xs',
          24: 'size-24 rounded-sm',
          32: 'size-32 rounded-sm',
          40: 'size-40 rounded-md',
          48: 'size-48 rounded-md',
          56: 'size-56 rounded-lg',
        },
        shape: {
          square: '',
          circle: 'rounded-full',
        },
      },
    },
  ),
};

/**
 * A generic media image component that displays an image with optional shape variants.
 * Supports square and circular appearances with consistent sizing.
 *
 * When the image fails to load or no src is provided, displays a background placeholder
 * or an optional text fallback.
 *
 * @example
 * import { MediaImage } from '@ledgerhq/lumen-ui-react';
 *
 * <MediaImage src="https://example.com/icon.png" alt="Bitcoin" size={32} />
 */
export const MediaImage = ({
  ref,
  className,
  src,
  alt,
  size = 48,
  shape = 'square',
  imgLoading = 'eager',
  ...props
}: MediaImageProps) => {
  const [error, setError] = useState(false);
  const shouldFallback = !src || error;

  useEffect(() => {
    setError(false);
  }, [src]);

  return (
    <div
      ref={ref}
      className={cn(mediaImageVariants.root({ size, shape }), className)}
      role='img'
      aria-label={alt}
      {...props}
    >
      {shouldFallback ? (
        <span className='text-muted select-none' aria-hidden='true' />
      ) : (
        <img
          src={src}
          alt=''
          loading={imgLoading}
          onError={() => setError(true)}
          className='size-full object-cover'
          aria-hidden='true'
        />
      )}
    </div>
  );
};
