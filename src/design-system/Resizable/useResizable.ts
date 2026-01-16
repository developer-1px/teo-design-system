import { useCallback, useEffect, useRef, useState } from "react";

export type ResizeDirection = "left" | "right" | "top" | "bottom";

export interface UseResizableOptions {
  direction: ResizeDirection;
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
  storageKey?: string;
  onResize?: (size: number) => void;
}

export interface UseResizableReturn {
  size: number;
  isDragging: boolean;
  resizeHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onDoubleClick: () => void;
  };
  reset: () => void;
}

/**
 * Universal resizable hook for sidebars, drawers, and panels
 * Supports 4 directions: left, right, top, bottom
 */
export function useResizable({
  direction,
  defaultSize,
  minSize = 200,
  maxSize = 1000,
  storageKey,
  onResize,
}: UseResizableOptions): UseResizableReturn {
  // Restore from localStorage if available
  const getInitialSize = useCallback(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = Number.parseInt(stored, 10);
        if (!Number.isNaN(parsed)) {
          return Math.max(minSize, Math.min(maxSize, parsed));
        }
      }
    }
    return defaultSize;
  }, [storageKey, defaultSize, minSize, maxSize]);

  const [size, setSize] = useState(getInitialSize);
  const [isDragging, setIsDragging] = useState(false);

  // Refs to track drag state
  const startPosRef = useRef(0);
  const startSizeRef = useRef(0);

  /**
   * Calculate new size based on direction and mouse delta
   */
  const calculateNewSize = useCallback(
    (currentPos: number): number => {
      const delta =
        direction === "left" || direction === "top"
          ? currentPos - startPosRef.current
          : startPosRef.current - currentPos;

      const newSize = startSizeRef.current + delta;
      return Math.max(minSize, Math.min(maxSize, newSize));
    },
    [direction, minSize, maxSize],
  );

  /**
   * Handle mouse move during drag
   */
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const currentPos =
        direction === "left" || direction === "right" ? e.clientX : e.clientY;
      const newSize = calculateNewSize(currentPos);

      setSize(newSize);
      onResize?.(newSize);
    },
    [isDragging, direction, calculateNewSize, onResize],
  );

  /**
   * Handle mouse up (end drag)
   */
  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;

    setIsDragging(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    // Save to localStorage
    if (storageKey) {
      localStorage.setItem(storageKey, size.toString());
    }
  }, [isDragging, size, storageKey]);

  /**
   * Handle mouse down (start drag)
   */
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);
      startPosRef.current =
        direction === "left" || direction === "right" ? e.clientX : e.clientY;
      startSizeRef.current = size;

      // Set cursor for entire document
      const cursor =
        direction === "left" || direction === "right"
          ? "col-resize"
          : "row-resize";
      document.body.style.cursor = cursor;
      document.body.style.userSelect = "none";
    },
    [direction, size],
  );

  /**
   * Handle double click (reset to default)
   */
  const handleDoubleClick = useCallback(() => {
    setSize(defaultSize);
    onResize?.(defaultSize);

    if (storageKey) {
      localStorage.setItem(storageKey, defaultSize.toString());
    }
  }, [defaultSize, storageKey, onResize]);

  /**
   * Reset to default size
   */
  const reset = useCallback(() => {
    setSize(defaultSize);
    onResize?.(defaultSize);

    if (storageKey) {
      localStorage.setItem(storageKey, defaultSize.toString());
    }
  }, [defaultSize, storageKey, onResize]);

  /**
   * Attach/detach global mouse listeners
   */
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    size,
    isDragging,
    resizeHandleProps: {
      onMouseDown: handleMouseDown,
      onDoubleClick: handleDoubleClick,
    },
    reset,
  };
}
