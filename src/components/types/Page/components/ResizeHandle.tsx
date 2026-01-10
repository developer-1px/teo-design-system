/**
 * ResizeHandle - 패널 크기 조절 핸들 컴포넌트
 *
 * 드래그를 통해 패널 크기를 조절할 수 있는 핸들을 렌더링합니다.
 * 방향(horizontal/vertical/both)에 따라 다른 커서와 동작을 제공합니다.
 *
 * @example
 * <ResizeHandle
 *   direction="horizontal"
 *   onResize={(delta) => handleResize('left', currentSize + delta.x)}
 * />
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';

export interface ResizeHandleProps {
  /**
   * Resize 방향
   */
  direction: 'horizontal' | 'vertical' | 'both';

  /**
   * Resize 콜백
   */
  onResize: (delta: { x: number; y: number }) => void;

  /**
   * 추가 CSS 클래스
   */
  className?: string;

  /**
   * 최소 크기 (px)
   */
  minSize?: number;

  /**
   * 최대 크기 (px)
   */
  maxSize?: number;
}

export function ResizeHandle(props: ResizeHandleProps) {
  const { direction, onResize, className, minSize, maxSize } = props;

  const [isDragging, setIsDragging] = useState(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const currentDeltaRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(true);
      startPosRef.current = { x: e.clientX, y: e.clientY };
      currentDeltaRef.current = { x: 0, y: 0 };

      // Prevent text selection during drag
      document.body.style.userSelect = 'none';
      document.body.style.cursor =
        direction === 'horizontal'
          ? 'col-resize'
          : direction === 'vertical'
            ? 'row-resize'
            : 'nwse-resize';
    },
    [direction]
  );

  // Handle mouse move
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startPosRef.current.x;
      const deltaY = e.clientY - startPosRef.current.y;

      currentDeltaRef.current = {
        x: direction === 'vertical' ? 0 : deltaX,
        y: direction === 'horizontal' ? 0 : deltaY,
      };

      onResize(currentDeltaRef.current);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onResize, direction]);

  const baseClasses = 'resize-handle group relative transition-colors';

  const directionClasses = {
    horizontal:
      'w-1 h-full cursor-col-resize hover:bg-accent/50 active:bg-accent border-l border-border',
    vertical:
      'h-1 w-full cursor-row-resize hover:bg-accent/50 active:bg-accent border-t border-border',
    both: 'w-2 h-2 cursor-nwse-resize hover:bg-accent/50 active:bg-accent rounded-full border border-border',
  };

  return (
    <div
      className={cn(baseClasses, directionClasses[direction], isDragging && 'bg-accent', className)}
      onMouseDown={handleMouseDown}
      role="separator"
      aria-orientation={direction === 'horizontal' ? 'vertical' : 'horizontal'}
      aria-valuenow={0}
      aria-valuemin={minSize}
      aria-valuemax={maxSize}
      data-resize-handle
      data-direction={direction}
    >
      {/* Visual indicator on hover */}
      <div
        className={cn(
          'absolute bg-accent/0 group-hover:bg-accent/20 transition-colors pointer-events-none',
          direction === 'horizontal' && 'inset-y-0 -left-1 w-3',
          direction === 'vertical' && 'inset-x-0 -top-1 h-3',
          direction === 'both' && 'inset-0'
        )}
      />
    </div>
  );
}
