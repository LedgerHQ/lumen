import { fileURLToPath } from 'node:url';

import { defineConfig } from 'oxlint';

import lumen from '@ledgerhq/lumen-lint-plugin/oxlint';

const { jsPlugins, rules } = lumen.configs.strict;

// What a consumer writes to lint only some files: the glob is theirs.
export default defineConfig({
  jsPlugins,
  settings: {
    'better-tailwindcss': {
      entryPoint: fileURLToPath(new URL('./global.css', import.meta.url)),
    },
  },
  overrides: [{ files: ['**/*.web.{ts,tsx}'], rules }],
});
