
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import * as styles from './Toast.css';

export interface ToastItem {
    id: string;
    message: string;
    duration?: number;
}

interface ToastContainerProps {
    toasts: ToastItem[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return createPortal(
        <div className={styles.toastContainer}>
            {toasts.map((toast) => (
                <Toast key={toast.id} item={toast} onRemove={onRemove} />
            ))}
        </div>,
        document.body
    );
}

function Toast({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
    useEffect(() => {
        const duration = item.duration || 3000;
        const timer = setTimeout(() => {
            onRemove(item.id);
        }, duration);
        return () => clearTimeout(timer);
    }, [item, onRemove]);

    return (
        <div className={styles.toast} role="alert">
            <span className={styles.message}>{item.message}</span>
            <button className={styles.closeButton} onClick={() => onRemove(item.id)}>
                ×
            </button>
        </div>
    );
}

// Simple Hook for local demo usage
export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = (message: string, duration?: number) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts(prev => [...prev, { id, message, duration }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, addToast, removeToast };
}
