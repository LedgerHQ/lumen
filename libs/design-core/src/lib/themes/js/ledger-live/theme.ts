import { primitiveTypographyTokens } from '../primitives/primitive.typographies.js';
import { primitiveMotionTokens } from '../primitives/primitives.motion.js';
import { primitiveLayoutTokens } from '../primitives/primitives.others.js';
import { primitiveShadowTokens } from '../primitives/primitives.shadows.js';
import type { ThemeCoreTokens } from '../types.js';
import { typographyTokens } from '../typographies/index.js';
import { ledgerLiveDarkColorTokens } from './theme.dark.js';
import { ledgerLiveLightColorTokens } from './theme.light.js';

export const ledgerLiveCoreTokens = {
  ...primitiveLayoutTokens,
  fontFamilies: primitiveTypographyTokens.fontFamily,
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
