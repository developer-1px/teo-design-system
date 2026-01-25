import { useCallback, useMemo, useId, useState } from "react";
// import { useHotKeys } from "./useHotKeys";
import { useCommandSystem } from "../interaction/useCommandSystem";
import { useClipboard } from "../search/useClipboard";
import { useClickOutside } from "../primitives/useClickOutside";
import { useGridSelection, type CellPosition, type SelectionRange } from "./useGridSelection";
import { parseTableData, applyTableData, getPastedSelection } from "../lib/tableDataUtils";
import { useTableHistory } from "./useTableHistory";
import { useGlobalClipboard } from "../state/useGlobalClipboard";
import { useEditSession } from "../interaction/useEditSession";
import { useFocusRef } from "../interaction/useFocusRef";
import { TableCommand } from "../interaction/commands";

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
    onFind?: () => void;
}

export interface HeadlessTableReturn<T> {
    state: {
        cursor: CellPosition;
        selection: SelectionRange | null;
        copiedRange: SelectionRange | null;
        editing: {
            active: boolean;
            position: CellPosition | null;
            value: any;
        };
        data: T[];
        getNormalizedRange: () => { startRow: number; endRow: number; startCol: number; endCol: number };
        search: {
            query: string;
            matches: CellPosition[];
            activeIndex: number;
            isSearching: boolean;
        };
    };
    actions: {
        moveCursor: (rowDelta: number, colDelta: number, expandSelection?: boolean) => void;
        setCursor: (row: number, col: number) => void;
        startEditing: (row?: number, col?: number, initialValue?: any) => void;
        // setEditValue needed for input binding? yes
        setEditValue: (val: any) => void;
        commitEditing: (commitOptions?: { refocus?: boolean }) => void;
        cancelEditing: (options?: { refocus?: boolean }) => void;
        updateData: (newData: T[]) => void;
        undo: () => void;
        redo: () => void;
        selectAll: () => void;
        selectRow: (row: number, expandSelection?: boolean) => void;
        selectColumn: (col: number, expandSelection?: boolean) => void;
        insertRow: (atIndex?: number) => void;
        deleteRow: (atIndex?: number) => void;
        insertColumn: (atIndex?: number, key?: string) => void;
        deleteColumn: (atIndex?: number) => void;
        setSearchQuery: (query: string) => void;
        findNext: () => void;
        findPrev: () => void;
        closeSearch: () => void;
        openSearch: () => void;
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
        "data-copied": boolean;
        "data-cursor": boolean;
        "data-editing": boolean;
        "data-search-match": boolean;
        "data-search-active": boolean;
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
    onFind,
}: TableOptions<T>): HeadlessTableReturn<T> {
    // Unified History State (Data + Selection)
    const {
        state: historyState,
        set: setHistory,
        replace: replaceHistory,
        undo,
        redo,
    } = useTableHistory(initialData);

    const { data, cursor, selection } = historyState;
    const numRows = data.length;
    const numCols = columns.length;

    // 2D Selection Logic Hook (Controlled)
    const {
        moveCursor,
        setCursor,
        setCursorAndSelection,
        setSelection,
        selectAll,
        selectRow,
        selectColumn,
        getNormalizedRange
    } = useGridSelection({
        rows: numRows,
        cols: numCols,
        loop: options.loop,
        value: { cursor, selection },
        onChange: (newCursor, newSelection) => {
            replaceHistory(prev => ({
                ...prev,
                cursor: newCursor,
                selection: newSelection
            }));
        }
    });

    // Search State (Transient)
    const [searchQuery, setSearchQuery] = useState("");
    const [matches, setMatches] = useState<CellPosition[]>([]);
    const [searchActiveIndex, setSearchActiveIndex] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);

    // Focus Management
    const { ref: containerRef, focusAsync: focusGrid } = useFocusRef<HTMLElement>();

    // Commit Logic (extracted to keep useEditSession clean)
    const handleCommit = useCallback((value: any, meta: CellPosition) => {
        // Update Data
        setHistory(prev => {
            const newData = [...prev.data];
            // @ts-ignore
            newData[meta.row] = { ...newData[meta.row], [columns[meta.col]]: value };
            return {
                ...prev,
                data: newData
            };
        });

        // onChange callback (side effect)
        // We can't easily get the 'newData' here to pass to onChange without repeating logic or using effect.
        // It's acceptable to defer onChange call until render? No, onChange is for USER notification.
        // Let's rely on effect or just let it be. Currently onChange passes `newData`.

        // Move after enter
        if (options.moveOnEnter === "down") moveCursor(1, 0);
        if (options.moveOnEnter === "right") moveCursor(0, 1);
    }, [columns, setHistory, options.moveOnEnter, moveCursor]); // Removed data dependency

    // Editing Session
    const {
        isEditing,
        value: editValue,
        change: setEditValue,
        start,
        commit,
        cancel
    } = useEditSession<any, CellPosition>({
        onCommit: handleCommit
    });

    // Global Clipboard State
    const tableId = useId();
    const { copiedRange, sourceTableId, setCopiedRange } = useGlobalClipboard();
    const { copy } = useClipboard();

    // Editing Wrappers
    const startEditing = useCallback((row?: number, col?: number, initialValue?: any) => {
        const r = row ?? cursor.row;
        const c = col ?? cursor.col;

        const item = data[r];
        const colKey = columns[c];
        // @ts-ignore
        const val = initialValue !== undefined ? initialValue : (item ? item[colKey] : "");

        start(val, { row: r, col: c });
    }, [cursor, data, columns, start]);

    const commitEditing = useCallback((commitOptions: { refocus?: boolean } = { refocus: true }) => {
        commit();
        if (commitOptions.refocus) {
            focusGrid();
        }
    }, [commit, focusGrid]);

    const cancelEditing = useCallback((opts: { refocus?: boolean } = { refocus: true }) => {
        cancel();
        if (opts.refocus) {
            focusGrid();
        }
    }, [cancel, focusGrid]);

    // Structural Mutations
    const insertRow = useCallback((atIndex?: number) => {
        const idx = atIndex ?? cursor.row;
        setHistory(prev => {
            const newData = [...prev.data];
            const blank = columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {} as T);
            newData.splice(idx, 0, blank);
            return {
                ...prev,
                data: newData,
                cursor: prev.cursor.row >= idx ? { ...prev.cursor, row: prev.cursor.row + 1 } : prev.cursor,
                selection: prev.selection ? (
                    prev.selection.start.row >= idx || prev.selection.end.row >= idx
                        ? {
                            start: { ...prev.selection.start, row: prev.selection.start.row >= idx ? prev.selection.start.row + 1 : prev.selection.start.row },
                            end: { ...prev.selection.end, row: prev.selection.end.row >= idx ? prev.selection.end.row + 1 : prev.selection.end.row }
                        }
                        : prev.selection
                ) : null
            };
        });
        // Note: onChange(newData) is hard because setHistory is functional.
        // We'll rely on useTableHistory's onChange if we had one, 
        // but let's just compute it once here.
        const newData = [...data];
        const blank = columns.reduce((acc, col) => ({ ...acc, [col]: "" }), {} as T);
        newData.splice(idx, 0, blank);
        onChange?.(newData);
    }, [cursor.row, setHistory, columns, onChange, data]);

    const deleteRow = useCallback((atIndex?: number) => {
        const idx = atIndex ?? cursor.row;
        if (data.length <= 1) return;
        setHistory(prev => {
            const newData = [...prev.data];
            newData.splice(idx, 1);
            const newCursorRow = Math.min(prev.cursor.row, newData.length - 1);
            return {
                ...prev,
                data: newData,
                cursor: { ...prev.cursor, row: newCursorRow },
                selection: null
            };
        });
        const newData = [...data];
        newData.splice(idx, 1);
        onChange?.(newData);
    }, [cursor.row, data, setHistory, onChange]);

    const insertColumn = useCallback((atIndex?: number, key?: string) => {
        const idx = atIndex ?? cursor.col;
        const newKey = key || `col_${Date.now()}`;
        setHistory(prev => {
            const newData = prev.data.map(item => ({ ...item, [newKey]: "" }));
            return {
                ...prev,
                data: newData,
                cursor: prev.cursor.col >= idx ? { ...prev.cursor, col: prev.cursor.col + 1 } : prev.cursor
            };
        });
        const newData = data.map(item => ({ ...item, [newKey]: "" }));
        onChange?.(newData);
    }, [cursor.col, data, setHistory, onChange]);

    const deleteColumn = useCallback((atIndex?: number) => {
        const idx = atIndex ?? cursor.col;
        const keyToDelete = columns[idx];
        if (!keyToDelete) return;
        setHistory(prev => {
            const newData = prev.data.map(item => {
                const newItem = { ...item };
                delete newItem[keyToDelete as keyof T];
                return newItem;
            });
            return {
                ...prev,
                data: newData,
                cursor: { ...prev.cursor, col: Math.max(0, idx - 1) }
            };
        });
        const newData = data.map(item => {
            const newItem = { ...item };
            delete newItem[keyToDelete as keyof T];
            return newItem;
        });
        onChange?.(newData);
    }, [cursor.col, data, columns, setHistory, onChange]);

    // Search Actions
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        if (!query) {
            setMatches([]);
            setSearchActiveIndex(-1);
            return;
        }

        const newMatches: CellPosition[] = [];
        data.forEach((row, rIdx) => {
            columns.forEach((col, cIdx) => {
                // @ts-ignore
                const val = row[col];
                if (String(val).toLowerCase().includes(query.toLowerCase())) {
                    newMatches.push({ row: rIdx, col: cIdx });
                }
            });
        });

        setMatches(newMatches);

        // Find if current cursor is already a match
        const existingIdx = newMatches.findIndex(m => m.row === cursor.row && m.col === cursor.col);
        if (existingIdx !== -1) {
            setSearchActiveIndex(existingIdx);
        } else if (newMatches.length > 0) {
            setSearchActiveIndex(0);
            setCursor(newMatches[0].row, newMatches[0].col);
        } else {
            setSearchActiveIndex(-1);
        }
    }, [data, columns, cursor.row, cursor.col, setCursor]);

    const findNext = useCallback(() => {
        if (matches.length === 0) return;
        const nextIdx = (searchActiveIndex + 1) % matches.length;
        setSearchActiveIndex(nextIdx);
        setCursor(matches[nextIdx].row, matches[nextIdx].col);
    }, [matches, searchActiveIndex, setCursor]);

    const findPrev = useCallback(() => {
        if (matches.length === 0) return;
        const prevIdx = (searchActiveIndex - 1 + matches.length) % matches.length;
        setSearchActiveIndex(prevIdx);
        setCursor(matches[prevIdx].row, matches[prevIdx].col);
    }, [matches, searchActiveIndex, setCursor]);

    const closeSearch = useCallback(() => {
        setIsSearching(false);
        setSearchQuery("");
        setMatches([]);
        setSearchActiveIndex(-1);
        focusGrid();
    }, [focusGrid]);

    const openSearch = useCallback(() => {
        setIsSearching(true);
    }, []);

    // Command System Implementation
    const defaultKeybindings = useMemo(() => [
        // Navigation
        { key: "ArrowUp", command: TableCommand.NavMove, args: { dr: -1, dc: 0 }, when: "!isEditing" },
        { key: "ArrowDown", command: TableCommand.NavMove, args: { dr: 1, dc: 0 }, when: "!isEditing" },
        { key: "ArrowLeft", command: TableCommand.NavMove, args: { dr: 0, dc: -1 }, when: "!isEditing" },
        { key: "ArrowRight", command: TableCommand.NavMove, args: { dr: 0, dc: 1 }, when: "!isEditing" },

        { key: "Shift+ArrowUp", command: TableCommand.NavMove, args: { dr: -1, dc: 0, select: true }, when: "!isEditing" },
        { key: "Shift+ArrowDown", command: TableCommand.NavMove, args: { dr: 1, dc: 0, select: true }, when: "!isEditing" },
        { key: "Shift+ArrowLeft", command: TableCommand.NavMove, args: { dr: 0, dc: -1, select: true }, when: "!isEditing" },
        { key: "Shift+ArrowRight", command: TableCommand.NavMove, args: { dr: 0, dc: 1, select: true }, when: "!isEditing" },

        // Jump
        { key: "cmd+ArrowUp", command: TableCommand.NavMove, args: { dr: -numRows, dc: 0 }, when: "!isEditing" },
        { key: "cmd+ArrowDown", command: TableCommand.NavMove, args: { dr: numRows, dc: 0 }, when: "!isEditing" },
        { key: "cmd+ArrowLeft", command: TableCommand.NavMove, args: { dr: 0, dc: -numCols }, when: "!isEditing" },
        { key: "cmd+ArrowRight", command: TableCommand.NavMove, args: { dr: 0, dc: numCols }, when: "!isEditing" },

        { key: "cmd+Shift+ArrowUp", command: TableCommand.NavMove, args: { dr: -numRows, dc: 0, select: true }, when: "!isEditing" },
        { key: "cmd+Shift+ArrowDown", command: TableCommand.NavMove, args: { dr: numRows, dc: 0, select: true }, when: "!isEditing" },
        { key: "cmd+Shift+ArrowLeft", command: TableCommand.NavMove, args: { dr: 0, dc: -numCols, select: true }, when: "!isEditing" },
        { key: "cmd+Shift+ArrowRight", command: TableCommand.NavMove, args: { dr: 0, dc: numCols, select: true }, when: "!isEditing" },

        // Tab Navigation
        { key: "Tab", command: TableCommand.NavMove, args: { dr: 0, dc: 1 }, when: "!isEditing" },
        { key: "Shift+Tab", command: TableCommand.NavMove, args: { dr: 0, dc: -1 }, when: "!isEditing" },

        // Actions
        { key: "Enter", command: TableCommand.ActionEdit, when: "!isEditing" },
        { key: "F2", command: TableCommand.ActionEdit, when: "!isEditing" },

        { key: "Backspace", command: TableCommand.ActionDelete, when: "!isEditing" },
        { key: "Delete", command: TableCommand.ActionDelete, when: "!isEditing" },

        { key: "cmd+a", command: TableCommand.ActionSelectAll, when: "!isEditing" },
        { key: "cmd+z", command: TableCommand.ActionUndo, when: "!isEditing" },
        { key: "cmd+shift+z", command: TableCommand.ActionRedo, when: "!isEditing" },
        { key: "cmd+c", command: TableCommand.ActionCopy, when: "!isEditing" },

        // Cancel works in editing mode too
        { key: "Escape", command: TableCommand.ActionCancel, when: "isEditing" },
        // Also cancel selection?
        { key: "Escape", command: TableCommand.ActionCancel, when: "hasSelection" },

        // Structural Mutations
        { key: "cmd+shift+=", command: TableCommand.ActionInsertRow, when: "!isEditing" },
        { key: "cmd+shift+-", command: TableCommand.ActionDeleteRow, when: "!isEditing" },

        // Search
        { key: "cmd+f", command: TableCommand.ActionFind, when: "!isEditing" },
        { key: "cmd+g", command: TableCommand.NavFindNext, when: "hasSearch" },
        { key: "cmd+shift+g", command: TableCommand.NavFindPrev, when: "hasSearch" },
        { key: "Enter", command: TableCommand.NavFindNext, when: "hasSearch" },
        { key: "Shift+Enter", command: TableCommand.NavFindPrev, when: "hasSearch" },
    ], [numRows, numCols, isSearching]);

    const handleCopy = async () => {
        // Build TSV
        const { startRow, endRow, startCol, endCol } = getNormalizedRange();
        setCopiedRange({ start: { row: startRow, col: startCol }, end: { row: endRow, col: endCol } }, tableId);
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
    };

    // Helper for delete
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
            // @ts-ignore
            newData[r] = rowItem;
        }

        setHistory(prev => ({ ...prev, data: newData }));
        onChange?.(newData);
    };

    // 2. Command Registry
    const commandRegistry = {
        [TableCommand.NavMove]: ({ dr, dc, select }: any) => moveCursor(dr, dc, select),
        [TableCommand.ActionEdit]: () => startEditing(),
        [TableCommand.ActionDelete]: () => handleDelete(),
        [TableCommand.ActionSelectAll]: () => selectAll(),
        [TableCommand.ActionUndo]: () => undo(),
        [TableCommand.ActionRedo]: () => redo(),
        [TableCommand.ActionCopy]: () => handleCopy(),
        [TableCommand.ActionSelectRow]: ({ row, select }: any) => selectRow(row, select),
        [TableCommand.ActionSelectColumn]: ({ col, select }: any) => selectColumn(col, select),
        [TableCommand.ActionInsertRow]: () => insertRow(),
        [TableCommand.ActionDeleteRow]: () => deleteRow(),
        [TableCommand.ActionInsertColumn]: () => insertColumn(),
        [TableCommand.ActionDeleteColumn]: () => deleteColumn(),
        [TableCommand.ActionFind]: () => {
            setIsSearching(true);
            onFind?.();
        },
        [TableCommand.NavFindNext]: () => findNext(),
        [TableCommand.NavFindPrev]: () => findPrev(),
        [TableCommand.ActionCancel]: () => {
            if (isEditing) cancelEditing();
            else if (isSearching) closeSearch();
            else if (copiedRange) setCopiedRange(null, null);
            else if (selection) setSelection(null);
        },
        [TableCommand.Type]: ({ key }: any) => {
            if (options.editOnType && !isEditing) {
                startEditing(undefined, undefined, key);
            }
        }
    };

    // 3. Context (State)
    const context = {
        isEditing,
        hasSelection: !!selection,
        hasSearch: isSearching
    };

    const { onKeyDown } = useCommandSystem(defaultKeybindings, commandRegistry, context, {
        enabled: true
    });


    // Click Outside to Commit
    useClickOutside(containerRef, () => {
        if (isEditing) {
            // Do not refocus if clicked outside
            commitEditing({ refocus: false });
        }
    });

    return {
        state: {
            cursor,
            selection,
            copiedRange: sourceTableId === tableId ? copiedRange : null,
            editing: {
                active: isEditing,
                position: isEditing ? cursor : null,
                value: editValue,
            },
            data,
            getNormalizedRange,
            search: {
                query: searchQuery,
                matches,
                activeIndex: searchActiveIndex,
                isSearching
            }
        },
        actions: {
            moveCursor,
            setCursor,
            startEditing,
            setEditValue,
            commitEditing,
            cancelEditing,
            updateData: (newData: T[]) => setHistory(prev => ({ ...prev, data: newData })),
            undo,
            redo,
            selectAll,
            selectRow,
            selectColumn,
            insertRow,
            deleteRow,
            insertColumn,
            deleteColumn,
            setSearchQuery: handleSearch,
            findNext,
            findPrev,
            closeSearch,
            openSearch
        },
        gridProps: {
            // @ts-ignore
            ref: containerRef,
            role: "grid",
            tabIndex: 0, // make focusable
            onKeyDown,
            onMouseDown: () => { },
            // @ts-ignore
            onPaste: async (e: React.ClipboardEvent) => {
                const text = e.clipboardData.getData('text');
                if (text) {
                    const rows = parseTableData(text);
                    if (rows.length === 0) return;

                    const newData = applyTableData(
                        data,
                        rows,
                        cursor.row,
                        cursor.col,
                        columns
                    );
                    const newSelection = getPastedSelection(
                        cursor.row,
                        cursor.col,
                        rows.length,
                        rows[0]?.length || 0,
                        data.length, // Note: data.length might change if paste extends table? No, applyTableData doesn't seem to extend.
                        columns.length
                    );

                    setHistory(prev => ({
                        ...prev,
                        data: newData,
                        selection: newSelection,
                        // Update cursor to start of paste (already current cursor) or end? 
                        // Usually stick to anchor.
                        cursor: prev.cursor
                    }));

                    onChange?.(newData);
                    setCopiedRange(null, null);
                }
            }
        },
        getCellProps: (row, col) => ({
            onClick: (e) => {
                if (e.shiftKey) {
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
            "data-copied": (copiedRange && sourceTableId === tableId) ? (
                row >= Math.min(copiedRange.start.row, copiedRange.end.row) &&
                row <= Math.max(copiedRange.start.row, copiedRange.end.row) &&
                col >= Math.min(copiedRange.start.col, copiedRange.end.col) &&
                col <= Math.max(copiedRange.start.col, copiedRange.end.col)
            ) : false,
            "data-cursor": row === cursor.row && col === cursor.col,
            "data-editing": isEditing && row === cursor.row && col === cursor.col,
            "data-search-match": matches.some(m => m.row === row && m.col === col),
            "data-search-active": searchActiveIndex !== -1 && matches[searchActiveIndex].row === row && matches[searchActiveIndex].col === col,
        })
    };
}
