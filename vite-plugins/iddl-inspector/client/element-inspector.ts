/**
 * IDDL Inspector - Element Inspector
 *
 * Inspect 모드 메인 컨트롤러
 * - Cmd+D: Inspect 모드 활성화
 * - Hover: 요소 outline 표시
 * - Click: 컴포넌트 계층구조 표시
 * - ESC: Inspect 모드 종료
 */

import { activateInspectMode, deactivateInspectMode, isInspectModeActive } from './overlay';
import { extractComponentHierarchy } from './component-hierarchy';
import { showPanel, hidePanel, isPanelVisible } from './component-panel';

let clickHandler: ((e: MouseEvent) => void) | null = null;
let mouseDownHandler: ((e: MouseEvent) => void) | null = null;
let mouseUpHandler: ((e: MouseEvent) => void) | null = null;
let escapeHandler: ((e: KeyboardEvent) => void) | null = null;

/**
 * Inspect 모드 활성화
 */
export function enableInspectMode(): void {
  if (isInspectModeActive()) return;

  console.log('[Element Inspector] Inspect mode enabled');

  // Overlay 활성화 (hover outline)
  activateInspectMode();

  // 원본 요소의 모든 클릭 이벤트 차단
  const shouldBlockEvent = (target: HTMLElement): boolean => {
    // Inspector UI 자체는 허용
    return !(
      target.id === 'iddl-inspector-overlay' ||
      target.id === 'iddl-inspector-tag' ||
      target.id === 'iddl-inspector-panel' ||
      target.closest('#iddl-inspector-panel')
    );
  };

  // mousedown 차단 (드래그 시작 방지)
  mouseDownHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (shouldBlockEvent(target)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  };

  // mouseup 차단 (드래그 종료 방지)
  mouseUpHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (shouldBlockEvent(target)) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  };

  // Click 이벤트 등록
  clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    // Inspector UI 자체는 제외
    if (!shouldBlockEvent(target)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    // 컴포넌트 계층구조 추출
    const hierarchy = extractComponentHierarchy(target);

    console.log('[Element Inspector] Component hierarchy:', hierarchy);

    if (hierarchy.length > 0) {
      // 클릭한 요소의 위치
      const rect = target.getBoundingClientRect();

      // Panel 표시
      showPanel(hierarchy, rect);
    } else {
      console.warn('[Element Inspector] No React components found at this element');
    }
  };

  document.addEventListener('mousedown', mouseDownHandler, true);
  document.addEventListener('mouseup', mouseUpHandler, true);
  document.addEventListener('click', clickHandler, true);

  // ESC 키로 종료
  escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      disableInspectMode();
    }
  };

  document.addEventListener('keydown', escapeHandler);
}

/**
 * Inspect 모드 비활성화
 */
export function disableInspectMode(): void {
  if (!isInspectModeActive()) return;

  console.log('[Element Inspector] Inspect mode disabled');

  // Overlay 비활성화
  deactivateInspectMode();

  // Panel 숨기기
  hidePanel();

  // 이벤트 리스너 제거
  if (mouseDownHandler) {
    document.removeEventListener('mousedown', mouseDownHandler, true);
    mouseDownHandler = null;
  }

  if (mouseUpHandler) {
    document.removeEventListener('mouseup', mouseUpHandler, true);
    mouseUpHandler = null;
  }

  if (clickHandler) {
    document.removeEventListener('click', clickHandler, true);
    clickHandler = null;
  }

  if (escapeHandler) {
    document.removeEventListener('keydown', escapeHandler);
    escapeHandler = null;
  }
}

/**
 * Inspect 모드 토글
 */
export function toggleInspectMode(): void {
  if (isInspectModeActive()) {
    disableInspectMode();
  } else {
    enableInspectMode();
  }
}

/**
 * Inspect 모드 활성 상태 확인
 */
export function isInspectMode(): boolean {
  return isInspectModeActive();
}
