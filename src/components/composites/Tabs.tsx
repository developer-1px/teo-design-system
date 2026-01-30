import React from 'react';
import * as styles from './Tabs.css';
import { clsx } from 'clsx';

export interface TabItem {
    id: string;
    label: string | React.ReactNode;
    disabled?: boolean;
}

interface TabsProps {
    items: TabItem[];
    value: string;
    onChange: (value: string) => void;
    variant?: 'line' | 'segment';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    className?: string;
}

export function Tabs({
    items,
    value,
    onChange,
    variant = 'line',
    size = 'md',
    fullWidth = true, // Default to true for easy layouts
    className
}: TabsProps) {

    return (
        <div className={clsx(styles.tabsRoot, className)}>
            <div className={styles.tabsList({ variant })}>
                {items.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => !item.disabled && onChange(item.id)}
                        disabled={item.disabled}
                        data-state={value === item.id ? 'active' : 'inactive'}
                        className={styles.tabTrigger({ variant, size, fullWidth })}
                        type="button"
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
