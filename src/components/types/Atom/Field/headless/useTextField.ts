/**
 * useTextField - 텍스트 입력 필드 헤드리스 훅
 *
 * text, email, url, phone, password 타입에서 공통으로 사용되는 로직을 제공합니다.
 *
 * 제공 기능:
 * - 입력 값 관리 (controlled/uncontrolled)
 * - 실시간 검증 (minLength, maxLength, pattern, required)
 * - clearable 버튼 지원
 * - ARIA 접근성 자동 설정
 *
 * @example
 * const field = useTextField({
 *   model: 'email',
 *   value: email,
 *   required: true,
 *   constraints: { pattern: '^[^@]+@[^@]+\\.[^@]+$' },
 *   clearable: true,
 *   onChange: setEmail,
 * });
 *
 * <input {...field.getInputProps()} />
 * {field.showClearButton && <button {...field.getClearButtonProps()}>Clear</button>}
 */

import { type ChangeEvent, useRef, useState } from 'react';
import type { FieldConstraints } from '@/components/types/Atom/types';

export interface UseTextFieldOptions {
  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Controlled value (optional)
   */
  value?: string;

  /**
   * Required field validation
   */
  required?: boolean;

  /**
   * Validation constraints (minLength, maxLength, pattern)
   */
  constraints?: FieldConstraints;

  /**
   * Show clear button when value exists
   */
  clearable?: boolean;

  /**
   * Value change handler
   */
  onChange?: (value: string) => void;

  /**
   * Custom validation function (returns error message or null)
   */
  onValidate?: (value: string) => string | null;

  /**
   * Blur event handler
   */
  onBlur?: () => void;

  /**
   * Focus event handler
   */
  onFocus?: () => void;
}

export interface UseTextFieldReturn {
  /**
   * Current value
   */
  value: string;

  /**
   * Current error message (null if no error)
   */
  error: string | null;

  /**
   * Whether to show clear button
   */
  showClearButton: boolean;

  /**
   * Input ref for focus management
   */
  inputRef: React.RefObject<HTMLInputElement>;

  /**
   * Props getter for input element
   */
  getInputProps: () => {
    ref: React.RefObject<HTMLInputElement>;
    name: string;
    value: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    'aria-required'?: boolean;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    'data-model': string;
  };

  /**
   * Props getter for clear button
   */
  getClearButtonProps: () => {
    onClick: () => void;
    'aria-label': string;
    type: 'button';
    tabIndex: number;
  };

  /**
   * Manual validation trigger
   */
  validate: () => string | null;

  /**
   * Manual value setter
   */
  setValue: (value: string) => void;

  /**
   * Clear value and error
   */
  clear: () => void;
}

export function useTextField(options: UseTextFieldOptions): UseTextFieldReturn {
  const {
    model,
    value: controlledValue,
    required,
    constraints,
    clearable = false,
    onChange,
    onValidate,
    onBlur,
    onFocus,
  } = options;

  // State
  const [internalValue, setInternalValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Controlled vs Uncontrolled
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  /**
   * Validate value against constraints
   */
  const validate = (val: string): string | null => {
    // Required check
    if (required && !val.trim()) {
      return 'This field is required';
    }

    // Min length
    if (constraints?.minLength && val.length < constraints.minLength) {
      return `Minimum ${constraints.minLength} characters required`;
    }

    // Max length
    if (constraints?.maxLength && val.length > constraints.maxLength) {
      return `Maximum ${constraints.maxLength} characters allowed`;
    }

    // Pattern (regex)
    if (constraints?.pattern && val) {
      try {
        const regex = new RegExp(constraints.pattern);
        if (!regex.test(val)) {
          return constraints.patternMessage ?? 'Invalid format';
        }
      } catch (e) {
        console.error('Invalid regex pattern:', constraints.pattern);
      }
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
  const setValue = (newValue: string) => {
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
   * Handle input change
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
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
   * Clear value and error
   */
  const clear = () => {
    setValue('');
    setError(null);
    inputRef.current?.focus();
  };

  /**
   * Get input props
   */
  const getInputProps = () => ({
    ref: inputRef,
    name: model,
    value,
    required,
    minLength: constraints?.minLength,
    maxLength: constraints?.maxLength,
    pattern: constraints?.pattern,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    'aria-required': required ? true : undefined,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${model}-error` : undefined,
    'data-model': model,
  });

  /**
   * Get clear button props
   */
  const getClearButtonProps = () => ({
    onClick: clear,
    'aria-label': 'Clear input',
    type: 'button' as const,
    tabIndex: -1, // Not in tab order, only clickable
  });

  return {
    value,
    error,
    showClearButton: clearable && value.length > 0,
    inputRef,
    getInputProps,
    getClearButtonProps,
    validate: () => validate(value),
    setValue,
    clear,
  };
}
