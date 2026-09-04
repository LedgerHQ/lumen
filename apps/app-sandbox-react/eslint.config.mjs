import { prodConfig } from '../../eslint.config.mjs';

export default [
  ...prodConfig,
  {
    name: 'app-sandbox-react-exceptions',
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      /**
       * The app is `private: true` and deliberately consumes the root's hoisted
       * dev dependencies and its workspace siblings rather than re-declaring
       * them; the rule only sees this project's own (near-empty) manifest.
       */
      'import/no-extraneous-dependencies': 'off',
    },
  },
];
