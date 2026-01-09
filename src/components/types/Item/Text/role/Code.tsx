import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Code - 인라인 코드 스니펫
 *
 * 텍스트 내에서 코드를 표시하는 인라인 요소
 */
export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /**
   * variant - 스타일 변형
   */
  variant?: 'default' | 'accent' | 'subtle';
}

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          'inline-block px-1.5 py-0.5 rounded text-sm font-mono',
          'border transition-colors',
          // Variant styles
          variant === 'default' && 'bg-surface text-text border-default',
          variant === 'accent' && 'bg-accent/10 text-accent border-accent/20',
          variant === 'subtle' && 'bg-surface-sunken text-muted border-transparent',
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  }
);

Code.displayName = 'Code';
