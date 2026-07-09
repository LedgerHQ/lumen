import { cn } from '@ledgerhq/lumen-utils-shared';
import { Avatar } from '../Avatar/Avatar';
import type { AvatarButtonProps } from './types';

/**
 * An {@link Avatar} wrapped in a button, for use as an interactive trigger.
 */
export const AvatarButton = ({
  ref,
  className,
  onClick,
  ...props
}: AvatarButtonProps) => {
  return (
    <button
      ref={ref}
      type='button'
      onClick={onClick}
      className={cn('cursor-pointer rounded-full', className)}
    >
      <Avatar {...props} />
    </button>
  );
};
