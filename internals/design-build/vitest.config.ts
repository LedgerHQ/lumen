import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    // Each test builds real outputs (every mode, svgr per icon): seconds
    // locally, much more on CI runners with coverage on.
    testTimeout: 120_000,
    hookTimeout: 120_000,
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
