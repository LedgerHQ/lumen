import type { MouseEventHandler, Ref } from 'react';
import type { AvatarProps } from '../Avatar/types';

export type AvatarButtonProps = Omit<AvatarProps, 'ref' | 'onClick'> & {
  /**
   * Ref forwarded to the underlying `<button>` element.
   * @optional
   */
  ref?: Ref<HTMLButtonElement>;
  /**
   * Called when the button is clicked.
   * @optional
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
