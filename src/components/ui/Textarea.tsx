import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Textarea - 여러 줄 텍스트 입력
 */
export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * error - 에러 상태
   */
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          // Base styles
          'w-full rounded-md text-sm font-normal',
          'bg-surface-sunken px-3 py-2 border-0 shadow-inset',
          'transition-all resize-vertical',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'placeholder:text-subtle',

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
