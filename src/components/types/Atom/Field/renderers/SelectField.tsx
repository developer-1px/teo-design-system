/**
 * SelectField - 선택 입력 필드 렌더러
 *
 * Headless useSelectField + CVA styles 조합
 * select, multiselect 타입을 지원합니다.
 *
 * @example
 * <SelectField
 *   label="Country"
 *   model="country"
 *   dataType="select"
 *   options={[
 *     { label: 'Korea', value: 'kr' },
 *     { label: 'USA', value: 'us' },
 *   ]}
 * />
 */

import { useSelectField } from '../headless/useSelectField';
import {
  errorStyles,
  fieldWrapperStyles,
  labelStyles,
  selectStyles,
} from '../styles/field.styles';
import type { FieldOption, Intent, Prominence } from '@/components/types/Atom/types';
import { cn } from '@/shared/lib/utils';

export interface SelectFieldProps {
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
  dataType: 'select' | 'multiselect';

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
   * Density (spacing)
   */
  density?: 'Comfortable' | 'Standard' | 'Compact';

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Placeholder text (first option)
   */
  placeholder?: string;

  /**
   * Controlled value
   */
  value?: string | number | boolean | (string | number | boolean)[];

  /**
   * Change handler
   */
  onChange?: (value: string | number | boolean | (string | number | boolean)[]) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export function SelectField(props: SelectFieldProps) {
  const {
    label,
    model,
    dataType,
    options,
    prominence = 'Standard',
    intent = 'Neutral',
    density = 'Standard',
    required = false,
    placeholder = 'Select...',
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
    multiple: dataType === 'multiselect',
    onChange,
  });

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Select input */}
      <select
        {...field.getSelectProps()}
        id={model}
        disabled={disabled}
        className={cn(
          selectStyles({
            prominence,
            density,
            intent,
            error: !!field.error,
            multiple: dataType === 'multiselect',
          })
        )}
      >
        {/* Placeholder option (single select only) */}
        {dataType === 'select' && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {/* Options */}
        {field.options.map((opt) => (
          <option key={String(opt.value)} {...field.getOptionProps(opt)}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Error message */}
      {field.error && (
        <span className={errorStyles()} id={`${model}-error`} role="alert">
          {field.error}
        </span>
      )}
    </div>
  );
}
