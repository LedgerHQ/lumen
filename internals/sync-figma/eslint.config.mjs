import { prodConfig } from '../../eslint.config.mjs';

export default [
  ...prodConfig,
  {
    name: 'sync-figma-exceptions',
    files: ['src/**/*.{ts,mts}'],
    rules: {
      /**
       * These are CLI pipelines run by hand and by `sync-figma.yml`; their
       * stdout is the only progress feedback a maintainer gets.
       */
      'no-console': 'off',
    },
  },
];
