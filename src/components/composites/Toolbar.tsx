import React from 'react';
import * as styles from './Toolbar.css';

export interface ToolbarProps {
    children: React.ReactNode;
    className?: string;
}

export const Toolbar = ({ children, className }: ToolbarProps) => {
    return (
        <div className={`${styles.root} ${className || ''}`} role="toolbar">
            {children}
        </div>
    );
};

export const ToolbarSeparator = () => <div className={styles.separator} />;
