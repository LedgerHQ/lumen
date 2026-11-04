import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watch: false,
    include: ['scripts/**/*.test.ts'],
    reporters: ['default'],
  },
});
