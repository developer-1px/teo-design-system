/**
 * IDDL Inspector UI - Central Textarea Display
 *
 * 화면 중앙에 textarea를 표시하여 React 트리 구조를 보여줌
 */

import { inspectReactTree } from './inspector';

let isVisible = false;
let container: HTMLElement | null = null;
let textarea: HTMLTextAreaElement | null = null;

/**
 * Inspector UI 생성
 */
function createUI(): HTMLElement {
  // Container
  const div = document.createElement('div');
  div.id = 'iddl-inspector';
  div.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    max-width: 1200px;
    height: 80vh;
    z-index: 999999;
    padding: 0;
  `;

  // Textarea
  const ta = document.createElement('textarea');
  ta.readOnly = true;
  ta.spellcheck = false;
  ta.style.cssText = `
    width: 100%;
    height: 100%;
    padding: 16px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    background: #1e1e1e;
    color: #d4d4d4;
    border: 1px solid #404040;
    border-radius: 8px;
    outline: none;
    resize: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  `;

  div.appendChild(ta);
  textarea = ta;

  return div;
}

/**
 * Inspector 표시
 */
export function showInspector(): void {
  if (isVisible) return;

  // UI 생성
  if (!container) {
    container = createUI();
    document.body.appendChild(container);
  }

  // React 트리 추출
  const jsx = inspectReactTree();

  if (textarea) {
    textarea.value = jsx;
  }

  isVisible = true;

  // ESC 키로 닫기
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      hideInspector();
      document.removeEventListener('keydown', handleEscape);
    }
  };

  document.addEventListener('keydown', handleEscape);
}

/**
 * Inspector 숨기기
 */
export function hideInspector(): void {
  if (!isVisible || !container) return;

  container.remove();
  container = null;
  textarea = null;
  isVisible = false;
}

/**
 * Inspector 토글
 */
export function toggleInspector(): void {
  if (isVisible) {
    hideInspector();
  } else {
    showInspector();
  }
}

/**
 * 현재 표시 상태 확인
 */
export function isInspectorVisible(): boolean {
  return isVisible;
}
