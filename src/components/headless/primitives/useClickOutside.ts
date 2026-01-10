/**
 * useClickOutside - 영역 외부 클릭 감지 (드롭다운, 팝오버)
 *
 * 특정 요소 외부를 클릭했을 때 콜백을 실행합니다.
 * @see docs/1-project/4-headless-hook.md
 */

import { useEffect, useRef } from 'react';

export interface UseClickOutsideOptions {
  /** 외부 클릭 시 실행할 콜백 */
  onClickOutside: (event: MouseEvent | TouchEvent) => void;
  /** 이벤트 리스너 활성화 여부 */
  enabled?: boolean;
}

/**
 * @example
 * const ref = useClickOutside({
 *   onClickOutside: () => setIsOpen(false),
 *   enabled: isOpen,
 * });
 *
 * <div ref={ref}>
 *   Dropdown content
 * </div>
 */
export function useClickOutside<T extends HTMLElement>(
  options: UseClickOutsideOptions
): React.RefObject<T | null> {
  const { onClickOutside, enabled = true } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (!ref.current) return;

      const target = event.target as Node;
      if (!ref.current.contains(target)) {
        onClickOutside(event);
      }
    };

    // mousedown이 더 빠르게 반응
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [onClickOutside, enabled]);

  return ref;
}
