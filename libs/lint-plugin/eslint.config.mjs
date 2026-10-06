import { prodConfig } from '../../eslint.config.mjs';

export default [
  // Fixtures violate the rules on purpose; `types/` is generated.
  { ignores: ['fixtures/**', 'types/**'] },
  ...prodConfig,
  {
    files: ['**/*.json'],
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredFiles: [
            '{projectRoot}/eslint.config.{js,cjs,mjs}',
            '{projectRoot}/vitest.config.{js,ts,mjs,mts}',
            '{projectRoot}/src/**/*.test.js',
            '{projectRoot}/src/**/*.cases.js',
            '{projectRoot}/scripts/**/*.js',
            // Lint fixtures import Lumen packages as plain text samples.
            '{projectRoot}/fixtures/**/*',
          ],
          // eslint, oxlint and tailwindcss are the host the plugin runs in, not
          // modules it imports; `tslib` is a build helper but only types are emitted.
          ignoredDependencies: ['eslint', 'oxlint', 'tailwindcss', 'tslib'],
        },
      ],
    },
    languageOptions: {
      parser: await import('jsonc-eslint-parser'),
    },
  },
];
