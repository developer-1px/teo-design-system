/**
 * useTextareaField - 텍스트 영역 필드 헤드리스 훅
 *
 * textarea, richtext 타입에서 공통으로 사용되는 로직을 제공합니다.
 *
 * 제공 기능:
 * - 입력 값 관리 (controlled/uncontrolled)
 * - 실시간 검증 (minLength, maxLength, required)
 * - rows 관리
 * - ARIA 접근성 자동 설정
 *
 * @example
 * const field = useTextareaField({
 *   model: 'description',
 *   value: description,
 *   required: true,
 *   constraints: { minLength: 10, maxLength: 500 },
 *   rows: 4,
 *   onChange: setDescription,
 * });
 *
 * <textarea {...field.getTextareaProps()} />
 */

import { type ChangeEvent, useRef, useState } from 'react';
import type { FieldConstraints } from '@/components/types/Atom/types';

export interface UseTextareaFieldOptions {
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
   * Validation constraints (minLength, maxLength)
   */
  constraints?: FieldConstraints;

  /**
   * Number of visible text rows
   */
  rows?: number;

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

export interface UseTextareaFieldReturn {
  /**
   * Current value
   */
  value: string;

  /**
   * Current error message (null if no error)
   */
  error: string | null;

  /**
   * Character count info
   */
  characterCount: {
    current: number;
    max?: number;
    percentage?: number;
  };

  /**
   * Textarea ref for focus management
   */
  textareaRef: React.RefObject<HTMLTextAreaElement>;

  /**
   * Props getter for textarea element
   */
  getTextareaProps: () => {
    ref: React.RefObject<HTMLTextAreaElement>;
    name: string;
    value: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    rows?: number;
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    'aria-required'?: boolean;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    'data-model': string;
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

export function useTextareaField(options: UseTextareaFieldOptions): UseTextareaFieldReturn {
  const {
    model,
    value: controlledValue,
    required,
    constraints,
    rows = 4,
    onChange,
    onValidate,
    onBlur,
    onFocus,
  } = options;

  // State
  const [internalValue, setInternalValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
   * Handle textarea change
   */
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
    textareaRef.current?.focus();
  };

  /**
   * Character count info
   */
  const characterCount = {
    current: value.length,
    max: constraints?.maxLength,
    percentage: constraints?.maxLength
      ? Math.round((value.length / constraints.maxLength) * 100)
      : undefined,
  };

  /**
   * Get textarea props
   */
  const getTextareaProps = () => ({
    ref: textareaRef,
    name: model,
    value,
    required,
    minLength: constraints?.minLength,
    maxLength: constraints?.maxLength,
    rows,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    'aria-required': required ? true : undefined,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${model}-error` : undefined,
    'data-model': model,
  });

  return {
    value,
    error,
    characterCount,
    textareaRef,
    getTextareaProps,
    validate: () => validate(value),
    setValue,
    clear,
  };
}
