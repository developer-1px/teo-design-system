import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Skeleton - 로딩 스켈레톤
 *
 * 콘텐츠가 로딩 중일 때 표시되는 placeholder
 */
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * variant - 모양 변형
   */
  variant?: 'text' | 'circular' | 'rectangular';

  /**
   * width - 너비 (CSS 값)
   */
  width?: string | number;

  /**
   * height - 높이 (CSS 값)
   */
  height?: string | number;

  /**
   * animate - 애니메이션 활성화
   */
  animate?: boolean;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = 'rectangular',
      width,
      height,
      animate = true,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface',
          animate && 'animate-pulse',
          // Variant shapes
          variant === 'text' && 'rounded h-4',
          variant === 'circular' && 'rounded-full',
          variant === 'rectangular' && 'rounded-md',
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
