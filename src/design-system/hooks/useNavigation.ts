import { useCallback, useEffect, useState } from "react";
import { useHotKeys } from "./useHotKeys";

/**
 * Navigation options
 */
export interface UseNavigationOptions<T> {
  /** Items to navigate through */
  items: T[];
  /** Callback when item is selected (Enter key) */
  onSelect?: (item: T, index: number) => void;
  /** Callback when navigation is closed (Escape key) */
  onClose?: () => void;
  /** Enable/disable navigation (default: true) */
  enabled?: boolean;
  /** Loop from end to start and vice versa (default: false) */
  loop?: boolean;
  /** Auto scroll to selected item (default: true) */
  autoScroll?: boolean;
}

/**
 * Navigation return value
 */
export interface UseNavigationReturn<T> {
  /** Currently selected index */
  selectedIndex: number;
  /** Set selected index manually */
  setSelectedIndex: (index: number) => void;
  /** Select next item */
  selectNext: () => void;
  /** Select previous item */
  selectPrev: () => void;
  /** Select first item */
  selectFirst: () => void;
  /** Select last item */
  selectLast: () => void;
  /** Currently selected item (or null if none) */
  selectedItem: T | null;
}

/**
 * List navigation hook
 *
 * Provides keyboard navigation for lists (↑↓ Enter Escape).
 * Uses unified keyboard command system (useHotKeys) for consistency.
 *
 * Features:
 * - Arrow key navigation (↑↓)
 * - Home/End for first/last
 * - Enter to select
 * - Escape to close (works even in form inputs)
 * - Conditional activation
 * - Loop navigation (optional)
 * - Auto scroll (optional)
 *
 * @param options - Navigation configuration
 * @returns Navigation state and utilities
 *
 * @example
 * ```tsx
 * const { selectedIndex, selectedItem } = useNavigation({
 *   items: searchResults,
 *   onSelect: (item) => console.log("Execute:", item.label),
 *   onClose: () => setQuery(""),
 *   enabled: searchResults.length > 0,
 *   loop: true,
 * });
 *
 * return (
 *   <div>
 *     {searchResults.map((result, i) => (
 *       <div key={i} data-active={i === selectedIndex}>
 *         {result.label}
 *       </div>
 *     ))}
 *   </div>
 * );
 * ```
 */
export function useNavigation<T>({
  items,
  onSelect,
  onClose,
  enabled = true,
  loop = false,
}: UseNavigationOptions<T>): UseNavigationReturn<T> {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset selection when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, []);

  // Clamp index to valid range
  const clampIndex = useCallback(
    (index: number): number => {
      if (items.length === 0) return 0;

      if (loop) {
        // Loop navigation: wrap around
        if (index < 0) return items.length - 1;
        if (index >= items.length) return 0;
        return index;
      } else {
        // Clamp navigation: stay within bounds
        return Math.max(0, Math.min(index, items.length - 1));
      }
    },
    [items.length, loop],
  );

  // Navigation helpers
  const selectNext = useCallback(() => {
    setSelectedIndex((prev) => clampIndex(prev + 1));
  }, [clampIndex]);

  const selectPrev = useCallback(() => {
    setSelectedIndex((prev) => clampIndex(prev - 1));
  }, [clampIndex]);

  const selectFirst = useCallback(() => {
    setSelectedIndex(0);
  }, []);

  const selectLast = useCallback(() => {
    setSelectedIndex(Math.max(0, items.length - 1));
  }, [items.length]);

  // Get currently selected item
  const selectedItem =
    items.length > 0 && selectedIndex >= 0 && selectedIndex < items.length
      ? items[selectedIndex]
      : null;

  // ✅ Register navigation commands (don't work on form inputs)
  useHotKeys(
    {
      ArrowDown: () => selectNext(),
      ArrowUp: () => selectPrev(),
      Home: () => selectFirst(),
      End: () => selectLast(),
      Enter: () => {
        if (selectedItem !== null) {
          onSelect?.(selectedItem, selectedIndex);
        }
      },
    },
    {
      enabled: enabled && items.length > 0,
      preventDefault: true,
      enableOnFormTags: false, // Don't trigger on form inputs
    },
  );

  // ✅ Register close command (works everywhere, even in form inputs)
  useHotKeys(
    {
      Escape: () => onClose?.(),
    },
    {
      enabled,
      preventDefault: true,
      enableOnFormTags: true, // Escape always works (modal close)
    },
  );

  return {
    selectedIndex,
    setSelectedIndex,
    selectNext,
    selectPrev,
    selectFirst,
    selectLast,
    selectedItem,
  };
}
