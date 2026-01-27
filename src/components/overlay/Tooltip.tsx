
import type { ReactNode } from 'react';
import * as styles from './Tooltip.css';

interface TooltipProps {
    content: string;
    children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
    return (
        <div className={styles.container}>
            {children}
            <div className={styles.tooltip} role="tooltip">
                {content}
                <div className={styles.arrow} />
            </div>
        </div>
    );
}
