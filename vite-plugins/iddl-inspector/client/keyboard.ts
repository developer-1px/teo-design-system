/**
 * IDDL Inspector Keyboard Handler
 *
 * Cmd+D: 필터 레벨 순환 (Page → Section → Group → Atom → All) + 패널 표시
 * ESC: 패널 닫기
 */

import { cycleFilterLevel, getCurrentFilterLevel } from './filter-state';
import { clearAllHighlights, clearSelection, highlightAllComponents } from './multi-highlighter';
import { hidePanel, isPanelVisible, showPanel, updatePanelContent } from './persistent-panel';

/**
 * 키보드 이벤트 리스너 등록
 */
export function setupKeyboardHandler(): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Cmd (Mac) 또는 Ctrl (Windows/Linux)
    const isMac = /Mac/i.test(navigator.platform);
    const modKey = isMac ? e.metaKey : e.ctrlKey;

    // ESC: Panel 닫기
    if (e.key === 'Escape' && isPanelVisible()) {
      e.preventDefault();
      hidePanel();
      clearAllHighlights();
      return;
    }

    // Cmd+D: 필터 레벨 순환 + Panel 표시
    if (modKey && e.key === 'd') {
      e.preventDefault();
      handleFilterCycle();
    }
  });
}

/**
 * 필터 레벨 순환 처리
 */
function handleFilterCycle(): void {
  // 패널이 보이지 않으면 표시
  if (!isPanelVisible()) {
    showPanel();
  }

  // 다음 필터 레벨로 순환
  const newLevel = cycleFilterLevel();

  console.log(`[IDDL Inspector] Filter level changed to: ${newLevel}`);

  // 하이라이트 업데이트
  const components = highlightAllComponents();

  // 패널 내용 업데이트
  updatePanelContent(components);
}
