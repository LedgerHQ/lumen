import { cva } from 'class-variance-authority';
import React from 'react';
import { useCommonTranslation } from '../../../i18n';
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
      alt,
      size = 'md',
      imgLoading,
      showNotification = false,
      ...props
    },
    ref,
  ) => {
    const { t } = useCommonTranslation();
    const [error, setError] = React.useState<boolean>(false);
    const shouldFallback = !src || error;

    const resolvedAlt = alt || t('components.avatar.defaultAlt');

    const ariaLabel = showNotification
      ? `${resolvedAlt}, ${t('components.avatar.notificationAriaLabel')}`
      : resolvedAlt;

    React.useEffect(() => {
      setError(false);
    }, [src]);

    return (
      <div
        ref={ref}
        className={avatarVariants.root({ size, className })}
        role='img'
        aria-label={ariaLabel}
        {...props}
      >
        {showNotification && (
          <div
            className={avatarVariants.notification({ size })}
            aria-hidden='true'
          />
        )}
        {shouldFallback ? (
          <User
            size={fallbackSizes[size]}
            aria-label='Fallback Icon'
            aria-hidden='true'
          />
        ) : (
          <img
            src={src}
            alt=''
            loading={imgLoading}
            onError={() => setError(true)}
            className='size-full overflow-hidden rounded-full object-cover'
            aria-hidden='true'
          />
        )}
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';
