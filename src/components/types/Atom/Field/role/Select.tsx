import { ChevronDown } from 'lucide-react';
import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils.ts';

/**
 * Select - 단일 선택 드롭다운
 *
 * IDDL Field의 dataType: 'select'를 위한 컴포넌트
 * @see spec/iddl-spec-1.0.1.md Section 4.1.2
 */
export interface SelectOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  /**
   * options - 선택지 목록
   */
  options: SelectOption[];

  /**
   * placeholder - 빈 값일 때 표시할 텍스트
   */
  placeholder?: string;

  /**
   * variant - 스타일 변형
   */
  variant?: 'default' | 'ghost';

  /**
   * error - 에러 상태
   */
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options = [], placeholder, variant = 'default', error, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            // Base styles
            'w-full rounded-md text-sm font-normal appearance-none',
            'transition-all cursor-pointer',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
            'disabled:cursor-not-allowed disabled:opacity-50',

            // Padding for chevron icon
            'pr-10',

            // Variants
            {
              // Default - layer-1 배경 (sunken)
              'bg-surface-sunken px-3 py-2 border-0 shadow-inset': variant === 'default',

              // Ghost - 투명 배경
              'bg-transparent px-2 py-1 border border-default': variant === 'ghost',
            },

            // Error state
            error && 'ring-2 ring-red-500 focus-visible:ring-red-500',

            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={String(option.value)}
              value={String(option.value)}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Chevron Icon */}
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-subtle"
        />
      </div>
    );
  }
);

Select.displayName = 'Select';
