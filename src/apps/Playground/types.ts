/**
 * Playground Event Types
 *
 * Defines all possible events in the playground environment for Event Sourcing.
 */

// ============================================================================
// Entity Types
// ============================================================================

export interface TextBlock {
    id: string;
    content: string;
    x: number;
    y: number;
}

export interface Shape {
    id: string;
    type: "rect" | "circle" | "triangle";
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
}

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
}

// ============================================================================
// Playground State
// ============================================================================

export interface PlaygroundState {
    textBlocks: TextBlock[];
    shapes: Shape[];
    todos: TodoItem[];
    selection: string[]; // IDs of selected items
}

// ============================================================================
// Event Types
// ============================================================================

export type PlaygroundEventType =
    // Text Block Events
    | "TEXT_BLOCK_ADDED"
    | "TEXT_BLOCK_DELETED"
    | "TEXT_BLOCK_CHANGED"
    | "TEXT_BLOCK_MOVED"
    // Shape Events
    | "SHAPE_ADDED"
    | "SHAPE_DELETED"
    | "SHAPE_MOVED"
    | "SHAPE_RESIZED"
    | "SHAPE_COLOR_CHANGED"
    // Todo Events
    | "TODO_ADDED"
    | "TODO_DELETED"
    | "TODO_TOGGLED"
    | "TODO_TEXT_CHANGED"
    // Selection Events
    | "SELECTION_CHANGED"
    | "SELECTION_CLEARED";

// ============================================================================
// Event Payloads
// ============================================================================

export type PlaygroundEventPayload =
    // Text Block
    | { type: "TEXT_BLOCK_ADDED"; block: TextBlock }
    | { type: "TEXT_BLOCK_DELETED"; id: string }
    | { type: "TEXT_BLOCK_CHANGED"; id: string; content: string }
    | { type: "TEXT_BLOCK_MOVED"; id: string; x: number; y: number }
    // Shape
    | { type: "SHAPE_ADDED"; shape: Shape }
    | { type: "SHAPE_DELETED"; id: string }
    | { type: "SHAPE_MOVED"; id: string; x: number; y: number }
    | { type: "SHAPE_RESIZED"; id: string; width: number; height: number }
    | { type: "SHAPE_COLOR_CHANGED"; id: string; color: string }
    // Todo
    | { type: "TODO_ADDED"; todo: TodoItem }
    | { type: "TODO_DELETED"; id: string }
    | { type: "TODO_TOGGLED"; id: string }
    | { type: "TODO_TEXT_CHANGED"; id: string; text: string }
    // Selection
    | { type: "SELECTION_CHANGED"; ids: string[] }
    | { type: "SELECTION_CLEARED" };

// ============================================================================
// Clipboard Item Types
// ============================================================================

export type ClipboardDataType = "text-block" | "shape" | "todo" | "mixed";

export interface ClipboardData {
    type: ClipboardDataType;
    items: (TextBlock | Shape | TodoItem)[];
}

// ============================================================================
// Initial State
// ============================================================================

export const INITIAL_PLAYGROUND_STATE: PlaygroundState = {
    textBlocks: [
        { id: "text-1", content: "Hello World", x: 50, y: 50 },
        { id: "text-2", content: "Event Sourcing Demo", x: 50, y: 120 },
        { id: "text-3", content: "Try Cmd+Z to undo!", x: 50, y: 190 },
    ],
    shapes: [
        {
            id: "shape-1",
            type: "rect",
            x: 300,
            y: 50,
            width: 100,
            height: 80,
            color: "#3b82f6",
        },
        {
            id: "shape-2",
            type: "circle",
            x: 450,
            y: 50,
            width: 80,
            height: 80,
            color: "#10b981",
        },
        {
            id: "shape-3",
            type: "triangle",
            x: 580,
            y: 50,
            width: 80,
            height: 80,
            color: "#f59e0b",
        },
    ],
    todos: [
        { id: "todo-1", text: "Try copying a shape (Cmd+C)", completed: false },
        { id: "todo-2", text: "Paste it somewhere (Cmd+V)", completed: false },
        { id: "todo-3", text: "Undo your changes (Cmd+Z)", completed: false },
    ],
    selection: [],
};
