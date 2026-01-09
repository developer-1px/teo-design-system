/**
 * IDDLContext - IDDL Context System
 *
 * prominence, role, density, intent를 자동으로 자식에게 전파
 * Section과 Group이 이 Context를 제공함
 */

import { createContext, useContext } from 'react';
import type { LayoutContextValue, GroupRole } from '@/components/types/Atom/types.ts';

/**
 * IDDL Context
 * Section과 Group이 자동으로 이 Context를 제공
 * v4.1: template 추가 (Page template을 Section으로 전파)
 * v5.0: layout 추가 (Page layout을 Section으로 전파)
 */
export const IDDLContext = createContext<LayoutContextValue>({
  prominence: 'Standard',
  density: 'Standard',
  intent: 'Neutral',
  depth: 0,
  layout: undefined, // v5.0: Page layout (Section role validation & config용)
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

// ============================================
// Group Context (GroupRole 전용)
// ============================================

/**
 * GroupLayoutContextValue - Group 전용 Context 타입
 * GroupRole을 그대로 사용하여 타입 안정성 확보
 */
export interface GroupLayoutContextValue {
  prominence: LayoutContextValue['prominence'];
  role?: GroupRole; // GroupRole 타입 사용
  density?: LayoutContextValue['density'];
  intent?: LayoutContextValue['intent'];
  depth: number;
  mode?: 'view' | 'edit';
}

/**
 * GroupLayoutContext - Group 전용 Context
 */
export const GroupLayoutContext = createContext<GroupLayoutContextValue>({
  prominence: 'Standard',
  density: 'Standard',
  intent: 'Neutral',
  depth: 0,
});

/**
 * useGroupLayoutContext - Group Context 가져오기
 */
export function useGroupLayoutContext(): GroupLayoutContextValue {
  return useContext(GroupLayoutContext);
}

/**
 * GroupLayoutProvider - Group 전용 Provider
 */
export const GroupLayoutProvider = GroupLayoutContext.Provider;
