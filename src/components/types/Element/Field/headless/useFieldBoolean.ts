/**
 * useBooleanField - 불리언 입력 필드 헤드리스 훅
 *
 * boolean 타입 (checkbox, switch, toggle)에서 공통으로 사용되는 로직을 제공합니다.
 *
 * 제공 기능:
 * - 체크 상태 관리 (controlled/uncontrolled)
 * - 키보드 토글 (Space, Enter)
 * - ARIA 접근성 자동 설정 (switch는 aria-checked, checkbox는 checked)
 *
 * @example
 * const field = useBooleanField({
 *   model: 'darkMode',
 *   value: isDarkMode,
 *   onChange: setIsDarkMode,
 * });
 *
 * <input {...field.getCheckboxProps()} type="checkbox" />
 * <button {...field.getSwitchProps()}>Toggle</button>
 */

import { type ChangeEvent, type KeyboardEvent, useRef, useState } from 'react';

export interface UseBooleanFieldOptions {
  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Controlled value (optional)
   */
  value?: boolean;

  /**
   * Required field validation (must be true)
   */
  required?: boolean;

  /**
   * Value change handler
   */
  onChange?: (value: boolean) => void;

  /**
   * Blur event handler
   */
  onBlur?: () => void;

  /**
   * Focus event handler
   */
  onFocus?: () => void;
}

export interface UseBooleanFieldReturn {
  /**
   * Current checked state
   */
  checked: boolean;

  /**
   * Current error message (null if no error)
   */
  error: string | null;

  /**
   * Input ref for focus management
   */
  inputRef: React.RefObject<HTMLInputElement | HTMLButtonElement | null>;

  /**
   * Props getter for checkbox input
   */
  getCheckboxProps: () => {
    ref: React.RefObject<HTMLInputElement | null>;
    type: 'checkbox';
    name: string;
    checked: boolean;
    required?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    'data-model': string;
  };

  /**
   * Props getter for switch button (role="switch")
   */
  getSwitchProps: () => {
    ref: React.RefObject<HTMLButtonElement | null>;
    type: 'button';
    role: 'switch';
    'aria-checked': boolean;
    'aria-required'?: boolean;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    'data-model': string;
  };

  /**
   * Props getter for toggle button (role="button")
   */
  getToggleProps: () => {
    ref: React.RefObject<HTMLButtonElement | null>;
    type: 'button';
    role: 'button';
    'aria-pressed': boolean;
    'aria-required'?: boolean;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    onClick: () => void;
    onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    'data-model': string;
  };

  /**
   * Toggle checked state
   */
  toggle: () => void;

  /**
   * Manual validation trigger
   */
  validate: () => string | null;

  /**
   * Manual value setter
   */
  setChecked: (value: boolean) => void;
}

export function useFieldBoolean(options: UseBooleanFieldOptions): UseBooleanFieldReturn {
  const { model, value: controlledValue, required, onChange, onBlur, onFocus } = options;

  // State
  const [internalValue, setInternalValue] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLButtonElement>(null);

  // Controlled vs Uncontrolled
  const checked = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  /**
   * Validate value
   */
  const validate = (val: boolean): string | null => {
    // Required check (must be true)
    if (required && !val) {
      return 'This field must be checked';
    }
    return null;
  };

  /**
   * Update value and trigger validation
   */
  const setChecked = (newValue: boolean) => {
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
   * Toggle checked state
   */
  const toggle = () => {
    setChecked(!checked);
  };

  /**
   * Handle checkbox change
   */
  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  };

  /**
   * Handle keyboard events for switch/toggle
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  /**
   * Handle blur (mark as touched, validate)
   */
  const handleBlur = () => {
    setTouched(true);
    const validationError = validate(checked);
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
   * Get checkbox props
   */
  const getCheckboxProps = () => ({
    ref: inputRef as React.RefObject<HTMLInputElement | null>,
    type: 'checkbox' as const,
    name: model,
    checked,
    required,
    onChange: handleCheckboxChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${model}-error` : undefined,
    'data-model': model,
  });

  /**
   * Get switch props (role="switch")
   */
  const getSwitchProps = () => ({
    ref: inputRef as React.RefObject<HTMLButtonElement | null>,
    type: 'button' as const,
    role: 'switch' as const,
    'aria-checked': checked,
    'aria-required': required,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${model}-error` : undefined,
    onClick: toggle,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    onFocus: handleFocus,
    'data-model': model,
  });

  /**
   * Get toggle button props (role="button", aria-pressed)
   */
  const getToggleProps = () => ({
    ref: inputRef as React.RefObject<HTMLButtonElement | null>,
    type: 'button' as const,
    role: 'button' as const,
    'aria-pressed': checked,
    'aria-required': required,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${model}-error` : undefined,
    onClick: toggle,
    onKeyDown: handleKeyDown,
    onBlur: handleBlur,
    onFocus: handleFocus,
    'data-model': model,
  });

  return {
    checked,
    error,
    inputRef,
    getCheckboxProps,
    getSwitchProps,
    getToggleProps,
    toggle,
    validate: () => validate(checked),
    setChecked,
  };
}
