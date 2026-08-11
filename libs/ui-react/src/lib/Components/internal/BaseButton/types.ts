import type { ComponentPropsWithRef, ComponentType } from 'react';
import type { IconSize } from '../../symbols/Icon/types';

export type BaseButtonProps = {
  /**
   * The visual style of the button.
   * @default base
   */
  appearance?:
    | 'base'
    | 'gray'
    | 'accent'
    | 'transparent'
    | 'no-background'
    | 'red';
  /**
   * The size variant of the button.
   * @default md
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /**
   * If true, the button expands to full width of its container.
   * @default false
   */
  isFull?: boolean;
  /**
   * If true, shows a loading spinner instead of the icon.
   * @default false
   */
  loading?: boolean;
  /**
   * Optional prop to render the button as a child element.
   * @default false
   */
  asChild?: boolean;
  /**
   * An optional icon component to render inside the button.
   */
  icon?: ComponentType<{ size?: IconSize; className?: string }>;
} & ComponentPropsWithRef<'button'>;
