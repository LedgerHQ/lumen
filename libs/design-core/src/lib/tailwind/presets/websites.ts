import type { Config } from 'tailwindcss';
import { websitesCSSTheme } from '../../generated/css/index.js';
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
