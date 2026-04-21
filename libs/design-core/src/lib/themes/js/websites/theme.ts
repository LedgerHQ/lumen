import { primitiveMotionTokens } from '../primitives/primitives.motion';
import { primitiveLayoutTokens } from '../primitives/primitives.others';
import { primitiveShadowTokens } from '../primitives/primitives.shadows';
import type { ThemeCoreTokens } from '../types';
import { typographyTokens } from '../typographies';
import { websitesDarkColorTokens } from './theme.dark';
import { websitesLightColorTokens } from './theme.light';

export const websitesCoreTokens = {
  ...primitiveLayoutTokens,
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
