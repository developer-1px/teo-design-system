/**
 * DateField - 날짜/시간 입력 필드 렌더러
 *
 * date, datetime 타입을 지원합니다.
 * Headless hook 없이 간단한 네이티브 input 사용
 *
 * @example
 * <DateField
 *   label="Birth Date"
 *   model="user.birthDate"
 *   type="date"
 *   prominence="Standard"
 *   required
 * />
 */

import {
  fieldWrapperStyles,
  inputStyles,
  labelStyles,
} from '../styles/field.styles';
import type { FieldConstraints, Intent, Prominence } from '@/components/types/Atom/types';
import { cn } from '@/shared/lib/utils';

export interface DateFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Data type (determines input type)
   */
  type: 'date' | 'datetime';

  /**
   * Prominence level
   */
  prominence?: Prominence;

  /**
   * Intent (semantic color)
   */
  intent?: Intent;

  /**
   * Density (spacing)
   */
  density?: 'Comfortable' | 'Standard' | 'Compact';

  /**
   * Validation constraints
   */
  constraints?: FieldConstraints;

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Controlled value
   */
  value?: string;

  /**
   * Change handler
   */
  onChange?: (value: string) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export function DateField(props: DateFieldProps) {
  const {
    label,
    model,
    type,
    prominence = 'Standard',
    intent = 'Neutral',
    density = 'Standard',
    constraints,
    required = false,
    placeholder,
    value,
    onChange,
    className,
    disabled = false,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Input */}
      <input
        id={model}
        name={model}
        type={type === 'datetime' ? 'datetime-local' : 'date'}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={constraints?.min ? String(constraints.min) : undefined}
        max={constraints?.max ? String(constraints.max) : undefined}
        className={inputStyles({
          prominence,
          density,
          intent,
          dataType: type,
        })}
        data-model={model}
      />
    </div>
  );
}
