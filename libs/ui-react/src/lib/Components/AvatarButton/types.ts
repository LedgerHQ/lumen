import type { ComponentPropsWithRef } from 'react';
import type { AvatarProps } from '../Avatar/types';

export type AvatarButtonProps = Pick<
  AvatarProps,
  | 'src'
  | 'alt'
  | 'size'
  | 'imgLoading'
  | 'fallbackText'
  | 'fallbackColor'
  | 'appearance'
> &
  Omit<ComponentPropsWithRef<'button'>, 'children' | 'type'>;
