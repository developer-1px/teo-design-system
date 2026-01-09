import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { iddlInspector } from './vite-plugins/iddl-inspector/index';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    iddlInspector(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
