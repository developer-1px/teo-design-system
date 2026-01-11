import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { iddlInspector } from './vite-plugins/iddl-inspector/index';

export default defineConfig({
  plugins: [react(), iddlInspector()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
