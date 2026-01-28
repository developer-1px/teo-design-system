import React from 'react';
import { Badge, type BadgeProps } from './Badge';
import * as styles from './StatusBadge.css';

export interface StatusBadgeProps extends BadgeProps {
    status?: 'neutral' | 'success' | 'warning' | 'critical' | 'info';
    showDot?: boolean;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
    ({ status = 'neutral', showDot = true, children, ...props }, ref) => {
        // Map status to Badge intent
        const intentMap: Record<string, any> = {
            neutral: 'neutral',
            success: 'success',
            warning: 'warning',
            critical: 'danger',
            info: 'info',
        };

        return (
            <Badge
                ref={ref}
                intent={intentMap[status]}
                variant="subtle"
                {...props}
                className={`${styles.root} ${props.className || ''}`}
            >
                {showDot && <span className={`${styles.dot} ${styles.dotColors[status]}`} />}
                {children}
            </Badge>
        );
    }
);

StatusBadge.displayName = 'StatusBadge';
