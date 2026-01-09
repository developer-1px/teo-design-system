/**
 * IDDL Inspector Client Entry Point
 *
 * React 컴포넌트 검사 도구
 * - Cmd+D: Inspect 모드 활성화
 * - Hover: 요소 outline 표시
 * - Click: 컴포넌트 계층구조 표시
 */

import { setupKeyboardHandler } from './keyboard';

// 키보드 핸들러 초기화
setupKeyboardHandler();

console.log('[IDDL Inspector] Ready. Press Cmd+D (Mac) or Ctrl+D (Win) to start inspecting.');
