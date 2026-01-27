import { type ReactNode } from 'react';
import * as styles from './Drawer.css';
import { Overlay, OverlayPortal } from './Overlay';

// --- Drawer Content (The part that renders inside Portal) ---
function DrawerInner({ title, children, onClose }: { title?: string, children: ReactNode, onClose: () => void }) {
    // Close on Escape - handled by Overlay? Overlay handles it if we use it correctly.
    // But since we are building custom content, we might re-use Overlay's logic or implement our own layer logic.
    // Overlay 'Reference' implementation handles click outside and escape if we implement it there.
    // But currently Overlay.tsx logic is coupled to "TriggerRef" existence for click outside.
    // Drawer is "Modal", so click outside = click backdrop.

    return (
        <OverlayPortal>
            <div className={styles.backdrop} onClick={onClose}>
                <div
                    className={styles.drawer}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? "drawer-title" : undefined}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.header}>
                        {title && <h3 id="drawer-title" className={styles.title}>{title}</h3>}
                        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                            ×
                        </button>
                    </div>
                    <div className={styles.content}>
                        {children}
                    </div>
                </div>
            </div>
        </OverlayPortal>
    );
}

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
    // We wrap it in Overlay to maintain "System Consistency" (Context, State Pattern)
    // Even though we control it fully.
    return (
        <Overlay open={isOpen} onOpenChange={(v) => !v && onClose()}>
            {isOpen && <DrawerInner title={title} onClose={onClose}>{children}</DrawerInner>}
        </Overlay>
    );
}
