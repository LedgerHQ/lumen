import type { ComponentPropsWithRef, ReactNode } from 'react';

export type DotSymbolSize = 8 | 10 | 12 | 16 | 20 | 24;

export type DotSymbolPin =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export type DotSymbolProps = {
  /**
   * Image source URL for the dot indicator.
   */
  src: string;
  /**
   * Alternative text for the dot image.
   */
  alt?: string;
  /**
   * Corner placement of the dot indicator.
   * @default 'bottom-end'
   */
  pin?: DotSymbolPin;
  /**
   * The size of the dot indicator in pixels.
   * @default 16
   */
  size?: DotSymbolSize;
  /**
   * The shape of the dot indicator.
   * @default 'circle'
   */
  shape?: 'square' | 'circle';
  /**
   * Additional custom CSS classes to apply to the wrapper.
   */
  className?: string;
  /**
   * The wrapped component (e.g. MediaImage or Spot).
   */
  children?: ReactNode;
} & Omit<ComponentPropsWithRef<'div'>, 'children'>;
