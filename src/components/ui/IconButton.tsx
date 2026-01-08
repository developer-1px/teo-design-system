import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  layer?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = 'md', active = false, layer = 2, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles - square, rounded, no borders
          'inline-flex items-center justify-center rounded-md',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
          'disabled:pointer-events-none disabled:opacity-50',

          // Layer-specific hover
          `layer-${layer}-interactive`,

          // Active state - accent color background with left indicator
          {
            'text-accent accent-indicator': active,
          },

          // Sizes - dense and square
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
