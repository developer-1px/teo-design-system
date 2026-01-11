/**
 * NavigableContext - Navigable Context & Provider
 *
 * Navigable behavior를 하위 컴포넌트에서 사용할 수 있도록 Context 제공
 */

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import type { NavigableContext as NavigableContextType, NavigableItem } from './types';

/**
 * Navigable Context
 */
export const NavigableContext = createContext<NavigableContextType | null>(null);

/**
 * useNavigableContext - Navigable Context 소비
 *
 * Navigable Wrapper 내부에서만 사용 가능
 *
 * @throws Error if used outside <Navigable>
 */
export function useNavigableContext(): NavigableContextType {
  const context = useContext(NavigableContext);
  if (!context) {
    throw new Error('useNavigableContext must be used within <Navigable>');
  }
  return context;
}

/**
 * useNavigableContextOptional - Optional Navigable Context
 *
 * Navigable이 없을 수도 있는 경우 사용 (Selectable과 통합 시)
 *
 * @returns NavigableContextType | null
 */
export function useNavigableContextOptional(): NavigableContextType | null {
  return useContext(NavigableContext);
}

/**
 * useNavigableItem - Item용 편의 Hook
 *
 * Navigable Context를 소비하여 item props 제공
 *
 * @example
 * function ListItem({ id, children }) {
 *   const { isFocused, itemProps } = useNavigableItem(id);
 *   return (
 *     <li {...itemProps} className={isFocused ? 'focused' : ''}>
 *       {children}
 *     </li>
 *   );
 * }
 */
export function useNavigableItem(id: string, textValue?: string, disabled = false) {
  const context = useNavigableContext();
  const ref = useRef<HTMLElement>(null);

  // Register/unregister item
  useEffect(() => {
    if (ref.current) {
      const item: NavigableItem = {
        id,
        ref: ref.current,
        disabled,
        textValue: textValue || ref.current.textContent || '',
      };

      context.registerItem(item);

      return () => {
        context.unregisterItem(id);
      };
    }
  }, [id, textValue, disabled, context]);

  // Update item when props change
  useEffect(() => {
    if (ref.current) {
      context.updateItem(id, {
        disabled,
        textValue: textValue || ref.current.textContent || '',
      });
    }
  }, [id, textValue, disabled, context]);

  return {
    isFocused: context.isFocused(id),
    itemProps: {
      ref,
      ...context.getItemProps(id),
    },
  };
}

/**
 * NavigableProvider - Context Provider wrapper
 *
 * @internal - Navigable Wrapper 컴포넌트 내부에서만 사용
 */
export function NavigableProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: NavigableContextType;
}) {
  return <NavigableContext.Provider value={value}>{children}</NavigableContext.Provider>;
}
