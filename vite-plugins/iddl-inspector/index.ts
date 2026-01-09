import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Plugin } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * IDDL Inspector Vite Plugin
 *
 * React 컴포넌트 트리를 JSX 형식으로 표시하는 간단한 개발 도구
 *
 * 사용법:
 * - Cmd+D (Mac) / Ctrl+D (Windows)로 inspector 토글
 * - 화면 중앙에 textarea로 전체 React 트리 구조 표시
 * - ESC나 Cmd+D로 닫기
 */
export function iddlInspector(): Plugin {
  let root = '';
  let base = '';
  let isServe = false;
  let clientCode: string | undefined;

  return {
    name: 'vite-plugin-iddl-inspector',

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
          children: 'import "/@id/__x00__vite-plugin-iddl-inspector/client";',
        },
      ];
    },

    // Virtual module 등록
    resolveId: {
      order: 'pre',
      filter: { id: /^vite-plugin-iddl-inspector\/client$/u },
      handler(source) {
        return '\0' + source;
      },
    },

    // Virtual module 로드
    load: {
      filter: { id: /^\0vite-plugin-iddl-inspector\/client$/u },
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
