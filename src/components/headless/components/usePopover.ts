/**
 * usePopover - 팝오버 컴포넌트 헤드리스 훅
 *
 * IDDL Overlay role="Popover" 구현을 위한 헤드리스 로직
 * @see docs/1-project/1-type-role-aria-mapping-1.md#6-overlay (Popover)
 * @see docs/1-project/4-headless-hook.md
 */

import { useClickOutside } from '../primitives/useClickOutside';
import { useDisclosure } from '../primitives/useDisclosure';

export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface UsePopoverOptions {
  /** Popover 위치 */
  placement?: PopoverPlacement;
  /** ESC 키로 닫기 허용 여부 */
  closeOnEsc?: boolean;
  /** 외부 클릭으로 닫기 허용 여부 */
  closeOnBlur?: boolean;
  /** 열림 콜백 */
  onOpen?: () => void;
  /** 닫힘 콜백 */
  onClose?: () => void;
}

export interface UsePopoverReturn {
  /** Popover 열림 상태 */
  isOpen: boolean;
  /** Popover 열기 */
  open: () => void;
  /** Popover 닫기 */
  close: () => void;
  /** Trigger에 적용할 props */
  getTriggerProps: () => {
    'aria-haspopup': 'dialog';
    'aria-expanded': boolean;
    onClick: () => void;
  };
  /** Popover Content에 적용할 props */
  getPopoverProps: () => {
    role: 'dialog';
    ref: React.RefObject<HTMLDivElement | null>;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
}

/**
 * @example
 * const { isOpen, getTriggerProps, getPopoverProps } = usePopover({
 *   placement: 'bottom',
 *   closeOnBlur: true,
 * });
 *
 * <button {...getTriggerProps()}>Open Popover</button>
 * {isOpen && (
 *   <div {...getPopoverProps()}>
 *     Popover content
 *   </div>
 * )}
 */
export function usePopover(options: UsePopoverOptions = {}): UsePopoverReturn {
  const {
    placement: _placement = 'bottom',
    closeOnEsc = true,
    closeOnBlur = true,
    onOpen,
    onClose,
  } = options;

  const { isOpen, open, close, toggle } = useDisclosure({ onOpen, onClose });
  const popoverRef = useClickOutside<HTMLDivElement>({
    onClickOutside: close,
    enabled: isOpen && closeOnBlur,
  });

  const getTriggerProps = () => {
    const handleClick = () => {
      toggle();
    };

    return {
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': isOpen,
      onClick: handleClick,
    };
  };

  const getPopoverProps = () => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        event.preventDefault();
        close();
      }
    };

    return {
      role: 'dialog' as const,
      ref: popoverRef,
      onKeyDown: handleKeyDown,
    };
  };

  return {
    isOpen,
    open,
    close,
    getTriggerProps,
    getPopoverProps,
  };
}
