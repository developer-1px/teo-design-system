import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right';
  collapsed?: boolean;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, side = 'left', collapsed = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base sidebar - Layer 2 surface
          // PRINCIPLE: 선 대신 배경색 차이로 구분
          'flex flex-col bg-layer-2',
          'transition-all duration-200',

          // Collapsed state
          {
            'w-12': collapsed,
          },

          className
        )}
        {...props}
      />
    );
  }
);

Sidebar.displayName = 'Sidebar';
