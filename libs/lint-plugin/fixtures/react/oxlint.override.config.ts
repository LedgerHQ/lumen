import { fileURLToPath } from 'node:url';

import { defineConfig } from 'oxlint';

import { react } from '@ledgerhq/lumen-lint-plugin/oxlint';

// What a consumer writes with plain top-level `rules`.
export default defineConfig({
  extends: [
    react({
      entryPoint: fileURLToPath(new URL('../global.css', import.meta.url)),
    }),
  ],
  rules: {
    'shadcn/no-restyle': 'off',
    'shadcn/no-inline-styles': 'warn',
  },
});
