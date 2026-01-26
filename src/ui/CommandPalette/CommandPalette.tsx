import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Icon } from "@/ui/primitives/Icon"; // Assume Icon is moved or aliased? Legacy Icon still exists.
import { useHeadlessList } from "@/design-system/hooks/data/useHeadlessList";
import * as styles from "./CommandPalette.css";

export interface PaletteItem {
    id: string;
    label: string;
    icon?: React.ElementType; // Lucide icon
    shortcut?: string[];
    onSelect: () => void;
}

export interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    items: PaletteItem[];
}

export function CommandPalette({ isOpen, onClose, items }: CommandPaletteProps) {
    const [search, setSearch] = useState("");

    // Filter items
    const filteredItems = useMemo(() => {
        if (!search) return items;
        const lower = search.toLowerCase();
        return items.filter(item => item.label.toLowerCase().includes(lower));
    }, [items, search]);

    // Headless List
    const {
        state: { selectedIndex, focusedIndex },
        actions: { setSelectedIndex, setFocusedIndex },
        listProps: { onKeyDown: handleListKey },
        getItemProps,
    } = useHeadlessList({
        items: filteredItems,
        onSelect: (item) => {
            item.onSelect();
            onClose();
            setSearch("");
        },
        loop: true,
        initialSelectedIndex: 0,
    });

    // Reset selection when search changes
    useEffect(() => {
        setFocusedIndex(0);
    }, [search, setFocusedIndex]);

    // Global shortcut to close? handled by caller typically, or overlay click.

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.panel}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleListKey}
            >
                {/* Search Input Area */}
                <div className={styles.searchArea}>
                    <Icon src={Search} size={16} /> {/* inline style/size? Icon component might need update if it uses legacy tokens */}
                    <input
                        autoFocus
                        className={styles.input}
                        placeholder="Type a command or search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Results Area */}
                <div className={styles.resultsArea}>
                    {filteredItems.map((item, index) => {
                        const itemProps = getItemProps(index);
                        return (
                            <div
                                key={item.id}
                                className={styles.item}
                                {...itemProps}
                                data-focused={index === focusedIndex}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {item.icon && <Icon src={item.icon} size={16} />}
                                    <span>{item.label}</span>
                                </div>
                                {item.shortcut && (
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        {item.shortcut.map(k => (
                                            <span key={k} className={styles.itemShortcut}>{k}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                    {filteredItems.length === 0 && (
                        <div style={{ padding: 12, textAlign: 'center', color: '#999' }}>
                            No results found
                        </div>
                    )}
                </div>

                {/* Footer area */}
                <div className={styles.footer}>
                    <span>Minimal Design Kit</span>
                    <span>Use arrows to navigate, Enter to select</span>
                </div>
            </div>
        </div>
    );
}
