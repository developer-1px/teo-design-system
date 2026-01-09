/**
 * useDisclosure - 열림/닫힘 상태 관리 (모달, 팝오버, 아코디언 등)
 *
 * 재사용 가능한 open/close 상태 로직을 제공합니다.
 * @see docs/1-project/4-headless-hook.md
 */

import { useCallback, useState } from 'react';

export interface UseDisclosureOptions {
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export interface UseDisclosureReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * @example
 * const { isOpen, open, close, toggle } = useDisclosure();
 *
 * <button onClick={toggle}>Toggle</button>
 * {isOpen && <div>Content</div>}
 */
export function useDisclosure(options: UseDisclosureOptions = {}): UseDisclosureReturn {
  const { defaultOpen = false, onOpen, onClose } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [isOpen, open, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
