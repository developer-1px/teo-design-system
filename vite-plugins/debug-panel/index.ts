import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Debug Panel Vite Plugin
 *
 * 디버그 모드에서 React 컴포넌트를 클릭하여 정보를 표시하는 플러그인
 *
 * 사용법:
 * - Cmd+D (Mac) / Ctrl+D (Windows)로 디버그 모드 토글
 * - 디버그 모드에서 요소에 hover하면 outline 표시
 * - 클릭하면 컴포넌트 계층 패널 표시
 */
export function debugPanel(): Plugin {
  let root = '';
  let base = '';
  let isServe = false;
  let clientCode: string | undefined;

  return {
    name: 'vite-plugin-debug-panel',

    configResolved(config) {
      root = config.root;
      base = config.base;
      isServe = config.command === 'serve';
    },

    // React 19용 _debugSource 주입 (파일 경로 정보를 위해)
    transform: {
      filter: { id: /jsx-dev-runtime\.js/u },
      handler(code) {
        if (!isServe) return;
        if (code.includes('_source')) return;

        const defineIndex = code.indexOf('"_debugInfo"');
        if (defineIndex === -1) return;

        const valueIndex = code.indexOf('value: null', defineIndex);
        if (valueIndex === -1) return;

        let newCode =
          code.slice(0, valueIndex) + 'value: source' + code.slice(valueIndex + 11);

        if (code.includes('function ReactElement(type, key, self, source,')) {
          return newCode;
        }

        newCode = newCode.replaceAll(
          /maybeKey,\s*isStaticChildren/gu,
          'maybeKey, isStaticChildren, source'
        );

        newCode = newCode.replaceAll(
          /(\w+)?,\s*debugStack,\s*debugTask/gu,
          (m, previousArg) => {
            if (previousArg === 'source') return m;
            return m.replace('debugTask', 'debugTask, source');
          }
        );

        return newCode;
      },
    },

    // HTML에 클라이언트 스크립트 주입
    transformIndexHtml() {
      if (!isServe) return;
      return [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: 'import "/@id/__x00__vite-plugin-debug-panel/client";',
        },
      ];
    },

    // Virtual module 등록
    resolveId: {
      order: 'pre',
      filter: { id: /^vite-plugin-debug-panel\/client$/u },
      handler(source) {
        return '\0' + source;
      },
    },

    // Virtual module 로드
    load: {
      filter: { id: /^\0vite-plugin-debug-panel\/client$/u },
      handler() {
        if (!isServe) return '';

        if (!clientCode) {
          clientCode = readFileSync(join(__dirname, 'client.js'), 'utf-8');
        }

        // root와 base를 클라이언트 코드에 주입
        return clientCode.replace('__ROOT__', root).replace('__BASE__', base);
      },
    },
  };
}
