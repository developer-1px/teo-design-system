import { useCallback, useEffect, useRef } from "react";
import { useFocusTrap } from "./utils/useFocusTrap";
import { useId } from "./utils/useId";
import { useScrollLock } from "./utils/useScrollLock";

/**
 * Options for useModal hook
 */
export interface UseModalOptions {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Element to focus initially */
  initialFocus?: React.RefObject<HTMLElement>;
  /** Close on Escape key (default: true) */
  closeOnEsc?: boolean;
  /** Close on backdrop click (default: true) */
  closeOnBackdropClick?: boolean;
  /** Lock body scroll (default: true) */
  lockScroll?: boolean;
  /** Restore focus on close (default: true) */
  restoreFocus?: boolean;
}

/**
 * Props for modal backdrop
 */
export interface BackdropProps {
  /** Click handler */
  onClick: () => void;
  /** ARIA hidden */
  "aria-hidden": true;
}

/**
 * Props for modal dialog
 */
export interface DialogProps {
  /** Ref for the dialog container */
  ref: React.RefObject<HTMLDivElement | null>;
  /** ARIA role */
  role: "dialog";
  /** ARIA modal */
  "aria-modal": true;
  /** ARIA labelledby (title ID) */
  "aria-labelledby": string;
  /** ARIA describedby (description ID) */
  "aria-describedby": string;
  /** Keyboard event handler */
  onKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * Props for modal title
 */
export interface TitleProps {
  /** Unique ID */
  id: string;
}

/**
 * Props for modal description
 */
export interface DescriptionProps {
  /** Unique ID */
  id: string;
}

/**
 * Props for close button
 */
export interface CloseButtonProps {
  /** Click handler */
  onClick: () => void;
  /** ARIA label */
  "aria-label": string;
}

/**
 * Return value from useModal hook
 */
export interface UseModalReturn {
  /** Whether the modal is open */
  open: boolean;
  /** Get props for backdrop */
  getBackdropProps: () => BackdropProps;
  /** Get props for dialog */
  getDialogProps: () => DialogProps;
  /** Get props for title */
  getTitleProps: () => TitleProps;
  /** Get props for description */
  getDescriptionProps: () => DescriptionProps;
  /** Get props for close button */
  getCloseButtonProps: () => CloseButtonProps;
  /** Close the modal */
  close: () => void;
}

/**
 * Headless modal/dialog hook following Headless UI Dialog pattern
 *
 * Features:
 * - Focus trap (Tab cycles within modal)
 * - Scroll lock (prevents body scroll)
 * - Escape key to close
 * - Backdrop click to close
 * - Focus restoration
 * - Full ARIA attributes
 *
 * @param options - Configuration options
 * @returns Modal state and prop getters
 *
 * @example
 * ```tsx
 * function MyModal() {
 *   const [open, setOpen] = useState(false);
 *   const {
 *     getBackdropProps,
 *     getDialogProps,
 *     getTitleProps,
 *     getDescriptionProps,
 *     getCloseButtonProps,
 *   } = useModal({
 *     open,
 *     onClose: () => setOpen(false),
 *   });
 *
 *   if (!open) return null;
 *
 *   return (
 *     <>
 *       <div {...getBackdropProps()} />
 *       <div {...getDialogProps()}>
 *         <h2 {...getTitleProps()}>Title</h2>
 *         <p {...getDescriptionProps()}>Description</p>
 *         <button {...getCloseButtonProps()}>Close</button>
 *       </div>
 *     </>
 *   );
 * }
 * ```
 */
export function useModal(options: UseModalOptions): UseModalReturn {
  const {
    open,
    onClose,
    initialFocus,
    closeOnEsc = true,
    closeOnBackdropClick = true,
    lockScroll = true,
    restoreFocus = true,
  } = options;

  const baseId = useId("modal");
  const dialogRef = useRef<HTMLDivElement>(null);

  // Apply focus trap
  useFocusTrap(dialogRef as React.RefObject<HTMLElement>, {
    active: open,
    initialFocus,
    restoreFocus,
  });

  // Apply scroll lock
  useScrollLock(open && lockScroll);

  /**
   * Close the modal
   */
  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  /**
   * Handle Escape key
   */
  useEffect(() => {
    if (!open || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEsc, close]);

  /**
   * Handle dialog keyboard events
   */
  const handleDialogKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEsc) {
        e.preventDefault();
        close();
      }
    },
    [closeOnEsc, close],
  );

  /**
   * Get props for backdrop
   */
  const getBackdropProps = useCallback(
    (): BackdropProps => ({
      onClick: closeOnBackdropClick ? close : () => { },
      "aria-hidden": true,
    }),
    [closeOnBackdropClick, close],
  );

  /**
   * Get props for dialog
   */
  const getDialogProps = useCallback(
    (): DialogProps => ({
      ref: dialogRef,
      role: "dialog",
      "aria-modal": true,
      "aria-labelledby": `${baseId}-title`,
      "aria-describedby": `${baseId}-description`,
      onKeyDown: handleDialogKeyDown,
    }),
    [baseId, handleDialogKeyDown],
  );

  /**
   * Get props for title
   */
  const getTitleProps = useCallback(
    (): TitleProps => ({
      id: `${baseId}-title`,
    }),
    [baseId],
  );

  /**
   * Get props for description
   */
  const getDescriptionProps = useCallback(
    (): DescriptionProps => ({
      id: `${baseId}-description`,
    }),
    [baseId],
  );

  /**
   * Get props for close button
   */
  const getCloseButtonProps = useCallback(
    (): CloseButtonProps => ({
      onClick: close,
      "aria-label": "Close modal",
    }),
    [close],
  );

  return {
    open,
    getBackdropProps,
    getDialogProps,
    getTitleProps,
    getDescriptionProps,
    getCloseButtonProps,
    close,
  };
}
