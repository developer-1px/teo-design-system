/**
 * useCombobox - 콤보박스 컴포넌트 헤드리스 훅
 *
 * IDDL Field dataType="select" control="combobox" 구현을 위한 헤드리스 로직
 * @see docs/1-project/1-type-role-aria-mapping-1.md#3-field (select/combobox)
 * @see docs/1-project/4-headless-hook.md
 */

import { useState, useCallback } from 'react';
import { useDisclosure } from '../primitives/useDisclosure';

export interface UseComboboxOptions<T> {
  /** 선택 가능한 아이템 목록 */
  items: T[];
  /** 아이템 → 문자열 변환 함수 */
  itemToString?: (item: T | null) => string;
  /** 선택 변경 콜백 */
  onSelectedItemChange?: (item: T | null) => void;
}

export interface UseComboboxReturn<T> {
  /** 열림 상태 */
  isOpen: boolean;
  /** 선택된 아이템 */
  selectedItem: T | null;
  /** 입력 값 */
  inputValue: string;
  /** 하이라이트된 인덱스 */
  highlightedIndex: number;
  /** Input에 적용할 props */
  getInputProps: () => {
    role: 'combobox';
    'aria-autocomplete': 'list';
    'aria-expanded': boolean;
    'aria-controls': string;
    'aria-activedescendant': string | undefined;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  /** Listbox에 적용할 props */
  getListboxProps: () => {
    role: 'listbox';
    id: string;
  };
  /** Option에 적용할 props */
  getOptionProps: (index: number, item: T) => {
    role: 'option';
    id: string;
    'aria-selected': boolean;
    onClick: () => void;
  };
}

/**
 * @example
 * const items = ['Apple', 'Banana', 'Cherry'];
 * const { getInputProps, getListboxProps, getOptionProps, isOpen } = useCombobox({ items });
 *
 * <input {...getInputProps()} />
 * {isOpen && (
 *   <ul {...getListboxProps()}>
 *     {items.map((item, i) => (
 *       <li key={i} {...getOptionProps(i, item)}>{item}</li>
 *     ))}
 *   </ul>
 * )}
 */
export function useCombobox<T>(options: UseComboboxOptions<T>): UseComboboxReturn<T> {
  const { items, itemToString = (item) => (item ? String(item) : ''), onSelectedItemChange } = options;
  const { isOpen, open, close } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const selectItem = useCallback(
    (item: T | null) => {
      setSelectedItem(item);
      setInputValue(itemToString(item));
      onSelectedItemChange?.(item);
      close();
    },
    [itemToString, onSelectedItemChange, close]
  );

  const getInputProps = useCallback(() => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      if (value) {
        open();
      } else {
        close();
      }
      // TODO: 필터링 로직 추가
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          if (!isOpen) {
            open();
          } else {
            setHighlightedIndex((prev) => (prev < items.length - 1 ? prev + 1 : prev));
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          event.preventDefault();
          if (isOpen && highlightedIndex >= 0) {
            selectItem(items[highlightedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          close();
          break;
      }
    };

    return {
      role: 'combobox' as const,
      'aria-autocomplete': 'list' as const,
      'aria-expanded': isOpen,
      'aria-controls': 'combobox-listbox',
      'aria-activedescendant': isOpen ? `combobox-option-${highlightedIndex}` : undefined,
      value: inputValue,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
    };
  }, [isOpen, inputValue, highlightedIndex, items, open, close, selectItem]);

  const getListboxProps = useCallback(() => {
    return {
      role: 'listbox' as const,
      id: 'combobox-listbox',
    };
  }, []);

  const getOptionProps = useCallback(
    (index: number, item: T) => {
      const handleClick = () => {
        selectItem(item);
      };

      return {
        role: 'option' as const,
        id: `combobox-option-${index}`,
        'aria-selected': selectedItem === item,
        onClick: handleClick,
      };
    },
    [selectedItem, selectItem]
  );

  return {
    isOpen,
    selectedItem,
    inputValue,
    highlightedIndex,
    getInputProps,
    getListboxProps,
    getOptionProps,
  };
}
