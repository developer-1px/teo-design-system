import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/shared/lib/utils.ts';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', active = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md',
          'transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          'disabled:pointer-events-none disabled:opacity-50',

          // Interactive states
          {
            'text-accent bg-accent/10': active,
            'text-muted hover:bg-black/5 hover:text-text active:bg-black/10': !active,
          },

          // Sizes
          {
            'h-8 w-8': size === 'sm',
            'h-9 w-9': size === 'md',
            'h-10 w-10': size === 'lg',
          },

          className
        )}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';
