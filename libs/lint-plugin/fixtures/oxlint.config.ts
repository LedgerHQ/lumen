import { fileURLToPath } from 'node:url';

import { defineConfig } from 'oxlint';

import lumen from '@ledgerhq/lumen-lint-plugin/oxlint';

// What a consumer writes with `oxlint.config.ts`.
export default defineConfig({
  extends: [lumen.configs.strict],
  settings: {
    'better-tailwindcss': {
      entryPoint: fileURLToPath(new URL('./global.css', import.meta.url)),
    },
  },
});
