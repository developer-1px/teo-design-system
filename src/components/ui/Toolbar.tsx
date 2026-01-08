import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Dense toolbar with subtle background
          'flex h-10 items-center px-dense-md',
          'bg-surface-secondary',
          className
        )}
        {...props}
      />
    );
  }
);

Toolbar.displayName = 'Toolbar';
