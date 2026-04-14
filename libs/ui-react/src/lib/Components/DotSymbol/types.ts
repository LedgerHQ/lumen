import type { ComponentPropsWithRef, ComponentType, ReactNode } from 'react';
import type { IconSize } from '../Icon';

export type DotSymbolSize = 16 | 20 | 24;

export type DotSymbolPin =
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export type DotSymbolAppearance = 'success' | 'muted' | 'error';

type DotSymbolImageContent = {
  /**
   * Discriminant for the image variant.
   * @default 'image'
   */
  type?: 'image';
  /**
   * Image source URL for the dot indicator.
   */
  src: string;
  /**
   * Alternative text for the dot image.
   */
  alt?: string;
  /**
   * Loading strategy for the image.
   * - `eager`: Load immediately (default browser behavior)
   * - `lazy`: Defer loading until near viewport
   * @default eager (browser default: eager)
   */
  imgLoading?: 'eager' | 'lazy';
  icon?: never;
  appearance?: never;
};

type DotSymbolIconContent = {
  /**
   * Discriminant for the icon variant.
   */
  type: 'icon';
  /**
   * Semantic color of the dot background.
   */
  appearance: DotSymbolAppearance;
  /**
   * Icon component to render inside the dot.
   */
  icon: ComponentType<{ size?: IconSize; className?: string }>;
  src?: never;
  alt?: never;
  imgLoading?: never;
};

export type DotSymbolProps = {
  /**
   * Corner placement of the dot indicator.
   * @default 'bottom-end'
   */
  pin?: DotSymbolPin;
  /**
   * The size of the dot indicator in pixels.
   * @default 20
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
} & (DotSymbolImageContent | DotSymbolIconContent) &
  Omit<ComponentPropsWithRef<'div'>, 'children'>;
