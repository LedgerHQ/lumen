import { prodConfig } from '../../eslint.config.mjs';
import {
  defineStorybookAddons,
  defineLumenReactRules,
} from '../../eslint.shared.mjs';

export default [
  ...prodConfig,
  defineStorybookAddons({ packageJsonLocation: '../../package.json' }),
  ...defineLumenReactRules({
    entryPoint: './src/styles.css',
    tailwindConfig: './tailwind.config.ts',
  }),
];
