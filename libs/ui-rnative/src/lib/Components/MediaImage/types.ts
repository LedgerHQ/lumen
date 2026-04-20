import type { StyledViewProps } from '../../../styles';

export type MediaImageSize = 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56;

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
   * Alternative text for the image, used for accessibility.
   */
  alt?: string;
} & Omit<StyledViewProps, 'children'>;
