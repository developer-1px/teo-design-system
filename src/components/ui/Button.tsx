import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  layer?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'ghost', size = 'md', layer = 4, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles - dense with rounded corners
          'inline-flex items-center justify-center rounded-md font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',

          // Variants - using layer system
          // PRINCIPLE: 인라인 요소(버튼)에는 그림자 사용 금지
          // PRINCIPLE: border + background 동시 사용 금지 (outline 제외)
          {
            // Accent variant - primary action, 화면당 1개만
            'bg-accent text-text-inverse hover:bg-accent-hover active:bg-accent-active':
              variant === 'accent',

            // Ghost variant - secondary action, 배경 없음
            'bg-transparent text-text-primary':
              variant === 'ghost',

            // Outline variant - dangerous action, border만 사용
            'border border-border bg-transparent text-text-primary':
              variant === 'outline',
          },

          // Layer-specific hover for ghost and outline variants
          variant !== 'accent' && `layer-${layer}-interactive`,

          // Sizes - dense spacing
          {
            'h-7 px-3 text-xs': size === 'sm',
            'h-9 px-4 text-sm': size === 'md',
            'h-11 px-6 text-base': size === 'lg',
          },

          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
