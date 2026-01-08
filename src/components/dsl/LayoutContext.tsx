/**
 * LayoutContext - DSL Context System
 *
 * prominence와 purpose를 자동으로 자식에게 전파
 * Section과 Group이 이 Context를 제공함
 */

import { createContext, useContext } from 'react';
import type { LayoutContextValue } from './types';

/**
 * Layout Context
 * Section과 Group이 자동으로 이 Context를 제공
 */
export const LayoutContext = createContext<LayoutContextValue>({
  prominence: 2,
  depth: 0,
});

/**
 * useLayoutContext - 현재 Section/Group의 prominence와 purpose 가져오기
 *
 * Item 컴포넌트에서 사용하여 부모의 prominence와 purpose를 참조
 *
 * @example
 * ```tsx
 * function Item({ prominence, as }) {
 *   const ctx = useLayoutContext();
 *   const computedProminence = prominence ?? ctx.prominence;
 *   // ...
 * }
 * ```
 */
export function useLayoutContext(): LayoutContextValue {
  return useContext(LayoutContext);
}

/**
 * LayoutProvider - Context Provider
 * Section과 Group 컴포넌트가 내부적으로 사용
 */
export const LayoutProvider = LayoutContext.Provider;
