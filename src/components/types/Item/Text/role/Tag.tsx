import { X } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Tag - 제거 가능한 태그
 */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * onRemove - 제거 핸들러
   */
  onRemove?: () => void;

  /**
   * size - 태그 크기
   */
  size?: 'sm' | 'md';
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, onRemove, size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center gap-1 rounded-md bg-surface border border-default',
          'font-normal text-text',
          'transition-colors',

          // Sizes
          {
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-2.5 py-1 text-sm': size === 'md',
          },

          className
        )}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="hover:bg-black/10 rounded-sm p-0.5 transition-colors"
          >
            <X size={size === 'sm' ? 10 : 12} />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';
