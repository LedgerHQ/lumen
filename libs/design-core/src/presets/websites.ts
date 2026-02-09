import type { Config } from 'tailwindcss';
import { websitesCSSTheme } from '../themes/css';
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
  ],
  darkMode: 'class',
};
