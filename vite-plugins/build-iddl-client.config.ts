import { resolve } from 'path';
import { defineConfig } from 'vite';

/**
 * IDDL Inspector 클라이언트 빌드 설정
 */
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'iddl-inspector/client/index.ts'),
      formats: ['iife'],
      name: 'IDDLInspector',
      fileName: () => 'client.js',
    },
    outDir: resolve(__dirname, 'iddl-inspector'),
    emptyOutDir: false,
    minify: false,
    rollupOptions: {
      output: {
        // IIFE로 번들링 (self-contained)
        format: 'iife',
        // 모든 것을 하나의 파일로
        inlineDynamicImports: true,
      },
    },
  },
});
