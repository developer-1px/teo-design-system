import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

/**
 * Select - 드롭다운 선택
 */
export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * error - 에러 상태
   */
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            // Base styles
            'w-full rounded-md text-sm font-normal appearance-none',
            'bg-surface-sunken px-3 py-2 pr-10 border-0 shadow-inset',
            'transition-all cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            'disabled:cursor-not-allowed disabled:opacity-50',

            // Error state
            error && 'ring-2 ring-red-500 focus-visible:ring-red-500',

            className
          )}
          {...props}
        >
          {children}
        </select>

        {/* Chevron Icon */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronDown size={16} className="text-subtle" />
        </div>
      </div>
    );
  }
);

Select.displayName = 'Select';
