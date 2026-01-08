import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  sunken?: boolean;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  ({ className, elevated = false, sunken = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base panel - rounded corners
          'rounded-md',

          // Surface variations - using colors and shadows, not borders
          {
            // Elevated panel - white with shadow
            'bg-surface-elevated shadow-elevated': elevated,

            // Sunken panel - slightly darker
            'bg-background-sunken': sunken,

            // Default panel
            'bg-surface': !elevated && !sunken,
          },

          className
        )}
        {...props}
      />
    );
  }
);

Panel.displayName = 'Panel';
