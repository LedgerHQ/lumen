import type { Config } from 'tailwindcss';
import { enterpriseCSSTheme } from '../../generated/css/index.js';
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
} from '../plugins/index.js';

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
