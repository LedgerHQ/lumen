import type { ComponentPropsWithRef, ComponentType } from 'react';
import { IconProps, IconSize } from '../Icon';

export type InteractiveIconProps = {
  /**
   * Whether the icon is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The visual style of the icon button.
   * Choose 'filled' for icons with solid backgrounds or 'stroked' for outlined icons.
   */
  iconType: 'filled' | 'stroked';
  /**
   * The color appearance of the icon.
   * - 'muted': Subdued color for secondary actions.
   * - 'white': White color for use on dark backgrounds.
   * - 'base': Default high-contrast color.
   * @default 'muted'
   */
  appearance?: 'muted' | 'white' | 'base';
  /**
   * The icon component to render.
   */
  icon: ComponentType<Omit<IconProps, 'children'>>;
  /**
   * The size of the icon in pixels.
   * @default 20
   */
  size?: IconSize;
} & Omit<ComponentPropsWithRef<'button'>, 'disabled' | 'children'>;
