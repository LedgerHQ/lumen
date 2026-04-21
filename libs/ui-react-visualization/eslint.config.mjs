import storybook from 'eslint-plugin-storybook';

import { prodConfig } from '../../eslint.config.mjs';

export default [
  ...prodConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx,cjs,cts,mjs,mts}'],
    plugins: {
      storybook,
    },
    rules: {
      'storybook/no-uninstalled-addons': [
        'error',
        {
          packageJsonLocation: '../../package.json',
        },
      ],
    },
  },
];
