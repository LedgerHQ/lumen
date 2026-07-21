import type { StyledPressableProps } from '../../../styles';
import type { AvatarProps } from '../Avatar/types';

export type AvatarButtonProps = Pick<
  AvatarProps,
  'src' | 'alt' | 'size' | 'fallbackText' | 'fallbackColor' | 'appearance'
> &
  StyledPressableProps & {
    /**
     * When `true`, prevents the user from interacting with the avatar.
     *
     * @default false
     */
    disabled?: boolean;
  };
