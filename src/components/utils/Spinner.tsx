import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils.ts';
import { Loader2 } from 'lucide-react';

/**
 * Spinner - 로딩 스피너
 *
 * 로딩 상태를 나타내는 회전 애니메이션
 */
export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * size - 크기
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * variant - 색상 변형
   */
  variant?: 'default' | 'accent' | 'subtle';
}

export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label="Loading"
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        <Loader2
          className={cn(
            'animate-spin',
            // Size variants
            size === 'sm' && 'w-4 h-4',
            size === 'md' && 'w-5 h-5',
            size === 'lg' && 'w-6 h-6',
            // Color variants
            variant === 'default' && 'text-text',
            variant === 'accent' && 'text-accent',
            variant === 'subtle' && 'text-subtle'
          )}
        />
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';
