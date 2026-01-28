import React, { useState, useRef } from 'react';
import { Search, X, ListFilter } from 'lucide-react';
import * as styles from './SearchFilterBar.css';
import { Overlay, OverlayTrigger, OverlayContent } from '@/components/overlay/Overlay';
import { CascadingMenu, type CascadingMenuItem } from '@/components/overlay/CascadingMenu';

export interface FilterTag {
    id: string;
    key: string;
    value: string;
}

export interface SearchFilterBarProps {
    tags?: FilterTag[];
    onTagsChange?: (tags: FilterTag[]) => void;
    onSearch?: (query: string) => void;
    placeholder?: string;
    filterMenu?: CascadingMenuItem[];
    className?: string;
}

export const SearchFilterBar = ({
    tags = [],
    onTagsChange,
    onSearch,
    placeholder = "Search or filter...",
    filterMenu,
    className
}: SearchFilterBarProps) => {
    const [inputValue, setInputValue] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            const parts = inputValue.split(':');
            let key = 'search';
            let value = inputValue;

            if (parts.length > 1) {
                key = parts[0].trim();
                value = parts.slice(1).join(':').trim();
            }

            const newTag: FilterTag = {
                id: Math.random().toString(36).substr(2, 9),
                key: key,
                value: value
            };

            const updatedTags = [...tags, newTag];
            onTagsChange?.(updatedTags);
            setInputValue('');
            onSearch?.('');
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            const updatedTags = tags.slice(0, -1);
            onTagsChange?.(updatedTags);
        }
    };

    const removeTag = (id: string) => {
        const updatedTags = tags.filter(t => t.id !== id);
        onTagsChange?.(updatedTags);
    };

    const handleMenuSelect = (item: CascadingMenuItem) => {
        // Simple heuristic for demo: if it has a dash, split it
        let key = 'filter';
        let value = item.label;

        if (item.id.includes('-')) {
            const parts = item.id.split('-');
            key = parts[0];
        }

        const newTag: FilterTag = {
            id: Math.random().toString(36).substr(2, 9),
            key: key,
            value: value
        };

        onTagsChange?.([...tags, newTag]);
        setMenuOpen(false);
    };

    return (
        <div className={`${styles.root} ${className || ''}`} ref={containerRef}>
            <div
                className={styles.filterBar}
                onClick={() => inputRef.current?.focus()}
            >
                <div className={styles.searchSection}>
                    <Search className={styles.icon} size={16} />

                    {tags.map(tag => (
                        <div key={tag.id} className={styles.tag}>
                            <span className={styles.tagLabel}>{tag.key}:</span>
                            <span className={styles.tagValue}>{tag.value}</span>
                            <X
                                size={12}
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
                        onChange={(e) => {
                            setInputValue(e.target.value);
                            onSearch?.(e.target.value);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={tags.length === 0 ? placeholder : ""}
                    />
                </div>

                {filterMenu && (
                    <Overlay open={menuOpen} onOpenChange={setMenuOpen}>
                        <OverlayTrigger>
                            <button
                                className={styles.filterButton}
                                data-active={menuOpen}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(true);
                                }}
                            >
                                <ListFilter size={18} />
                            </button>
                        </OverlayTrigger>
                        <OverlayContent align="end" side="bottom" sideOffset={8}>
                            <CascadingMenu items={filterMenu} onSelect={handleMenuSelect} />
                        </OverlayContent>
                    </Overlay>
                )}
            </div>
        </div>
    );
};
