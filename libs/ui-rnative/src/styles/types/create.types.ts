import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import type { LumenStyleSheetTheme } from './theme.types';

type AllAvailableStyles = ViewStyle & TextStyle & ImageStyle;
type AllAvailableKeys = keyof (ViewStyle & TextStyle & ImageStyle);

type FlatLumensValues = {
  [propName in AllAvailableKeys]?: AllAvailableStyles[propName];
};

type LumensValues = FlatLumensValues | FlatLumensValues[];

export type LumenStyleSheet = Record<
  string,
  | LumensValues
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | ((...args: any) => LumensValues)
>;

export type LumenStyleSheetExtended<S extends LumenStyleSheet> =
  | ((theme: LumenStyleSheetTheme) => S)
  | S;
