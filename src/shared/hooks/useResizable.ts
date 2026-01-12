import { useState, useCallback, useEffect, useRef } from 'react';

type Direction = 'top' | 'right' | 'bottom' | 'left';

interface UseResizableProps {
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  direction?: Direction;
  onResize?: (size: number) => void;
  onResizeEnd?: (size: number) => void;
}

export function useResizable({
  initialSize = 250,
  minSize = 100,
  maxSize = 800,
  direction = 'right',
  onResize,
  onResizeEnd,
}: UseResizableProps) {
  const [size, setSize] = useState(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const isResizingRef = useRef(false);
  const startSizeRef = useRef(initialSize);
  const startPosRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsResizing(true);
    isResizingRef.current = true;
    startSizeRef.current = size;

    // Determine start position based on direction
    if (direction === 'left' || direction === 'right') {
      startPosRef.current = e.clientX;
    } else {
      startPosRef.current = e.clientY;
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = (direction === 'left' || direction === 'right') ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  }, [direction, size]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current) return;

    let delta = 0;
    if (direction === 'right') {
      delta = e.clientX - startPosRef.current;
    } else if (direction === 'left') {
      delta = startPosRef.current - e.clientX;
    } else if (direction === 'bottom') {
      delta = e.clientY - startPosRef.current;
    } else if (direction === 'top') {
      delta = startPosRef.current - e.clientY;
    }

    const newSize = Math.min(Math.max(startSizeRef.current + delta, minSize), maxSize);

    setSize(newSize);
    onResize?.(newSize);
  }, [direction, minSize, maxSize, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    onResizeEnd?.(size);
  }, [size, onResizeEnd]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    size,
    isResizing,
    handleProps: {
      onMouseDown: handleMouseDown,
      // Touch support could be added here
      className: `absolute z-50 transition-colors hover:bg-primary/50 ${isResizing ? 'bg-primary' : 'bg-transparent'
        } ${direction === 'right' ? 'top-0 right-0 w-1 h-full cursor-col-resize hover:w-1.5' :
          direction === 'left' ? 'top-0 left-0 w-1 h-full cursor-col-resize hover:w-1.5' :
            direction === 'bottom' ? 'bottom-0 left-0 w-full h-1 cursor-row-resize hover:h-1.5' :
              'top-0 left-0 w-full h-1 cursor-row-resize hover:h-1.5'
        }`
    }
  };
}
