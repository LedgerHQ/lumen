import { cn, useDisabledContext } from '@ledgerhq/lumen-utils-shared';
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
  disabled: disabledProp = false,
  ...buttonProps
}: AvatarButtonProps) => {
  const disabled = useDisabledContext({
    consumerName: 'AvatarButton',
    mergeWith: { disabled: disabledProp },
  });

  return (
    <button
      ref={ref}
      type='button'
      disabled={disabled}
      className={cn(
        'group relative cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30',
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
