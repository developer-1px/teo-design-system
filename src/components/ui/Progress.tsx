import * as styles from './Progress.css';
import { clsx } from 'clsx';

interface ProgressProps {
    value: number;
    max?: number;
    intent?: 'primary' | 'success' | 'warning' | 'critical' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Progress({
    value,
    max = 100,
    intent = 'primary',
    size = 'md',
    className
}: ProgressProps) {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div className={clsx(styles.progressRoot({ size }), className)} role="progressbar" aria-valuenow={value} aria-valuemax={max}>
            <div
                className={styles.progressIndicator({ intent })}
                style={{ transform: `translateX(-${100 - percentage}%)` }}
            />
        </div>
    );
}
