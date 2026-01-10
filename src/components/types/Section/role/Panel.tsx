import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  sunken?: boolean;
  /**
   * Enable scrolling when content overflows
   * - true: overflow-auto (스크롤바가 필요할 때만 표시)
   * - 'x': 가로 스크롤만
   * - 'y': 세로 스크롤만
   */
  scrollable?: boolean | 'x' | 'y';
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, elevated = false, sunken = false, scrollable = true, ...props }, ref) => {
    const scrollableClass =
      scrollable === true
        ? 'overflow-auto'
        : scrollable === 'x'
          ? 'overflow-x-auto overflow-y-hidden'
          : scrollable === 'y'
            ? 'overflow-y-auto overflow-x-hidden'
            : '';

    return (
      <div
        ref={ref}
        className={cn(
          // Base panel - rounded corners
          'rounded-md',

          // Surface variations - TailwindCSS 4 tokens from themes.css
          {
            // Elevated panel - Layer 4 with medium shadow
            'bg-surface-elevated shadow-md': elevated,

            // Sunken panel - Layer 1 (darker background)
            'bg-surface-sunken': sunken,

            // Default panel - Layer 2 (base surface)
            'bg-surface': !elevated && !sunken,
          },

          scrollableClass,
          className
        )}
        {...props}
      />
    );
  }
);

Panel.displayName = 'Panel';
