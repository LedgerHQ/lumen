import { cva } from 'class-variance-authority';
import React from 'react';
import { User } from '../../Symbols';
import { AvatarProps } from './types';

const avatarVariants = {
  root: cva(
    'relative inline-flex items-center justify-center rounded-full bg-muted-transparent transition-colors',
    {
      variants: {
        size: {
          sm: 'size-40 p-4',
          md: 'size-48 p-4',
        },
      },
      defaultVariants: {
        size: 'md',
      },
    },
  ),
  notification: cva('absolute top-0 right-0 rounded-full bg-error-strong', {
    variants: {
      size: {
        sm: 'size-10',
        md: 'size-12',
      },
    },
  }),
};

const fallbackSizes = {
  sm: 16,
  md: 24,
} as const;

/**
 * A circular avatar component that displays a user image or fallback icon.
 *
 * When the image fails to load or no src is provided, displays a User icon fallback.
 * Supports an optional notification indicator.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/action-avatar--docs Storybook}
 *
 * @example
 * import { Avatar } from '@ledgerhq/lumen-ui-react';
 *
 * <Avatar src="https://example.com/photo.jpg" size="md" />
 *
 * // With notification indicator
 * <Avatar src="https://example.com/photo.jpg" showNotification />
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = 'avatar',
      size = 'md',
      imgLoading,
      showNotification = false,
      ...props
    },
    ref,
  ) => {
    const [error, setError] = React.useState<boolean>(false);
    const shouldFallback = !src || error;

    React.useEffect(() => {
      setError(false);
    }, [src]);

    return (
      <div
        ref={ref}
        className={avatarVariants.root({ size, className })}
        {...props}
      >
        {showNotification && (
          <div className={avatarVariants.notification({ size })} />
        )}
        {shouldFallback ? (
          <User size={fallbackSizes[size]} />
        ) : (
          <img
            src={src}
            alt={alt}
            loading={imgLoading}
            onError={() => setError(true)}
            className='size-full overflow-hidden rounded-full object-cover'
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
