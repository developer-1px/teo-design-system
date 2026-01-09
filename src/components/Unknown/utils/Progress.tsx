import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils.ts';

/**
 * Progress - 프로그레스 바
 *
 * 작업 진행 상태를 시각적으로 표시
 */
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * value - 진행률 (0-100)
   */
  value: number;

  /**
   * max - 최대값 (기본: 100)
   */
  max?: number;

  /**
   * size - 높이 크기
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * variant - 색상 변형
   */
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'error';

  /**
   * showLabel - 퍼센트 레이블 표시
   */
  showLabel?: boolean;
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value, max = 100, size = 'md', variant = 'accent', showLabel = false, ...props },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {/* Progress Bar */}
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={cn(
            'relative overflow-hidden rounded-full bg-surface',
            // Size variants
            size === 'sm' && 'h-1',
            size === 'md' && 'h-2',
            size === 'lg' && 'h-3'
          )}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300 ease-out',
              // Variant colors
              variant === 'default' && 'bg-text-secondary',
              variant === 'accent' && 'bg-accent',
              variant === 'success' && 'bg-green-500',
              variant === 'warning' && 'bg-yellow-500',
              variant === 'error' && 'bg-red-500'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Label */}
        {showLabel && (
          <div className="mt-1 text-xs text-muted text-right">{Math.round(percentage)}%</div>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
