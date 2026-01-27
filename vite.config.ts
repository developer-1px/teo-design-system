import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import mdx from '@mdx-js/rollup';

import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import remarkGfm from 'remark-gfm';


import { inspectorPlugin } from './vite-plugins/inspector';
import inspectorBabelPlugin from './vite-plugins/babel-inspector';

// https://vitejs.dev/config/
export default defineConfig(async (): Promise<UserConfig> => {
  const rehypeHighlight = (await import('rehype-highlight')).default;

  return {
    plugins: [
      inspectorPlugin(),
      {
        enforce: 'pre',
        ...mdx({
          providerImportSource: "@mdx-js/react",
          remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkGfm],
          rehypePlugins: [rehypeHighlight]
        })
      },
      react({
        babel: {
          plugins: [inspectorBabelPlugin]
        }
      }),
      vanillaExtractPlugin()
    ],

  }
})
