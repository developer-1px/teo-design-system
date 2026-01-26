import type { ReactNode } from 'react';
import { Overlay } from './Overlay';
import * as styles from './Drawer.css';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
    return (
        <Overlay isOpen={isOpen} onClose={onClose} type="drawer">
            <div className={styles.drawer} role="dialog" aria-modal="true" aria-labelledby={title ? "drawer-title" : undefined}>
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
        </Overlay>
    );
}
