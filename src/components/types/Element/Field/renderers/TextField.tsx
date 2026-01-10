/**
 * TextField - 텍스트 입력 필드 렌더러
 *
 * Headless useTextField + CVA styles 조합
 * text, email, url, phone, password 타입을 지원합니다.
 *
 * @example
 * <TextField
 *   label="Email"
 *   model="user.email"
 *   type="email"
 *   prominence="Standard"
 *   required
 *   clearable
 * />
 */

import { X } from 'lucide-react';
import type { FieldConstraints } from '@/components/types/Element/Field/Field.types';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { useTextField } from '../headless/useTextField';
import {
  clearButtonStyles,
  errorStyles,
  fieldWrapperStyles,
  inputStyles,
  labelStyles,
} from '../styles/field.styles';

export interface TextFieldProps {
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
  type: 'text' | 'email' | 'url' | 'phone' | 'password';

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
   * Show clear button when value exists
   */
  clearable?: boolean;

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

export function TextField(props: TextFieldProps) {
  const {
    label,
    model,
    type,
    prominence = 'Standard',
    intent = 'Neutral',
    density = 'Standard',
    constraints,
    clearable = false,
    required = false,
    placeholder,
    value,
    onChange,
    className,
    disabled = false,
  } = props;

  // Headless logic
  const field = useTextField({
    model,
    value,
    required,
    constraints,
    clearable,
    onChange,
  });

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Input with clear button */}
      <div className="relative">
        <input
          {...field.getInputProps()}
          id={model}
          type={type === 'phone' ? 'tel' : type}
          placeholder={placeholder}
          disabled={disabled}
          className={inputStyles({
            prominence,
            density,
            intent,
            error: !!field.error,
            dataType: type,
          })}
        />

        {/* Clear button */}
        {field.showClearButton && !disabled && (
          <button {...field.getClearButtonProps()} className={clearButtonStyles()}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Error message */}
      {field.error && (
        <span className={errorStyles()} id={`${model}-error`} role="alert">
          {field.error}
        </span>
      )}

      {/* Helper text (pattern message) */}
      {constraints?.patternMessage && !field.error && (
        <span className="text-xs text-subtle">{constraints.patternMessage}</span>
      )}
    </div>
  );
}
