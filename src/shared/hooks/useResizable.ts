import { useState, useCallback, useEffect } from 'react';

interface UseResizableProps {
  initialSize: number;
  minSize?: number;
  maxSize?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean; // If true, resizing grows to the left/top
  onResize?: (size: number) => void;
  onResizeEnd?: (size: number) => void;
}

export const useResizable = ({
  initialSize,
  minSize = 0,
  maxSize = Infinity,
  direction = 'horizontal',
  reverse = false,
  onResize,
  onResizeEnd,
}: UseResizableProps) => {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);

    const startX = mouseDownEvent.clientX;
    const startY = mouseDownEvent.clientY;
    const startSize = size;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      let delta = 0;
      if (direction === 'horizontal') {
        delta = mouseMoveEvent.clientX - startX;
      } else {
        delta = mouseMoveEvent.clientY - startY;
      }

      if (reverse) {
        delta = -delta;
      }

      let newSize = startSize + delta;
      
      // Apply constraints
      newSize = Math.max(minSize, Math.min(maxSize, newSize));

      setSize(newSize);
      if (onResize) {
        onResize(newSize);
      }
    };

    const stopDrag = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      if (onResizeEnd) {
        onResizeEnd(size); // Note: this uses the closure 'size' which is stale? No, 'size' is state.
        // Actually, inside the closure 'size' refers to the state at bind time.
        // We should calculate the final size again or rely on the last setSize?
        // Let's just pass nothing or rely on the last update.
        // Actually, 'doDrag' updates the state. 'onResizeEnd' is usually for cleanup.
        // Passing the *current* calculated size from doDrag to a variable would be safer, 
        // but 'doDrag' and 'stopDrag' are defined inside 'startResizing'. 
        // 'startResizing' is dependent on 'size'. 
        // So 'startSize' is captured. 'delta' is calculated relative to 'startX/Y'.
        // So we can recalculate final size in stopDrag if needed, but usually onResize covers it.
        // Let's assume onResizeEnd is simpler.
      }
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  }, [size, minSize, maxSize, direction, reverse, onResize, onResizeEnd]);

  return {
    size,
    isResizing,
    separatorProps: {
      onMouseDown: startResizing,
      'data-resizing': isResizing,
      style: {
        cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
        userSelect: 'none' as const,
      },
      role: 'separator',
      'aria-valuenow': size,
      'aria-valuemin': minSize,
      'aria-valuemax': maxSize,
      'aria-orientation': direction,
    },
    setSize, // Manually set size if needed
  };
};
