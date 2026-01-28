import type { ReactNode } from 'react';
import * as styles from './TopBar.css';
import { clsx } from 'clsx';

export interface TopBarProps {
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    className?: string;
}

export function TopBar({ left, center, right, className }: TopBarProps) {
    return (
        <header className={clsx(styles.container, className)}>
            <div className={styles.left}>{left}</div>
            {center && <div className={styles.center}>{center}</div>}
            <div className={styles.right}>{right}</div>
        </header>
    );
}
