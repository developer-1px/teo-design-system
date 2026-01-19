
import { useState, useCallback, useRef, useMemo } from "react";
// import { useHotKeys } from "./useHotKeys";
import { useCommandSystem } from "../interaction/useCommandSystem";
import { useHistory } from "../state/useHistory";
import { useClipboard } from "../search/useClipboard";
import { useClickOutside } from "../primitives/useClickOutside";
import { useGridSelection, type CellPosition, type SelectionRange } from "./useGridSelection";

export type { CellPosition, SelectionRange };

export interface TableOptions<T> {
    data: T[];
    columns: string[];
    onChange?: (newData: T[]) => void;
    getRowId?: (item: T, index: number) => string | number;
    options?: {
        loop?: boolean;
        editOnType?: boolean;
        moveOnEnter?: "down" | "right" | "none";
    };
}

export interface HeadlessTableReturn<T> {
    state: {
        cursor: CellPosition;
        selection: SelectionRange | null;
        editing: {
            active: boolean;
            position: CellPosition | null;
            value: any;
        };
        data: T[];
    };
    actions: {
        moveCursor: (rowDelta: number, colDelta: number, expandSelection?: boolean) => void;
        setCursor: (row: number, col: number) => void;
        startEditing: (row?: number, col?: number, initialValue?: any) => void;
        commitEditing: (newValue: any, options?: { refocus?: boolean }) => void;
        cancelEditing: (options?: { refocus?: boolean }) => void;
        updateData: (newData: T[]) => void;
        undo: () => void;
        redo: () => void;
        selectAll: () => void;
    };
    gridProps: {
        ref: React.RefObject<any>;
        role: string;
        tabIndex: number;
        onKeyDown: (e: React.KeyboardEvent) => void;
        onMouseDown: (e: React.MouseEvent) => void;
        onPaste: (e: React.ClipboardEvent) => void;
    };
    getCellProps: (row: number, col: number) => {
        onClick: (e: React.MouseEvent) => void;
        onDoubleClick: (e: React.MouseEvent) => void;
        "data-row": number;
        "data-col": number;
        "data-selected": boolean;
        "data-cursor": boolean;
        "data-editing": boolean;
    };
}

