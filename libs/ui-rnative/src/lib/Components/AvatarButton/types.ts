import type { StyledPressableProps } from '../../../styles';
import type { AvatarProps } from '../Avatar/types';

export type AvatarButtonProps = Pick<
  AvatarProps,
  'src' | 'alt' | 'size' | 'fallbackText' | 'fallbackColor'
> &
  StyledPressableProps;
