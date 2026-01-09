/**
 * IDDL Inspector Keyboard Handler
 *
 * Cmd+D (Mac) / Ctrl+D (Windows)로 Inspector 토글
 */

import { toggleInspector } from './ui';

/**
 * 키보드 이벤트 리스너 등록
 */
export function setupKeyboardHandler(): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Cmd+D (Mac) 또는 Ctrl+D (Windows/Linux)
    const isMac = /Mac/i.test(navigator.platform);
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    if (modKey && e.key === 'd') {
      e.preventDefault();
      toggleInspector();
    }
  });
}
