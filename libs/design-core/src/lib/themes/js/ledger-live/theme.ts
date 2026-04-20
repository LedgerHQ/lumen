import { primitiveMotionTokens } from '../primitives/primitives.motion';
import { primitiveLayoutTokens } from '../primitives/primitives.others';
import { primitiveShadowTokens } from '../primitives/primitives.shadows';
import type { ThemeCoreTokens } from '../types';
import { typographyTokens } from '../typographies';
import { ledgerLiveDarkColorTokens } from './theme.dark';
import { ledgerLiveLightColorTokens } from './theme.light';

export const ledgerLiveCoreTokens = {
  ...primitiveLayoutTokens,
  shadows: primitiveShadowTokens,
  typographies: typographyTokens,
  motion: primitiveMotionTokens,
} satisfies ThemeCoreTokens;

const ledgerLiveDarkTheme = {
  ...ledgerLiveCoreTokens,
  colors: ledgerLiveDarkColorTokens,
};

const ledgerLiveLightTheme = {
  ...ledgerLiveCoreTokens,
  colors: ledgerLiveLightColorTokens,
};

export const ledgerLiveThemes = {
  dark: ledgerLiveDarkTheme,
  light: ledgerLiveLightTheme,
};

export type LedgerLiveDarkTheme = typeof ledgerLiveDarkTheme;
export type LedgerLiveLightTheme = typeof ledgerLiveLightTheme;
export type LedgerLiveThemes = typeof ledgerLiveThemes;
