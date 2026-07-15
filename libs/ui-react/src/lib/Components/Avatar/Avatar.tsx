import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useState, useEffect } from 'react';
import { useCommonTranslation } from '../../../i18n';
import { User } from '../../Symbols';
import type { AvatarProps } from './types';

const avatarVariants = {
  root: cva(
    'relative inline-flex items-center justify-center rounded-full bg-base-transparent-hover align-middle transition-colors',
    {
      variants: {
        size: {
          xs: 'size-24',
          sm: 'size-40',
          md: 'size-48',
          lg: 'size-56',
          xl: 'size-72',
          '2xl': 'size-128',
        },
      },
      defaultVariants: {
        size: 'md',
      },
    },
  ),
  text: cva('select-none', {
    variants: {
      size: {
        xs: 'body-4-semi-bold',
        sm: 'body-1-semi-bold',
        md: 'heading-5-semi-bold',
        lg: 'heading-4-semi-bold',
        xl: 'heading-2-semi-bold',
        '2xl': 'heading-1-semi-bold',
      },
    },
  }),
};

const fallbackSizes = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 56,
} as const;

const FallbackContent = ({
  size,
  fallbackText,
  fallbackColor,
}: {
  size: NonNullable<AvatarProps['size']>;
  fallbackText?: string;
  fallbackColor?: string;
}) => {
  const colorClass = fallbackColor ? 'text-black' : 'text-base';
  return fallbackText ? (
    <span className={cn(avatarVariants.text({ size }), colorClass)}>
      {fallbackText}
    </span>
  ) : (
    <User
      className={colorClass}
      size={fallbackSizes[size]}
      aria-label='Fallback Icon'
      aria-hidden='true'
    />
  );
};

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
  fallbackText,
  fallbackColor,
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
      className={cn(avatarVariants.root({ size }), className)}
      style={
        shouldFallback && fallbackColor
          ? { backgroundColor: fallbackColor }
          : undefined
      }
      role='img'
      aria-label={resolvedAlt}
      {...props}
    >
      {shouldFallback ? (
        <FallbackContent
          size={size}
          fallbackText={fallbackText}
          fallbackColor={fallbackColor}
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
      <span
        className='pointer-events-none absolute inset-0 rounded-full ring-1 ring-icon ring-inset'
        aria-hidden='true'
      />
    </div>
  );

  return avatarContent;
};
