/**
 * IDDL Inspector Client Entry Point
 *
 * React 컴포넌트 검사 도구:
 * - Cmd+D: 필터 레벨 순환 + 패널 표시 (Page → Section → Group → Atom → All)
 * - ESC: 패널 닫기
 */

import { setupKeyboardHandler } from './keyboard';
import { initPersistentPanel } from './persistent-panel';

// DOM 로드 완료 후 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init(): void {
  // 키보드 핸들러 초기화
  setupKeyboardHandler();

  // 패널 이벤트 리스너 초기화
  initPersistentPanel();

  console.log('[IDDL Inspector] Ready.');
  console.log('  - Cmd+D: Show Inspector & Cycle Filter Level');
  console.log('  - ESC: Hide Inspector');
}
