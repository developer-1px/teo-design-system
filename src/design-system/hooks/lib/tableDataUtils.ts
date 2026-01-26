
/**
 * Parse text data (TSV) into a 2D array of strings.
 * Handles standard clipboard data from spreadsheets.
 */
export function parseTableData(text: string): string[][] {
    if (!text) return [];

    // Split by newlines (handling different EOL conventions) and filter empty rows intentionally? 
    // Usually spreadsheets end with a newline so the last split might be empty.
    return text
        .split(/\r\n|\n|\r/)
        .filter(row => row.trim() !== "") // Basic filtering of empty lines
        .map(row => row.split('\t'));
}

/**
 * Apply a 2D array of updates to an existing dataset.
 * 
 * @param data Current data array
 * @param updates 2D array of new values
 * @param startRow Target starting row index
 * @param startCol Target starting column index
 * @param columns Array of column keys corresponding to the data objects
 * @returns New data array with updates applied
 */
export function applyTableData<T>(
    data: T[],
    updates: string[][],
    startRow: number,
    startCol: number,
    columns: string[]
): T[] {
    const newData = [...data]; // Shallow copy of the array
    const numRows = data.length;
    const numCols = columns.length;

    updates.forEach((rowVals, rIdx) => {
        const targetRow = startRow + rIdx;
        if (targetRow >= numRows) return;

        rowVals.forEach((val, cIdx) => {
            const targetCol = startCol + cIdx;
            if (targetCol >= numCols) return;

            const colKey = columns[targetCol];

            // Create a shallow copy of the item being modified
            // @ts-ignore
            newData[targetRow] = { ...newData[targetRow], [colKey]: val };
        });
    });

    return newData;
}

/**
 * Calculate the selection range for pasted data.
 */
export function getPastedSelection(
    startRow: number,
    startCol: number,
    rowsPasted: number,
    colsPasted: number,
    totalRows: number,
    totalCols: number
) {
    if (rowsPasted <= 0 || colsPasted <= 0) return null;

    return {
        start: { row: startRow, col: startCol },
        end: {
            row: Math.min(startRow + rowsPasted - 1, totalRows - 1),
            col: Math.min(startCol + colsPasted - 1, totalCols - 1)
        }
    };
}
