/**
 * useNumberField - 숫자 입력 필드 헤드리스 훅
 *
 * number, currency, range 타입에서 공통으로 사용되는 로직을 제공합니다.
 *
 * 제공 기능:
 * - 숫자 입력 관리 (controlled/uncontrolled)
 * - min/max/step 검증
 * - 키보드 증감 (ArrowUp/ArrowDown)
 * - 통화 포맷팅 (currency 타입)
 * - ARIA 접근성 자동 설정
 *
 * @example
 * const field = useNumberField({
 *   model: 'fontSize',
 *   value: 16,
 *   constraints: { min: 8, max: 72, step: 2 },
 *   onChange: setFontSize,
 * });
 *
 * <input {...field.getInputProps()} type="number" />
 * <input {...field.getRangeProps()} type="range" />
 */

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';
import type { FieldConstraints } from '@/components/types/Element/Field/Field.types';

export interface UseNumberFieldOptions {
  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Controlled value (optional)
   */
  value?: number;

  /**
   * Required field validation
   */
  required?: boolean;

  /**
   * Validation constraints (min, max, step)
   */
  constraints?: FieldConstraints;

  /**
   * Currency code (for currency type)
   * @example 'USD', 'KRW', 'EUR'
   */
  currency?: string;

  /**
   * Value change handler
   */
  onChange?: (value: number) => void;

  /**
   * Custom validation function (returns error message or null)
   */
  onValidate?: (value: number) => string | null;

  /**
   * Blur event handler
   */
  onBlur?: () => void;

  /**
   * Focus event handler
   */
  onFocus?: () => void;
}

export interface UseNumberFieldReturn {
  /**
   * Current value
   */
  value: number;

  /**
   * Current error message (null if no error)
   */
  error: string | null;

  /**
   * Input ref for focus management
   */
  inputRef: React.RefObject<HTMLInputElement | null>;

  /**
   * Props getter for number input element
   */
  getInputProps: () => {
    ref: React.RefObject<HTMLInputElement | null>;
    type: 'number';
    name: string;
    value: number;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    'aria-required'?: boolean;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    'aria-valuemin'?: number;
    'aria-valuemax'?: number;
    'aria-valuenow': number;
    'data-model': string;
  };

  /**
   * Props getter for range input element
   */
  getRangeProps: () => {
    ref: React.RefObject<HTMLInputElement | null>;
    type: 'range';
    name: string;
    value: number;
    required?: boolean;
    min?: number;
    max?: number;
    step?: number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    'aria-required'?: boolean;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    'aria-valuemin': number;
    'aria-valuemax': number;
    'aria-valuenow': number;
    'aria-orientation': 'horizontal';
    'data-model': string;
  };

  /**
   * Increment value by step
   */
  increment: () => void;

  /**
   * Decrement value by step
   */
  decrement: () => void;

  /**
   * Manual validation trigger
   */
  validate: () => string | null;

  /**
   * Manual value setter
   */
  setValue: (value: number) => void;

  /**
   * Format value as currency (if currency is set)
   */
  formatCurrency: (value: number) => string;
}

export function useFieldSpinbutton(options: UseNumberFieldOptions): UseNumberFieldReturn {
  const {
    model,
    value: controlledValue,
    required,
    constraints,
    currency,
    onChange,
    onValidate,
    onBlur,
    onFocus,
  } = options;

  // State
  const [internalValue, setInternalValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Controlled vs Uncontrolled
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  // Constraints with defaults
  const min = constraints?.min ?? Number.MIN_SAFE_INTEGER;
  const max = constraints?.max ?? Number.MAX_SAFE_INTEGER;
  const step = constraints?.step ?? (currency ? 0.01 : 1);

  /**
   * Validate value against constraints
   */
  const validate = (val: number): string | null => {
    // Required check
    if (required && (val === null || val === undefined)) {
      return 'This field is required';
    }

    // Min check
    if (val < min) {
      return `Value must be at least ${min}`;
    }

    // Max check
    if (val > max) {
      return `Value must be at most ${max}`;
    }

    // Custom validation
    if (onValidate) {
      const customError = onValidate(val);
      if (customError) return customError;
    }

    return null;
  };

  /**
   * Update value and trigger validation
   */
  const setValue = (newValue: number) => {
    // Clamp to min/max
    const clampedValue = Math.max(min, Math.min(max, newValue));

    if (!isControlled) {
      setInternalValue(clampedValue);
    }

    // Validate only if touched
    if (touched) {
      const validationError = validate(clampedValue);
      setError(validationError);
    }

    // Trigger onChange
    onChange?.(clampedValue);
  };

  /**
   * Handle input change
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!Number.isNaN(newValue)) {
      setValue(newValue);
    }
  };

  /**
   * Handle keyboard increment/decrement
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      increment();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      decrement();
    }
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
   * Handle focus
   */
  const handleFocus = () => {
    onFocus?.();
  };

  /**
   * Increment value by step
   */
  const increment = () => {
    setValue(value + step);
  };

  /**
   * Decrement value by step
   */
  const decrement = () => {
    setValue(value - step);
  };

  /**
   * Format value as currency
   */
  const formatCurrency = (val: number): string => {
    if (!currency) return String(val);

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
      }).format(val);
    } catch {
      return `${currency} ${val.toFixed(2)}`;
    }
  };

  /**
   * Get number input props
   */
  const getInputProps = () => ({
    ref: inputRef,
    type: 'number' as const,
    name: model,
    value,
    required,
    min: constraints?.min,
    max: constraints?.max,
    step: currency ? 0.01 : constraints?.step,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    onFocus: handleFocus,
    'aria-required': required ? true : undefined,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${model}-error` : undefined,
    'aria-valuemin': constraints?.min,
    'aria-valuemax': constraints?.max,
    'aria-valuenow': value,
    'data-model': model,
  });

  /**
   * Get range input props
   */
  const getRangeProps = () => ({
    ref: inputRef,
    type: 'range' as const,
    name: model,
    value,
    required,
    min: constraints?.min ?? 0,
    max: constraints?.max ?? 100,
    step: constraints?.step,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    'aria-required': required ? true : undefined,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${model}-error` : undefined,
    'aria-valuemin': constraints?.min ?? 0,
    'aria-valuemax': constraints?.max ?? 100,
    'aria-valuenow': value,
    'aria-orientation': 'horizontal' as const,
    'data-model': model,
  });

  return {
    value,
    error,
    inputRef,
    getInputProps,
    getRangeProps,
    increment,
    decrement,
    validate: () => validate(value),
    setValue,
    formatCurrency,
  };
}
