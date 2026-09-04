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

      /**
       * An internal project ships no package.json on purpose, so the rule can
       * only see the root manifest and cannot resolve a workspace sibling like
       * `@ledgerhq/lumen-utils-shared`. What this project may import is already
       * governed by `@nx/enforce-module-boundaries` (`scope:internal` may reach
       * `scope:shared`), which is the check that actually matters here.
       */
      'import/no-extraneous-dependencies': 'off',
    },
  },
];
