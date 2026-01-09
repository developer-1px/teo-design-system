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
    top: 10%;
    left: 10%;
    width: 80vw;
    max-width: 1200px;
    height: 80vh;
    z-index: 999999;
    padding: 0;
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    background: #1e1e1e;
  `;

  // Header (draggable)
  const header = document.createElement('div');
  header.style.cssText = `
    padding: 12px 16px;
    background: #2d2d2d;
    border-bottom: 1px solid #404040;
    border-radius: 8px 8px 0 0;
    cursor: move;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  // Title
  const title = document.createElement('span');
  title.textContent = 'IDDL Inspector (Cmd+D to toggle)';
  title.style.cssText = `
    color: #d4d4d4;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 13px;
    font-weight: 600;
  `;

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.cssText = `
    background: transparent;
    border: none;
    color: #858585;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s, color 0.2s;
  `;
  closeBtn.onmouseover = () => {
    closeBtn.style.background = '#404040';
    closeBtn.style.color = '#ffffff';
  };
  closeBtn.onmouseout = () => {
    closeBtn.style.background = 'transparent';
    closeBtn.style.color = '#858585';
  };
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    hideInspector();
  };

  header.appendChild(title);
  header.appendChild(closeBtn);

  // Drag functionality
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialLeft = 0;
  let initialTop = 0;

  header.onmousedown = (e) => {
    if (e.target === closeBtn) return;

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const rect = div.getBoundingClientRect();
    initialLeft = rect.left;
    initialTop = rect.top;

    header.style.cursor = 'grabbing';
  };

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    div.style.left = `${initialLeft + deltaX}px`;
    div.style.top = `${initialTop + deltaY}px`;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = 'move';
    }
  });

  // Textarea
  const ta = document.createElement('textarea');
  ta.readOnly = true;
  ta.spellcheck = false;
  ta.style.cssText = `
    width: 100%;
    flex: 1;
    padding: 16px;
    font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    background: #1e1e1e;
    color: #d4d4d4;
    border: none;
    border-radius: 0 0 8px 8px;
    outline: none;
    resize: none;
  `;

  // 클릭 시 전체 선택
  ta.onclick = () => {
    ta.select();
  };

  // 포커스 시 전체 선택
  ta.onfocus = () => {
    ta.select();
  };

  div.appendChild(header);
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

  // 디버깅 로그
  console.log('[IDDL Inspector] JSX Result:', jsx);
  console.log('[IDDL Inspector] JSX Length:', jsx.length);

  if (textarea) {
    // Fallback 메시지
    if (!jsx || jsx.trim() === '') {
      textarea.value = '// IDDL Inspector: No React components found\n// Check browser console for details';
    } else {
      textarea.value = jsx;
    }
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
