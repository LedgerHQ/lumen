import { sharedConfig } from '../../eslint.config.mjs';

export default [
  ...sharedConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
