/**
 * useListboxField - Listbox 헤드리스 훅
 *
 * IDDL Field Spec: Choice Category - Listbox
 * 항상 보이는 선택 목록 (드롭다운 아님)
 *
 * @see docs/2-areas/spec/4-element/field/field.spec.md#625-listbox
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { FieldOption } from '../Field.types';

export interface UseListboxFieldOptions {
  /**
   * Listbox options
   */
  options: FieldOption[];

  /**
   * Allow multiple selection
   */
  multiple?: boolean;

  /**
   * Current value (controlled)
   */
  value?: string | number | (string | number)[];

  /**
   * onChange callback
   */
  onChange?: (value: string | number | (string | number)[]) => void;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export interface UseListboxFieldReturn {
  /**
   * Selected value(s)
   */
  value: string | number | (string | number)[];

  /**
   * Select an option
   */
  select: (optionValue: string | number) => void;

  /**
   * Check if option is selected
   */
  isSelected: (optionValue: string | number) => boolean;

  /**
   * Currently focused option index
   */
  focusedIndex: number;

  /**
   * Move focus to next option
   */
  focusNext: () => void;

  /**
   * Move focus to previous option
   */
  focusPrevious: () => void;

  /**
   * Props for listbox container
   */
  listboxProps: () => {
    role: 'listbox';
    'aria-multiselectable'?: boolean;
    'aria-activedescendant'?: string;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };

  /**
   * Props for each option
   */
  optionProps: (
    option: FieldOption,
    index: number
  ) => {
    role: 'option';
    'aria-selected': boolean;
    id: string;
    onClick: () => void;
    onMouseEnter: () => void;
    tabIndex: number;
  };
}

/**
 * useListboxField Hook
 */
export function useFieldListbox({
  options,
  multiple = false,
  value: controlledValue,
  onChange,
  disabled = false,
}: UseListboxFieldOptions): UseListboxFieldReturn {
  // Internal state for uncontrolled usage
  const [internalValue, setInternalValue] = useState<string | number | (string | number)[]>(
    multiple ? [] : ''
  );

  const [focusedIndex, setFocusedIndex] = useState(0);
  const listboxId = useRef(`listbox-${Math.random().toString(36).substr(2, 9)}`).current;

  // Determine if controlled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Sync internal value
  useEffect(() => {
    if (!isControlled && controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue, isControlled]);

  /**
   * Select an option
   */
  const select = useCallback(
    (optionValue: string | number) => {
      if (disabled) return;

      let newValue: string | number | (string | number)[];

      if (multiple) {
        const currentArray = Array.isArray(value) ? value : [];
        if (currentArray.includes(optionValue)) {
          // Deselect
          newValue = currentArray.filter((v) => v !== optionValue);
        } else {
          // Select
          newValue = [...currentArray, optionValue];
        }
      } else {
        newValue = optionValue;
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (onChange) {
        onChange(newValue);
      }
    },
    [multiple, value, isControlled, onChange, disabled]
  );

  /**
   * Check if option is selected
   */
  const isSelected = useCallback(
    (optionValue: string | number) => {
      if (multiple) {
        return Array.isArray(value) && value.includes(optionValue);
      }
      return value === optionValue;
    },
    [value, multiple]
  );

  /**
   * Focus navigation
   */
  const focusNext = useCallback(() => {
    setFocusedIndex((prev) => Math.min(prev + 1, options.length - 1));
  }, [options.length]);

  const focusPrevious = useCallback(() => {
    setFocusedIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  /**
   * Keyboard handler
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          focusNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusPrevious();
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (options[focusedIndex]) {
            select(options[focusedIndex].value);
          }
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setFocusedIndex(options.length - 1);
          break;
        default:
          break;
      }
    },
    [focusNext, focusPrevious, options, focusedIndex, select]
  );

  /**
   * Listbox props
   */
  const listboxProps = useCallback(
    () => ({
      role: 'listbox' as const,
      ...(multiple && { 'aria-multiselectable': true }),
      'aria-activedescendant': `${listboxId}-option-${focusedIndex}`,
      tabIndex: disabled ? -1 : 0,
      onKeyDown: handleKeyDown,
    }),
    [multiple, focusedIndex, listboxId, disabled, handleKeyDown]
  );

  /**
   * Option props
   */
  const optionProps = useCallback(
    (option: FieldOption, index: number) => ({
      role: 'option' as const,
      'aria-selected': isSelected(option.value),
      id: `${listboxId}-option-${index}`,
      onClick: () => select(option.value),
      onMouseEnter: () => setFocusedIndex(index),
      tabIndex: -1,
    }),
    [isSelected, listboxId, select]
  );

  return {
    value,
    select,
    isSelected,
    focusedIndex,
    focusNext,
    focusPrevious,
    listboxProps,
    optionProps,
  };
}
