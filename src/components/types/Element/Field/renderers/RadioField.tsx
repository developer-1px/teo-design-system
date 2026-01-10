/**
 * RadioField - 라디오 버튼 필드 렌더러
 *
 * Headless useSelectField + CVA styles 조합
 * radio 타입을 지원합니다.
 *
 * @example
 * <RadioField
 *   label="Gender"
 *   model="gender"
 *   type="radio"
 *   options={[
 *     { label: 'Male', value: 'male' },
 *     { label: 'Female', value: 'female' },
 *   ]}
 * />
 */

import type { FieldOption } from '@/components/types/Element/Field/Field.types';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { useSelectField } from '../headless/useSelectField';
import {
  checkboxStyles,
  errorStyles,
  fieldWrapperStyles,
  labelStyles,
  optionLabelStyles,
} from '../styles/field.styles';

export interface RadioFieldProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Data type
   */
  type: 'radio';

  /**
   * Available options
   */
  options: FieldOption[];

  /**
   * Prominence level
   */
  prominence?: Prominence;

  /**
   * Intent (semantic color)
   */
  intent?: Intent;

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Controlled value
   */
  value?: string | number | boolean;

  /**
   * Change handler
   */
  onChange?: (value: string | number | boolean) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export function RadioField(props: RadioFieldProps) {
  const {
    label,
    model,
    options,
    prominence = 'Standard',
    required = false,
    value,
    onChange,
    className,
    disabled = false,
  } = props;

  // Headless logic
  const field = useSelectField({
    model,
    options,
    value,
    required,
    multiple: false,
    onChange,
  });

  return (
    <fieldset className={cn(fieldWrapperStyles(), className)} disabled={disabled}>
      {/* Legend (acts as label) */}
      <legend className={labelStyles({ prominence, required })}>{label}</legend>

      {/* Radio options */}
      <div className="flex flex-col gap-2">
        {options.map((opt) => (
          <label
            key={String(opt.value)}
            className={optionLabelStyles({
              prominence,
              disabled: opt.disabled || disabled,
            })}
          >
            <input
              {...field.getInputProps(opt, 'radio')}
              className={checkboxStyles({ type: 'radio' })}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Error message */}
      {field.error && (
        <span className={errorStyles()} id={`${model}-error`} role="alert">
          {field.error}
        </span>
      )}
    </fieldset>
  );
}
