import type { ComponentType } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import type { StyledViewProps } from '../../../../styles';
import type { IconSize } from '../../symbols/Icon';

export type SpotAppearance =
  | 'base'
  | 'success'
  | 'error'
  | 'warning'
  | 'muted'
  | 'decorative-blue'
  | 'decorative-pink'
  | 'decorative-purple'
  | 'decorative-green'
  | 'decorative-turquoise'
  | 'decorative-yellow'
  | 'decorative-orange'
  | 'decorative-red';

export type SpotFill = 'transparent' | 'plain';

export type SpotSize = 32 | 40 | 48 | 56 | 72;

export type SpotDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type SpotProps = {
  /**
   * Color palette for the icon, and for the circle when `fill` is plain.
   * @default 'base'
   */
  appearance?: SpotAppearance;
  /**
   * Circle treatment. Transparent keeps a muted transparent fill. Plain uses the palette's solid background and paired text color.
   * @default 'transparent'
   */
  fill?: SpotFill;
  /**
   * Whether the spot is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The size of the spot.
   * @default 48
   */
  size?: SpotSize;
  /**
   * Icon rendered inside the circle.
   * @required
   */
  icon: ComponentType<{ size?: IconSize; style?: StyleProp<TextStyle> }>;
} & Omit<StyledViewProps, 'children'>;

export type SpotNumberProps = {
  /**
   * Digit rendered inside the circle.
   * @required
   */
  value: SpotDigit;
} & Omit<SpotProps, 'icon'>;
