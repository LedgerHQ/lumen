import { ComponentPropsWithRef } from 'react';
import {
  PressableProps,
  PressableStateCallbackType,
  TextProps as RNTextProps,
  ViewProps,
  ViewStyle,
  Text as RNText,
  View as RNView,
  Pressable as RNPressable,
} from 'react-native';
import { LumenTextStyle, LumenViewStyle } from './lx.types';
import { LumenStyleSheetTheme } from './theme.types';

type StyleFn = (state: PressableStateCallbackType) => ViewStyle;
export type PressableStyleItem =
  | ViewStyle
  | StyleFn
  | PressableStyleItem[]
  | null
  | undefined;

export type ExtendRNPressableProps = Omit<PressableProps, 'style'> & {
  style?: PressableStyleItem;
};

/**
 * View API that extends lx style property
 */
export type StyledViewProps = {
  /**
   * Support LX property - [see documentation](/?path=/docs/style-system-lx--docs).
   */
  lx?: LumenViewStyle;
} & ViewProps &
  ComponentPropsWithRef<typeof RNView>;

/**
 * Text API that extends lx style property
 */
export type StyledTextProps = {
  /**
   * Support LX property - [see documentation](/?path=/docs/style-system-lx--docs).
   */
  lx?: LumenTextStyle;
  /**
   * Typography preset
   */
  typography?: keyof LumenStyleSheetTheme['typographies'];
} & RNTextProps &
  ComponentPropsWithRef<typeof RNText>;

/**
 * Pressable API that extends lx style property
 */
export type StyledPressableProps = {
  /**
   * Support LX property - [see documentation](/?path=/docs/style-system-lx--docs).
   */
  lx?: LumenViewStyle;
} & ExtendRNPressableProps &
  ComponentPropsWithRef<typeof RNPressable>;
