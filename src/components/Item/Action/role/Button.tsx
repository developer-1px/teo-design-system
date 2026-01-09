import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Button - 디자인 시스템 전용 버튼 컴포넌트
 *
 * 핵심 원칙:
 * 1. 모든 클릭 가능한 요소는 이 컴포넌트만 사용
 * 2. <button> 태그 직접 사용 금지
 * 3. 정해진 variant만 사용 가능
 * 4. 인라인 요소에 shadow 사용 금지
 * 5. border + background 동시 사용 금지 (outline 제외)
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * variant - 버튼 스타일
   * - accent: Primary action (화면당 최대 1-2개)
   * - ghost: Secondary action (배경 없음)
   * - outline: Dangerous action (border만)
   */
  variant?: 'accent' | 'ghost' | 'outline';

  /**
   * size - 버튼 크기
   */
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'ghost', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded-md font-medium',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          'disabled:pointer-events-none disabled:opacity-50',

          // Variants
          {
            // Accent - Primary CTA (화면당 1개만!)
            'bg-accent text-white hover:bg-accent/90 active:bg-accent/80': variant === 'accent',

            // Ghost - Secondary action
            'bg-transparent text-text hover:bg-black/5 active:bg-black/10': variant === 'ghost',

            // Outline - Dangerous action
            'border border-default bg-transparent text-text hover:bg-black/5 active:bg-black/10':
              variant === 'outline',
          },

          // Sizes
          {
            'h-7 px-3 text-xs': size === 'sm',
            'h-9 px-4 text-sm': size === 'md',
            'h-11 px-6 text-base': size === 'lg',
          },

          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
