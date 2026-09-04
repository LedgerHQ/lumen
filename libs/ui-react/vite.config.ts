/// <reference types='vitest' />
import * as path from 'path';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const registerVisualizer = () => {
  const isAnalyze = process.env['ANALYZE'] === 'true';
  if (!isAnalyze) {
    return undefined;
  }

  return visualizer({
    filename: path.join(__dirname, 'dist/bundle-stats.html'),
    open: true,
    gzipSize: true,
    brotliSize: true,
  });
};

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/libs/ui-react',
  plugins: [
    react(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
    registerVisualizer(),
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
        'lib/Components/symbols/index': path.resolve(
          __dirname,
          'src/lib/Components/symbols/index.ts',
        ),
        // Charts are exposed only at `@ledgerhq/lumen-ui-react/visualization`
        // and never re-exported from src/index.ts. Rollup emits JS only for
        // modules reachable from a declared entry, so without this line the
        // subpath would ship declarations with no runtime and no Tailwind
        // classes to scan — typechecking green, 404 at import.
        'lib/Components/visualization/index': path.resolve(
          __dirname,
          'src/lib/Components/visualization/index.ts',
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
        '@radix-ui/react-tooltip',
        '@tanstack/react-table',
        '@base-ui/react',
        /^d3-/,
        'internmap',
        // Tripwires: nothing inside this package may import it by name. A
        // leftover self-import would otherwise resolve through the workspace
        // symlink and inline a second copy of the library.
        '@ledgerhq/lumen-ui-react',
        '@ledgerhq/lumen-ui-react/symbols',
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
