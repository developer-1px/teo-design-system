/**
 * ProminenceContext - 주목도 시스템 Context
 *
 * Layout 컴포넌트가 자동으로 depth를 자식에게 전파
 * Content 컴포넌트가 부모의 depth를 참조하여 스타일 계산
 */

import { createContext, useContext } from 'react';

export interface ProminenceContextValue {
  /**
   * 부모 Layout의 depth (0-6)
   * 이 값과 prominence를 조합하여 스타일이 자동 결정됨
   */
  depth: number;
}

/**
 * Prominence Context
 * Layout이 자동으로 이 Context를 제공함
 */
export const ProminenceContext = createContext<ProminenceContextValue>({
  depth: 0,
});

/**
 * useProminence - 현재 Layout의 depth를 가져오는 Hook
 *
 * Content 컴포넌트에서 사용하여 부모 Layout의 depth를 참조
 *
 * @example
 * ```tsx
 * function Content({ prominence }) {
 *   const { depth } = useProminence();
 *   const styles = calculateProminenceStyles(depth, prominence);
 *   // ...
 * }
 * ```
 */
export function useProminence(): ProminenceContextValue {
  const context = useContext(ProminenceContext);

  if (context === undefined) {
    throw new Error(
      'useProminence must be used within a Layout component. ' +
        'Wrap your Content component with <Layout>.'
    );
  }

  return context;
}

/**
 * ProminenceProvider - Context Provider
 * Layout 컴포넌트가 내부적으로 사용
 */
export const ProminenceProvider = ProminenceContext.Provider;
