/**
 * IDDL Inspector Client Entry Point
 *
 * React 트리 구조를 JSX 형식으로 표시하는 개발 도구
 * Cmd+D로 토글
 */

import { setupKeyboardHandler } from './keyboard';

// 키보드 핸들러 초기화
setupKeyboardHandler();

console.log('[IDDL Inspector] Ready. Press Cmd+D (Mac) or Ctrl+D (Win) to inspect React tree.');
