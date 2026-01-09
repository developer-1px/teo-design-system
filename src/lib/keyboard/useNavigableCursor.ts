/**
 * useNavigableCursor - 리스트/트리/테이블 키보드 네비게이션 훅
 *
 * Arrow 키로 커서 이동, Enter로 선택 등 통합 처리
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { NavigationOptions, CursorPosition } from './types';

interface UseNavigableCursorReturn<T> {
  /** 현재 커서 인덱스 */
  cursorIndex: number;
  /** 현재 커서 위치 (테이블/그리드용) */
  cursorPosition: CursorPosition;
  /** 현재 선택된 아이템 */
  currentItem: T | null;
  /** 다음 아이템으로 이동 */
  moveNext: () => void;
  /** 이전 아이템으로 이동 */
  movePrevious: () => void;
  /** 처음으로 이동 */
  moveFirst: () => void;
  /** 마지막으로 이동 */
  moveLast: () => void;
  /** 특정 인덱스로 이동 */
  moveTo: (index: number) => void;
  /** 현재 아이템 선택 */
  selectCurrent: () => void;
  /** 아이템별 props (리스트 렌더링용) */
  getItemProps: (index: number) => {
    'data-cursor': boolean;
    'data-index': number;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onClick: () => void;
  };
}

/**
 * 키보드 네비게이션 훅
 *
 * @example
 * ```tsx
 * const { cursorIndex, getItemProps } = useNavigableCursor({
 *   type: 'list',
 *   items: users,
 *   onSelect: (user) => console.log(user)
 * });
 *
 * return users.map((user, index) => (
 *   <div {...getItemProps(index)}>
 *     {user.name}
 *   </div>
 * ));
 * ```
 */
export const useNavigableCursor = <T,>(
  options: NavigationOptions<T>
): UseNavigableCursorReturn<T> => {
  const {
    type,
    items,
    orientation = 'vertical',
    loop = true,
    onSelect,
    initialIndex = 0,
    enabled = true,
  } = options;

  const [cursorIndex, setCursorIndex] = useState(initialIndex);
  const cursorPosition: CursorPosition = {
    index: cursorIndex,
    row: 0,
    col: 0,
  };

  // 범위 체크
  const clampIndex = useCallback(
    (index: number): number => {
      if (items.length === 0) return -1;
      if (loop) {
        return ((index % items.length) + items.length) % items.length;
      }
      return Math.max(0, Math.min(index, items.length - 1));
    },
    [items.length, loop]
  );

  // 다음 아이템
  const moveNext = useCallback(() => {
    if (!enabled || items.length === 0) return;
    setCursorIndex((prev) => clampIndex(prev + 1));
  }, [enabled, items.length, clampIndex]);

  // 이전 아이템
  const movePrevious = useCallback(() => {
    if (!enabled || items.length === 0) return;
    setCursorIndex((prev) => clampIndex(prev - 1));
  }, [enabled, items.length, clampIndex]);

  // 처음으로
  const moveFirst = useCallback(() => {
    if (!enabled || items.length === 0) return;
    setCursorIndex(0);
  }, [enabled, items.length]);

  // 마지막으로
  const moveLast = useCallback(() => {
    if (!enabled || items.length === 0) return;
    setCursorIndex(items.length - 1);
  }, [enabled, items.length]);

  // 특정 인덱스로
  const moveTo = useCallback(
    (index: number) => {
      if (!enabled || items.length === 0) return;
      setCursorIndex(clampIndex(index));
    },
    [enabled, items.length, clampIndex]
  );

  // 현재 아이템 선택
  const selectCurrent = useCallback(() => {
    if (!enabled || cursorIndex < 0 || cursorIndex >= items.length) return;
    const item = items[cursorIndex];
    if (item && onSelect) {
      onSelect(item, cursorIndex);
    }
  }, [enabled, cursorIndex, items, onSelect]);

  // 현재 아이템
  const currentItem = useMemo(() => {
    if (cursorIndex < 0 || cursorIndex >= items.length) return null;
    return items[cursorIndex];
  }, [cursorIndex, items]);

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled) return;

      // 네비게이션 타입별 키 매핑
      switch (type) {
        case 'list':
          if (orientation === 'vertical') {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              moveNext();
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              movePrevious();
            }
          } else {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              moveNext();
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              movePrevious();
            }
          }
          break;

        case 'tree':
          // 트리는 별도 구현 필요 (접기/펼치기)
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveNext();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            movePrevious();
          }
          break;

        case 'table':
        case 'grid':
          // 테이블/그리드는 2D 네비게이션
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            moveNext();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            movePrevious();
          }
          break;
      }

      // 공통 키
      if (e.key === 'Home') {
        e.preventDefault();
        moveFirst();
      } else if (e.key === 'End') {
        e.preventDefault();
        moveLast();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectCurrent();
      }
    },
    [enabled, type, orientation, moveNext, movePrevious, moveFirst, moveLast, selectCurrent]
  );

  // 아이템별 props
  const getItemProps = useCallback(
    (index: number) => ({
      'data-cursor': index === cursorIndex,
      'data-index': index,
      tabIndex: index === cursorIndex ? 0 : -1,
      onKeyDown: handleKeyDown,
      onClick: () => {
        moveTo(index);
        selectCurrent();
      },
    }),
    [cursorIndex, handleKeyDown, moveTo, selectCurrent]
  );

  // 아이템 변경 시 커서 초기화
  useEffect(() => {
    if (items.length === 0) {
      setCursorIndex(-1);
    } else if (cursorIndex >= items.length) {
      setCursorIndex(items.length - 1);
    }
  }, [items.length, cursorIndex]);

  return {
    cursorIndex,
    cursorPosition,
    currentItem,
    moveNext,
    movePrevious,
    moveFirst,
    moveLast,
    moveTo,
    selectCurrent,
    getItemProps,
  };
};
