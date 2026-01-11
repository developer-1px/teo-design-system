/**
 * useNavigable - Navigable headless hook
 *
 * 키보드 네비게이션 로직을 제공하는 headless hook
 * Context로 감싸서 하위 컴포넌트에서 사용
 *
 * @example
 * const navigable = useNavigable({ orientation: 'vertical' });
 * return (
 *   <NavigableContext.Provider value={navigable}>
 *     <div {...navigable.getContainerProps()}>
 *       {children}
 *     </div>
 *   </NavigableContext.Provider>
 * );
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { NavigableContext, NavigableItem, NavigableProps, NavigableState } from './types';

export function useNavigable(props: Omit<NavigableProps, 'children'>): NavigableContext {
  const {
    orientation,
    loop = false,
    typeahead = true,
    skipDisabled = true,
    defaultFocusedId,
    onFocusChange,
  } = props;

  // State
  const [state, setState] = useState<NavigableState>({
    focusedId: defaultFocusedId ?? null,
    items: new Map(),
    typeaheadBuffer: '',
    typeaheadTimeout: null,
  });

  const typeaheadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Get sorted items array (insertion order)
   */
  const getSortedItems = useCallback((): NavigableItem[] => {
    return Array.from(state.items.values());
  }, [state.items]);

  /**
   * Find next/prev item (skip disabled if needed)
   */
  const findNextItem = useCallback(
    (currentId: string | null, direction: 1 | -1): NavigableItem | null => {
      const items = getSortedItems();
      if (items.length === 0) return null;

      let startIndex = 0;
      if (currentId) {
        const currentIndex = items.findIndex(item => item.id === currentId);
        if (currentIndex !== -1) {
          startIndex = currentIndex;
        }
      }

      let index = startIndex;
      let attempts = 0;

      do {
        index = index + direction;

        // Loop handling
        if (loop) {
          index = (index + items.length) % items.length;
        } else {
          if (index < 0) return null;
          if (index >= items.length) return null;
        }

        const item = items[index];
        if (!skipDisabled || !item.disabled) {
          return item;
        }

        attempts++;
      } while (attempts < items.length);

      return null;
    },
    [getSortedItems, loop, skipDisabled]
  );

  /**
   * Update focused ID
   */
  const setFocusedId = useCallback(
    (id: string | null) => {
      setState(prev => ({ ...prev, focusedId: id }));
      onFocusChange?.(id);
    },
    [onFocusChange]
  );

  /**
   * Focus next item
   */
  const focusNext = useCallback(() => {
    const next = findNextItem(state.focusedId, 1);
    if (next) {
      setFocusedId(next.id);
      next.ref.focus();
    }
  }, [state.focusedId, findNextItem, setFocusedId]);

  /**
   * Focus previous item
   */
  const focusPrev = useCallback(() => {
    const prev = findNextItem(state.focusedId, -1);
    if (prev) {
      setFocusedId(prev.id);
      prev.ref.focus();
    }
  }, [state.focusedId, findNextItem, setFocusedId]);

  /**
   * Focus first item
   */
  const focusFirst = useCallback(() => {
    const items = getSortedItems();
    const first = items.find(item => !skipDisabled || !item.disabled);
    if (first) {
      setFocusedId(first.id);
      first.ref.focus();
    }
  }, [getSortedItems, skipDisabled, setFocusedId]);

  /**
   * Focus last item
   */
  const focusLast = useCallback(() => {
    const items = getSortedItems();
    const last = items.reverse().find(item => !skipDisabled || !item.disabled);
    if (last) {
      setFocusedId(last.id);
      last.ref.focus();
    }
  }, [getSortedItems, skipDisabled, setFocusedId]);

  /**
   * Focus by ID
   */
  const focusById = useCallback(
    (id: string) => {
      const item = state.items.get(id);
      if (item && (!skipDisabled || !item.disabled)) {
        setFocusedId(id);
        item.ref.focus();
      }
    },
    [state.items, skipDisabled, setFocusedId]
  );

  /**
   * Register item
   */
  const registerItem = useCallback((item: NavigableItem) => {
    setState(prev => {
      const newItems = new Map(prev.items);
      newItems.set(item.id, item);
      return { ...prev, items: newItems };
    });
  }, []);

  /**
   * Unregister item
   */
  const unregisterItem = useCallback((id: string) => {
    setState(prev => {
      const newItems = new Map(prev.items);
      newItems.delete(id);
      return { ...prev, items: newItems };
    });
  }, []);

  /**
   * Update item
   */
  const updateItem = useCallback((id: string, updates: Partial<NavigableItem>) => {
    setState(prev => {
      const item = prev.items.get(id);
      if (!item) return prev;

      const newItems = new Map(prev.items);
      newItems.set(id, { ...item, ...updates });
      return { ...prev, items: newItems };
    });
  }, []);

  /**
   * Typeahead search
   */
  const handleTypeahead = useCallback(
    (char: string) => {
      if (!typeahead) return;

      // Clear existing timeout
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }

      // Update buffer
      const newBuffer = state.typeaheadBuffer + char.toLowerCase();
      setState(prev => ({ ...prev, typeaheadBuffer: newBuffer }));

      // Find matching item
      const items = getSortedItems();
      const match = items.find(item =>
        item.textValue.toLowerCase().startsWith(newBuffer) &&
        (!skipDisabled || !item.disabled)
      );

      if (match) {
        setFocusedId(match.id);
        match.ref.focus();
      }

      // Reset buffer after 500ms
      typeaheadTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, typeaheadBuffer: '' }));
        typeaheadTimeoutRef.current = null;
      }, 500);
    },
    [typeahead, state.typeaheadBuffer, getSortedItems, skipDisabled, setFocusedId]
  );

  /**
   * Keyboard event handler
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isVertical = orientation === 'vertical' || orientation === 'both';
      const isHorizontal = orientation === 'horizontal' || orientation === 'both';

      // Navigation keys
      if (isVertical && e.key === 'ArrowDown') {
        e.preventDefault();
        focusNext();
      } else if (isVertical && e.key === 'ArrowUp') {
        e.preventDefault();
        focusPrev();
      } else if (isHorizontal && e.key === 'ArrowRight') {
        e.preventDefault();
        focusNext();
      } else if (isHorizontal && e.key === 'ArrowLeft') {
        e.preventDefault();
        focusPrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        focusFirst();
      } else if (e.key === 'End') {
        e.preventDefault();
        focusLast();
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        // Typeahead (single character, no modifiers)
        handleTypeahead(e.key);
      }
    },
    [orientation, focusNext, focusPrev, focusFirst, focusLast, handleTypeahead]
  );

  /**
   * Check if item is focused
   */
  const isFocused = useCallback(
    (id: string) => state.focusedId === id,
    [state.focusedId]
  );

  /**
   * Get container props
   */
  const getContainerProps = useCallback(
    () => ({
      role: 'listbox',
      'aria-activedescendant': state.focusedId ?? undefined,
      onKeyDown: handleKeyDown,
      tabIndex: 0,
    }),
    [state.focusedId, handleKeyDown]
  );

  /**
   * Get item props
   */
  const getItemProps = useCallback(
    (id: string) => ({
      id,
      tabIndex: (state.focusedId === id ? 0 : -1) as 0 | -1,
      'data-focused': state.focusedId === id,
      onFocus: () => setFocusedId(id),
      onMouseEnter: () => {
        // Optional: auto-focus on hover
        // setFocusedId(id);
      },
    }),
    [state.focusedId, setFocusedId]
  );

  // Cleanup typeahead timeout on unmount
  useEffect(() => {
    return () => {
      if (typeaheadTimeoutRef.current) {
        clearTimeout(typeaheadTimeoutRef.current);
      }
    };
  }, []);

  return {
    focusedId: state.focusedId,
    isFocused,
    focusNext,
    focusPrev,
    focusFirst,
    focusLast,
    focusById,
    registerItem,
    unregisterItem,
    updateItem,
    getContainerProps,
    getItemProps,
  };
}
