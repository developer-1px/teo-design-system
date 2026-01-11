/**
 * useRovingFocus - 로빙 포커스 (툴바, 메뉴, 탭)
 *
 * 화살표 키로 포커스를 이동할 수 있는 컴포넌트 그룹을 관리합니다.
 * 한 번에 하나의 요소만 tab 순서에 포함됩니다 (tabindex=0, 나머지는 -1).
 * @see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
 */

import { useCallback, useRef, useState } from 'react';

export type Orientation = 'horizontal' | 'vertical' | 'both';

export interface UseRovingFocusOptions {
  /** 포커스 이동 방향 */
  orientation?: Orientation;
  /** 순환 이동 여부 (마지막 → 첫 번째) */
  loop?: boolean;
  /** 초기 포커스 인덱스 */
  defaultIndex?: number;
}

export interface UseRovingFocusReturn {
  /** 현재 포커스된 인덱스 */
  focusedIndex: number;
  /** 특정 인덱스로 포커스 이동 */
  setFocusedIndex: (index: number) => void;
  /** 아이템에 적용할 props를 반환하는 함수 */
  getItemProps: (index: number) => {
    tabIndex: number;
    onKeyDown: (_event: React.KeyboardEvent) => void;
    onFocus: () => void;
    ref: React.RefCallback<HTMLElement>;
  };
}

/**
 * @example
 * const { focusedIndex, getItemProps } = useRovingFocus({
 *   orientation: 'horizontal',
 *   loop: true,
 * });
 *
 * {items.map((item, index) => (
 *   <button key={index} {...getItemProps(index)}>
 *     {item}
 *   </button>
 * ))}
 */
export function useRovingFocus(options: UseRovingFocusOptions = {}): UseRovingFocusReturn {
  const { orientation = 'horizontal', loop = true, defaultIndex = 0 } = options;
  const [focusedIndex, setFocusedIndex] = useState(defaultIndex);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const getItemProps = useCallback(
    (index: number) => {
      const handleKeyDown = (_event: React.KeyboardEvent) => {
        // TODO: 구현 필요
        // - ArrowRight/ArrowDown: 다음 아이템
        // - ArrowLeft/ArrowUp: 이전 아이템
        // - Home: 첫 번째 아이템
        // - End: 마지막 아이템
        // - orientation에 따라 적절한 키만 처리
      };

      const handleFocus = () => {
        setFocusedIndex(index);
      };

      const ref = (element: HTMLElement | null) => {
        if (element) {
          itemRefs.current.set(index, element);
        } else {
          itemRefs.current.delete(index);
        }
      };

      return {
        tabIndex: index === focusedIndex ? 0 : -1,
        onKeyDown: handleKeyDown,
        onFocus: handleFocus,
        ref,
      };
    },
    [focusedIndex]
  );

  return {
    focusedIndex,
    setFocusedIndex,
    getItemProps,
  };
}
