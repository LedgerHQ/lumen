import { prodConfig } from '../../eslint.config.mjs';
import {
  defineStorybookAddons,
  defineTailwindRules,
} from '../../eslint.shared.mjs';

export default [
  ...prodConfig,
  defineStorybookAddons({ packageJsonLocation: '../../package.json' }),
  defineTailwindRules({
    entryPoint: './src/styles.css',
    tailwindConfig: './tailwind.config.ts',
  }),
];
