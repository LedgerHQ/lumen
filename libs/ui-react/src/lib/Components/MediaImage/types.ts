import type { ComponentPropsWithRef } from 'react';

export type MediaImageSize = 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64;

export type MediaImageShape = 'square' | 'circle';

export type MediaImageProps = {
  /**
   * Image source URL. When undefined or on load error, displays a fallback.
   * @optional
   */
  src?: string;
  /**
   * The shape of the media image.
   * @default 'square'
   */
  shape?: MediaImageShape;
  /**
   * The size of the media image in pixels.
   * @default 48
   */
  size?: MediaImageSize;
  /**
   * Loading strategy for the image.
   * - `eager`: Load immediately (default browser behavior)
   * - `lazy`: Defer loading until near viewport
   * @optional
   * @default eager (browser default: eager)
   */
  imgLoading?: 'eager' | 'lazy';
  /**
   * Alternative text for the image, used for accessibility.
   */
  alt?: string;
  /**
   * Text used to derive a single-letter fallback when no `src` is provided or the image fails to load.
   * The first character is displayed, uppercased.
   * @optional
   */
  fallback?: string;
  /**
   * When true, displays a pulsing skeleton placeholder instead of the image or fallback.
   * @optional
   * @default false
   */
  loading?: boolean;
  /**
   * Additional custom CSS classes to apply. Do not use this prop to modify the component's core appearance.
   * @optional
   */
  className?: string;
} & ComponentPropsWithRef<'div'>;
