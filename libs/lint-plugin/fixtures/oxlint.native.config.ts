import { defineConfig } from 'oxlint';

import lumen from '@ledgerhq/lumen-lint-plugin/oxlint';

export default defineConfig({
  extends: [lumen.configs.reactnative.strict],
});
