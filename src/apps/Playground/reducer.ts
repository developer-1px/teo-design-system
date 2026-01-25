import type { HistoryEvent } from "@/design-system/hooks/state/useEventSourcingHistory";
import type {
    PlaygroundState,
    PlaygroundEventType,
    PlaygroundEventPayload,
} from "./types";

/**
 * Event Sourcing Reducer
 *
 * Applies events to state to compute the current state.
 * This is the heart of the Event Sourcing pattern.
 */
export function playgroundReducer(
    state: PlaygroundState,
    event: HistoryEvent<PlaygroundEventType>
): PlaygroundState {
    const payload = event.payload as PlaygroundEventPayload;

    switch (payload.type) {
        // ====================================================================
        // Text Block Events
        // ====================================================================

        case "TEXT_BLOCK_ADDED":
            return {
                ...state,
                textBlocks: [...state.textBlocks, payload.block],
            };

        case "TEXT_BLOCK_DELETED":
            return {
                ...state,
                textBlocks: state.textBlocks.filter((b) => b.id !== payload.id),
                selection: state.selection.filter((id) => id !== payload.id),
            };

        case "TEXT_BLOCK_CHANGED":
            return {
                ...state,
                textBlocks: state.textBlocks.map((b) =>
                    b.id === payload.id ? { ...b, content: payload.content } : b
                ),
            };

        case "TEXT_BLOCK_MOVED":
            return {
                ...state,
                textBlocks: state.textBlocks.map((b) =>
                    b.id === payload.id ? { ...b, x: payload.x, y: payload.y } : b
                ),
            };

        // ====================================================================
        // Shape Events
        // ====================================================================

        case "SHAPE_ADDED":
            return {
                ...state,
                shapes: [...state.shapes, payload.shape],
            };

        case "SHAPE_DELETED":
            return {
                ...state,
                shapes: state.shapes.filter((s) => s.id !== payload.id),
                selection: state.selection.filter((id) => id !== payload.id),
            };

        case "SHAPE_MOVED":
            return {
                ...state,
                shapes: state.shapes.map((s) =>
                    s.id === payload.id ? { ...s, x: payload.x, y: payload.y } : s
                ),
            };

        case "SHAPE_RESIZED":
            return {
                ...state,
                shapes: state.shapes.map((s) =>
                    s.id === payload.id
                        ? { ...s, width: payload.width, height: payload.height }
                        : s
                ),
            };

        case "SHAPE_COLOR_CHANGED":
            return {
                ...state,
                shapes: state.shapes.map((s) =>
                    s.id === payload.id ? { ...s, color: payload.color } : s
                ),
            };

        // ====================================================================
        // Todo Events
        // ====================================================================

        case "TODO_ADDED":
            return {
                ...state,
                todos: [...state.todos, payload.todo],
            };

        case "TODO_DELETED":
            return {
                ...state,
                todos: state.todos.filter((t) => t.id !== payload.id),
                selection: state.selection.filter((id) => id !== payload.id),
            };

        case "TODO_TOGGLED":
            return {
                ...state,
                todos: state.todos.map((t) =>
                    t.id === payload.id ? { ...t, completed: !t.completed } : t
                ),
            };

        case "TODO_TEXT_CHANGED":
            return {
                ...state,
                todos: state.todos.map((t) =>
                    t.id === payload.id ? { ...t, text: payload.text } : t
                ),
            };

        // ====================================================================
        // Selection Events
        // ====================================================================

        case "SELECTION_CHANGED":
            return {
                ...state,
                selection: payload.ids,
            };

        case "SELECTION_CLEARED":
            return {
                ...state,
                selection: [],
            };

        default:
            return state;
    }
}
