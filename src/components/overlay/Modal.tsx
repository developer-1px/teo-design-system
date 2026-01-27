import { type ReactNode } from 'react';
import { X } from 'lucide-react';
import * as styles from './Modal.css';
import { Overlay, OverlayPortal } from './Overlay';

// --- Modal Content ---
function ModalInner({ title, children, footer, onClose }: { title?: string, children: ReactNode, footer?: ReactNode, onClose: () => void }) {
    return (
        <OverlayPortal>
            <div className={styles.backdrop} onClick={onClose}>
                <div
                    className={styles.modal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby={title ? "modal-title" : undefined}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className={styles.header}>
                        {title && <h3 id="modal-title" className={styles.title}>{title}</h3>}
                        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                            <X size={18} />
                        </button>
                    </div>

                    <div>
                        {children}
                    </div>

                    {footer && (
                        <div className={styles.footer}>
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </OverlayPortal>
    );
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
}

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    return (
        <Overlay open={isOpen} onOpenChange={(v) => !v && onClose()}>
            {isOpen && <ModalInner title={title} onClose={onClose} footer={footer}>{children}</ModalInner>}
        </Overlay>
    );
}
