import type { ReactNode } from 'react';
import { Overlay } from './Overlay';
import * as styles from './Modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    return (
        <Overlay isOpen={isOpen} onClose={onClose} type="modal">
            <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={title ? "modal-title" : undefined}>
                <div className={styles.header}>
                    {title && <h3 id="modal-title" className={styles.title}>{title}</h3>}
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
