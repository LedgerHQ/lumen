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
      reporter: ['lcov'],
    },
  },
});
