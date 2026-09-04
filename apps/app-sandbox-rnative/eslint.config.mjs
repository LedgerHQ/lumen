import { prodConfig } from '../../eslint.config.mjs';

export default [
  ...prodConfig,
  {
    name: 'app-sandbox-rnative-exceptions',
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      /**
       * expo-router is file-based: every route module under `src/app/` is
       * addressed by its default export, so this is not a style choice.
       */
      'import/no-default-export': 'off',

      /**
       * A demo sandbox — logging is how you inspect a block while poking at it
       * on a device.
       */
      'no-console': 'off',

      /**
       * The app is `private: true` and deliberately consumes the root's hoisted
       * dev dependencies and its workspace siblings rather than re-declaring
       * them; the rule only sees this project's own (near-empty) manifest.
       */
      'import/no-extraneous-dependencies': 'off',

      /** Metro's config API is CommonJS. */
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
