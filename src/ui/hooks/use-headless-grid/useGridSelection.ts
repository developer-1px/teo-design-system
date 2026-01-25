import { useCallback, useState } from "react";
import type { GridCursor } from "./useGridCursor";

export type GridSelection = {
    start: GridCursor;
    end: GridCursor;
} | null;

export const useGridSelection = (_rowCount: number, _colCount: number) => {
    const [selection, setSelection] = useState<GridSelection>(null);
    const [isSelecting, setIsSelecting] = useState(false);
    const [anchor, setAnchor] = useState<GridCursor | null>(null);

    const startSelection = useCallback((cursor: GridCursor) => {
        setIsSelecting(true);
        setAnchor(cursor);
        setSelection({ start: cursor, end: cursor });
    }, []);

    const updateSelection = useCallback(
        (cursor: GridCursor) => {
            if (isSelecting && anchor) {
                setSelection({
                    start: {
                        row: Math.min(anchor.row, cursor.row),
                        col: Math.min(anchor.col, cursor.col),
                    },
                    end: {
                        row: Math.max(anchor.row, cursor.row),
                        col: Math.max(anchor.col, cursor.col),
                    },
                });
            }
        },
        [isSelecting, anchor]
    );

    const endSelection = useCallback(() => {
        setIsSelecting(false);
        setAnchor(null);
    }, []);

    const clearSelection = useCallback(() => {
        setSelection(null);
        setIsSelecting(false);
        setAnchor(null);
    }, []);

    return {
        selection,
        isSelecting,
        startSelection,
        updateSelection,
        endSelection, // Call on mouse up
        clearSelection,
    };
};
