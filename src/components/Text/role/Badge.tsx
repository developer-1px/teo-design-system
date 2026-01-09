import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Badge - 상태 표시 배지
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * variant - 배지 스타일
   */
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';

  /**
   * size - 배지 크기
   */
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center rounded-full font-medium',
          'transition-colors',

          // Sizes
          {
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-2.5 py-1 text-xs': size === 'md',
          },

          // Variants
          {
            // Default - accent color
            'bg-accent/10 text-accent border border-accent/20':
              variant === 'default',

            // Success - green
            'bg-green-500/10 text-green-600 border border-green-500/20':
              variant === 'success',

            // Warning - yellow
            'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20':
              variant === 'warning',

            // Error - red
            'bg-red-500/10 text-red-600 border border-red-500/20':
              variant === 'error',

            // Info - blue
            'bg-blue-500/10 text-blue-600 border border-blue-500/20':
              variant === 'info',
          },

          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
