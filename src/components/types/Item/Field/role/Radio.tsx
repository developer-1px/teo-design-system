import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils.ts';

/**
 * Radio - 라디오 버튼
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * label - 라디오 레이블
   */
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    const radioId = id || `radio-${Math.random().toString(36).substring(7)}`;

    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="radio"
            id={radioId}
            ref={ref}
            className={cn(
              'peer h-4 w-4 appearance-none rounded-full border border-default bg-surface-sunken',
              'transition-all cursor-pointer',
              'checked:border-[5px] checked:border-accent',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            {...props}
          />
        </div>
        {label && (
          <label
            htmlFor={radioId}
            className="text-sm font-normal text-text cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
