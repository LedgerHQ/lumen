import { prodConfig } from '../../eslint.config.mjs';
import { defineDependencyChecks } from '../../eslint.shared.mjs';

export default [
  // Fixtures violate the rules on purpose; `types/` is generated.
  { ignores: ['fixtures/**', 'types/**'] },
  ...prodConfig,
  defineDependencyChecks({
    ignoredFiles: [
      '{projectRoot}/scripts/**/*.js',
      // Lint fixtures import Lumen packages as plain text samples.
      '{projectRoot}/fixtures/**/*',
    ],
    // eslint, oxlint and tailwindcss are the host the plugin runs in, not
    // modules it imports; `tslib` is a build helper but only types are emitted.
    // design-core is never imported: its peer pins the version whose
    // `/cn` entry `no-restricted-imports` points consumers to.
    ignoredDependencies: [
      'eslint',
      'oxlint',
      'tailwindcss',
      'tslib',
      '@ledgerhq/lumen-design-core',
    ],
  }),
];
