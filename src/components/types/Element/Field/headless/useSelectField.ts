/**
 * useSelectField - 선택 입력 필드 헤드리스 훅
 *
 * select, multiselect, radio, checkbox-group 타입에서 공통으로 사용되는 로직을 제공합니다.
 *
 * 제공 기능:
 * - 단일/다중 선택 관리
 * - 키보드 네비게이션 (Arrow keys, Enter, Space)
 * - 검색/필터링 (select 타입)
 * - ARIA 접근성 자동 설정
 *
 * @example
 * const field = useSelectField({
 *   model: 'country',
 *   options: [{ label: 'Korea', value: 'kr' }, { label: 'USA', value: 'us' }],
 *   value: 'kr',
 *   onChange: setCountry,
 * });
 *
 * <select {...field.getSelectProps()}>
 *   {field.options.map(opt => (
 *     <option key={opt.value} {...field.getOptionProps(opt)}>
 *       {opt.label}
 *     </option>
 *   ))}
 * </select>
 */

import { type ChangeEvent, useState } from 'react';
import type { FieldOption } from '@/components/types/Element/Field/Field.types';

export interface UseSelectFieldOptions {
  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Available options
   */
  options: FieldOption[];

  /**
   * Controlled value (단일 선택: string | number, 다중 선택: array)
   */
  value?: string | number | boolean | (string | number | boolean)[];

  /**
   * Required field validation
   */
  required?: boolean;

  /**
   * Enable multiple selection
   */
  multiple?: boolean;

  /**
   * Enable search/filter (for select/combobox)
   */
  searchable?: boolean;

  /**
   * Value change handler
   */
  onChange?: (value: string | number | boolean | (string | number | boolean)[]) => void;

  /**
   * Blur event handler
   */
  onBlur?: () => void;

  /**
   * Focus event handler
   */
  onFocus?: () => void;
}

export interface UseSelectFieldReturn {
  /**
   * Current value (단일 or 다중)
   */
  value: string | number | boolean | (string | number | boolean)[] | undefined;

  /**
   * Current error message (null if no error)
   */
  error: string | null;

  /**
   * Filtered options (when searchable)
   */
  options: FieldOption[];

  /**
   * Search query (for searchable select)
   */
  searchQuery: string;

  /**
   * Set search query
   */
  setSearchQuery: (query: string) => void;

  /**
   * Props getter for select element
   */
  getSelectProps: () => {
    name: string;
    value: string | string[];
    required?: boolean;
    multiple?: boolean;
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    'aria-required'?: boolean;
    'aria-invalid': boolean;
    'aria-describedby'?: string;
    'data-model': string;
  };

  /**
   * Props getter for option element
   */
  getOptionProps: (option: FieldOption) => {
    value: string;
    disabled?: boolean;
    selected?: boolean;
  };

  /**
   * Props getter for radio/checkbox input
   */
  getInputProps: (option: FieldOption, type: 'radio' | 'checkbox') => {
    type: 'radio' | 'checkbox';
    name: string;
    value: string;
    checked: boolean;
    required?: boolean;
    disabled?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
    'aria-invalid': boolean;
    'data-model': string;
  };

  /**
   * Check if option is selected
   */
  isSelected: (option: FieldOption) => boolean;

  /**
   * Select an option (or toggle in multiple mode)
   */
  select: (value: string | number | boolean) => void;

  /**
   * Manual validation trigger
   */
  validate: () => string | null;
}

export function useSelectField(options: UseSelectFieldOptions): UseSelectFieldReturn {
  const {
    model,
    options: fieldOptions,
    value: controlledValue,
    required,
    multiple = false,
    searchable = false,
    onChange,
    onBlur,
    onFocus,
  } = options;

  // State
  const [internalValue, setInternalValue] = useState<
    string | number | boolean | (string | number | boolean)[] | undefined
  >(multiple ? [] : undefined);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Controlled vs Uncontrolled
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  /**
   * Filter options by search query
   */
  const filteredOptions = searchable
    ? fieldOptions.filter((opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : fieldOptions;

  /**
   * Validate value
   */
  const validate = (): string | null => {
    if (required) {
      if (multiple) {
        if (!Array.isArray(value) || value.length === 0) {
          return 'Please select at least one option';
        }
      } else {
        if (value === undefined || value === null || value === '') {
          return 'Please select an option';
        }
      }
    }
    return null;
  };

  /**
   * Check if option is selected
   */
  const isSelected = (option: FieldOption): boolean => {
    if (multiple && Array.isArray(value)) {
      return value.includes(option.value);
    }
    return value === option.value;
  };

  /**
   * Select an option
   */
  const select = (optionValue: string | number | boolean) => {
    let newValue: string | number | boolean | (string | number | boolean)[];

    if (multiple) {
      const currentArray = Array.isArray(value) ? value : [];
      if (currentArray.includes(optionValue)) {
        // Remove from selection
        newValue = currentArray.filter((v) => v !== optionValue);
      } else {
        // Add to selection
        newValue = [...currentArray, optionValue];
      }
    } else {
      newValue = optionValue;
    }

    if (!isControlled) {
      setInternalValue(newValue);
    }

    // Validate if touched
    if (touched) {
      setError(validate());
    }

    onChange?.(newValue);
  };

  /**
   * Handle select change
   */
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
      select(selectedOptions as any);
    } else {
      select(e.target.value);
    }
  };

  /**
   * Handle radio/checkbox change
   */
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>, optionValue: string | number | boolean) => {
    select(optionValue);
  };

  /**
   * Handle blur
   */
  const handleBlur = () => {
    setTouched(true);
    setError(validate());
    onBlur?.();
  };

  /**
   * Handle focus
   */
  const handleFocus = () => {
    onFocus?.();
  };

  /**
   * Get select props
   */
  const getSelectProps = () => ({
    name: model,
    value: multiple
      ? Array.isArray(value)
        ? value.map(String)
        : []
      : value !== undefined
        ? String(value)
        : '',
    required,
    multiple,
    onChange: handleSelectChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    'aria-required': required ? true : undefined,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${model}-error` : undefined,
    'data-model': model,
  });

  /**
   * Get option props
   */
  const getOptionProps = (option: FieldOption) => ({
    value: String(option.value),
    disabled: option.disabled,
    selected: isSelected(option),
  });

  /**
   * Get radio/checkbox input props
   */
  const getInputProps = (option: FieldOption, type: 'radio' | 'checkbox') => ({
    type,
    name: type === 'radio' ? model : `${model}[]`,
    value: String(option.value),
    checked: isSelected(option),
    required: type === 'radio' ? required : undefined,
    disabled: option.disabled,
    onChange: (e: ChangeEvent<HTMLInputElement>) => handleInputChange(e, option.value),
    onBlur: handleBlur,
    onFocus: handleFocus,
    'aria-invalid': !!error,
    'data-model': model,
  });

  return {
    value,
    error,
    options: filteredOptions,
    searchQuery,
    setSearchQuery,
    getSelectProps,
    getOptionProps,
    getInputProps,
    isSelected,
    select,
    validate,
  };
}
