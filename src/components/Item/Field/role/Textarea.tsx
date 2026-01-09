import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Textarea - 여러 줄 텍스트 입력
 *
 * IDDL Field의 dataType: 'textarea'를 위한 컴포넌트
 * @see spec/iddl-spec-1.0.1.md Section 4.1.2
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * variant - 입력 필드 스타일
   */
  variant?: 'default' | 'ghost';

  /**
   * error - 에러 상태
   */
  error?: boolean;

  /**
   * resize - 크기 조절 가능 여부
   */
  resize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', error, resize = true, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Base styles
          'w-full rounded-md text-sm font-normal',
          'transition-all',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'placeholder:text-subtle',
          'min-h-[80px]',

          // Resize
          resize ? 'resize-y' : 'resize-none',

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

Textarea.displayName = 'Textarea';
