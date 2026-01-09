/**
 * IDDLContext - IDDL Context System
 *
 * prominence, role, density, intent를 자동으로 자식에게 전파
 * Section과 Group이 이 Context를 제공함
 */

import { createContext, useContext } from 'react';
import type { LayoutContextValue } from '@/components/Item/types.ts';

/**
 * IDDL Context
 * Section과 Group이 자동으로 이 Context를 제공
 */
export const IDDLContext = createContext<LayoutContextValue>({
  prominence: 'Primary',
  density: 'Standard',
  intent: 'Neutral',
  depth: 0,
});

/**
 * useIDDLContext - 현재 Section/Group의 prominence, role, density, intent 가져오기
 *
 * Item 컴포넌트에서 사용하여 부모의 속성을 참조
 *
 * @example
 * ```tsx
 * function Item({ prominence, as }) {
 *   const ctx = useIDDLContext();
 *   const computedProminence = prominence ?? ctx.prominence;
 *   // ...
 * }
 * ```
 */
export function useIDDLContext(): LayoutContextValue {
  return useContext(IDDLContext);
}

/**
 * IDDLProvider - Context Provider
 * Section과 Group 컴포넌트가 내부적으로 사용
 */
export const IDDLProvider = IDDLContext.Provider;

// Backward compatibility exports
export const LayoutContext = IDDLContext;
export const useLayoutContext = useIDDLContext;
export const LayoutProvider = IDDLProvider;
