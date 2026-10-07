import { primitiveTypographyTokens } from '../primitives/primitive.typographies.js';
import { primitiveMotionTokens } from '../primitives/primitives.motion.js';
import { primitiveLayoutTokens } from '../primitives/primitives.others.js';
import { primitiveShadowTokens } from '../primitives/primitives.shadows.js';
import type { ThemeCoreTokens } from '../types.js';
import { typographyTokens } from '../typographies/index.js';
import { enterpriseDarkColorTokens } from './theme.dark.js';
import { enterpriseLightColorTokens } from './theme.light.js';

export const enterpriseCoreTokens = {
  ...primitiveLayoutTokens,
  fontFamilies: primitiveTypographyTokens.fontFamily,
  shadows: primitiveShadowTokens,
  typographies: typographyTokens,
  motion: primitiveMotionTokens,
} satisfies ThemeCoreTokens;

const enterpriseDarkTheme = {
  ...enterpriseCoreTokens,
  colors: enterpriseDarkColorTokens,
};

const enterpriseLightTheme = {
  ...enterpriseCoreTokens,
  colors: enterpriseLightColorTokens,
};

export const enterpriseThemes = {
  dark: enterpriseDarkTheme,
  light: enterpriseLightTheme,
};

export type EnterpriseThemes = typeof enterpriseThemes;
export type EnterpriseDarkTheme = typeof enterpriseDarkTheme;
export type EnterpriseLightTheme = typeof enterpriseLightTheme;
