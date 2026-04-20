import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { StyledPressableProps } from '../../../styles';
import type { IconSize } from '../Icon';

export type LinkProps = {
  /**
   * The visual style of the link.
   * @default base
   */
  appearance?: 'base' | 'accent';
  /**
   * The size variant of the link.
   * @default md
   */
  size?: 'sm' | 'md';
  /**
   * Whether to underline the link text.
   * @default true
   */
  underline?: boolean;
  /**
   * An optional icon component to render inside the link.
   * The icon styles are defined by the link. Please do not override them.
   */
  icon?: React.ComponentType<{
    size?: IconSize;
    style?: StyleProp<ViewStyle>;
  }>;
  /**
   * If true, displays an external link icon next to the link text.
   * @default false
   */
  isExternal?: boolean;
  /**
   * The URL to navigate to
   */
  href?: string;
  /**
   * Custom press handler (overrides default href navigation)
   */
  onPress?: () => void;
} & PropsWithChildren &
  Omit<StyledPressableProps, 'onPress' | 'children'>;
