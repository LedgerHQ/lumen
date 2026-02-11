import React from 'react';
import { IconSize } from '../Icon/types';

export type TileButtonProps = {
  /**
   * The icon component to render above the label.
   * Will be rendered at 20px size.
   */
  icon: React.ComponentType<{ size?: IconSize; className?: string }>;
  /**
   * The content of the button (label text).
   */
  children: React.ReactNode;
  /**
   * Click handler for the button.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /**
   * Whether the button is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If true, the button expands to full width of its container.
   * @default false
   */
  isFull?: boolean;
  /**
   * Additional CSS classes for layout adjustments.
   */
  className?: string;
  /**
   * Accessible label for the button.
   */
  'aria-label'?: string;
  /**
   * Optional prop to render the button as a child element.
   * When true, TileButton merges its props with its child element.
   * @default false
   */
  asChild?: boolean;
} & Omit<React.ComponentPropsWithRef<'button'>, 'onClick' | 'children'>;
