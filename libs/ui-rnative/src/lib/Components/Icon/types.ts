import type { Ref } from 'react';
import type { Svg, SvgProps } from 'react-native-svg';
import type { LumenTextStyle } from '../../../styles';
import type { TextProps } from '../Utility';

export type IconSize = 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56;

export type IconProps = {
  /**
   * The size of the icon.
   */
  size?: IconSize;
  /**
   * The color of the icon.
   */
  color?: LumenTextStyle['color'];
  /**
   * The children of the icon.
   */
  children?: React.ReactNode;
  /**
   * Whether the icon is disabled.
   */
  disabled?: boolean;
  /**
   * The ref to the Svg component.
   */
  ref?: Ref<Svg>;
} & Omit<TextProps, 'ref'> &
  Omit<SvgProps, 'style'>;
