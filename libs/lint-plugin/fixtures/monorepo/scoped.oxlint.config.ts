import { fileURLToPath } from 'node:url';

import { defineConfig } from 'oxlint';

import { react, reactNative } from '@ledgerhq/lumen-lint-plugin/oxlint';

export default defineConfig({
  extends: [
    react({
      entryPoint: fileURLToPath(new URL('../global.css', import.meta.url)),
      preset: 'strict',
      files: ['**/*.web.{ts,tsx}'],
    }),
    reactNative({ preset: 'strict', files: ['**/*.native.{ts,tsx}'] }),
  ],
});
