import { useCallback, useMemo, useState } from "react";
import { useCommandSystem } from "../interaction/useCommandSystem";
import { ListCommand } from "../interaction/commands";

export interface UseHeadlessListOptions<T> {
    items: T[];
    initialSelectedIndex?: number;
    loop?: boolean;
    onSelect?: (item: T, index: number) => void;
}

export function useHeadlessList<T>({
    items,
    initialSelectedIndex = -1,
    loop = false,
    onSelect
}: UseHeadlessListOptions<T>) {
    const [focusedIndex, setFocusedIndex] = useState(initialSelectedIndex >= 0 ? initialSelectedIndex : 0);
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);

    const moveFocus = useCallback((delta: number) => {
        setFocusedIndex(prev => {
            const next = prev + delta;
            if (loop) {
                return (next + items.length) % items.length;
            }
            return Math.max(0, Math.min(items.length - 1, next));
        });
    }, [items.length, loop]);

    const handleSelect = useCallback(() => {
        setSelectedIndex(focusedIndex);
        if (onSelect) {
            onSelect(items[focusedIndex], focusedIndex);
        }
    }, [focusedIndex, items, onSelect]);

    const commandRegistry = {
        [ListCommand.Up]: () => moveFocus(-1),
        [ListCommand.Down]: () => moveFocus(1),
        [ListCommand.Select]: handleSelect
    };

    const keybindings = useMemo(() => [
        { key: "ArrowUp", command: ListCommand.Up },
        { key: "ArrowDown", command: ListCommand.Down },
        { key: "Enter", command: ListCommand.Select },
        { key: "Space", command: ListCommand.Select }
    ], []);

    const { onKeyDown } = useCommandSystem(keybindings, commandRegistry);

    return {
        state: {
            focusedIndex,
            selectedIndex,
            item: items[focusedIndex]
        },
        actions: {
            moveFocus,
            select: handleSelect,
            setFocusedIndex,
            setSelectedIndex
        },
        listProps: {
            onKeyDown,
            tabIndex: 0,
            style: { outline: "none" } // Helper to remove default outline
        },
        getItemProps: (index: number) => ({
            "data-focused": index === focusedIndex,
            "data-selected": index === selectedIndex,
            onClick: () => {
                setFocusedIndex(index);
                setSelectedIndex(index);
                if (onSelect) onSelect(items[index], index);
            },
            style: {
                // Optional: visual helper for focus, though UI should handle it via data-focused
            }
        })
    };
}
