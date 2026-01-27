import React, { useState } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import * as styles from './StackMenu.css';

export interface MenuItem {
    id: string;
    label: string;
    icon?: React.ElementType; // Icon component
    onClick?: () => void;
    children?: MenuItem[]; // If children exist, it's a "parent" item (Stage 1)
}

interface StackMenuProps {
    items: MenuItem[]; // Root level items
    onSelect?: (item: MenuItem) => void;
    className?: string; // Allow positioning overrides
}

export function StackMenu({ items, onSelect, className }: StackMenuProps) {
    const [stack, setStack] = useState<MenuItem[]>([]); // Navigation stack. Empty = Root.

    const currentMenu = stack.length === 0 ? items : stack[stack.length - 1].children || [];
    const currentTitle = stack.length === 0 ? null : stack[stack.length - 1].label;

    const handleItemClick = (item: MenuItem) => {
        if (item.children) {
            // Push to stack (Go deeper into Stage 2)
            setStack([...stack, item]);
        } else {
            // Leaf node: Select action
            onSelect?.(item);
        }
    };

    const handleBack = () => {
        setStack(stack.slice(0, -1));
    };

    return (
        <div className={`${styles.container} ${className || ''}`}>
            {/* Header (Back button + Title) */}
            {stack.length > 0 && (
                <div className={styles.header}>
                    <div className={styles.backButton} onClick={handleBack}>
                        <ArrowLeft size={14} />
                    </div>
                    <span>{currentTitle}</span>
                </div>
            )}

            {/* Menu List */}
            {/* Unique key forces re-render for animation when view changes */}
            <div key={stack.length} className={styles.viewContainer}>
                <div className={styles.list}>
                    {currentMenu.map((item) => (
                        <div
                            key={item.id}
                            className={styles.item}
                            onClick={() => handleItemClick(item)}
                        >
                            <div className={styles.itemLabel}>
                                {item.icon && <item.icon className={styles.icon} />}
                                <span>{item.label}</span>
                            </div>

                            {/* Show Chevron if it has children */}
                            {item.children && <ChevronRight className={styles.chevron} />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
