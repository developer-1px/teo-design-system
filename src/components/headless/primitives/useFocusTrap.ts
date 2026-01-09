/**
 * useFocusTrap - 포커스 트랩 (모달, 다이얼로그)
 *
 * 특정 영역 내에서만 포커스 이동을 제한합니다.
 * Tab/Shift+Tab 키를 눌러도 해당 영역을 벗어나지 않습니다.
 * @see docs/1-project/4-headless-hook.md
 */

import { useEffect, useRef } from 'react';

export interface UseFocusTrapOptions {
  /** 포커스 트랩 활성화 여부 */
  enabled?: boolean;
  /** 초기 포커스 요소 셀렉터 */
  initialFocus?: string;
  /** 포커스 복원 여부 (트랩 해제 시 이전 요소로 복원) */
  restoreFocus?: boolean;
}

/**
 * @example
 * const trapRef = useFocusTrap({ enabled: isOpen });
 *
 * <div ref={trapRef}>
 *   <input />
 *   <button>Close</button>
 * </div>
 */
export function useFocusTrap<T extends HTMLElement>(
  options: UseFocusTrapOptions = {}
): React.RefObject<T> {
  const { enabled = true, initialFocus, restoreFocus = true } = options;
  const ref = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const container = ref.current;
    previousActiveElement.current = document.activeElement as HTMLElement;

    // TODO: 구현 필요
    // 1. 초기 포커스 설정
    // 2. Tab/Shift+Tab 이벤트 리스너 추가
    // 3. 포커스 가능한 요소 목록 추적
    // 4. 경계에서 순환 처리

    return () => {
      // 포커스 복원
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, initialFocus, restoreFocus]);

  return ref;
}
