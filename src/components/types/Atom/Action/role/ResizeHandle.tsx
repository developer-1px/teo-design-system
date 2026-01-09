import { GripHorizontal, GripVertical } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils.ts';

/**
 * ResizeHandle - 크기 조절 핸들
 *
 * Layout 컴포넌트 사이에 배치하여 사용자가 크기를 조절할 수 있도록 함
 */
export interface ResizeHandleProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 방향
   * - vertical: 좌우 크기 조절
   * - horizontal: 상하 크기 조절
   */
  direction?: 'vertical' | 'horizontal';

  /**
   * 아이콘 표시 여부
   */
  showIcon?: boolean;
}

export const ResizeHandle = forwardRef<HTMLDivElement, ResizeHandleProps>(
  ({ className, direction = 'vertical', showIcon = true, ...props }, ref) => {
    const Icon = direction === 'vertical' ? GripVertical : GripHorizontal;

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={direction === 'vertical' ? 'vertical' : 'horizontal'}
        className={cn(
          // Base styles
          'group flex items-center justify-center',
          'transition-colors duration-150',

          // Size
          direction === 'vertical' ? 'w-1 cursor-col-resize' : 'h-1 cursor-row-resize',

          // Colors
          'bg-border hover:bg-accent',

          // Focus styles
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',

          className
        )}
        tabIndex={0}
        onKeyDown={(e) => {
          // Keyboard accessibility
          if (
            e.key === 'ArrowLeft' ||
            e.key === 'ArrowRight' ||
            e.key === 'ArrowUp' ||
            e.key === 'ArrowDown'
          ) {
            e.preventDefault();
            // TODO: Implement keyboard resize
          }
        }}
        {...props}
      >
        {showIcon && (
          <Icon
            size={16}
            className={cn(
              'text-subtle opacity-0 group-hover:opacity-100',
              'transition-opacity duration-150'
            )}
          />
        )}
      </div>
    );
  }
);

ResizeHandle.displayName = 'ResizeHandle';
