import type { ComponentPropsWithRef } from 'react';
import type { AvatarProps } from '../Avatar/types';

type AvatarButtonAvatarProps = Pick<
  AvatarProps,
  'src' | 'alt' | 'size' | 'imgLoading' | 'fallbackText' | 'fallbackColor'
>;

export type AvatarButtonProps = AvatarButtonAvatarProps &
  Omit<ComponentPropsWithRef<'button'>, 'children' | 'type'>;
