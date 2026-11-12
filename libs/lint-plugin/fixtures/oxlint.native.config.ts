import { defineConfig } from 'oxlint';

import lumen from '@ledgerhq/lumen-lint-plugin/oxlint';

// What a React Native consumer writes with `oxlint.config.ts`: no Tailwind.
export default defineConfig({
  extends: [lumen.configs['react-native-strict']],
});
