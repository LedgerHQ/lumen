import type { Config } from 'tailwindcss';
import { websitesCSSTheme } from '../themes/css';
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

export const websitesPreset: Config = {
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
    createThemePlugin(websitesCSSTheme),
    createTypographyPlugin(),
    createGradientPlugin(websitesCSSTheme),
    createShadowPlugin(),
    createAnimationsPlugin(),
    createScrollbarPlugin(),
    createMaskPlugin(),
  ],
  darkMode: 'class',
};
