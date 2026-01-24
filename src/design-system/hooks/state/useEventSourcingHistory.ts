import { useCallback, useReducer, useMemo } from "react";

/**
 * Event structure for Event Sourcing
 */
export interface HistoryEvent<TEventType extends string = string> {
    /** Event type identifier */
    type: TEventType;
    /** Event payload data */
    payload: any;
    /** When the event occurred */
    timestamp: number;
    /** Optional metadata */
    metadata?: Record<string, any>;
}

/**
 * Reducer function that applies events to state
 */
export type EventReducer<TState, TEventType extends string = string> = (
    state: TState,
    event: HistoryEvent<TEventType>
) => TState;

/**
 * Options for useEventSourcingHistory
 */
export interface UseEventSourcingHistoryOptions<TState, TEventType extends string = string> {
    /** Initial state */
    initialState: TState;
    /** Reducer function that applies events to state */
    reducer: EventReducer<TState, TEventType>;
    /** Maximum number of events to keep (default: 100) */
    capacity?: number;
}

/**
 * Return value from useEventSourcingHistory
 */
export interface UseEventSourcingHistoryReturn<TState, TEventType extends string = string> {
    /** Current state (computed from events) */
    state: TState;
    /** Dispatch a new event */
    dispatch: (type: TEventType, payload?: any, metadata?: Record<string, any>) => void;
    /** Undo last event */
    undo: () => void;
    /** Redo last undone event */
    redo: () => void;
    /** Whether undo is possible */
    canUndo: boolean;
    /** Whether redo is possible */
    canRedo: boolean;
    /** All events (past only, not future) */
    events: HistoryEvent<TEventType>[];
    /** Future events (for redo) */
    futureEvents: HistoryEvent<TEventType>[];
    /** Clear all history */
    clear: () => void;
    /** Reset to initial state */
    reset: () => void;
    /** Replay all events from scratch (for debugging) */
    replay: () => TState;
}

// Internal state structure
interface EventSourcingState<TEventType extends string = string> {
    past: HistoryEvent<TEventType>[];
    future: HistoryEvent<TEventType>[];
}

// Action types
type EventSourcingAction<TEventType extends string = string> =
    | { type: "DISPATCH"; event: HistoryEvent<TEventType>; capacity: number }
    | { type: "UNDO" }
    | { type: "REDO" }
    | { type: "CLEAR" }
    | { type: "RESET" };

/**
 * Reducer for managing event sourcing state
 */
function eventSourcingReducer<TEventType extends string = string>(
    state: EventSourcingState<TEventType>,
    action: EventSourcingAction<TEventType>
): EventSourcingState<TEventType> {
    switch (action.type) {
        case "DISPATCH": {
            const { event, capacity } = action;
            const newPast = [...state.past, event];

            // Enforce capacity
            if (newPast.length > capacity) {
                newPast.shift();
            }

            return {
                past: newPast,
                future: [], // Clear future on new event
            };
        }

        case "UNDO": {
            if (state.past.length === 0) return state;

            const lastEvent = state.past[state.past.length - 1];
            const newPast = state.past.slice(0, -1);

            return {
                past: newPast,
                future: [lastEvent, ...state.future],
            };
        }

        case "REDO": {
            if (state.future.length === 0) return state;

            const nextEvent = state.future[0];
            const newFuture = state.future.slice(1);

            return {
                past: [...state.past, nextEvent],
                future: newFuture,
            };
        }

        case "CLEAR":
            return {
                past: [],
                future: [],
            };

        case "RESET":
            return {
                past: [],
                future: [],
            };

        default:
            return state;
    }
}

/**
 * Event Sourcing History Hook
 *
 * Implements event sourcing pattern where all state changes are recorded as events
 * and the current state is computed by replaying events from the initial state.
 *
 * Unlike `useHistory` which stores state snapshots, this hook:
 * - Records events (what happened) instead of state (what is)
 * - Computes current state by replaying events through a reducer
 * - Enables time-travel debugging and event replay
 * - Supports undo/redo by replaying event subsets
 *
 * @example
 * ```tsx
 * const { state, dispatch, undo, redo } = useEventSourcingHistory({
 *   initialState: { count: 0 },
 *   reducer: (state, event) => {
 *     switch (event.type) {
 *       case 'INCREMENT':
 *         return { count: state.count + 1 };
 *       case 'DECREMENT':
 *         return { count: state.count - 1 };
 *       default:
 *         return state;
 *     }
 *   }
 * });
 *
 * // Dispatch events
 * dispatch('INCREMENT');
 * dispatch('DECREMENT', { amount: 5 });
 * ```
 */
export function useEventSourcingHistory<TState, TEventType extends string = string>({
    initialState,
    reducer,
    capacity = 100,
}: UseEventSourcingHistoryOptions<TState, TEventType>): UseEventSourcingHistoryReturn<
    TState,
    TEventType
> {
    const [eventState, dispatchAction] = useReducer(eventSourcingReducer<TEventType>, {
        past: [],
        future: [],
    });

    /**
     * Replay events to compute current state
     */
    const replay = useCallback(
        (events: HistoryEvent<TEventType>[] = eventState.past): TState => {
            return events.reduce((state, event) => reducer(state, event), initialState);
        },
        [initialState, reducer, eventState.past]
    );

    /**
     * Current state (computed by replaying all past events)
     */
    const state = useMemo(() => replay(), [replay]);

    /**
     * Dispatch a new event
     */
    const dispatch = useCallback(
        (type: TEventType, payload?: any, metadata?: Record<string, any>) => {
            const event: HistoryEvent<TEventType> = {
                type,
                payload,
                timestamp: Date.now(),
                metadata,
            };

            dispatchAction({ type: "DISPATCH", event, capacity });
        },
        [capacity]
    );

    /**
     * Undo last event
     */
    const undo = useCallback(() => {
        dispatchAction({ type: "UNDO" });
    }, []);

    /**
     * Redo last undone event
     */
    const redo = useCallback(() => {
        dispatchAction({ type: "REDO" });
    }, []);

    /**
     * Clear all history
     */
    const clear = useCallback(() => {
        dispatchAction({ type: "CLEAR" });
    }, []);

    /**
     * Reset to initial state
     */
    const reset = useCallback(() => {
        dispatchAction({ type: "RESET" });
    }, []);

    return {
        state,
        dispatch,
        undo,
        redo,
        canUndo: eventState.past.length > 0,
        canRedo: eventState.future.length > 0,
        events: eventState.past,
        futureEvents: eventState.future,
        clear,
        reset,
        replay,
    };
}
