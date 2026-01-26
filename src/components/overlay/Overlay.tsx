import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as styles from './Overlay.css';

interface OverlayProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    type?: 'modal' | 'drawer' | 'unmounted'; // 'unmounted' is internal state
}

export function Overlay({ isOpen, onClose, children, type = 'modal' }: OverlayProps) {
    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay} role="presentation">
            <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
            <div className={styles.container[type]}>
                {children}
            </div>
        </div>,
        document.body
    );
}
