import type { AvatarProps } from '../Avatar/types';

export type AvatarButtonProps = AvatarProps & {
  onClick?: () => void;
};
