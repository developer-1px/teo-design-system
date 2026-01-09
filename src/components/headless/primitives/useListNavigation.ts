/**
 * useListNavigation - 리스트 키보드 내비게이션 (listbox, tree, menu)
 *
 * 리스트 형태의 컴포넌트에서 화살표 키 내비게이션을 제공합니다.
 * useRovingFocus와 유사하지만 리스트 특화 기능 추가:
 * - Type-ahead 검색
 * - 선택 상태 관리
 * - 다중 선택 지원
 * @see docs/1-project/4-headless-hook.md
 */

import { useCallback, useRef, useState } from 'react';

export interface UseListNavigationOptions {
  /** 아이템 개수 */
  itemCount: number;
  /** 순환 이동 여부 */
  loop?: boolean;
  /** 다중 선택 허용 여부 */
  multiSelect?: boolean;
  /** 선택 변경 콜백 */
  onSelectionChange?: (selectedIndices: number[]) => void;
}

export interface UseListNavigationReturn {
  /** 현재 포커스된 인덱스 */
  activeIndex: number;
  /** 선택된 인덱스들 */
  selectedIndices: number[];
  /** 다음 아이템으로 이동 */
  moveNext: () => void;
  /** 이전 아이템으로 이동 */
  movePrevious: () => void;
  /** 첫 번째 아이템으로 이동 */
  moveFirst: () => void;
  /** 마지막 아이템으로 이동 */
  moveLast: () => void;
  /** 아이템 선택/해제 */
  toggleSelection: (index: number) => void;
  /** 아이템에 적용할 props */
  getItemProps: (index: number) => {
    tabIndex: number;
    'aria-selected': boolean;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onClick: () => void;
  };
}

/**
 * @example
 * const { activeIndex, selectedIndices, getItemProps } = useListNavigation({
 *   itemCount: items.length,
 *   loop: true,
 *   multiSelect: true,
 * });
 *
 * {items.map((item, index) => (
 *   <div key={index} {...getItemProps(index)}>
 *     {item}
 *   </div>
 * ))}
 */
export function useListNavigation(options: UseListNavigationOptions): UseListNavigationReturn {
  const { itemCount, loop = true, multiSelect = false, onSelectionChange } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const moveNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev >= itemCount - 1) {
        return loop ? 0 : prev;
      }
      return prev + 1;
    });
  }, [itemCount, loop]);

  const movePrevious = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev <= 0) {
        return loop ? itemCount - 1 : prev;
      }
      return prev - 1;
    });
  }, [itemCount, loop]);

  const moveFirst = useCallback(() => {
    setActiveIndex(0);
  }, []);

  const moveLast = useCallback(() => {
    setActiveIndex(itemCount - 1);
  }, [itemCount]);

  const toggleSelection = useCallback(
    (index: number) => {
      setSelectedIndices((prev) => {
        const newSelection = multiSelect
          ? prev.includes(index)
            ? prev.filter((i) => i !== index)
            : [...prev, index]
          : [index];

        onSelectionChange?.(newSelection);
        return newSelection;
      });
    },
    [multiSelect, onSelectionChange]
  );

  const getItemProps = useCallback(
    (index: number) => {
      const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            moveNext();
            break;
          case 'ArrowUp':
            event.preventDefault();
            movePrevious();
            break;
          case 'Home':
            event.preventDefault();
            moveFirst();
            break;
          case 'End':
            event.preventDefault();
            moveLast();
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            toggleSelection(index);
            break;
        }
      };

      const handleClick = () => {
        setActiveIndex(index);
        toggleSelection(index);
      };

      return {
        tabIndex: index === activeIndex ? 0 : -1,
        'aria-selected': selectedIndices.includes(index),
        onKeyDown: handleKeyDown,
        onClick: handleClick,
      };
    },
    [activeIndex, selectedIndices, moveNext, movePrevious, moveFirst, moveLast, toggleSelection]
  );

  return {
    activeIndex,
    selectedIndices,
    moveNext,
    movePrevious,
    moveFirst,
    moveLast,
    toggleSelection,
    getItemProps,
  };
}
