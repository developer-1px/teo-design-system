import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

/**
 * Switch - 토글 스위치
 */
export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * label - 스위치 레이블
   */
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substring(7)}`;

    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="checkbox"
            id={switchId}
            ref={ref}
            className={cn(
              'peer h-5 w-9 appearance-none rounded-full bg-border',
              'transition-all cursor-pointer',
              'checked:bg-accent',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
          <div className="pointer-events-none absolute left-0.5 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
        </div>
        {label && (
          <label
            htmlFor={switchId}
            className="text-sm font-normal text-text cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
