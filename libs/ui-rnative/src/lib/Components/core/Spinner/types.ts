import type { LumenTextStyle } from '../../../../styles';
import type { TextProps } from '../../primitives';
import type { IconSize } from '../../symbols/Icon';

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
