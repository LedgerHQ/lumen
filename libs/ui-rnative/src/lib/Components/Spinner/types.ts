import { LumenTextStyle } from '../../../styles';
import { IconSize } from '../Icon';
import { TextProps } from '../Utility';

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
