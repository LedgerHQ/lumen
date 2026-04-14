import type { ComponentType, ReactNode } from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { StyledViewProps } from '../../../styles';
import { IconSize } from '../Icon';

export type DotSymbolSize = 8 | 10 | 12 | 16 | 20 | 24;
export type DotSymbolIconSize = 16 | 20 | 24;

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
   * The size of the dot indicator in pixels.
   * @default 20
   */
  size?: DotSymbolSize;
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
  icon: ComponentType<{ size?: IconSize; style?: StyleProp<TextStyle> }>;
  /**
   * The size of the dot indicator in pixels.
   * @default 20
   */
  size?: DotSymbolIconSize;
  src?: never;
  alt?: never;
};

export type DotSymbolProps = {
  /**
   * Corner placement of the dot indicator.
   * @default 'bottom-end'
   */
  pin?: DotSymbolPin;
  /**
   * The shape of the dot indicator.
   * @default 'circle'
   */
  shape?: 'square' | 'circle';
  /**
   * The wrapped component (e.g. MediaImage or Spot).
   */
  children?: ReactNode;
} & (DotSymbolImageContent | DotSymbolIconContent) &
  Omit<StyledViewProps, 'children'>;
