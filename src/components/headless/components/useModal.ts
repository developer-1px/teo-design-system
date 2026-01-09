/**
 * useModal - 모달 컴포넌트 헤드리스 훅
 *
 * IDDL Overlay role="Modal" 구현을 위한 헤드리스 로직
 * @see docs/1-project/1-type-role-aria-mapping-1.md#6-overlay (Modal)
 * @see docs/1-project/4-headless-hook.md
 */

import { useEffect } from 'react';
import { useDisclosure } from '../primitives/useDisclosure';
import { useFocusTrap } from '../primitives/useFocusTrap';

export interface UseModalOptions {
  /** 기본 열림 상태 */
  defaultOpen?: boolean;
  /** ESC 키로 닫기 허용 여부 */
  closeOnEsc?: boolean;
  /** 백드롭 클릭으로 닫기 허용 여부 */
  closeOnBackdropClick?: boolean;
  /** 열림 콜백 */
  onOpen?: () => void;
  /** 닫힘 콜백 */
  onClose?: () => void;
}

export interface UseModalReturn {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 열기 */
  open: () => void;
  /** 모달 닫기 */
  close: () => void;
  /** Modal Overlay에 적용할 props */
  getOverlayProps: () => {
    role: 'dialog';
    'aria-modal': boolean;
    ref: React.RefObject<HTMLDivElement>;
    onKeyDown: (event: React.KeyboardEvent) => void;
  };
  /** Backdrop에 적용할 props */
  getBackdropProps: () => {
    onClick: () => void;
  };
}

/**
 * @example
 * const { isOpen, open, close, getOverlayProps, getBackdropProps } = useModal({
 *   closeOnEsc: true,
 *   closeOnBackdropClick: true,
 * });
 *
 * <button onClick={open}>Open Modal</button>
 * {isOpen && (
 *   <>
 *     <div {...getBackdropProps()} />
 *     <div {...getOverlayProps()}>
 *       <h2>Modal Title</h2>
 *       <button onClick={close}>Close</button>
 *     </div>
 *   </>
 * )}
 */
export function useModal(options: UseModalOptions = {}): UseModalReturn {
  const {
    defaultOpen = false,
    closeOnEsc = true,
    closeOnBackdropClick = true,
    onOpen,
    onClose,
  } = options;

  const { isOpen, open, close } = useDisclosure({ defaultOpen, onOpen, onClose });
  const trapRef = useFocusTrap<HTMLDivElement>({ enabled: isOpen, restoreFocus: true });

  // ESC 키 처리
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEsc, close]);

  // Body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const getOverlayProps = () => {
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        event.preventDefault();
        close();
      }
    };

    return {
      role: 'dialog' as const,
      'aria-modal': true,
      ref: trapRef,
      onKeyDown: handleKeyDown,
    };
  };

  const getBackdropProps = () => {
    const handleClick = () => {
      if (closeOnBackdropClick) {
        close();
      }
    };

    return {
      onClick: handleClick,
    };
  };

  return {
    isOpen,
    open,
    close,
    getOverlayProps,
    getBackdropProps,
  };
}
