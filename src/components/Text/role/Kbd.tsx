import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Kbd - 키보드 단축키 표시
 *
 * 키보드 입력을 나타내는 시각적 인디케이터
 */
export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /**
   * size - 크기 변형
   */
  size?: 'sm' | 'md' | 'lg';
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ className, size = 'md', children, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center',
          'rounded border border-default',
          'bg-surface text-muted',
          'font-mono font-medium',
          'transition-colors',
          // Size variants
          size === 'sm' && 'px-1 py-0.5 text-[10px] min-w-[18px]',
          size === 'md' && 'px-1.5 py-0.5 text-xs min-w-[20px]',
          size === 'lg' && 'px-2 py-1 text-sm min-w-[24px]',
          className
        )}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);

Kbd.displayName = 'Kbd';
