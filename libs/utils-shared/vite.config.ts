import { join } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { LibraryFormats } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/utils-shared',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  build: {
    lib: {
      entry: join(__dirname, 'src/index.ts'),
      name: 'utils-shared',
      fileName: 'index',
      formats: ['es' as LibraryFormats],
    },
    rollupOptions: {
      external: ['clsx', 'tailwind-merge', 'react', 'react/jsx-runtime'],
    },
  },
  test: {
    watch: false,
    globals: true,
    silent: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      reporter: ['lcov'],
    },
  },
}));
