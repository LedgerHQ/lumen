import { defineConfig } from 'oxlint';

import { reactNative } from '@ledgerhq/lumen-lint-plugin/oxlint';

export default defineConfig({
  extends: [reactNative()],
});
