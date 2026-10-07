import { fileURLToPath } from 'node:url';

import { defineConfig } from 'oxlint';

import lumen from '@ledgerhq/lumen-lint-plugin/oxlint';

export default defineConfig({
  extends: [lumen.configs.recommended],
  settings: {
    'better-tailwindcss': {
      entryPoint: fileURLToPath(new URL('../global.css', import.meta.url)),
    },
  },
});
