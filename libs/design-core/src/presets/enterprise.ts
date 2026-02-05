import type { Config } from 'tailwindcss';
import { enterpriseCSSTheme } from '../themes/css';
import { createAnimationsPlugin } from '../utils/createAnimationsPlugin.js';
import { createPrimitivesPlugin } from '../utils/createPrimitivesPlugin.js';

import {
  createGradientPlugin,
  createThemePlugin,
  createTypographyPlugin,
  createShadowPlugin,
  createScrollbarPlugin,
} from '../utils/index.js';

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
    createThemePlugin(enterpriseCSSTheme),
    createTypographyPlugin(),
    createGradientPlugin(enterpriseCSSTheme),
    createShadowPlugin(),
    createAnimationsPlugin(),
    createScrollbarPlugin(),
  ],
  darkMode: 'class',
};
