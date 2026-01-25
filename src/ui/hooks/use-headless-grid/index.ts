import { useGridCursor, type GridOptions } from "./useGridCursor";
import { useGridSelection } from "./useGridSelection";

export type UseHeadlessGridProps = {
    rowCount: number;
    colCount: number;
    initialCursor?: { row: number; col: number };
};

export const useHeadlessGrid = ({
    rowCount,
    colCount,
    initialCursor,
}: UseHeadlessGridProps) => {
    const gridOptions: GridOptions = { rowCount, colCount };

    const { cursor, moveUp, moveDown, moveLeft, moveRight, setCursor } =
        useGridCursor(initialCursor, gridOptions);

    const {
        selection,
        startSelection,
        updateSelection,
        endSelection,
        clearSelection,
    } = useGridSelection(rowCount, colCount);

    // Keyboard Event Handler
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Basic Navigation
        if (!e.shiftKey && !e.metaKey && !e.ctrlKey) {
            switch (e.key) {
                case "ArrowUp":
                    e.preventDefault();
                    moveUp();
                    clearSelection();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    moveDown();
                    clearSelection();
                    break;
                case "ArrowLeft":
                    e.preventDefault();
                    moveLeft();
                    clearSelection();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    moveRight();
                    clearSelection();
                    break;
            }
        }

        // Shift Selection (Simple version: Anchor is current cursor)
        if (e.shiftKey) {
            // TODO: Implement keyboard selection expansion logic
            // This requires the cursor hook to know about the anchor
        }
    };

    return {
        // State
        cursor,
        selection,

        // Actions
        handleKeyDown,

        // Sub-hooks exposed for advanced composition
        cursorActions: { moveUp, moveDown, moveLeft, moveRight, setCursor },
        selectionActions: { startSelection, updateSelection, endSelection, clearSelection }
    };
};
