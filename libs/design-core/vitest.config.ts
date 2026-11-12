import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    include: ['src/**/*.test.{ts,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      reporter: ['lcov', 'json-summary'],
      // Count every file, not only the ones a test imports.
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.{ts,tsx}', '**/testing/**'],
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 },
    },
  },
});
