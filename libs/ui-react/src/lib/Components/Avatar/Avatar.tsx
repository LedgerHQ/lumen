import { cva } from 'class-variance-authority';
import { useState, useEffect } from 'react';
import { useCommonTranslation } from '../../../i18n';
import { User } from '../../Symbols';
import { DotIndicator } from '../DotIndicator';
import type { AvatarProps } from './types';

const avatarVariants = {
  root: cva(
    'relative inline-flex items-center justify-center rounded-full transition-colors',
    {
      variants: {
        appearance: {
          gray: 'bg-muted',
          transparent: 'bg-muted-transparent',
        },
        size: {
          sm: 'size-40 p-4',
          md: 'size-48 p-4',
          lg: 'size-56 p-4',
          xl: 'size-72 p-4',
        },
      },
      defaultVariants: {
        appearance: 'transparent',
        size: 'md',
      },
    },
  ),
};

type Size = NonNullable<AvatarProps['size']>;

const fallbackSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

const dotSizeMap: Partial<
  Record<Size, NonNullable<React.ComponentProps<typeof DotIndicator>['size']>>
> = {
  sm: 'lg',
  md: 'xl',
};

/**
 * A circular avatar component that displays a user image or fallback icon.
 *
 * When the image fails to load or no src is provided, displays a User icon fallback.
 * Supports an optional notification indicator.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/core-avatar--docs Storybook}
 *
 * @example
 * import { Avatar } from '@ledgerhq/lumen-ui-react';
 *
 * <Avatar src="https://example.com/photo.jpg" size="md" />
 *
 * // With notification indicator
 * <Avatar src="https://example.com/photo.jpg" showNotification />
 */
export const Avatar = ({
  ref,
  className,
  src,
  alt,
  appearance = 'transparent',
  size = 'md',
  imgLoading,
  showNotification: showNotificationProp = false,
  ...props
}: AvatarProps) => {
  const { t } = useCommonTranslation();
  const [error, setError] = useState<boolean>(false);
  const shouldFallback = !src || error;

  const resolvedAlt = alt || t('components.avatar.defaultAlt');

  // dot indicator is not visible on larger sizes, regardless of the `showNotification` prop
  const showNotification =
    showNotificationProp && (size === 'sm' || size === 'md');

  const ariaLabel = showNotification
    ? `${resolvedAlt}, ${t('components.avatar.notificationAriaLabel')}`
    : resolvedAlt;

  useEffect(() => {
    setError(false);
  }, [src]);

  const avatarContent = (
    <div
      ref={ref}
      className={avatarVariants.root({ appearance, size, className })}
      role='img'
      aria-label={ariaLabel}
      {...props}
    >
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

  if (showNotification) {
    return (
      <DotIndicator size={dotSizeMap[size]} appearance='red'>
        {avatarContent}
      </DotIndicator>
    );
  }

  return avatarContent;
};
