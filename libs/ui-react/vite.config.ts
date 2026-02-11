/// <reference types='vitest' />
import * as path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/ui-react',
  plugins: [
    //tailwindcss(),
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
  ],
  resolve: {
    preserveSymlinks: false,
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        'lib/Symbols/index': path.resolve(
          __dirname,
          'src/lib/Symbols/index.ts',
        ),
      },
      name: '@ledgerhq/lumen-ui-react',
      fileName: (_format) => 'index.js',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es' as const],
    },
    rollupOptions: {
      treeshake: {
        preset: 'smallest',
      },
      // External packages that should not be bundled into your library.
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'class-variance-authority',
        'tailwind-merge',
        'clsx',
        '@radix-ui/react-checkbox',
        '@radix-ui/react-dialog',
        '@radix-ui/react-slot',
        '@radix-ui/react-switch',
        '@radix-ui/react-select',
        '@radix-ui/react-tooltip',
        '@radix-ui/react-dropdown-menu',
        '@tanstack/react-table',
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
    },
    setupFiles: ['./src/test-setup.ts'],
  },
}));
