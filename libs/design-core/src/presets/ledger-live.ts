import type { Config } from 'tailwindcss';
import { ledgerLiveCSSTheme } from '../themes/css';
import { createAnimationsPlugin } from '../utils/createAnimationsPlugin.js';
import { createPrimitivesPlugin } from '../utils/createPrimitivesPlugin.js';
import {
  createGradientPlugin,
  createScreensPlugin,
  createThemePlugin,
  createTypographyPlugin,
  createShadowPlugin,
  createScrollbarPlugin,
} from '../utils/index.js';

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
  ],
  darkMode: 'class',
};
