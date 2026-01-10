import type { HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

interface ResizeHandleProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical';
  isResizing?: boolean;
}

export const ResizeHandle = ({
  direction = 'horizontal',
  isResizing,
  className,
  ...props
}: ResizeHandleProps) => {
  return (
    <div
      className={cn(
        'group relative z-50 flex items-center justify-center bg-transparent transition-colors hover:bg-border-active/10',
        direction === 'horizontal'
          ? 'w-1 h-full cursor-col-resize'
          : 'h-1 w-full cursor-row-resize',
        isResizing && 'bg-border-active', // Active state style
        className
      )}
      {...props}
    >
      {/* Visual Line */}
      <div
        className={cn(
          'bg-border-transparent transition-colors group-hover:bg-border-active',
          isResizing && 'bg-border-active',
          direction === 'horizontal' ? 'w-[1px] h-full' : 'h-[1px] w-full'
        )}
      />
    </div>
  );
};
