import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Virtual scroll configuration options
 */
export interface UseVirtualScrollOptions {
  /** Total number of items */
  itemCount: number;
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the scrollable container in pixels */
  containerHeight: number;
  /** Number of items to render above/below visible area (default: 3) */
  overscan?: number;
  /** Callback when scroll position changes */
  onScroll?: (scrollTop: number) => void;
}

/**
 * Virtual scroll item range
 */
export interface VirtualScrollRange {
  /** Index of first visible item */
  startIndex: number;
  /** Index of last visible item */
  endIndex: number;
  /** Offset for positioning the visible items */
  offsetY: number;
}

/**
 * Virtual scroll return value
 */
export interface UseVirtualScrollReturn {
  /** Ref to attach to the scrollable container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Range of items to render */
  range: VirtualScrollRange;
  /** Total height of all items (for scrollbar sizing) */
  totalHeight: number;
  /** Scroll to specific item index */
  scrollToIndex: (index: number, behavior?: ScrollBehavior) => void;
  /** Current scroll position */
  scrollTop: number;
}

/**
 * Virtual scroll hook for rendering large lists efficiently
 *
 * Only renders visible items + overscan buffer, dramatically improving
 * performance for lists with 100+ items.
 *
 * Features:
 * - Renders only visible items
 * - Smooth scrolling
 * - Configurable overscan
 * - Scroll to index
 * - Fixed item height (for simplicity)
 *
 * @param options - Virtual scroll configuration
 * @returns Virtual scroll utilities
 *
 * @example
 * ```tsx
 * const { containerRef, range, totalHeight, scrollToIndex } = useVirtualScroll({
 *   itemCount: 1000,
 *   itemHeight: 48,
 *   containerHeight: 400,
 *   overscan: 3,
 * });
 *
 * return (
 *   <div ref={containerRef} style={{ height: 400, overflow: "auto" }}>
 *     <div style={{ height: totalHeight, position: "relative" }}>
 *       {items.slice(range.startIndex, range.endIndex + 1).map((item, i) => (
 *         <div
 *           key={range.startIndex + i}
 *           style={{
 *             position: "absolute",
 *             top: (range.startIndex + i) * 48,
 *             height: 48,
 *           }}
 *         >
 *           {item.label}
 *         </div>
 *       ))}
 *     </div>
 *   </div>
 * );
 * ```
 */
export function useVirtualScroll({
  itemCount,
  itemHeight,
  containerHeight,
  overscan = 3,
  onScroll,
}: UseVirtualScrollOptions): UseVirtualScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate total height of all items
  const totalHeight = useMemo(
    () => itemCount * itemHeight,
    [itemCount, itemHeight],
  );

  // Calculate visible range
  const range = useMemo<VirtualScrollRange>(() => {
    // Calculate visible item indices
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight),
    );

    // Apply overscan
    const overscanStart = Math.max(0, startIndex - overscan);
    const overscanEnd = Math.min(itemCount - 1, endIndex + overscan);

    return {
      startIndex: overscanStart,
      endIndex: overscanEnd,
      offsetY: overscanStart * itemHeight,
    };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  // Handle scroll events
  const handleScroll = useCallback(
    (e: Event) => {
      const target = e.target as HTMLDivElement;
      const newScrollTop = target.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll],
  );

  // Attach scroll listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll to specific index
  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current;
      if (!container) return;

      const targetScrollTop = Math.max(
        0,
        Math.min(index * itemHeight, totalHeight - containerHeight),
      );

      container.scrollTo({
        top: targetScrollTop,
        behavior,
      });
    },
    [itemHeight, totalHeight, containerHeight],
  );

  return {
    containerRef,
    range,
    totalHeight,
    scrollToIndex,
    scrollTop,
  };
}

/**
 * Get absolute positioning style for virtual scroll item
 *
 * Helper to generate consistent positioning for virtualized items.
 *
 * @param index - Item index
 * @param itemHeight - Height of each item
 * @returns CSS properties for absolute positioning
 *
 * @example
 * ```tsx
 * <div style={getVirtualItemStyle(5, 48)}>
 *   Item 5
 * </div>
 * ```
 */
export function getVirtualItemStyle(
  index: number,
  itemHeight: number,
): React.CSSProperties {
  return {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: itemHeight,
    transform: `translateY(${index * itemHeight}px)`,
  };
}

/**
 * Calculate if an item is within the visible range
 *
 * @param index - Item index
 * @param range - Current visible range
 * @returns Whether item should be rendered
 */
export function isItemVisible(
  index: number,
  range: VirtualScrollRange,
): boolean {
  return index >= range.startIndex && index <= range.endIndex;
}
