import { primitiveMotionTokens } from '../primitives/primitives.motion';
import { primitiveLayoutTokens } from '../primitives/primitives.others';
import { primitiveShadowTokens } from '../primitives/primitives.shadows';
import { ThemeCoreTokens } from '../types';
import { typographyTokens } from '../typographies';
import { enterpriseDarkColorTokens } from './theme.dark';
import { enterpriseLightColorTokens } from './theme.light';

export const enterpriseCoreTokens = {
  ...primitiveLayoutTokens,
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
