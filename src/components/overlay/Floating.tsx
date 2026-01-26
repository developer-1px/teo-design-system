import type { ReactNode } from 'react';
import * as styles from './Floating.css';

interface FloatingProps {
    content: ReactNode;
    children: ReactNode; // Trigger
    visible?: boolean;
}

export function Floating({ content, children, visible = false }: FloatingProps) {
    return (
        <div className={styles.wrapper}>
            {children}
            {visible && (
                <div className={styles.popover}>
                    {content}
                </div>
            )}
        </div>
    );
}
