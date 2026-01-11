/**
 * useTabs - 탭 컴포넌트 헤드리스 훅
 *
 * IDDL Block role="TabList" 구현을 위한 헤드리스 로직
 * @see docs/1-project/1-type-role-aria-mapping-1.md#4-group (TabList)
 * @see docs/1-project/4-headless-hook.md
 */

import { useCallback, useState } from 'react';

export interface UseTabsOptions {
  /** 기본 선택 탭 인덱스 */
  defaultIndex?: number;
  /** 탭 변경 콜백 */
  onChange?: (index: number) => void;
  /** 키보드 활성화 여부 */
  activateOnFocus?: boolean;
}

export interface UseTabsReturn {
  /** 현재 선택된 탭 인덱스 */
  selectedIndex: number;
  /** 탭 선택 */
  selectTab: (index: number) => void;
  /** TabList에 적용할 props */
  getTabListProps: () => {
    role: 'tablist';
  };
  /** Tab에 적용할 props */
  getTabProps: (index: number) => {
    role: 'tab';
    'aria-selected': boolean;
    'aria-controls': string;
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (_event: React.KeyboardEvent) => void;
  };
  /** TabPanel에 적용할 props */
  getTabPanelProps: (index: number) => {
    role: 'tabpanel';
    'aria-labelledby': string;
    hidden: boolean;
  };
}

/**
 * @example
 * const { selectedIndex, getTabListProps, getTabProps, getTabPanelProps } = useTabs();
 *
 * <div {...getTabListProps()}>
 *   {tabs.map((tab, i) => (
 *     <button key={i} {...getTabProps(i)}>{tab}</button>
 *   ))}
 * </div>
 * {panels.map((panel, i) => (
 *   <div key={i} {...getTabPanelProps(i)}>{panel}</div>
 * ))}
 */
export function useTabs(options: UseTabsOptions = {}): UseTabsReturn {
  const { defaultIndex = 0, onChange, activateOnFocus = false } = options;
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const selectTab = useCallback(
    (index: number) => {
      setSelectedIndex(index);
      onChange?.(index);
    },
    [onChange]
  );

  const getTabListProps = useCallback(() => {
    return {
      role: 'tablist' as const,
    };
  }, []);

  const getTabProps = useCallback(
    (index: number) => {
      const handleClick = () => {
        selectTab(index);
      };

      const handleKeyDown = (_event: React.KeyboardEvent) => {
        // TODO: 구현 필요
        // - ArrowLeft/ArrowRight: 탭 이동
        // - Home/End: 첫/마지막 탭
        // - activateOnFocus에 따라 즉시 활성화 또는 Enter 필요
      };

      return {
        role: 'tab' as const,
        'aria-selected': index === selectedIndex,
        'aria-controls': `tabpanel-${index}`,
        tabIndex: index === selectedIndex ? 0 : -1,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
      };
    },
    [selectedIndex, selectTab]
  );

  const getTabPanelProps = useCallback(
    (index: number) => {
      return {
        role: 'tabpanel' as const,
        'aria-labelledby': `tab-${index}`,
        hidden: index !== selectedIndex,
      };
    },
    [selectedIndex]
  );

  return {
    selectedIndex,
    selectTab,
    getTabListProps,
    getTabProps,
    getTabPanelProps,
  };
}
