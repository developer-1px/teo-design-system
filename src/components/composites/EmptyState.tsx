import React from 'react';
import * as styles from './EmptyState.css';
import { PackageOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
    ({ icon: Icon = PackageOpen, title, description, action, className, children, ...props }, ref) => {
        return (
            <div ref={ref} className={clsx(styles.container(), className)} {...props}>
                <div className={styles.iconWrapper()}>
                    <Icon size={32} />
                </div>
                <h3 className={styles.title()}>{title}</h3>
                {description && <p className={styles.description()}>{description}</p>}
                {action && <div className={styles.actions()}>{action}</div>}
                {children}
            </div>
        );
    }
);

EmptyState.displayName = 'EmptyState';
