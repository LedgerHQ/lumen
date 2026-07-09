import { Avatar } from '../Avatar/Avatar';
import type { AvatarButtonProps } from './types';

export const AvatarButton = ({
  onClick: onClickProp,
  ...props
}: AvatarButtonProps) => {
  return (
    <button onClick={onClickProp}>
      <Avatar {...props} />
    </button>
  );
};
