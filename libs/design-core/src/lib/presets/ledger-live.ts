import type { Config } from 'tailwindcss';
import { ledgerLiveCSSTheme } from '../themes/css';
import {
  createGradientPlugin,
  createScreensPlugin,
  createThemePlugin,
  createTypographyPlugin,
  createShadowPlugin,
  createScrollbarPlugin,
  createMaskPlugin,
} from '../utils';
import { createAnimationsPlugin } from '../utils/createAnimationsPlugin.js';
import { createPrimitivesPlugin } from '../utils/createPrimitivesPlugin.js';

export const ledgerLivePreset: Config = {
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
    createThemePlugin(ledgerLiveCSSTheme),
    createTypographyPlugin(),
    createGradientPlugin(ledgerLiveCSSTheme),
    createShadowPlugin(),
    createAnimationsPlugin(),
    createScrollbarPlugin(),
    createMaskPlugin(),
  ],
  darkMode: 'class',
};
