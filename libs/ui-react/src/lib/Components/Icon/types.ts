import type { ComponentPropsWithRef, ReactNode } from 'react';

export type IconSize = 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56;

export type IconProps = {
  /**
   * The size of the icon.
   */
  size?: IconSize;
  /**
   * The class name of the icon.
   */
  className?: string;
  /**
   * The children of the icon.
   */
  children: ReactNode;
} & ComponentPropsWithRef<'svg'>;
