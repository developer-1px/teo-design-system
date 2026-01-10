import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Input - 텍스트 입력 필드
 *
 * 모든 text 기반 입력에 사용
 */
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * variant - 입력 필드 스타일
   */
  variant?: 'default' | 'ghost';

  /**
   * error - 에러 상태
   */
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', error, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Base styles
          'w-full rounded-md text-sm font-normal',
          'transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'placeholder:text-subtle',

          // Variants
          {
            // Default - layer-1 배경 (sunken)
            'bg-surface-sunken px-3 py-2 border-0 shadow-inset': variant === 'default',

            // Ghost - 투명 배경
            'bg-transparent px-2 py-1 border border-default': variant === 'ghost',
          },

          // Error state
          error && 'ring-2 ring-red-500 focus-visible:ring-red-500',

          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
