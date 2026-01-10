/**
 * useSelection Hook
 *
 * 상용 앱 수준의 선택 관리 시스템
 * - 단일/멀티 선택
 * - Shift 범위 선택
 * - Cmd+C, Cmd+X, Cmd+V (복사/잘라내기/붙여넙기)
 * - Delete/Backspace (삭제)
 * - Cmd+A (전체 선택)
 * - ESC (선택 해제)
 * - v1.0.3: 키보드 네비게이션 (ArrowUp/Down/Left/Right, Home, End)
 * - v1.0.4: Focus management (브라우저 포커스 자동 동기화)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UseSelectionOptions, UseSelectionReturn } from './types';

export function useSelection<T>(options: UseSelectionOptions<T>): UseSelectionReturn<T> {
  const {
    items,
    getId,
    multiSelect = true,
    onCopy,
    onCut,
    onPaste,
    onDelete,
    onSelectionChange,
    initialSelectedIds = [],
    keyboardNavigation = true,
    onNavigate,
  } = options;

  // State
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set(initialSelectedIds));
  const [lastSelectedId, setLastSelectedId] = useState<string | number | null>(null);
  const clipboardRef = useRef<T[]>([]);
  const itemRefsRef = useRef<Map<string | number, HTMLElement>>(new Map());

  // 선택된 아이템 목록
  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedIds.has(getId(item)));
  }, [items, selectedIds, getId]);

  // 선택 변경 알림
  useEffect(() => {
    onSelectionChange?.(selectedItems);
  }, [selectedItems, onSelectionChange]);

  // ID가 선택되어 있는지 확인
  const isSelected = useCallback(
    (id: string | number): boolean => {
      return selectedIds.has(id);
    },
    [selectedIds]
  );

  // 단일 선택 (기존 선택 해제)
  const selectSingle = useCallback((id: string | number) => {
    setSelectedIds(new Set([id]));
    setLastSelectedId(id);
  }, []);

  // 선택 토글 (Cmd/Ctrl + 클릭)
  const toggleSelect = useCallback(
    (id: string | number) => {
      if (!multiSelect) {
        selectSingle(id);
        return;
      }

      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
      setLastSelectedId(id);
    },
    [multiSelect, selectSingle]
  );

  // 범위 선택 (Shift + 클릭)
  const selectRange = useCallback(
    (id: string | number) => {
      if (!multiSelect || lastSelectedId === null) {
        selectSingle(id);
        return;
      }

      // lastSelectedId와 id 사이의 모든 아이템 선택
      const lastIndex = items.findIndex((item) => getId(item) === lastSelectedId);
      const currentIndex = items.findIndex((item) => getId(item) === id);

      if (lastIndex === -1 || currentIndex === -1) {
        selectSingle(id);
        return;
      }

      const start = Math.min(lastIndex, currentIndex);
      const end = Math.max(lastIndex, currentIndex);

      const rangeIds = items.slice(start, end + 1).map(getId);

      setSelectedIds((prev) => {
        const next = new Set(prev);
        rangeIds.forEach((rangeId) => next.add(rangeId));
        return next;
      });
    },
    [multiSelect, lastSelectedId, items, getId, selectSingle]
  );

  // 전체 선택
  const selectAll = useCallback(() => {
    if (!multiSelect) return;

    const allIds = items.map(getId);
    setSelectedIds(new Set(allIds));
    setLastSelectedId(allIds[allIds.length - 1] ?? null);
  }, [multiSelect, items, getId]);

  // 선택 해제
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setLastSelectedId(null);
  }, []);

  // 아이템 클릭 핸들러 (modifier keys 자동 처리)
  const handleItemClick = useCallback(
    (id: string | number, event: MouseEvent | React.MouseEvent) => {
      const isMac = /Mac/i.test(navigator.platform);
      const isMetaKey = isMac ? event.metaKey : event.ctrlKey;
      const isShiftKey = event.shiftKey;

      if (isMetaKey) {
        // Cmd/Ctrl + 클릭: 토글
        toggleSelect(id);
      } else if (isShiftKey) {
        // Shift + 클릭: 범위 선택
        selectRange(id);
      } else {
        // 일반 클릭: 단일 선택
        selectSingle(id);
      }
    },
    [toggleSelect, selectRange, selectSingle]
  );

  // 복사
  const copy = useCallback(() => {
    if (selectedItems.length === 0) return;

    clipboardRef.current = [...selectedItems];
    onCopy?.(selectedItems);
  }, [selectedItems, onCopy]);

  // 잘라내기
  const cut = useCallback(() => {
    if (selectedItems.length === 0) return;

    clipboardRef.current = [...selectedItems];
    onCut?.(selectedItems);
  }, [selectedItems, onCut]);

  // 붙여넣기
  const paste = useCallback(() => {
    if (clipboardRef.current.length === 0) return;

    onPaste?.(clipboardRef.current);
  }, [onPaste]);

  // 삭제
  const deleteSelected = useCallback(() => {
    if (selectedItems.length === 0) return;

    onDelete?.(selectedItems);
    clearSelection();
  }, [selectedItems, onDelete, clearSelection]);

  // 아이템 DOM 요소 등록 (focus management)
  const registerItemRef = useCallback((id: string | number, element: HTMLElement | null) => {
    if (element) {
      itemRefsRef.current.set(id, element);
    } else {
      itemRefsRef.current.delete(id);
    }
  }, []);

  // 아이템에 프로그래매틱하게 포커스
  const focusItem = useCallback((id: string | number) => {
    const element = itemRefsRef.current.get(id);
    if (element) {
      element.focus();
    }
  }, []);

  // 아이템 props
  const getItemProps = useCallback(
    (id: string | number) => {
      return {
        onClick: (e: React.MouseEvent) => handleItemClick(id, e),
        'aria-selected': isSelected(id),
        role: 'option' as const,
        tabIndex: isSelected(id) ? 0 : -1,
      };
    },
    [handleItemClick, isSelected]
  );

  // 컨테이너 props (키보드 단축키)
  const getContainerProps = useCallback(() => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      const isMac = /Mac/i.test(navigator.platform);
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl+A: 전체 선택
      if (modKey && e.key === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }

      // Cmd/Ctrl+C: 복사
      if (modKey && e.key === 'c') {
        e.preventDefault();
        copy();
        return;
      }

      // Cmd/Ctrl+X: 잘라내기
      if (modKey && e.key === 'x') {
        e.preventDefault();
        cut();
        return;
      }

      // Cmd/Ctrl+V: 붙여넣기
      if (modKey && e.key === 'v') {
        e.preventDefault();
        paste();
        return;
      }

      // Delete/Backspace: 삭제
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // ESC: 선택 해제
      if (e.key === 'Escape') {
        e.preventDefault();
        clearSelection();
        return;
      }

      // 키보드 네비게이션 (방향키)
      if (keyboardNavigation && items.length > 0) {
        const selectedItemsArray = Array.from(selectedIds);
        const currentId = selectedItemsArray[selectedItemsArray.length - 1]; // 마지막 선택 항목
        const currentIndex = items.findIndex((item) => getId(item) === currentId);

        let nextIndex = currentIndex;

        // ArrowDown / ArrowRight: 다음 항목
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : currentIndex;
        }

        // ArrowUp / ArrowLeft: 이전 항목
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        }

        // Home: 첫 항목
        if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        }

        // End: 마지막 항목
        if (e.key === 'End') {
          e.preventDefault();
          nextIndex = items.length - 1;
        }

        // 네비게이션 적용
        if (nextIndex !== currentIndex || currentIndex === -1) {
          const nextItem = items[nextIndex];
          const nextId = getId(nextItem);
          selectSingle(nextId);
          onNavigate?.(nextItem);

          // Focus management: 브라우저 포커스도 함께 이동
          setTimeout(() => focusItem(nextId), 0);
        }
      }
    };

    return {
      onKeyDown: handleKeyDown,
      role: 'listbox' as const,
      'aria-multiselectable': multiSelect,
    };
  }, [
    selectAll,
    copy,
    cut,
    paste,
    deleteSelected,
    clearSelection,
    multiSelect,
    keyboardNavigation,
    items,
    getId,
    selectedIds,
    selectSingle,
    onNavigate,
    focusItem,
  ]);

  return {
    selectedIds,
    selectedItems,
    isSelected,
    selectSingle,
    toggleSelect,
    selectRange,
    selectAll,
    clearSelection,
    handleItemClick,
    copy,
    cut,
    paste,
    deleteSelected,
    registerItemRef,
    focusItem,
    getItemProps,
    getContainerProps,
  };
}
