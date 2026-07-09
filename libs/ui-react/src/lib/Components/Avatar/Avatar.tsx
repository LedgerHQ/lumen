import { cva } from 'class-variance-authority';
import { useState, useEffect } from 'react';
import { useCommonTranslation } from '../../../i18n';
import { User } from '../../Symbols';
import type { AvatarProps } from './types';

const avatarVariants = {
  root: cva(
    'relative inline-flex items-center justify-center rounded-full transition-colors',
    {
      variants: {
        size: {
          sm: 'size-40 p-4',
          md: 'size-48 p-4',
          lg: 'size-56 p-4',
          xl: 'size-72 p-4',
        },
      },
      defaultVariants: {
        size: 'md',
      },
    },
  ),
};

const fallbackSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

/**
 * A circular avatar component that displays a user image or fallback icon.
 *
 * When the image fails to load or no src is provided, displays a User icon fallback.
 * Supports an optional notification indicator.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-avatar--docs Storybook}
 *
 * @example
 * import { Avatar } from '@ledgerhq/lumen-ui-react';
 *
 * <Avatar src="https://example.com/photo.jpg" size="md" />
 */
export const Avatar = ({
  ref,
  className,
  src,
  alt,
  size = 'md',
  imgLoading,
  ...props
}: AvatarProps) => {
  const { t } = useCommonTranslation();
  const [error, setError] = useState<boolean>(false);
  const shouldFallback = !src || error;

  const resolvedAlt = alt || t('components.avatar.defaultAriaLabel');

  useEffect(() => {
    setError(false);
  }, [src]);

  const avatarContent = (
    <div
      ref={ref}
      className={avatarVariants.root({ size, className })}
      role='img'
      aria-label={resolvedAlt}
      {...props}
    >
      {shouldFallback ? (
        <User
          className='text-base'
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

  return avatarContent;
};
