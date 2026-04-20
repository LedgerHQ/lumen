import type { PropsWithChildren } from 'react';
import type { ColorSchemeName } from 'react-native';
import type { LumenThemes } from '../types';

export const COLOR_SCHEMES = {
  light: 'light',
  dark: 'dark',
} as const;

export type LumenStyleSheetProviderProps = PropsWithChildren & {
  themes: LumenThemes;
  colorScheme?: ColorSchemeName;
  onColorSchemeChange?: (scheme: ColorSchemeName) => void;
};
