import {
  type ButtonHTMLAttributes,
  type ComponentType,
  type MouseEventHandler,
  type ReactNode,
  type Ref,
} from 'react';
import { IconSize } from '../Icon/types';

export type TileButtonProps = {
  /**
   * The icon component to render above the label.
   * Will be rendered at 20px size.
   */
  icon: ComponentType<{ size?: IconSize; className?: string }>;
  /**
   * The content of the button (label text).
   */
  children: ReactNode;
  /**
   * Click handler for the button.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
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
  /**
   * Ref to the tile button element.
   */
  ref?: Ref<HTMLButtonElement>;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'children'>;
