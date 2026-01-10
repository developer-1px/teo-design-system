/**
 * useMenu - 메뉴 컴포넌트 헤드리스 훅
 *
 * IDDL Block role="Menu" 구현을 위한 헤드리스 로직
 * @see docs/1-project/1-type-role-aria-mapping-1.md#4-group (Menu, MenuItem)
 * @see docs/1-project/4-headless-hook.md
 */

import { useCallback, useRef, useState } from 'react';
import { useClickOutside } from '../primitives/useClickOutside';
import { useDisclosure } from '../primitives/useDisclosure';

export interface UseMenuOptions {
  /** 메뉴 열림 콜백 */
  onOpen?: () => void;
  /** 메뉴 닫힘 콜백 */
  onClose?: () => void;
}

export interface UseMenuReturn {
  /** 메뉴 열림 상태 */
  isOpen: boolean;
  /** 메뉴 열기 */
  open: () => void;
  /** 메뉴 닫기 */
  close: () => void;
  /** 현재 포커스된 아이템 인덱스 */
  activeIndex: number;
  /** Trigger 버튼에 적용할 props */
  getTriggerProps: () => {
    'aria-haspopup': 'menu';
    'aria-expanded': boolean;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  /** Menu에 적용할 props */
  getMenuProps: () => {
    role: 'menu';
    ref: React.RefObject<HTMLDivElement | null>;
  };
  /** MenuItem에 적용할 props */
  getMenuItemProps: (index: number) => {
    role: 'menuitem';
    tabIndex: number;
    onClick: () => void;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
}

/**
 * @example
 * const { isOpen, getTriggerProps, getMenuProps, getMenuItemProps } = useMenu();
 *
 * <button {...getTriggerProps()}>Menu</button>
 * {isOpen && (
 *   <div {...getMenuProps()}>
 *     {items.map((item, i) => (
 *       <button key={i} {...getMenuItemProps(i)}>{item}</button>
 *     ))}
 *   </div>
 * )}
 */
export function useMenu(options: UseMenuOptions = {}): UseMenuReturn {
  const { onOpen, onClose } = options;
  const { isOpen, open, close } = useDisclosure({ onOpen, onClose });
  const [activeIndex, setActiveIndex] = useState(0);
  const menuRef = useClickOutside<HTMLDivElement>({
    onClickOutside: close,
    enabled: isOpen,
  });

  const getTriggerProps = useCallback(() => {
    const handleClick = () => {
      if (isOpen) {
        close();
      } else {
        open();
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      // TODO: 구현 필요
      // - ArrowDown: 메뉴 열고 첫 번째 아이템 포커스
      // - ArrowUp: 메뉴 열고 마지막 아이템 포커스
    };

    return {
      'aria-haspopup': 'menu' as const,
      'aria-expanded': isOpen,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
    };
  }, [isOpen, open, close]);

  const getMenuProps = useCallback(() => {
    return {
      role: 'menu' as const,
      ref: menuRef,
    };
  }, [menuRef]);

  const getMenuItemProps = useCallback(
    (index: number) => {
      const handleClick = () => {
        // 아이템 클릭 시 메뉴 닫기
        close();
      };

      const handleKeyDown = (event: React.KeyboardEvent) => {
        // TODO: 구현 필요
        // - ArrowDown/ArrowUp: 아이템 이동
        // - Home/End: 첫/마지막 아이템
        // - Escape: 메뉴 닫기
        // - Enter/Space: 아이템 선택 및 메뉴 닫기
      };

      return {
        role: 'menuitem' as const,
        tabIndex: index === activeIndex ? 0 : -1,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
      };
    },
    [activeIndex, close]
  );

  return {
    isOpen,
    open,
    close,
    activeIndex,
    getTriggerProps,
    getMenuProps,
    getMenuItemProps,
  };
}
