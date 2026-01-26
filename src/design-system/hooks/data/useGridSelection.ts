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
    // Controlled State
    value?: {
        cursor: CellPosition;
        selection: SelectionRange | null;
    };
    onChange?: (cursor: CellPosition, selection: SelectionRange | null) => void;
}

interface UseGridSelectionReturn {
    cursor: CellPosition;
    selection: SelectionRange | null;
    setCursor: (row: number, col: number) => void;
    setCursorAndSelection: (row: number, col: number, range: SelectionRange) => void;
    moveCursor: (rowDelta: number, colDelta: number, expandSelection?: boolean) => void;
    setSelection: (range: SelectionRange | null) => void;
    selectRow: (row: number, expandSelection?: boolean) => void;
    selectColumn: (col: number, expandSelection?: boolean) => void;
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
    value,
    onChange
}: UseGridSelectionOptions): UseGridSelectionReturn {
    // Internal state (used if uncontrolled)
    const [internalCursor, setInternalCursor] = useState<CellPosition>({ row: 0, col: 0 });
    const [internalSelection, setInternalSelection] = useState<SelectionRange | null>(null);

    const isControlled = value !== undefined;
    const cursor = isControlled ? value.cursor : internalCursor;
    const selection = isControlled ? value.selection : internalSelection;

    // Helper to ensure bounds
    const clamp = (val: number, max: number) => Math.max(0, Math.min(val, max));

    const updateState = useCallback((c: CellPosition, s: SelectionRange | null) => {
        if (!isControlled) {
            setInternalCursor(c);
            setInternalSelection(s);
        }
        onChange?.(c, s);
    }, [isControlled, onChange]);

    const setCursor = useCallback((row: number, col: number) => {
        const r = clamp(row, rows - 1);
        const c = clamp(col, cols - 1);
        updateState({ row: r, col: c }, null);
    }, [rows, cols, updateState]);

    const setCursorAndSelection = useCallback((row: number, col: number, range: SelectionRange) => {
        const r = clamp(row, rows - 1);
        const c = clamp(col, cols - 1);
        updateState({ row: r, col: c }, range);
    }, [rows, cols, updateState]);

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

            // Selection Logic
            let newSelection = null;
            if (expandSelection) {
                // anchor is existing anchor (start) or previous cursor (if starting selection)
                const anchor = selection ? selection.start : cursor;
                newSelection = {
                    start: anchor,
                    end: newCursor
                };
            }

            updateState(newCursor, newSelection);
        },
        [cursor, selection, rows, cols, loop, updateState]
    );

    const selectAll = useCallback(() => {
        updateState(
            cursor, // keep cursor? or move to 0,0? usually keep cursor but select all
            {
                start: { row: 0, col: 0 },
                end: { row: rows - 1, col: cols - 1 }
            }
        );
    }, [rows, cols, cursor, updateState]);

    const setSelection = useCallback((range: SelectionRange | null) => {
        updateState(cursor, range);
    }, [cursor, updateState]);

    const selectRow = useCallback((row: number, expandSelection = false) => {
        const r = clamp(row, rows - 1);
        const anchor = expandSelection && selection ? selection.start.row : r;
        const newCursor = { row: r, col: cols - 1 };
        const newSelection = {
            start: { row: anchor, col: 0 },
            end: { row: r, col: cols - 1 }
        };
        updateState(newCursor, newSelection);
    }, [rows, cols, selection, updateState]);

    const selectColumn = useCallback((col: number, expandSelection = false) => {
        const c = clamp(col, cols - 1);
        const anchor = expandSelection && selection ? selection.start.col : c;
        const newCursor = { row: rows - 1, col: c };
        const newSelection = {
            start: { row: 0, col: anchor },
            end: { row: rows - 1, col: c }
        };
        updateState(newCursor, newSelection);
    }, [rows, cols, selection, updateState]);

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
        setSelection,
        selectRow,
        selectColumn,
        selectAll,
        getNormalizedRange
    };
}
