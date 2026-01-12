import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Divider - 구분선
 *
 * 콘텐츠를 시각적으로 구분하는 수평/수직 구분선
 */
export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * orientation - 방향
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * spacing - 여백 크기
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg';

  /**
   * label - 중앙 레이블 (horizontal only)
   */
  label?: string;
}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', spacing = 'md', label, ...props }, ref) => {
    if (label && orientation === 'horizontal') {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center gap-2 text-xs text-subtle',
            spacing === 'sm' && 'my-2',
            spacing === 'md' && 'my-4',
            spacing === 'lg' && 'my-8',
            className
          )}
          {...props}
        >
          <div className="flex-1 h-px bg-border" />
          <span>{label}</span>
          <div className="flex-1 h-px bg-border" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          'bg-border',
          // Orientation
          orientation === 'horizontal' && 'w-full h-px',
          orientation === 'vertical' && 'w-px h-full',
          // Spacing
          orientation === 'horizontal' && spacing === 'sm' && 'my-2',
          orientation === 'horizontal' && spacing === 'md' && 'my-4',
          orientation === 'horizontal' && spacing === 'lg' && 'my-8',
          orientation === 'vertical' && spacing === 'sm' && 'mx-2',
          orientation === 'vertical' && spacing === 'md' && 'mx-4',
          orientation === 'vertical' && spacing === 'lg' && 'mx-8',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
