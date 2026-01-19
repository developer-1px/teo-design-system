import { useCallback, useState } from "react";

export interface CellPosition {
    row: number;
    col: number;
}

export interface SelectionRange {
    start: CellPosition; // Anchor
    end: CellPosition;   // Focus
}

interface UseGridSelectionOptions {
    rows: number;
    cols: number;
    loop?: boolean;
}

interface UseGridSelectionReturn {
    cursor: CellPosition;
    selection: SelectionRange | null;
    setCursor: (row: number, col: number) => void;
    setCursorAndSelection: (row: number, col: number, range: SelectionRange) => void;
    moveCursor: (rowDelta: number, colDelta: number, expandSelection?: boolean) => void;
    setSelection: (range: SelectionRange | null) => void;
    selectAll: () => void;
    getNormalizedRange: () => { startRow: number; endRow: number; startCol: number; endCol: number };
}

/**
 * Low-level hook for 2D Grid Selection logic.
 * Manages cursor position and range selection independently of data.
 */
export function useGridSelection({
    rows,
    cols,
    loop = false,
}: UseGridSelectionOptions): UseGridSelectionReturn {
    const [cursor, setCursorState] = useState<CellPosition>({ row: 0, col: 0 });
    const [selection, setSelectionState] = useState<SelectionRange | null>(null);

    // Helper to ensure bounds
    const clamp = (val: number, max: number) => Math.max(0, Math.min(val, max));

    const setCursor = useCallback((row: number, col: number) => {
        const r = clamp(row, rows - 1);
        const c = clamp(col, cols - 1);
        setCursorState({ row: r, col: c });
        setSelectionState(null);
    }, [rows, cols]);

    const setCursorAndSelection = useCallback((row: number, col: number, range: SelectionRange) => {
        const r = clamp(row, rows - 1);
        const c = clamp(col, cols - 1);
        setCursorState({ row: r, col: c });
        setSelectionState(range);
    }, [rows, cols]);

    const moveCursor = useCallback(
        (rowDelta: number, colDelta: number, expandSelection = false) => {
            let newRow = cursor.row + rowDelta;
            let newCol = cursor.col + colDelta;

            // Loop logic
            if (loop) {
                if (newCol >= cols) {
                    newCol = 0;
                    newRow = (newRow + 1) % rows;
                } else if (newCol < 0) {
                    newCol = cols - 1;
                    newRow = (newRow - 1 + rows) % rows;
                }
                // Simple row loop
                newRow = (newRow + rows) % rows;
            } else {
                newRow = clamp(newRow, rows - 1);
                newCol = clamp(newCol, cols - 1);
            }

            const newCursor = { row: newRow, col: newCol };
            setCursorState(newCursor);

            // Selection Logic
            if (expandSelection) {
                // anchor is existing anchor (start) or previous cursor (if starting selection)
                const anchor = selection ? selection.start : cursor;
                setSelectionState({
                    start: anchor,
                    end: newCursor
                });
            } else {
                setSelectionState(null);
            }
        },
        [cursor, selection, rows, cols, loop] // Removed clamp dependency as it is internal constant-ish function or we can move it out
    );

    const selectAll = useCallback(() => {
        setSelectionState({
            start: { row: 0, col: 0 },
            end: { row: rows - 1, col: cols - 1 }
        });
    }, [rows, cols]);

    // Helper for range normalization
    const getNormalizedRange = useCallback(() => {
        if (!selection) return { startRow: cursor.row, endRow: cursor.row, startCol: cursor.col, endCol: cursor.col };
        const startRow = Math.min(selection.start.row, selection.end.row);
        const endRow = Math.max(selection.start.row, selection.end.row);
        const startCol = Math.min(selection.start.col, selection.end.col);
        const endCol = Math.max(selection.start.col, selection.end.col);
        return { startRow, endRow, startCol, endCol };
    }, [selection, cursor]);

    return {
        cursor,
        selection,
        setCursor,
        setCursorAndSelection,
        moveCursor,
        setSelection: setSelectionState,
        selectAll,
        getNormalizedRange
    };
}
