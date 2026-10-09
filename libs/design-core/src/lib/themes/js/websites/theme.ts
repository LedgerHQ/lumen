import { primitiveTypographyTokens } from '../primitives/primitive.typographies.js';
import { primitiveMotionTokens } from '../primitives/primitives.motion.js';
import { primitiveLayoutTokens } from '../primitives/primitives.others.js';
import { primitiveShadowTokens } from '../primitives/primitives.shadows.js';
import type { ThemeCoreTokens } from '../types.js';
import { typographyTokens } from '../typographies/index.js';
import { websitesDarkColorTokens } from './theme.dark.js';
import { websitesLightColorTokens } from './theme.light.js';

export const websitesCoreTokens = {
  ...primitiveLayoutTokens,
  fontFamilies: primitiveTypographyTokens.fontFamily,
  shadows: primitiveShadowTokens,
  typographies: typographyTokens,
  motion: primitiveMotionTokens,
} satisfies ThemeCoreTokens;

const websitesDarkTheme = {
  ...websitesCoreTokens,
  colors: websitesDarkColorTokens,
};

const websitesLightTheme = {
  ...websitesCoreTokens,
  colors: websitesLightColorTokens,
};

export const websitesThemes = {
  dark: websitesDarkTheme,
  light: websitesLightTheme,
};

export type WebsitesThemes = typeof websitesThemes;
export type WebsitesDarkTheme = typeof websitesDarkTheme;
export type WebsitesLightTheme = typeof websitesLightTheme;
