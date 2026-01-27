import React, {
    createContext,
    useContext,
    useState,
    useRef,
    useEffect,
    useLayoutEffect,
    type ReactNode
} from 'react';
import { createPortal } from 'react-dom';
import * as styles from './Overlay.css';

// --- Types ---
type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

interface OverlayContextValue {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    triggerRef: React.RefObject<HTMLElement | null>;
    contentRef: React.RefObject<HTMLElement | null>;
}

// --- Context ---
const OverlayContext = createContext<OverlayContextValue | null>(null);

// --- Root ---
interface OverlayProps {
    children: ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function Overlay({ children, open, defaultOpen = false, onOpenChange }: OverlayProps) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    const triggerRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLElement>(null);

    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : uncontrolledOpen;

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setUncontrolledOpen(newOpen);
        }
        onOpenChange?.(newOpen);
    };

    // Close on click outside
    useEffect(() => {
        if (!isOpen) return;

        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            const trigger = triggerRef.current;
            const content = contentRef.current;

            // Don't close if clicking inside trigger or content
            if (trigger?.contains(target)) return;
            if (content?.contains(target)) return;

            handleOpenChange(false);
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') handleOpenChange(false);
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);



    return (
        <OverlayContext.Provider value={{
            isOpen,
            setIsOpen: handleOpenChange,
            triggerRef,
            contentRef
        }}>
            {children}
        </OverlayContext.Provider>
    );
}

// --- Hook ---
export function useOverlay() {
    const context = useContext(OverlayContext);
    if (!context) {
        throw new Error('useOverlay must be used within an <Overlay />');
    }
    return context;
}

// --- Portal (Generic) ---
export function OverlayPortal({ children }: { children: ReactNode }) {
    // For now simple createPortal. In future we can handle z-index stacking context here.
    return createPortal(children, document.body);
}

// --- Trigger ---
interface OverlayTriggerProps {
    children: ReactNode;
    asChild?: boolean; // TODO: Implement slot/cloneElement properly if needed. For now simple wrapper.
    onClick?: () => void;
}

export function OverlayTrigger({ children, onClick }: OverlayTriggerProps) {
    const ctx = useContext(OverlayContext);
    if (!ctx) throw new Error("OverlayTrigger must be used within <Overlay>");

    // For now, we wrap in a span to attach ref easily. 
    // In prod, use cloneElement or Slot to avoid wrapper hell.
    return (
        <span
            ref={ctx.triggerRef as any}
            onClick={(e) => {
                ctx.setIsOpen(!ctx.isOpen);
                onClick?.();
                e.stopPropagation();
            }}
            style={{ display: 'inline-flex' }} // Minimal footprint
        >
            {children}
        </span>
    );
}

// --- Content ---
interface OverlayContentProps {
    children: ReactNode;
    side?: Side;
    align?: Align;
    sideOffset?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function OverlayContent({
    children,
    side = 'bottom',
    align = 'center',
    sideOffset = 4,
    className,
    style: inlineStyle
}: OverlayContentProps) {
    const ctx = useContext(OverlayContext);
    if (!ctx) throw new Error("OverlayContent must be used within <Overlay>");

    const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

    useLayoutEffect(() => {
        if (!ctx.isOpen || !ctx.triggerRef.current || !ctx.contentRef.current) return;

        const triggerRect = ctx.triggerRef.current.getBoundingClientRect();
        const contentRect = ctx.contentRef.current.getBoundingClientRect();

        // Basic calculation (No collision detection for MVP, can add flip logic later)
        let top = 0;
        let left = 0;

        // 1. Side Logic (Main Axis)
        switch (side) {
            case 'top':
                top = triggerRect.top - contentRect.height - sideOffset;
                break;
            case 'bottom':
                top = triggerRect.bottom + sideOffset;
                break;
            case 'left':
                left = triggerRect.left - contentRect.width - sideOffset;
                break;
            case 'right':
                left = triggerRect.right + sideOffset;
                break;
        }

        // 2. Align Logic (Cross Axis)
        if (side === 'top' || side === 'bottom') {
            if (align === 'start') left = triggerRect.left;
            else if (align === 'end') left = triggerRect.right - contentRect.width;
            else left = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);

            // If side is horizontal, we computed top above. 
            // If side was left/right, we computed left above.
        } else {
            // side is left/right
            if (align === 'start') top = triggerRect.top;
            else if (align === 'end') top = triggerRect.bottom - contentRect.height;
            else top = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
        }

        // Apply scroll offset because we are rendering in Portal (document.body)
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        setCoords({
            top: top + scrollY,
            left: left + scrollX
        });

    }, [ctx.isOpen, side, align, sideOffset]);

    if (!ctx.isOpen) return null;

    // Use Portal to render at body level to avoid overflow:hidden clipping
    return createPortal(
        <div
            ref={ctx.contentRef as any}
            className={`${styles.content} ${className || ''}`}
            style={{
                ...inlineStyle,
                top: coords.top,
                left: coords.left,
            }}
        >
            {children}
        </div>,
        document.body
    );
}
