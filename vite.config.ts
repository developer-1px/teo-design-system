import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { debugPanel } from './vite-plugins/debug-panel/index';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    debugPanel(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
