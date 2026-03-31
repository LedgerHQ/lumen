import type { Config } from 'tailwindcss';
import { allBrandsCSSTheme } from '../themes/css';
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

export const allBrandsPreset: Config = {
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
    createThemePlugin(allBrandsCSSTheme),
    createTypographyPlugin(),
    createGradientPlugin(allBrandsCSSTheme),
    createShadowPlugin(),
    createAnimationsPlugin(),
    createScrollbarPlugin(),
    createMaskPlugin(),
  ],
  darkMode: 'class',
};
