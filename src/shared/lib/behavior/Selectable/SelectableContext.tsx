/**
 * SelectableContext - Selectable Context & Provider
 *
 * Selectable behavior를 하위 컴포넌트에서 사용할 수 있도록 Context 제공
 */

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import type { SelectableContext as SelectableContextType, SelectableItem } from './types';

/**
 * Selectable Context
 */
export const SelectableContext = createContext<SelectableContextType | null>(null);

/**
 * useSelectableContext - Selectable Context 소비
 *
 * Selectable Wrapper 내부에서만 사용 가능
 *
 * @throws Error if used outside <Selectable>
 */
export function useSelectableContext(): SelectableContextType {
  const context = useContext(SelectableContext);
  if (!context) {
    throw new Error('useSelectableContext must be used within <Selectable>');
  }
  return context;
}

/**
 * useSelectableItem - Item용 편의 Hook
 *
 * Selectable Context를 소비하여 item props 제공
 *
 * @example
 * function ListItem({ id, children }) {
 *   const { isSelected, itemProps } = useSelectableItem(id);
 *   return (
 *     <li {...itemProps} className={isSelected ? 'selected' : ''}>
 *       {children}
 *     </li>
 *   );
 * }
 */
export function useSelectableItem(id: string, disabled = false) {
  const context = useSelectableContext();

  // Register/unregister item
  useEffect(() => {
    const item: SelectableItem = {
      id,
      disabled,
    };

    context.registerItem(item);

    return () => {
      context.unregisterItem(id);
    };
  }, [id, disabled, context]);

  // Update item when props change
  useEffect(() => {
    // For Selectable, we only need to update disabled state
    // (unlike Navigable which also tracks textValue for typeahead)
    const currentItem = context.selectedIds; // Just to trigger re-render
  }, [disabled, context]);

  return {
    isSelected: context.isSelected(id),
    itemProps: context.getItemProps(id),
  };
}

/**
 * SelectableProvider - Context Provider wrapper
 *
 * @internal - Selectable Wrapper 컴포넌트 내부에서만 사용
 */
export function SelectableProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: SelectableContextType;
}) {
  return <SelectableContext.Provider value={value}>{children}</SelectableContext.Provider>;
}
