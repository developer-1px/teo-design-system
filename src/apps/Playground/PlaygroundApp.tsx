import { useCallback } from "react";
import { Frame } from "../../design-system/Frame/Frame";
import { Text } from "../../design-system/text/Text";
import { Size, Space } from "../../design-system/token/token.const.1tier";
import { useEventSourcingHistory } from "../../design-system/hooks/state/useEventSourcingHistory";
import { useHybridClipboard } from "../../design-system/hooks/state/useHybridClipboard";
import { useOSShortcuts } from "../../design-system/hooks/interaction/useOSShortcuts";
import { playgroundReducer } from "./reducer";
import {
    INITIAL_PLAYGROUND_STATE,
    type PlaygroundState,
    type PlaygroundEventType,
    type TextBlock,
    type Shape,
    type TodoItem,
} from "./types";

/**
 * Playground App
 *
 * Demonstrates Event Sourcing, Hybrid Clipboard, and OS Shortcuts
 * in a complex environment with text blocks, shapes, and todo lists.
 */
export function PlaygroundApp() {
    // ========================================================================
    // Event Sourcing History
    // ========================================================================

    const history = useEventSourcingHistory<PlaygroundState, PlaygroundEventType>({
        initialState: INITIAL_PLAYGROUND_STATE,
        reducer: playgroundReducer,
        capacity: 100,
    });

    const { state, dispatch, undo, redo, canUndo, canRedo, events, futureEvents } = history;

    // ========================================================================
    // Hybrid Clipboard
    // ========================================================================

    const clipboard = useHybridClipboard();

    // ========================================================================
    // Selection State
    // ========================================================================

    const selectedIds = state.selection;

    // Commented out for now - will be used when implementing interactive components
    // const selectItem = useCallback(
    //     (id: string, addToSelection = false) => {
    //         if (addToSelection) {
    //             if (selectedIds.includes(id)) {
    //                 // Deselect
    //                 dispatch("SELECTION_CHANGED", {
    //                     type: "SELECTION_CHANGED",
    //                     ids: selectedIds.filter((i) => i !== id),
    //                 });
    //             } else {
    //                 // Add to selection
    //                 dispatch("SELECTION_CHANGED", {
    //                     type: "SELECTION_CHANGED",
    //                     ids: [...selectedIds, id],
    //                 });
    //             }
    //         } else {
    //             // Replace selection
    //             dispatch("SELECTION_CHANGED", {
    //                 type: "SELECTION_CHANGED",
    //                 ids: [id],
    //             });
    //         }
    //     },
    //     [selectedIds, dispatch]
    // );

    const clearSelection = useCallback(() => {
        dispatch("SELECTION_CLEARED", { type: "SELECTION_CLEARED" });
    }, [dispatch]);

    // ========================================================================
    // Clipboard Operations
    // ========================================================================

    const handleCopy = useCallback(async () => {
        if (selectedIds.length === 0) return;

        // Gather selected items
        const items: (TextBlock | Shape | TodoItem)[] = [];

        selectedIds.forEach((id) => {
            const textBlock = state.textBlocks.find((b) => b.id === id);
            if (textBlock) items.push(textBlock);

            const shape = state.shapes.find((s) => s.id === id);
            if (shape) items.push(shape);

            const todo = state.todos.find((t) => t.id === id);
            if (todo) items.push(todo);
        });

        if (items.length === 0) return;

        // Determine type
        const types = new Set(
            items.map((item) => {
                if ("content" in item) return "text-block";
                if ("type" in item && item.type !== undefined) return "shape";
                return "todo";
            })
        );

        const clipboardType = types.size === 1 ? Array.from(types)[0] : "mixed";

        // Copy to clipboard
        await clipboard.copy(
            clipboardType,
            { type: clipboardType, items },
            JSON.stringify(items, null, 2)
        );

        console.log("Copied:", items);
    }, [selectedIds, state, clipboard]);

    const handlePaste = useCallback(async () => {
        const item = await clipboard.paste();
        if (!item) return;

        const data = item.data as any;
        const items = data.items || [];

        console.log("Pasting:", items);

        // Generate new IDs and offset positions
        items.forEach((originalItem: any) => {
            const newId = `${originalItem.id}-copy-${Date.now()}`;

            if ("content" in originalItem) {
                // Text Block
                const newBlock: TextBlock = {
                    ...originalItem,
                    id: newId,
                    x: originalItem.x + 20,
                    y: originalItem.y + 20,
                };
                dispatch("TEXT_BLOCK_ADDED", { type: "TEXT_BLOCK_ADDED", block: newBlock });
            } else if ("type" in originalItem && originalItem.type !== undefined) {
                // Shape
                const newShape: Shape = {
                    ...originalItem,
                    id: newId,
                    x: originalItem.x + 20,
                    y: originalItem.y + 20,
                };
                dispatch("SHAPE_ADDED", { type: "SHAPE_ADDED", shape: newShape });
            } else if ("completed" in originalItem) {
                // Todo
                const newTodo: TodoItem = {
                    ...originalItem,
                    id: newId,
                };
                dispatch("TODO_ADDED", { type: "TODO_ADDED", todo: newTodo });
            }
        });
    }, [clipboard, dispatch]);

    const handleDelete = useCallback(() => {
        if (selectedIds.length === 0) return;

        selectedIds.forEach((id) => {
            // Find item type and delete
            if (state.textBlocks.find((b) => b.id === id)) {
                dispatch("TEXT_BLOCK_DELETED", { type: "TEXT_BLOCK_DELETED", id });
            } else if (state.shapes.find((s) => s.id === id)) {
                dispatch("SHAPE_DELETED", { type: "SHAPE_DELETED", id });
            } else if (state.todos.find((t) => t.id === id)) {
                dispatch("TODO_DELETED", { type: "TODO_DELETED", id });
            }
        });
    }, [selectedIds, state, dispatch]);

    const handleSelectAll = useCallback(() => {
        const allIds = [
            ...state.textBlocks.map((b) => b.id),
            ...state.shapes.map((s) => s.id),
            ...state.todos.map((t) => t.id),
        ];
        dispatch("SELECTION_CHANGED", { type: "SELECTION_CHANGED", ids: allIds });
    }, [state, dispatch]);

    // ========================================================================
    // OS Shortcuts
    // ========================================================================

    const shortcuts = useOSShortcuts({
        onCopy: handleCopy,
        onPaste: handlePaste,
        onUndo: undo,
        onRedo: redo,
        onDelete: handleDelete,
        onSelectAll: handleSelectAll,
        onEscape: clearSelection,
    });

    // ========================================================================
    // Render
    // ========================================================================

    return (
        <Frame
            override={{ minHeight: Size.screen, gap: Space.n0 }}
            onKeyDown={shortcuts.onKeyDown}
            tabIndex={0}
        >
            {/* Header */}
            <Frame
                spacing={Space.n12}
                override={{ row: true }}
                surface="raised"
            >
                <Text.Card.Title>Playground</Text.Card.Title>
                <Text.Card.Desc>
                    {canUndo && "Cmd+Z: Undo"}
                    {canUndo && canRedo && " | "}
                    {canRedo && "Cmd+Shift+Z: Redo"}
                    {!canUndo && !canRedo && "Start editing!"}
                </Text.Card.Desc>
                <Frame style={{ flex: 1 }} />
                <Text.Card.Desc>
                    Clipboard: {clipboard.hasContent ? "Has data" : "Empty"}
                </Text.Card.Desc>
                <Text.Card.Desc>Selected: {selectedIds.length}</Text.Card.Desc>
            </Frame>

            {/* Main Content */}
            <Frame
                override={{ flex: 1, gap: Space.n0, row: true }}
            >
                {/* Canvas Area - Placeholder for now */}
                <Frame
                    spacing={Space.n12}
                    override={{ flex: 1 }}
                    surface="base"
                    style={{ position: "relative" }}
                >
                    <Text.Card.Title>Canvas (Coming Soon)</Text.Card.Title>
                    <Text.Card.Desc>
                        Text blocks: {state.textBlocks.length} | Shapes: {state.shapes.length} |
                        Todos: {state.todos.length}
                    </Text.Card.Desc>
                </Frame>

                {/* Debug Panel - Placeholder for now */}
                <Frame
                    spacing={Space.n12}
                    override={{ w: Size.n320 }}
                    surface="raised"
                >
                    <Text.Card.Title>Debug Panel</Text.Card.Title>

                    <Frame override={{ gap: Space.n8 }}>
                        <Text.Card.Title>Events</Text.Card.Title>
                        <Text.Card.Desc>Past: {events.length}</Text.Card.Desc>
                        <Text.Card.Desc>Future: {futureEvents.length}</Text.Card.Desc>
                    </Frame>

                    <Frame override={{ gap: Space.n8 }}>
                        <Text.Card.Title>Clipboard</Text.Card.Title>
                        <Text.Card.Desc>
                            {clipboard.content
                                ? `Type: ${clipboard.content.type}`
                                : "No content"}
                        </Text.Card.Desc>
                    </Frame>

                    <Frame override={{ gap: Space.n8 }}>
                        <Text.Card.Title>Selection</Text.Card.Title>
                        <Text.Card.Desc>{selectedIds.join(", ") || "None"}</Text.Card.Desc>
                    </Frame>
                </Frame>
            </Frame>
        </Frame>
    );
}
