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
  /**
   * interactive - 호버 효과 및 클릭 가능 여부
   */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', interactive, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-lg', // Radius should eventually come from tokens too, but keep for structure
          interactive &&
          'cursor-pointer transition-all hover:ring-2 hover:ring-primary active:scale-[0.98]',

          // Variants - Removed hardcoded borders/shadows (Handled by IDDL Token Engine)
          {
            // Default - legacy fallback if needed, but intended to be handled by `iddl-structure` passed via className
            // 'shadow-3': variant === 'default', 
            // 'border border-default': variant === 'bordered',
          },

          // Padding - Removed hardcoded padding (Handled by IDDL Token Engine `iddl-layout`)
          {
            // 'p-0': padding === 'none',
            // ...
          },

          className // Token Engine classes passed here
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
