import { createContext, useContext } from "react";

export type NavSelectionMode = "single" | "multi" | "none";

export interface NavContextValue {
    focusedId?: string;
    selectedId?: string;
    selectionMode?: NavSelectionMode;
}

const NavContext = createContext<NavContextValue | null>(null);

/**
 * Navigation Context Provider
 * Intermediate layer to pass selection and focus states indirectly.
 */
export const NavProvider = NavContext.Provider;

/**
 * Hook to consume navigation state for a specific ID.
 * Allows any component (not just Frame) to sync with navigation.
 */
export function useNavState(id?: string) {
    const context = useContext(NavContext);
    if (!context || !id) {
        return { isFocused: false, isSelected: false, mode: "none" as NavSelectionMode };
    }

    return {
        isFocused: context.focusedId === id,
        isSelected: context.selectedId === id,
        mode: context.selectionMode ?? "single",
    };
}

export function useNavContext() {
    return useContext(NavContext);
}
