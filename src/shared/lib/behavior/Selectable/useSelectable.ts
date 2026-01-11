/**
 * useSelectable - Selectable headless hook
 *
 * 선택 관리 로직을 제공하는 headless hook
 * Context로 감싸서 하위 컴포넌트에서 사용
 *
 * @example
 * const selectable = useSelectable({ mode: 'extended' });
 * return (
 *   <SelectableContext.Provider value={selectable}>
 *     {children}
 *   </SelectableContext.Provider>
 * );
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigableContextOptional } from '../Navigable/NavigableContext';
import type { SelectableContext, SelectableItem, SelectableProps, SelectableState } from './types';

export function useSelectable(props: Omit<SelectableProps, 'children'>): SelectableContext {
  const {
    mode,
    followFocus = false,
    required = false,
    defaultSelected = [],
    selected: controlledSelected,
    onSelectionChange,
  } = props;

  // Navigable integration (optional)
  const navigable = useNavigableContextOptional();

  // State
  const [state, setState] = useState<SelectableState>({
    selectedIds: new Set(defaultSelected),
    anchorId: null,
    lastActionId: null,
    items: new Map(),
  });

  // Controlled vs Uncontrolled
  const selectedIds =
    controlledSelected !== undefined ? new Set(controlledSelected) : state.selectedIds;
  const isControlled = controlledSelected !== undefined;

  /**
   * Update selected IDs
   */
  const setSelectedIds = useCallback(
    (newSelectedIds: Set<string>) => {
      if (!isControlled) {
        setState((prev) => ({ ...prev, selectedIds: newSelectedIds }));
      }
      onSelectionChange?.(Array.from(newSelectedIds));
    },
    [isControlled, onSelectionChange]
  );

  /**
   * Get sorted items array
   */
  const getSortedItems = useCallback((): SelectableItem[] => {
    return Array.from(state.items.values());
  }, [state.items]);

  /**
   * Check if item is selected
   */
  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  /**
   * Get selected count
   */
  const getSelectedCount = useCallback(() => selectedIds.size, [selectedIds]);

  /**
   * Get selected IDs as array
   */
  const getSelectedIds = useCallback(() => Array.from(selectedIds), [selectedIds]);

  /**
   * Select single item (clear others)
   */
  const select = useCallback(
    (id: string) => {
      if (mode === 'none') return;

      const item = state.items.get(id);
      if (!item || item.disabled) return;

      const newSelected = new Set([id]);
      setSelectedIds(newSelected);
      setState((prev) => ({ ...prev, anchorId: id, lastActionId: id }));
    },
    [mode, state.items, setSelectedIds]
  );

  /**
   * Toggle selection
   */
  const toggle = useCallback(
    (id: string) => {
      if (mode === 'none' || mode === 'single') {
        select(id);
        return;
      }

      const item = state.items.get(id);
      if (!item || item.disabled) return;

      const newSelected = new Set(selectedIds);

      if (newSelected.has(id)) {
        // Deselect (check required)
        if (required && newSelected.size === 1) return;
        newSelected.delete(id);
      } else {
        // Select
        newSelected.add(id);
      }

      setSelectedIds(newSelected);
      setState((prev) => ({ ...prev, anchorId: id, lastActionId: id }));
    },
    [mode, required, selectedIds, state.items, setSelectedIds, select]
  );

  /**
   * Select range (anchor → toId)
   */
  const selectRange = useCallback(
    (toId: string) => {
      if (mode !== 'extended') return;

      const items = getSortedItems();
      const anchorIndex = state.anchorId
        ? items.findIndex((item) => item.id === state.anchorId)
        : 0;
      const toIndex = items.findIndex((item) => item.id === toId);

      if (anchorIndex === -1 || toIndex === -1) return;

      const [start, end] = [Math.min(anchorIndex, toIndex), Math.max(anchorIndex, toIndex)];
      const newSelected = new Set<string>();

      for (let i = start; i <= end; i++) {
        const item = items[i];
        if (!item.disabled) {
          newSelected.add(item.id);
        }
      }

      setSelectedIds(newSelected);
      setState((prev) => ({ ...prev, lastActionId: toId }));
    },
    [mode, state.anchorId, getSortedItems, setSelectedIds]
  );

  /**
   * Select all
   */
  const selectAll = useCallback(() => {
    if (mode !== 'extended') return;

    const items = getSortedItems();
    const newSelected = new Set(items.filter((item) => !item.disabled).map((item) => item.id));

    setSelectedIds(newSelected);
  }, [mode, getSortedItems, setSelectedIds]);

  /**
   * Clear selection
   */
  const clearSelection = useCallback(() => {
    if (required && selectedIds.size > 0) return;

    setSelectedIds(new Set());
    setState((prev) => ({ ...prev, anchorId: null, lastActionId: null }));
  }, [required, selectedIds.size, setSelectedIds]);

  /**
   * Set anchor
   */
  const setAnchor = useCallback((id: string) => {
    setState((prev) => ({ ...prev, anchorId: id }));
  }, []);

  /**
   * Register item
   */
  const registerItem = useCallback((item: SelectableItem) => {
    setState((prev) => {
      const newItems = new Map(prev.items);
      newItems.set(item.id, item);
      return { ...prev, items: newItems };
    });
  }, []);

  /**
   * Unregister item
   */
  const unregisterItem = useCallback(
    (id: string) => {
      setState((prev) => {
        const newItems = new Map(prev.items);
        newItems.delete(id);

        // Remove from selected if exists
        const newSelected = new Set(selectedIds);
        newSelected.delete(id);
        if (newSelected.size !== selectedIds.size) {
          setSelectedIds(newSelected);
        }

        return { ...prev, items: newItems };
      });
    },
    [selectedIds, setSelectedIds]
  );

  /**
   * Handle keyboard events
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, id: string) => {
      // Space: toggle selection
      if (e.key === ' ') {
        e.preventDefault();
        toggle(id);
      }

      // Ctrl+A: select all (extended mode only)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && mode === 'extended') {
        e.preventDefault();
        selectAll();
      }

      // Escape: clear selection
      if (e.key === 'Escape') {
        clearSelection();
      }
    },
    [toggle, selectAll, clearSelection, mode]
  );

  /**
   * Handle click events
   */
  const handleClick = useCallback(
    (e: React.MouseEvent, id: string) => {
      const item = state.items.get(id);
      if (!item || item.disabled) return;

      // Extended mode: Shift = range, Ctrl = toggle, normal = select
      if (mode === 'extended') {
        if (e.shiftKey) {
          selectRange(id);
        } else if (e.ctrlKey || e.metaKey) {
          toggle(id);
        } else {
          select(id);
        }
      }
      // Multiple mode: Ctrl = toggle, normal = select
      else if (mode === 'multiple') {
        if (e.ctrlKey || e.metaKey) {
          toggle(id);
        } else {
          select(id);
        }
      }
      // Single mode: always select
      else if (mode === 'single') {
        select(id);
      }
    },
    [mode, state.items, select, toggle, selectRange]
  );

  /**
   * Get item props
   */
  const getItemProps = useCallback(
    (id: string) => ({
      'aria-selected': isSelected(id),
      'data-selected': isSelected(id),
      onClick: (e: React.MouseEvent) => handleClick(e, id),
      onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, id),
    }),
    [isSelected, handleClick, handleKeyDown]
  );

  /**
   * Follow focus integration
   */
  useEffect(() => {
    if (followFocus && navigable && navigable.focusedId) {
      select(navigable.focusedId);
    }
  }, [followFocus, navigable?.focusedId, select, navigable]);

  return {
    mode,
    followFocus,
    selectedIds,
    anchorId: state.anchorId,
    isSelected,
    getSelectedCount,
    getSelectedIds,
    select,
    toggle,
    selectRange,
    selectAll,
    clearSelection,
    setAnchor,
    registerItem,
    unregisterItem,
    getItemProps,
  };
}
