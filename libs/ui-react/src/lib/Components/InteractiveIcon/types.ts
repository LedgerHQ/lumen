import type { ComponentPropsWithRef, ReactNode } from 'react';

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
   * The visual style of the icon button.
   * Choose 'muted' for icons with muted background, 'white' for icons with white background, or 'base' for icons with base background.
   */
  appearance?: 'muted' | 'white' | 'base';
  /**
   * The icon component to display inside the button.
   * Should be a single icon element from the design system.
   */
  children: ReactNode;
} & Omit<ComponentPropsWithRef<'button'>, 'disabled'>;
