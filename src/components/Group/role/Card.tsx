import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Card - 콘텐츠 카드
 *
 * Layer 3 (primary surface) 레벨 사용
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * variant - 카드 스타일
   */
  variant?: 'default' | 'bordered' | 'flat';

  /**
   * padding - 카드 패딩
   */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'bg-surface-raised rounded-lg',

          // Variants
          {
            // Default - subtle shadow
            'shadow-3': variant === 'default',

            // Bordered - border instead of shadow
            'border border-default': variant === 'bordered',

            // Flat - no shadow or border
            '': variant === 'flat',
          },

          // Padding
          {
            'p-0': padding === 'none',
            'p-3': padding === 'sm',
            'p-4': padding === 'md',
            'p-6': padding === 'lg',
          },

          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
