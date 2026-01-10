/**
 * NumberField - 숫자 입력 필드 렌더러
 *
 * Headless useNumberField + CVA styles 조합
 * number, currency, range 타입을 지원합니다.
 *
 * @example
 * <NumberField
 *   label="Font Size"
 *   model="fontSize"
 *   type="number"
 *   constraints={{ min: 8, max: 72 }}
 * />
 *
 * <NumberField
 *   label="Opacity"
 *   model="opacity"
 *   type="range"
 *   constraints={{ min: 0, max: 100 }}
 * />
 */

import { useNumberField } from '../headless/useNumberField';
import {
  errorStyles,
  fieldWrapperStyles,
  inputStyles,
  labelStyles,
  rangeLabelsStyles,
  rangeStyles,
} from '../styles/field.styles';
import type { FieldConstraints, Intent, Prominence } from '@/components/types/Atom/types';
import { cn } from '@/shared/lib/utils';

export interface NumberFieldProps {
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
  type: 'number' | 'currency' | 'range';

  /**
   * Prominence level
   */
  prominence?: Prominence;

  /**
   * Intent (semantic color)
   */
  intent?: Intent;

  /**
   * Validation constraints (min, max, step)
   */
  constraints?: FieldConstraints;

  /**
   * Currency code (for currency type)
   */
  currency?: string;

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
  value?: number;

  /**
   * Change handler
   */
  onChange?: (value: number) => void;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export function NumberField(props: NumberFieldProps) {
  const {
    label,
    model,
    type,
    prominence = 'Standard',
    intent = 'Neutral',
    constraints,
    currency,
    required = false,
    placeholder,
    value,
    onChange,
    className,
    disabled = false,
  } = props;

  // Headless logic
  const field = useNumberField({
    model,
    value,
    required,
    constraints,
    currency,
    onChange,
  });

  // Render range slider
  if (type === 'range') {
    return (
      <div className={cn(fieldWrapperStyles(), className)}>
        {/* Label */}
        <label htmlFor={model} className={labelStyles({ prominence, required })}>
          {label}
        </label>

        {/* Range input */}
        <div>
          <input
            {...field.getRangeProps()}
            id={model}
            disabled={disabled}
            className={rangeStyles()}
          />

          {/* Min/Max labels */}
          <div className={rangeLabelsStyles()}>
            <span>{constraints?.min ?? 0}</span>
            <span className="font-semibold text-text">{field.value}</span>
            <span>{constraints?.max ?? 100}</span>
          </div>
        </div>

        {/* Error message */}
        {field.error && (
          <span className={errorStyles()} id={`${model}-error`} role="alert">
            {field.error}
          </span>
        )}
      </div>
    );
  }

  // Render number/currency input
  return (
    <div className={cn(fieldWrapperStyles(), className)}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Number input */}
      <input
        {...field.getInputProps()}
        id={model}
        placeholder={placeholder}
        disabled={disabled}
        className={inputStyles({
          prominence,
          intent,
          error: !!field.error,
          dataType: type,
        })}
      />

      {/* Error message */}
      {field.error && (
        <span className={errorStyles()} id={`${model}-error`} role="alert">
          {field.error}
        </span>
      )}

      {/* Currency display (if currency type) */}
      {type === 'currency' && !field.error && field.value > 0 && (
        <span className="text-xs text-subtle">{field.formatCurrency(field.value)}</span>
      )}
    </div>
  );
}
