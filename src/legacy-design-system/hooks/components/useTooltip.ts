import { useCallback, useEffect, useRef, useState } from "react";
import { useControlledState } from "../primitives/useControlledState";
import { useId } from "../primitives/useId";

/**
 * Tooltip placement options
 */
export type TooltipPlacement = "top" | "bottom" | "left" | "right";

/**
 * Options for useTooltip hook
 */
export interface UseTooltipOptions {
  /** Placement of the tooltip */
  placement?: TooltipPlacement;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Delay before hiding tooltip (ms) */
  closeDelay?: number;
  /** Offset from trigger element (px) */
  offset?: number;
  /** Controlled open state */
  isOpen?: boolean;
  /** Default open state (uncontrolled mode) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Props for tooltip trigger element
 */
export interface TriggerProps {
  /** Mouse enter handler */
  onMouseEnter: () => void;
  /** Mouse leave handler */
  onMouseLeave: () => void;
  /** Focus handler */
  onFocus: () => void;
  /** Blur handler */
  onBlur: () => void;
  /** ARIA describedby */
  "aria-describedby": string;
  /** Ref for positioning */
  ref: React.RefObject<HTMLElement | null>;
}

/**
 * Props for tooltip element
 */
export interface TooltipProps {
  /** Unique ID */
  id: string;
  /** ARIA role */
  role: "tooltip";
  /** Positioning styles */
  style: React.CSSProperties;
  /** Ref for positioning */
  ref: React.RefObject<HTMLElement | null>;
}

/**
 * Return value from useTooltip hook
 */
export interface UseTooltipReturn {
  /** Whether the tooltip is open */
  isOpen: boolean;
  /** Get props for trigger element */
  getTriggerProps: () => TriggerProps;
  /** Get props for tooltip element */
  getTooltipProps: () => TooltipProps;
  /** Show the tooltip */
  show: () => void;
  /** Hide the tooltip */
  hide: () => void;
}

/**
 * Headless tooltip hook with positioning and delay support
 *
 * Features:
 * - Hover and focus activation
 * - Configurable show/hide delays
 * - Automatic positioning with offset
 * - Full ARIA attributes
 * - Controlled/Uncontrolled modes
 *
 * @param options - Configuration options
 * @returns Tooltip state and prop getters
 *
 * @example
 * ```tsx
 * function MyTooltip() {
 *   const { isOpen, getTriggerProps, getTooltipProps } = useTooltip({
 *     placement: "top",
 *     delay: 500,
 *   });
 *
 *   return (
 *     <>
 *       <button {...getTriggerProps()}>Hover me</button>
 *       {isOpen && <div {...getTooltipProps()}>Tooltip content</div>}
 *     </>
 *   );
 * }
 * ```
 */
export function useTooltip(options: UseTooltipOptions = {}): UseTooltipReturn {
  const {
    placement = "top",
    delay = 0,
    closeDelay = 0,
    offset = 8,
    isOpen: controlledIsOpen,
    defaultOpen = false,
    onOpenChange,
  } = options;

  const baseId = useId("tooltip");
  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLElement>(null);
  const showTimeoutRef = useRef<any>(null);
  const hideTimeoutRef = useRef<any>(null);

  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Controlled state for open/close
  const [isOpen, setIsOpen] = useControlledState(
    controlledIsOpen,
    defaultOpen,
    onOpenChange,
  );

  /**
   * Calculate tooltip position based on trigger element
   */
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;

      case "bottom":
        top = triggerRect.bottom + offset;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;

      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - offset;
        break;

      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + offset;
        break;
    }

    setPosition({ top, left });
  }, [placement, offset]);

  /**
   * Show the tooltip after delay
   */
  const show = useCallback(() => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Set show timeout
    if (delay > 0) {
      showTimeoutRef.current = setTimeout(() => {
        setIsOpen(true);
        calculatePosition();
      }, delay);
    } else {
      setIsOpen(true);
      calculatePosition();
    }
  }, [delay, setIsOpen, calculatePosition]);

  /**
   * Hide the tooltip after closeDelay
   */
  const hide = useCallback(() => {
    // Clear any pending show timeout
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    // Set hide timeout
    if (closeDelay > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, closeDelay);
    } else {
      setIsOpen(false);
    }
  }, [closeDelay, setIsOpen]);

  /**
   * Recalculate position when tooltip opens or window resizes
   */
  useEffect(() => {
    if (!isOpen) return;

    calculatePosition();

    const handleResize = () => calculatePosition();
    const handleScroll = () => calculatePosition();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, calculatePosition]);

  /**
   * Cleanup timeouts on unmount
   */
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  /**
   * Get props for trigger element
   */
  const getTriggerProps = useCallback(
    (): TriggerProps => ({
      onMouseEnter: show,
      onMouseLeave: hide,
      onFocus: show,
      onBlur: hide,
      "aria-describedby": isOpen ? `${baseId}-tooltip` : "",
      ref: triggerRef,
    }),
    [baseId, isOpen, show, hide],
  );

  /**
   * Get props for tooltip element
   */
  const getTooltipProps = useCallback(
    (): TooltipProps => ({
      id: `${baseId}-tooltip`,
      role: "tooltip",
      style: {
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 9999,
      },
      ref: tooltipRef,
    }),
    [baseId, position],
  );

  return {
    isOpen,
    getTriggerProps,
    getTooltipProps,
    show,
    hide,
  };
}
