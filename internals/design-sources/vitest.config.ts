import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    // The DTCG check parses every source file with Terrazzo.
    testTimeout: 60_000,
    include: ['src/**/*.test.{ts,mts}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8',
      reporter: ['json-summary'],
      include: ['src/**/*.{ts,mts}'],
    },
  },
});
