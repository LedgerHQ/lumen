/// <reference types='vitest' />
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  root: resolve(__dirname),
  plugins: [react()],
  css: {
    postcss: resolve(__dirname, '../../postcss.config.js'),
  },
  build: {
    outDir: './dist/lottie',
    emptyOutDir: true,
    reportCompressedSize: true,
    minify: true,
    sourcemap: true,
    rollupOptions: {
      input: resolve(__dirname, 'lottie.html'),
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
      },
    },
  },
}));
