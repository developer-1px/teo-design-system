import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import { debugPanel } from './vite-plugins/debug-panel/index';
import path from 'path';

export default defineConfig({
  plugins: [
    { enforce: 'pre', ...mdx({
      remarkPlugins: [remarkGfm, remarkFrontmatter],
    }) },
    react(),
    debugPanel(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
