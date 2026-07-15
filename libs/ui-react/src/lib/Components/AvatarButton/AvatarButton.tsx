import { cn } from '@ledgerhq/lumen-utils-shared';
import { Avatar } from '../Avatar/Avatar';
import type { AvatarButtonProps } from './types';

/**
 * An {@link Avatar} wrapped in a button, for use as an interactive trigger.
 */
export const AvatarButton = ({
  ref,
  className,
  src,
  alt,
  size,
  imgLoading,
  fallbackText,
  fallbackColor,
  ...buttonProps
}: AvatarButtonProps) => {
  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'group relative cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus disabled:cursor-not-allowed',
        className,
      )}
      {...buttonProps}
    >
      <Avatar
        src={src}
        alt={alt}
        size={size}
        imgLoading={imgLoading}
        fallbackText={fallbackText}
        fallbackColor={fallbackColor}
      />
      <span className='pointer-events-none absolute inset-0 rounded-full transition-colors group-hover:bg-base-transparent-hover group-active:bg-base-transparent-pressed' />
    </button>
  );
};
