import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    include: ['scripts/**/*.test.ts', 'cli/**/*.test.js'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8',
      reporter: ['lcov', 'json-summary'],
      include: ['scripts/**/*.ts', 'cli/**/*.js'],
      exclude: [
        '**/*.test.ts',
        '**/*.test.js',
        'cli/bin.js',
        'cli/fixtures.js',
      ],
      thresholds: { lines: 80, statements: 80, functions: 80, branches: 80 },
    },
  },
});
