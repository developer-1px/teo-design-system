import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Slider - 범위 선택 슬라이더
 *
 * IDDL Field의 dataType: 'range'를 위한 컴포넌트
 * @see spec/iddl-spec-1.0.1.md Section 4.1.2
 */
export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * showValue - 현재 값 표시 여부
   */
  showValue?: boolean;

  /**
   * error - 에러 상태
   */
  error?: boolean;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, showValue = false, error, value, min = 0, max = 100, step = 1, ...props }, ref) => {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          className={cn(
            // Base styles
            'flex-1 h-2 rounded-lg appearance-none cursor-pointer',
            'transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',

            // Track
            'bg-surface-sunken shadow-inset',

            // Thumb (Webkit)
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:h-5',
            '[&::-webkit-slider-thumb]:w-5',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-accent',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:shadow-md',
            '[&::-webkit-slider-thumb]:transition-all',
            '[&::-webkit-slider-thumb]:hover:scale-110',

            // Thumb (Firefox)
            '[&::-moz-range-thumb]:h-5',
            '[&::-moz-range-thumb]:w-5',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-accent',
            '[&::-moz-range-thumb]:border-0',
            '[&::-moz-range-thumb]:cursor-pointer',
            '[&::-moz-range-thumb]:shadow-md',
            '[&::-moz-range-thumb]:transition-all',
            '[&::-moz-range-thumb]:hover:scale-110',

            // Error state
            error && 'ring-2 ring-red-500'
          )}
          {...props}
        />

        {/* Value Display */}
        {showValue && (
          <div className="min-w-[3rem] text-right text-sm font-medium text-text">
            {value}
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
