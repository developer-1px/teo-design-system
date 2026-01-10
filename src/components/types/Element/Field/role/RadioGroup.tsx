import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { Radio } from './Radio.tsx';

/**
 * RadioGroup - 라디오 버튼 그룹 (단일 선택)
 *
 * IDDL Field의 dataType: 'radio'를 위한 컴포넌트
 * @see spec/iddl-spec-1.0.1.md Section 4.1.2
 */
export interface RadioGroupOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  icon?: string;
}

export interface RadioGroupProps {
  /**
   * name - 라디오 그룹 이름 (필수)
   */
  name: string;

  /**
   * options - 선택지 목록
   */
  options: RadioGroupOption[];

  /**
   * value - 현재 선택된 값
   */
  value?: string | number | boolean;

  /**
   * onChange - 값 변경 핸들러
   */
  onChange?: (value: string | number | boolean) => void;

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

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      name,
      options,
      value,
      onChange,
      orientation = 'vertical',
      disabled = false,
      error = false,
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        role="radiogroup"
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
          const isChecked = String(value) === optionValue;

          return (
            <Radio
              key={optionValue}
              id={`${name}-${optionValue}`}
              name={name}
              value={optionValue}
              label={option.label}
              checked={isChecked}
              disabled={disabled || option.disabled}
              onChange={() => onChange?.(option.value)}
            />
          );
        })}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
