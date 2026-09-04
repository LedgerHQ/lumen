import { prodConfig } from '../../eslint.config.mjs';

export default [
  ...prodConfig,
  {
    name: 'sync-figma-exceptions',
    files: ['src/**/*.{ts,mts}'],
    rules: {
      // CLI pipelines — stdout is their only progress output.
      'no-console': 'off',
    },
  },
];
