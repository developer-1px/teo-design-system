/**
 * Vite config for building debug panel client
 *
 * Usage: vite build --config vite-plugins/build-client.config.ts
 */

import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'debug-panel/client/index.ts'),
      formats: ['iife'],
      name: 'DebugPanel',
      fileName: () => 'client.js',
    },
    outDir: path.resolve(__dirname, 'debug-panel'),
    emptyOutDir: false,
    minify: false, // Keep readable for development
    rollupOptions: {
      output: {
        // Inline everything into single file
        inlineDynamicImports: true,
      },
    },
  },
});
