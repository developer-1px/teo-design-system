/**
 * useCheckboxField - 체크박스 그룹 헤드리스 훅
 *
 * checkbox 타입에서 사용되는 다중 선택 로직을 제공합니다.
 *
 * 제공 기능:
 * - 다중 선택 값 관리 (controlled/uncontrolled)
 * - 개별 체크박스 상태 관리
 * - required 검증 (최소 1개 선택)
 * - ARIA 접근성 자동 설정
 *
 * @example
 * const field = useCheckboxField({
 *   model: 'interests',
 *   options: [
 *     { label: 'Sports', value: 'sports' },
 *     { label: 'Music', value: 'music' },
 *   ],
 *   value: ['sports'],
 *   required: true,
 *   onChange: setInterests,
 * });
 *
 * {field.options.map(opt => (
 *   <label key={opt.value}>
 *     <input {...field.getCheckboxProps(opt.value)} />
 *     {opt.label}
 *   </label>
 * ))}
 */

import { useState } from 'react';
import type { FieldOption } from '@/components/types/Element/Field/Field.types';

export interface UseCheckboxFieldOptions {
  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Available options
   */
  options: FieldOption[];

  /**
   * Controlled value (selected values array)
   */
  value?: Array<string | number | boolean>;

  /**
   * Required field validation (at least one must be selected)
   */
  required?: boolean;

  /**
   * Value change handler
   */
  onChange?: (value: Array<string | number | boolean>) => void;

  /**
   * Blur event handler
   */
  onBlur?: () => void;
}

export interface UseCheckboxFieldReturn {
  /**
   * Current selected values
   */
  value: Array<string | number | boolean>;

  /**
   * Current error message (null if no error)
   */
  error: string | null;

  /**
   * Available options
   */
  options: FieldOption[];

  /**
   * Props getter for individual checkbox
   */
  getCheckboxProps: (optionValue: string | number | boolean) => {
    name: string;
    value: string;
    checked: boolean;
    disabled?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    'aria-required'?: boolean;
    'aria-invalid': boolean;
    'data-model': string;
  };

  /**
   * Check if an option is selected
   */
  isChecked: (optionValue: string | number | boolean) => boolean;

  /**
   * Manual validation trigger
   */
  validate: () => string | null;

  /**
   * Manual value setter
   */
  setValue: (value: Array<string | number | boolean>) => void;

  /**
   * Clear all selections
   */
  clear: () => void;
}

export function useFieldCheckbox(options: UseCheckboxFieldOptions): UseCheckboxFieldReturn {
  const {
    model,
    options: checkboxOptions,
    value: controlledValue,
    required,
    onChange,
    onBlur,
  } = options;

  // State
  const [internalValue, setInternalValue] = useState<Array<string | number | boolean>>([]);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  // Controlled vs Uncontrolled
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  /**
   * Validate value against constraints
   */
  const validate = (val: Array<string | number | boolean>): string | null => {
    // Required check (at least one selected)
    if (required && val.length === 0) {
      return 'At least one option must be selected';
    }

    return null;
  };

  /**
   * Update value and trigger validation
   */
  const setValue = (newValue: Array<string | number | boolean>) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }

    // Validate only if touched
    if (touched) {
      const validationError = validate(newValue);
      setError(validationError);
    }

    // Trigger onChange
    onChange?.(newValue);
  };

  /**
   * Check if an option is selected
   */
  const isChecked = (optionValue: string | number | boolean): boolean => {
    return value.includes(optionValue);
  };

  /**
   * Handle checkbox change
   */
  const handleChange =
    (optionValue: string | number | boolean) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      let newValue: Array<string | number | boolean>;

      if (checked) {
        // Add to selection
        newValue = [...value, optionValue];
      } else {
        // Remove from selection
        newValue = value.filter((v) => v !== optionValue);
      }

      setValue(newValue);
    };

  /**
   * Handle blur (mark as touched, validate)
   */
  const handleBlur = () => {
    setTouched(true);
    const validationError = validate(value);
    setError(validationError);
    onBlur?.();
  };

  /**
   * Clear all selections
   */
  const clear = () => {
    setValue([]);
    setError(null);
  };

  /**
   * Get checkbox props for a specific option
   */
  const getCheckboxProps = (optionValue: string | number | boolean) => {
    const option = checkboxOptions.find((opt) => opt.value === optionValue);

    return {
      name: `${model}[]`,
      value: String(optionValue),
      checked: isChecked(optionValue),
      disabled: option?.disabled,
      onChange: handleChange(optionValue),
      onBlur: handleBlur,
      'aria-required': required ? true : undefined,
      'aria-invalid': !!error,
      'data-model': model,
    };
  };

  return {
    value,
    error,
    options: checkboxOptions,
    getCheckboxProps,
    isChecked,
    validate: () => validate(value),
    setValue,
    clear,
  };
}
