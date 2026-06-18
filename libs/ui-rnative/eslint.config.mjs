import { prodConfig } from '../../eslint.config.mjs';

export default [
  ...prodConfig,
  {
    ignores: ['public', '.cache', 'node_modules'],
  },
];
