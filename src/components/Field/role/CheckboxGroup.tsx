import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { Checkbox } from './Checkbox';

/**
 * CheckboxGroup - 체크박스 그룹 (다중 선택)
 *
 * IDDL Field의 dataType: 'checkbox'를 위한 컴포넌트
 * @see spec/iddl-spec-1.0.1.md Section 4.1.2
 */
export interface CheckboxGroupOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  icon?: string;
}

export interface CheckboxGroupProps {
  /**
   * name - 체크박스 그룹 이름
   */
  name: string;

  /**
   * options - 선택지 목록
   */
  options: CheckboxGroupOption[];

  /**
   * value - 현재 선택된 값들 (배열)
   */
  value?: Array<string | number | boolean>;

  /**
   * onChange - 값 변경 핸들러
   */
  onChange?: (value: Array<string | number | boolean>) => void;

  /**
   * orientation - 배치 방향
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * disabled - 전체 비활성화
   */
  disabled?: boolean;

  /**
   * error - 에러 상태
   */
  error?: boolean;

  /**
   * className - 추가 스타일
   */
  className?: string;
}

export const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  (
    {
      name,
      options,
      value = [],
      onChange,
      orientation = 'vertical',
      disabled = false,
      error = false,
      className,
    },
    ref
  ) => {
    const handleChange = (optionValue: string | number | boolean, checked: boolean) => {
      if (!onChange) return;

      const currentValue = value || [];
      if (checked) {
        // Add to array
        onChange([...currentValue, optionValue]);
      } else {
        // Remove from array
        onChange(currentValue.filter((v) => String(v) !== String(optionValue)));
      }
    };

    return (
      <div
        ref={ref}
        role="group"
        className={cn(
          'flex gap-3',
          orientation === 'vertical' && 'flex-col',
          orientation === 'horizontal' && 'flex-row flex-wrap',
          error && 'ring-2 ring-red-500 rounded-md p-2',
          className
        )}
      >
        {options.map((option) => {
          const optionValue = String(option.value);
          const isChecked = value.some((v) => String(v) === optionValue);

          return (
            <Checkbox
              key={optionValue}
              id={`${name}-${optionValue}`}
              name={name}
              value={optionValue}
              label={option.label}
              checked={isChecked}
              disabled={disabled || option.disabled}
              onChange={(e) => handleChange(option.value, e.target.checked)}
            />
          );
        })}
      </div>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';