export function useHeadlessTable<T>({
    data: initialData,
    columns,
    onChange,
    // getRowId,
    options = {
        loop: false,
        editOnType: true,
        moveOnEnter: "down",
    },
}: TableOptions<T>): HeadlessTableReturn<T> {
    // History is the source of truth for data
    const {
        state: data,
        set: setDataHistory,
        undo,
        redo,
        // history: past,
        // future
    } = useHistory({
        initialState: initialData,
    });

    const numRows = data.length;
    const numCols = columns.length;

    // 2D Selection Logic Hook
    const {
        cursor,
        selection,
        moveCursor,
        setCursor,
        setCursorAndSelection,
        setSelection,
        selectAll,
        getNormalizedRange
    } = useGridSelection({
        rows: numRows,
        cols: numCols,
        loop: options.loop
    });

    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState<any>("");

    const { copy } = useClipboard();
    const containerRef = useRef<HTMLElement | null>(null);

    // Helper to Restore Focus
    const focusGrid = useCallback(() => {
        // We need to wait for render cleanup or just focus immediately?
        // Usually immediate focus works if element exists.
        if (containerRef.current) {
            containerRef.current.focus();
        }
    }, []);

    // Editing Logic
    const startEditing = useCallback((row?: number, col?: number, initialValue?: any) => {
        // If row/col specified, move there first
        const r = row ?? cursor.row;
        const c = col ?? cursor.col;

        const item = data[r];
        const colKey = columns[c]; // Assuming columns are keys of T
        // @ts-ignore
        const val = initialValue !== undefined ? initialValue : (item ? item[colKey] : "");

        setIsEditing(true);
        setEditValue(val);
    }, [cursor, data, columns]);

    const commitEditing = useCallback((newValue: any, commitOptions: { refocus?: boolean } = { refocus: true }) => {
        if (!isEditing) return;

        // Update Data
        const newData = [...data];
        // Shallow copy row
        // @ts-ignore
        newData[cursor.row] = { ...newData[cursor.row], [columns[cursor.col]]: newValue };

        setDataHistory(newData); // Push to history
        onChange?.(newData);

        setIsEditing(false);

        // Move after enter
        if (options.moveOnEnter === "down") moveCursor(1, 0);
        if (options.moveOnEnter === "right") moveCursor(0, 1);

        if (commitOptions.refocus) {
            requestAnimationFrame(() => focusGrid());
        }

    }, [data, cursor, columns, isEditing, options.moveOnEnter, moveCursor, setDataHistory, onChange, focusGrid]);

    const cancelEditing = useCallback((options: { refocus?: boolean } = { refocus: true }) => {
        setIsEditing(false);
        if (options.refocus) {
            requestAnimationFrame(() => focusGrid());
        }
    }, [focusGrid]);



    // Command System Implementation (VS Code Style)
    // 1. Keybinding Definitions (JSON-serializable)
    const defaultKeybindings = useMemo(() => [
        // Navigation
        { key: "ArrowUp", command: "nav.move", args: { dr: -1, dc: 0 }, when: "!isEditing" },
        { key: "ArrowDown", command: "nav.move", args: { dr: 1, dc: 0 }, when: "!isEditing" },
        { key: "ArrowLeft", command: "nav.move", args: { dr: 0, dc: -1 }, when: "!isEditing" },
        { key: "ArrowRight", command: "nav.move", args: { dr: 0, dc: 1 }, when: "!isEditing" },

        { key: "Shift+ArrowUp", command: "nav.move", args: { dr: -1, dc: 0, select: true }, when: "!isEditing" },
        { key: "Shift+ArrowDown", command: "nav.move", args: { dr: 1, dc: 0, select: true }, when: "!isEditing" },
        { key: "Shift+ArrowLeft", command: "nav.move", args: { dr: 0, dc: -1, select: true }, when: "!isEditing" },
        { key: "Shift+ArrowRight", command: "nav.move", args: { dr: 0, dc: 1, select: true }, when: "!isEditing" },

        // Jump
        { key: "cmd+ArrowUp", command: "nav.move", args: { dr: -numRows, dc: 0 }, when: "!isEditing" },
        { key: "cmd+ArrowDown", command: "nav.move", args: { dr: numRows, dc: 0 }, when: "!isEditing" },
        { key: "cmd+ArrowLeft", command: "nav.move", args: { dr: 0, dc: -numCols }, when: "!isEditing" },
        { key: "cmd+ArrowRight", command: "nav.move", args: { dr: 0, dc: numCols }, when: "!isEditing" },

        { key: "cmd+Shift+ArrowUp", command: "nav.move", args: { dr: -numRows, dc: 0, select: true }, when: "!isEditing" },
        { key: "cmd+Shift+ArrowDown", command: "nav.move", args: { dr: numRows, dc: 0, select: true }, when: "!isEditing" },
        { key: "cmd+Shift+ArrowLeft", command: "nav.move", args: { dr: 0, dc: -numCols, select: true }, when: "!isEditing" },
        { key: "cmd+Shift+ArrowRight", command: "nav.move", args: { dr: 0, dc: numCols, select: true }, when: "!isEditing" },

        // Tab Navigation
        { key: "Tab", command: "nav.move", args: { dr: 0, dc: 1 }, when: "!isEditing" },
        { key: "Shift+Tab", command: "nav.move", args: { dr: 0, dc: -1 }, when: "!isEditing" },

        // Actions
        { key: "Enter", command: "action.edit", when: "!isEditing" },
        { key: "F2", command: "action.edit", when: "!isEditing" },

        { key: "Backspace", command: "action.delete", when: "!isEditing" },
        { key: "Delete", command: "action.delete", when: "!isEditing" },

        { key: "cmd+a", command: "action.selectAll", when: "!isEditing" },
        { key: "cmd+z", command: "action.undo", when: "!isEditing" },
        { key: "cmd+shift+z", command: "action.redo", when: "!isEditing" },
        { key: "cmd+c", command: "action.copy", when: "!isEditing" },

        // Cancel works in editing mode too
        { key: "Escape", command: "action.cancel", when: "isEditing" },
        // Also cancel selection?
        { key: "Escape", command: "action.cancel", when: "hasSelection" },
    ], [numRows, numCols]); // Recreate if dimensions change (for jump) - technically jump doesn't need re-creation if we handle logic inside, but args are static here.

    // 2. Command Registry (Logic)
    const commandRegistry = {
        "nav.move": ({ dr, dc, select }: any) => moveCursor(dr, dc, select),
        "action.edit": () => startEditing(),
        "action.delete": () => handleDelete(),
        "action.selectAll": () => selectAll(),
        "action.undo": () => undo(),
        "action.redo": () => redo(),
        "action.copy": () => handleCopy(),
        "action.cancel": () => {
            if (isEditing) cancelEditing();
            else if (selection) setSelection(null);
        },
        "type": ({ key }: any) => {
            if (options.editOnType && !isEditing) {
                startEditing(undefined, undefined, key);
            }
        }
    };

    // 3. Context (State)
    const context = {
        isEditing,
        // isFocused, // Removed
        hasSelection: !!selection
        // Add more context as needed: "isFirstRow", "isLastCol" etc.
    };

    const { onKeyDown } = useCommandSystem(defaultKeybindings, commandRegistry, context, {
        enabled: true // Scope
    });

    // Helper for delete (extracted from old handleKeyDown)
    const handleDelete = () => {
        const newData = [...data];
        const { startRow, endRow, startCol, endCol } = getNormalizedRange();

        for (let r = startRow; r <= endRow; r++) {
            // @ts-ignore
            const rowItem = newData[r] ? { ...newData[r] } : {};
            for (let c = startCol; c <= endCol; c++) {
                const colKey = columns[c];
                // @ts-ignore
                rowItem[colKey] = "";
            }
            // @ts-ignore
            newData[r] = rowItem;
        }
        setDataHistory(newData);
        onChange?.(newData);
    };

    // (removed stale handleKeyDown)

    const handleCopy = async () => {
        // Build TSV
        const { startRow, endRow, startCol, endCol } = getNormalizedRange();
        let tsv = "";
        for (let r = startRow; r <= endRow; r++) {
            const rowVals = [];
            for (let c = startCol; c <= endCol; c++) {
                // @ts-ignore
                rowVals.push(data[r][columns[c]]);
            }
            tsv += rowVals.join("\t") + "\n";
        }
        await copy(tsv);
        // Maybe show toast?
    };

    // Click Outside to Commit
    useClickOutside(containerRef, () => {
        if (isEditing) {
            // Do not refocus if clicked outside
            commitEditing(editValue, { refocus: false });
        }
    });

    return {
        state: {
            cursor,
            selection,
            editing: {
                active: isEditing,
                position: isEditing ? cursor : null,
                value: editValue,
            },
            data,
        },
        actions: {
            moveCursor,
            setCursor,
            startEditing,
            commitEditing,
            cancelEditing,
            updateData: setDataHistory,
            undo,
            redo,
            selectAll,
        },
        gridProps: {
            // @ts-ignore
            ref: containerRef,
            role: "grid",
            tabIndex: 0, // make focusable
            onKeyDown,
            onMouseDown: () => {
                // Ensure focus if standard click behavior doesn't catch it for some reason
                // though usually clicking a tabIndex=0 element focuses it.
            },
            // @ts-ignore
            onPaste: async (e: React.ClipboardEvent) => {
                const text = e.clipboardData.getData('text');
                if (text) {
                    // Parse TSV
                    const rows = text.split(/\r\n|\n|\r/).filter(r => r); // filter empty?
                    if (rows.length === 0) return;

                    const newData = [...data];
                    const startR = cursor.row;
                    const startC = cursor.col;

                    rows.forEach((rowStr, rIdx) => {
                        const targetRow = startR + rIdx;
                        if (targetRow >= numRows) return;

                        const cols = rowStr.split('\t');
                        cols.forEach((val, cIdx) => {
                            const targetCol = startC + cIdx;
                            if (targetCol >= numCols) return;

                            const colKey = columns[targetCol];
                            // @ts-ignore
                            newData[targetRow] = { ...newData[targetRow], [colKey]: val };
                        });
                    });

                    setDataHistory(newData);
                    onChange?.(newData);
                }
            }
        },
        getCellProps: (row, col) => ({
            onClick: (e) => {
                if (e.shiftKey) {
                    // range select
                    // anchor is current selection start or cursor
                    const anchor = selection ? selection.start : cursor;
                    setCursorAndSelection(row, col, { start: anchor, end: { row, col } });
                } else {
                    setCursor(row, col);
                }
            },
            onDoubleClick: () => startEditing(row, col),
            "data-row": row,
            "data-col": col,
            "data-selected": selection ? (
                row >= Math.min(selection.start.row, selection.end.row) &&
                row <= Math.max(selection.start.row, selection.end.row) &&
                col >= Math.min(selection.start.col, selection.end.col) &&
                col <= Math.max(selection.start.col, selection.end.col)
            ) : (row === cursor.row && col === cursor.col),
            "data-cursor": row === cursor.row && col === cursor.col,
            "data-editing": isEditing && row === cursor.row && col === cursor.col,
        })
    };
}
