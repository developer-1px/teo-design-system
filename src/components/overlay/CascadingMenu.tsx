import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import * as styles from './CascadingMenu.css';

// Re-use MenuItem interface structure broadly
export interface CascadingMenuItem {
    id: string;
    label: string;
    icon?: React.ElementType;
    children?: CascadingMenuItem[];
    onClick?: () => void;
}

interface CascadingMenuProps {
    items: CascadingMenuItem[];
    onSelect: (item: CascadingMenuItem) => void;
}

export function CascadingMenu({ items, onSelect }: CascadingMenuProps) {
    const [activeId, setActiveId] = useState<string | null>(null);

    return (
        <div className={styles.menu} onMouseLeave={() => setActiveId(null)}>
            {items.map(item => (
                <div
                    key={item.id}
                    className={styles.menuItem}
                    onMouseEnter={() => setActiveId(item.id)}
                    onClick={() => {
                        if (!item.children) {
                            onSelect(item);
                        }
                    }}
                    data-active={activeId === item.id}
                >
                    <div className={styles.itemLabel}>
                        {item.icon && <item.icon size={14} />}
                        <span>{item.label}</span>
                    </div>

                    {item.children && <ChevronRight className={styles.chevron} />}

                    {/* Render Sub Menu if Active */}
                    {item.children && activeId === item.id && (
                        <div className={styles.subMenuPosition}>
                            {/* Recursive usage for potentially infinite nesting */}
                            <CascadingMenu items={item.children} onSelect={onSelect} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
