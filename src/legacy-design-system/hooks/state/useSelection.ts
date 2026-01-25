import { useCallback, useState } from "react";

/**
 * Selection hook options
 */
export interface UseSelectionOptions<T> {
    /** Initial selected items */
    initialSelected?: T[];
    /** Allow multiple selection (default: true) */
    multiple?: boolean;
    /** Function to get unique ID from item (default: JSON.stringify) */
    getKey?: (item: T) => string | number;
}

/**
 * Selection hook return value
 */
export interface UseSelectionReturn<T> {
    /** Selected items */
    selected: T[];
    /** Whether item is selected */
    isSelected: (item: T) => boolean;
    /** Select an item */
    select: (item: T) => void;
    /** Deselect an item */
    deselect: (item: T) => void;
    /** Toggle selection */
    toggle: (item: T) => void;
    /** Select all items (if provided) */
    selectAll: (items: T[]) => void;
    /** Clear selection */
    clear: () => void;
    /** Set selection manually */
    setSelected: (items: T[]) => void;
    /** Number of selected items */
    count: number;
}

/**
 * Selection management hook
 *
 * Manages selection state for lists, grids, or tables.
 *
 * Features:
 * - Single/Multi selection support
 * - Toggle selection
 * - Custom key support
 *
 * @param options - Configuration options
 * @returns Selection state and utilities
 */
export function useSelection<T = string>({
    initialSelected = [],
    multiple = true,
    getKey = (item: any) => (item?.id ? item.id : JSON.stringify(item)),
}: UseSelectionOptions<T> = {}): UseSelectionReturn<T> {
    const [selected, setSelected] = useState<T[]>(initialSelected);

    const isSelected = useCallback(
        (item: T) => {
            const itemKey = getKey(item);
            return selected.some((s) => getKey(s) === itemKey);
        },
        [selected, getKey]
    );

    const select = useCallback(
        (item: T) => {
            if (multiple) {
                if (!isSelected(item)) {
                    setSelected((prev) => [...prev, item]);
                }
            } else {
                setSelected([item]);
            }
        },
        [multiple, isSelected]
    );

    const deselect = useCallback(
        (item: T) => {
            const itemKey = getKey(item);
            setSelected((prev) => prev.filter((s) => getKey(s) !== itemKey));
        },
        [getKey]
    );

    const toggle = useCallback(
        (item: T) => {
            if (isSelected(item)) {
                deselect(item);
            } else {
                select(item);
            }
        },
        [isSelected, select, deselect]
    );

    const selectAll = useCallback(
        (items: T[]) => {
            if (multiple) {
                // Only select items not already selected to avoid duplicates if relying on simple array
                // But since we replace, just setting it is fine.
                // We might want to merge if we want to keep "existing" selection that might not be in the 'items' list (pagination),
                // but typically selectAll means "select these items".
                // Let's assume replacing for now, or merging unique.

                // Merging approach (keep existing, add new):
                const currentKeys = new Set(selected.map(getKey));
                const newItems = items.filter((item) => !currentKeys.has(getKey(item)));
                setSelected((prev) => [...prev, ...newItems]);
            } else {
                if (items.length > 0) {
                    setSelected([items[0]]);
                }
            }
        },
        [multiple, selected, getKey]
    );

    const clear = useCallback(() => {
        setSelected([]);
    }, []);

    return {
        selected,
        isSelected,
        select,
        deselect,
        toggle,
        selectAll,
        clear,
        setSelected,
        count: selected.length,
    };
}
