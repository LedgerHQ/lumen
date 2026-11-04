import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    include: ['src/**/*.test.js'],
    reporters: ['default'],
    // The conformance test spawns oxlint and warms up Tailwind.
    testTimeout: 60_000,
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8',
      reporter: ['lcov', 'json-summary'],
      // Count every file, not only the ones a test imports.
      include: ['src/**/*.js'],
      exclude: ['**/*.test.js'],
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 },
    },
  },
});
