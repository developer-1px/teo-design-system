import { useCallback, useReducer } from "react";

/**
 * History hook options
 */
export interface UseHistoryOptions<T> {
    /** Initial state */
    initialState: T;
    /** Maximum history size (default: 50) */
    capacity?: number;
}

/**
 * History hook return value
 */
export interface UseHistoryReturn<T> {
    /** Current state */
    state: T;
    /** Set new state (pushes to history) */
    set: (newState: T | ((prev: T) => T)) => void;
    /** Replace current state (does not push to history) */
    replace: (newState: T | ((prev: T) => T)) => void;
    /** Reset state (clears history) */
    reset: (newState: T) => void;
    /** Undo last change */
    undo: () => void;
    /** Redo last undone change */
    redo: () => void;
    /** Whether undo is possible */
    canUndo: boolean;
    /** Whether redo is possible */
    canRedo: boolean;
    /** Current history stack (only past) */
    history: T[];
    /** Current future stack */
    future: T[];
    /** Clear history */
    clear: () => void;
}

// Action types
type Action<T> =
    | { type: "SET"; payload: T | ((prev: T) => T); capacity: number }
    | { type: "REPLACE"; payload: T | ((prev: T) => T) }
    | { type: "RESET"; payload: T }
    | { type: "UNDO" }
    | { type: "REDO" }
    | { type: "CLEAR" };

// Helper to resolve functional state
function resolveState<T>(payload: T | ((prev: T) => T), current: T): T {
    return typeof payload === "function"
        ? (payload as (prev: T) => T)(current)
        : payload;
}

// State structure
interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

/**
 * Reducer for processing history actions
 */
function historyReducer<T>(state: HistoryState<T>, action: Action<T>): HistoryState<T> {
    const { past, present, future } = state;

    switch (action.type) {
        case "SET": {
            const { payload, capacity } = action;
            const newPresent = resolveState(payload, present);

            // Don't modify if state hasn't changed (shallow comparison)
            if (newPresent === present) return state;

            const newPast = [...past, present];

            // Enforce capacity
            if (newPast.length > capacity) {
                newPast.shift();
            }

            return {
                past: newPast,
                present: newPresent,
                future: [], // Clearing future on new change is standard behavior
            };
        }

        case "REPLACE":
            return {
                past,
                present: resolveState(action.payload, present),
                future, // Keep future to allow "soft" updates (like selection change) without breaking data redo
            };

        case "RESET":
            return {
                past: [],
                present: action.payload,
                future: [],
            };

        case "UNDO": {
            if (past.length === 0) return state;

            const previous = past[past.length - 1];
            const newPast = past.slice(0, past.length - 1);

            return {
                past: newPast,
                present: previous,
                future: [present, ...future],
            };
        }

        case "REDO": {
            if (future.length === 0) return state;

            const next = future[0];
            const newFuture = future.slice(1);

            return {
                past: [...past, present],
                present: next,
                future: newFuture,
            };
        }

        case "CLEAR":
            return {
                past: [],
                present: present,
                future: [],
            };

        default:
            return state;
    }
}

/**
 * History (Undo/Redo) management hook
 *
 * Provides time-travel capabilities for state.
 *
 * Features:
 * - Undo/Redo
 * - History capacity limit
 * - Reset support
 *
 * @param options - Configuration options
 * @returns History state and controls
 */
export function useHistory<T>({
    initialState,
    capacity = 50,
}: UseHistoryOptions<T>): UseHistoryReturn<T> & { replace: (newState: T) => void } {
    const [historyState, dispatch] = useReducer(historyReducer<T>, {
        past: [],
        present: initialState,
        future: [],
    });

    const set = useCallback(
        (newState: T | ((prev: T) => T)) => {
            dispatch({ type: "SET", payload: newState, capacity });
        },
        [capacity]
    );

    const replace = useCallback((newState: T | ((prev: T) => T)) => {
        dispatch({ type: "REPLACE", payload: newState });
    }, []);

    const reset = useCallback((newState: T) => {
        dispatch({ type: "RESET", payload: newState });
    }, []);

    const undo = useCallback(() => {
        dispatch({ type: "UNDO" });
    }, []);

    const redo = useCallback(() => {
        dispatch({ type: "REDO" });
    }, []);

    const clear = useCallback(() => {
        dispatch({ type: "CLEAR" });
    }, []);

    return {
        state: historyState.present,
        set,
        replace,
        reset,
        undo,
        redo,
        canUndo: historyState.past.length > 0,
        canRedo: historyState.future.length > 0,
        history: historyState.past,
        future: historyState.future,
        clear,
    };
}
