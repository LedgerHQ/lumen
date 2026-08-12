import type { ReactNode } from 'react';
import type { BaseButtonProps } from '../../internal/BaseButton/types';

export type ButtonProps = {
  /**
   * The content of the button. This is required to ensure buttons always have a label.
   * @required
   */
  children: ReactNode;
  /**
   * The size variant of the button.
   * @default md
   */
  size?: 'sm' | 'md' | 'lg';
} & Omit<BaseButtonProps, 'children' | 'size'>;
