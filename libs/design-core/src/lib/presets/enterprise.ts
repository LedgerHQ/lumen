import type { Config } from 'tailwindcss';
import { enterpriseCSSTheme } from '../themes/css';
import {
  createGradientPlugin,
  createScreensPlugin,
  createThemePlugin,
  createTypographyPlugin,
  createShadowPlugin,
  createScrollbarPlugin,
  createMaskPlugin,
  createAnimationsPlugin,
  createPrimitivesPlugin,
} from '../utils';

export const enterprisePreset: Config = {
  content: [],
  theme: {
    boxShadow: {},
    boxShadowColor: {},
    fontSize: {},
    fontWeight: {},
    lineHeight: {},
    colors: {},
  },
  plugins: [
    createPrimitivesPlugin(),
    createScreensPlugin(),
    createThemePlugin(enterpriseCSSTheme),
    createTypographyPlugin(),
    createGradientPlugin(enterpriseCSSTheme),
    createShadowPlugin(),
    createAnimationsPlugin(),
    createScrollbarPlugin(),
    createMaskPlugin(),
  ],
  darkMode: 'class',
};
