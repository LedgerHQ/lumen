/// <reference types='vitest' />
import * as path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/ui-react-visualization',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  resolve: {
    preserveSymlinks: false,
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: '@ledgerhq/lumen-ui-react-visualization',
      fileName: (_format) => 'index.js',
      formats: ['es' as const],
    },
    rollupOptions: {
      treeshake: {
        preset: 'smallest',
      },
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        '@ledgerhq/lumen-design-core',
        '@ledgerhq/lumen-ui-react',
        '@ledgerhq/lumen-utils-shared',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'd3-array',
        'd3-scale',
        'd3-shape',
      ],
      preserveEntrySignatures: 'strict' as const,
      output: {
        preserveModules: true,
        preserveModulesRoot: path.resolve(__dirname, 'src'),
        entryFileNames: '[name].js',
      },
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      reporter: ['lcov'],
    },
    setupFiles: ['./src/test-setup.ts'],
  },
}));
