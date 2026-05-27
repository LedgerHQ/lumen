import type { LumenTextStyle } from '../../../styles';
import type { IconSize } from '../Icon';
import type { TextProps } from '../Utility';

export type SpinnerProps = {
  /**
   * The size of the spinner icon in pixels.
   * @default 16
   */
  size?: IconSize;
  /**
   * The color of the spinner icon.
   * @default 'base'
   */
  color?: LumenTextStyle['color'] | string;
} & Omit<TextProps, 'children'>;
