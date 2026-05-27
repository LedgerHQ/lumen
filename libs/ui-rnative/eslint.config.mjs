import storybook from 'eslint-plugin-storybook';

import { prodConfig } from '../../eslint.config.mjs';
import { defineProdRules } from '../../eslint.shared.mjs';
export default [
  ...prodConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx,cjs,cts,mjs,mts}'],
    plugins: {
      storybook,
    },
  },
  defineProdRules({}),
  {
    ignores: ['public', '.cache', 'node_modules'],
  },
  ...storybook.configs['flat/recommended'],
];
