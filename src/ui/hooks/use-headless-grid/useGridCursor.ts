import { useCallback, useState } from "react";

export type GridCursor = {
    row: number;
    col: number;
};

export type GridOptions = {
    rowCount: number;
    colCount: number;
    loop?: boolean;
};

export const useGridCursor = (
    initialCursor: GridCursor = { row: 0, col: 0 },
    options: GridOptions
) => {
    const [cursor, setCursor] = useState<GridCursor>(initialCursor);

    const moveCursor = useCallback(
        (deltaRow: number, deltaCol: number) => {
            setCursor((prev) => {
                let newRow = prev.row + deltaRow;
                let newCol = prev.col + deltaCol;

                // Boundary checks
                if (newRow < 0) newRow = 0;
                if (newRow >= options.rowCount) newRow = options.rowCount - 1;
                if (newCol < 0) newCol = 0;
                if (newCol >= options.colCount) newCol = options.colCount - 1;

                // Loop logic (optional, can be expanded later)
                if (options.loop) {
                    // simple single-axis loop for now, full wrapping needs more logic
                }

                return { row: newRow, col: newCol };
            });
        },
        [options.rowCount, options.colCount, options.loop]
    );

    const setCursorPosition = useCallback((row: number, col: number) => {
        if (
            row >= 0 &&
            row < options.rowCount &&
            col >= 0 &&
            col < options.colCount
        ) {
            setCursor({ row, col });
        }
    }, [options.rowCount, options.colCount]);

    return {
        cursor,
        setCursor: setCursorPosition,
        moveUp: () => moveCursor(-1, 0),
        moveDown: () => moveCursor(1, 0),
        moveLeft: () => moveCursor(0, -1),
        moveRight: () => moveCursor(0, 1),
    };
};
