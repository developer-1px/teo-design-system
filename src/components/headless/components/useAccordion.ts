/**
 * useAccordion - 아코디언 컴포넌트 헤드리스 훅
 *
 * IDDL Block role="Accordion" 구현을 위한 헤드리스 로직
 * @see docs/1-project/1-type-role-aria-mapping-1.md#4-group (Accordion, AccordionItem)
 * @see docs/1-project/4-headless-hook.md
 */

import { useCallback, useState } from 'react';

export interface UseAccordionOptions {
  /** 다중 패널 열림 허용 여부 */
  allowMultiple?: boolean;
  /** 모든 패널 닫기 허용 여부 */
  allowToggle?: boolean;
  /** 기본 열린 인덱스들 */
  defaultIndices?: number[];
}

export interface UseAccordionReturn {
  /** 열린 인덱스들 */
  expandedIndices: number[];
  /** 특정 인덱스 토글 */
  toggle: (index: number) => void;
  /** AccordionItem Trigger에 적용할 props */
  getTriggerProps: (index: number) => {
    'aria-expanded': boolean;
    'aria-controls': string;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  /** AccordionItem Panel에 적용할 props */
  getPanelProps: (index: number) => {
    id: string;
    'aria-labelledby': string;
    hidden: boolean;
  };
}

/**
 * @example
 * const { expandedIndices, getTriggerProps, getPanelProps } = useAccordion({
 *   allowMultiple: true,
 * });
 *
 * {items.map((item, i) => (
 *   <div key={i}>
 *     <button {...getTriggerProps(i)}>{item.title}</button>
 *     <div {...getPanelProps(i)}>{item.content}</div>
 *   </div>
 * ))}
 */
export function useAccordion(options: UseAccordionOptions = {}): UseAccordionReturn {
  const { allowMultiple = false, allowToggle = true, defaultIndices = [] } = options;
  const [expandedIndices, setExpandedIndices] = useState<number[]>(defaultIndices);

  const toggle = useCallback(
    (index: number) => {
      setExpandedIndices((prev) => {
        const isExpanded = prev.includes(index);

        if (allowMultiple) {
          // 다중 열림 모드
          if (isExpanded) {
            return allowToggle ? prev.filter((i) => i !== index) : prev;
          }
          return [...prev, index];
        } else {
          // 단일 열림 모드
          if (isExpanded) {
            return allowToggle ? [] : prev;
          }
          return [index];
        }
      });
    },
    [allowMultiple, allowToggle]
  );

  const getTriggerProps = useCallback(
    (index: number) => {
      const isExpanded = expandedIndices.includes(index);

      const handleClick = () => {
        toggle(index);
      };

      const handleKeyDown = (event: React.KeyboardEvent) => {
        // TODO: 구현 필요
        // - ArrowDown: 다음 트리거로 포커스
        // - ArrowUp: 이전 트리거로 포커스
        // - Home/End: 첫/마지막 트리거
      };

      return {
        'aria-expanded': isExpanded,
        'aria-controls': `accordion-panel-${index}`,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
      };
    },
    [expandedIndices, toggle]
  );

  const getPanelProps = useCallback(
    (index: number) => {
      const isExpanded = expandedIndices.includes(index);

      return {
        id: `accordion-panel-${index}`,
        'aria-labelledby': `accordion-trigger-${index}`,
        hidden: !isExpanded,
      };
    },
    [expandedIndices]
  );

  return {
    expandedIndices,
    toggle,
    getTriggerProps,
    getPanelProps,
  };
}
