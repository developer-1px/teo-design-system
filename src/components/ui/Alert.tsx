import React from 'react';
import * as styles from './Alert.css';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

const Icons: Record<string, LucideIcon> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    danger: AlertCircle,
    neutral: Info
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    intent?: styles.AlertVariants['intent'];
    variant?: styles.AlertVariants['variant'];
    title?: string;
    icon?: LucideIcon;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ intent = 'info', variant = 'subtle', title, icon, children, className, ...props }, ref) => {
        const IconComponent = icon || Icons[intent || 'info'];

        return (
            <div
                ref={ref}
                className={clsx(styles.alert({ intent, variant }), className)}
                {...props}
            >
                <div className={styles.icon({ intent })}>
                    <IconComponent size={20} />
                </div>
                <div className={styles.content()}>
                    {title && <div className={styles.title()}>{title}</div>}
                    {children && <div className={styles.description()}>{children}</div>}
                </div>
            </div>
        );
    }
);

Alert.displayName = 'Alert';
