import { Ref } from 'react';
import { Svg, SvgProps } from 'react-native-svg';
import { LumenTextStyle } from '../../../styles';
import { TextProps } from '../Utility';

export type IconSize = 12 | 16 | 20 | 24 | 40 | 48 | 56;

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
   * The ref to the Svg component.
   */
  ref?: Ref<Svg>;
} & Omit<TextProps, 'ref'> &
  Omit<SvgProps, 'style'>;
