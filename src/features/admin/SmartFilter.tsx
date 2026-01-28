import { useState, useRef } from 'react';
import { Search, X, Circle, User, Shield, ListFilter } from 'lucide-react';
import * as styles from './SmartFilter.css';
// import { StackMenu, type MenuItem } from '@/components/overlay/StackMenu';
import { CascadingMenu, type CascadingMenuItem } from '@/components/overlay/CascadingMenu';
import { Overlay, OverlayTrigger, OverlayContent } from '@/components/overlay/Overlay';

interface FilterTag {
    id: string;
    label: string;
    value: string;
}

export function SmartFilter() {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [tags, setTags] = useState<FilterTag[]>([
        { id: '1', label: 'Status', value: 'Active' },
    ]);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Menu Definition (Linear Style)
    const menuItems: CascadingMenuItem[] = [
        {
            id: 'status',
            label: 'Status',
            icon: Circle,
            children: [
                { id: 'status-active', label: 'Active', icon: Circle },
                { id: 'status-pending', label: 'Pending', icon: Circle },
                { id: 'status-suspended', label: 'Suspended', icon: Circle },
            ]
        },
        {
            id: 'role',
            label: 'Role',
            icon: Shield,
            children: [
                { id: 'role-admin', label: 'Admin', icon: User },
                { id: 'role-manager', label: 'Manager', icon: User },
                { id: 'role-user', label: 'User', icon: User },
            ]
        }
    ];



    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            const parts = inputValue.split(':');
            let label = 'Search';
            let value = inputValue;

            if (parts.length > 1) {
                label = parts[0].trim();
                value = parts[1].trim();
            }

            const newTag = {
                id: Date.now().toString(),
                label: label.charAt(0).toUpperCase() + label.slice(1),
                value: value
            };

            setTags([...tags, newTag]);
            setInputValue('');
            setIsFocused(false);
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (id: string) => {
        setTags(tags.filter(t => t.id !== id));
    };

    // Handle leaf node selection
    const handleMenuSelect = (item: CascadingMenuItem) => {
        // Determine category based on ID convention (e.g., 'status-active')
        // In a real app, you might pass parent context down or use a better data structure
        let category = 'Filter';
        let value = item.label;

        if (item.id.startsWith('status-')) category = 'Status';
        if (item.id.startsWith('role-')) category = 'Role';

        const newTag = {
            id: Date.now().toString(),
            label: category,
            value: value
        };
        setTags([...tags, newTag]);
        setInputValue('');
        setIsFocused(false);
    };

    return (
        <div className={styles.rootContainer} ref={containerRef}>
            {/* 1. Search Bar */}
            <div className={styles.filterBar}>
                <div className={styles.searchSection}>
                    <Search className={styles.icon} />

                    {tags.map(tag => (
                        <div key={tag.id} className={styles.tag}>
                            <span>{tag.label}:</span>
                            <span style={{ color: '#000' }}>{tag.value}</span>
                            <X
                                size={10}
                                className={styles.tagClose}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTag(tag.id);
                                }}
                            />
                        </div>
                    ))}

                    <input
                        ref={inputRef}
                        className={styles.input}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={tags.length === 0 ? "Search..." : ""}
                    />
                </div>
            </div>

            {/* 2. External Filter Button (Wrapped in Overlay) */}
            <Overlay open={isFocused} onOpenChange={setIsFocused}>
                <OverlayTrigger>
                    <div
                        className={styles.standaloneFilterButton}
                        data-active={isFocused}
                    // onClick handled by Trigger
                    >
                        <ListFilter size={16} strokeWidth={2} />
                    </div>
                </OverlayTrigger>

                <OverlayContent align="end" side="bottom" sideOffset={4}>
                    <CascadingMenu items={menuItems} onSelect={handleMenuSelect} />
                </OverlayContent>
            </Overlay>
        </div>
    );
}
