import {
  ledgerLiveThemes,
  TypographyTokens,
} from '@ledgerhq/lumen-design-core';
import { AddEntriesNegative } from './utility.types';

/**
 * Typography tokens without responsive display (not applicable for React Native)
 */
export type LumenTypographyTokens = TypographyTokens['heading'] &
  TypographyTokens['body'];

export type LumenTypographyTokenName =
  | keyof TypographyTokens['heading']
  | keyof TypographyTokens['body'];

/**
 * Instead of exposing the raw theme objects, narrow, extends and transform the theme to improve experience and performances
 */
type ThemeWithOneTypographyTokens<Theme extends LumenTheme> = Omit<
  Theme,
  'typographies' | 'spacings'
> & {
  typographies: LumenTypographyTokens;
  spacings: AddEntriesNegative<Theme['spacings']>;
};

export type LumenDarkTheme = typeof ledgerLiveThemes.dark;
export type LumenLightTheme = typeof ledgerLiveThemes.light;
export type LumenTheme = LumenDarkTheme | LumenLightTheme;
export type LumenStyleSheetTheme = ThemeWithOneTypographyTokens<LumenTheme>;

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface LumenStyleSheetThemes {
  light: LumenStyleSheetTheme;
  dark: LumenStyleSheetTheme;
}

export type LumenThemes = {
  light: LumenLightTheme;
  dark: LumenDarkTheme;
};
