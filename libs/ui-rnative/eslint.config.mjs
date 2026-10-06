import { prodConfig } from '../../eslint.config.mjs';
import { defineLumenNativeRules } from '../../eslint.shared.mjs';

export default [
  ...prodConfig,
  ...defineLumenNativeRules(),
  {
    ignores: ['public', '.cache', 'node_modules'],
  },
];
