import { useCallback, useMemo } from "react";
import { useCommandSystem } from "../interaction/useCommandSystem";
import { useGridSelection, type CellPosition, type SelectionRange } from "./useGridSelection";
import { useClipboard } from "../search/useClipboard";
import { useTableHistory } from "./useTableHistory";

export interface Appointment {
    id: string;
    title: string;
    day: number; // 0-6 (Sun-Sat) or 0-4 (Mon-Fri)
    hour: number; // 0-23
    duration: number; // in hours
}

export interface UseHeadlessCalendarReturn {
    state: {
        cursor: CellPosition;
        selection: SelectionRange | null;
        appointments: Appointment[];
        mode: "view" | "edit"; // Simplification for POC
    };
    actions: {
        moveCursor: (dr: number, dc: number, select?: boolean) => void;
        setCursor: (row: number, col: number) => void;
        setSelection: (range: SelectionRange | null) => void;
        addAppointment: () => void;
        deleteAppointment: () => void;
        undo: () => void;
        redo: () => void;
        copy: () => void;
        cut: () => void;
        paste: () => void;
    };
    gridProps: {
        onKeyDown: (e: React.KeyboardEvent) => void;
        tabIndex: number;
    };
}

export function useHeadlessCalendar(initialAppointments: Appointment[] = []) {
    // 1. History (Reuse Table History for simplicity as it stores data+cursor+selection)
    // We treat "appointments" as "data" array.
    const {
        state: historyState,
        replace: replaceHistory,
        set: setHistory,
        undo,
        redo
    } = useTableHistory<Appointment>(initialAppointments);

    const { data: appointments, cursor, selection } = historyState;

    // 2. Grid Logic (7 days x 24 hours)
    const {
        moveCursor,
        setCursor,
        setSelection,
        getNormalizedRange
    } = useGridSelection({
        rows: 24,
        cols: 7,
        loop: false,
        value: { cursor, selection },
        onChange: (c, s) => replaceHistory(prev => ({ ...prev, cursor: c, selection: s }))
    });

    const { copy, read } = useClipboard();

    // 3. Appointment Logic
    const handleAdd = useCallback(() => {
        const newAppt: Appointment = {
            id: Math.random().toString(36).substr(2, 9),
            title: "New Event",
            day: cursor.col,
            hour: cursor.row,
            duration: 1
        };
        setHistory(prev => ({
            ...prev,
            data: [...prev.data, newAppt]
        }));
    }, [cursor, setHistory]);

    const handleDelete = useCallback(() => {
        // Simple delete at cursor for POC
        setHistory(prev => ({
            ...prev,
            data: prev.data.filter(a => !(a.day === cursor.col && a.hour === cursor.row))
        }));
    }, [cursor, setHistory]);

    // 4. Clipboard Logic
    const getSelectedAppointments = useCallback(() => {
        const { startRow, endRow, startCol, endCol } = getNormalizedRange();
        return appointments.filter(a =>
            a.day >= startCol && a.day <= endCol &&
            a.hour >= startRow && a.hour <= endRow
        );
    }, [appointments, getNormalizedRange]);

    const handleCopy = useCallback(async () => {
        const selected = getSelectedAppointments();
        if (selected.length === 0) return;
        await copy(JSON.stringify(selected));
    }, [getSelectedAppointments, copy]);

    const handleCut = useCallback(async () => {
        const selected = getSelectedAppointments();
        if (selected.length === 0) return;

        await copy(JSON.stringify(selected));

        // Delete selected
        const idsToRemove = new Set(selected.map(a => a.id));
        setHistory(prev => ({
            ...prev,
            data: prev.data.filter(a => !idsToRemove.has(a.id))
        }));
    }, [getSelectedAppointments, copy, setHistory]);

    const handlePaste = useCallback(async () => {
        const text = await read();
        if (!text) return;

        try {
            const pastedAppts = JSON.parse(text) as Appointment[];
            if (!Array.isArray(pastedAppts) || pastedAppts.length === 0) return;

            // Find top-left of pasted data
            const minDay = Math.min(...pastedAppts.map(a => a.day));
            const minHour = Math.min(...pastedAppts.map(a => a.hour));

            // Calculate delta to current cursor
            const dDay = cursor.col - minDay;
            const dHour = cursor.row - minHour;

            const newAppts = pastedAppts.map(a => ({
                ...a,
                id: Math.random().toString(36).substr(2, 9), // New ID
                day: a.day + dDay,
                hour: a.hour + dHour
            }));

            setHistory(prev => ({
                ...prev,
                data: [...prev.data, ...newAppts],
                // Optional: Select the newly pasted items?
                selection: {
                    start: { row: cursor.row, col: cursor.col },
                    end: {
                        row: cursor.row + (Math.max(...pastedAppts.map(a => a.hour)) - minHour),
                        col: cursor.col + (Math.max(...pastedAppts.map(a => a.day)) - minDay)
                    }
                }
            }));
        } catch (e) {
            console.error("Failed to paste appointments", e);
        }
    }, [read, cursor, setHistory]);

    // 5. Command System
    const commandRegistry = {
        "nav.move": ({ dr, dc, select }: any) => moveCursor(dr, dc, select),
        "action.add": handleAdd,
        "action.delete": handleDelete,
        "action.undo": undo,
        "action.redo": redo,
        "action.copy": handleCopy,
        "action.cut": handleCut,
        "action.paste": handlePaste,
    };

    const keybindings = useMemo(() => [
        { key: "ArrowUp", command: "nav.move", args: { dr: -1, dc: 0 } },
        { key: "ArrowDown", command: "nav.move", args: { dr: 1, dc: 0 } },
        { key: "ArrowLeft", command: "nav.move", args: { dr: 0, dc: -1 } },
        { key: "ArrowRight", command: "nav.move", args: { dr: 0, dc: 1 } },
        { key: "Shift+ArrowUp", command: "nav.move", args: { dr: -1, dc: 0, select: true } },
        { key: "Shift+ArrowDown", command: "nav.move", args: { dr: 1, dc: 0, select: true } },
        { key: "Enter", command: "action.add" },
        { key: "Backspace", command: "action.delete" },
        { key: "cmd+z", command: "action.undo" },
        { key: "cmd+shift+z", command: "action.redo" },
        { key: "cmd+c", command: "action.copy" },
        { key: "cmd+x", command: "action.cut" },
        { key: "cmd+v", command: "action.paste" },
    ], []);

    const { onKeyDown } = useCommandSystem(keybindings, commandRegistry, {}, { enabled: true });

    return {
        state: {
            cursor,
            selection,
            appointments,
            mode: "view"
        },
        actions: {
            moveCursor,
            setCursor,
            setSelection,
            addAppointment: handleAdd,
            deleteAppointment: handleDelete,
            undo,
            redo,
            copy: handleCopy,
            cut: handleCut,
            paste: handlePaste,
        },
        gridProps: {
            onKeyDown,
            tabIndex: 0
        }
    };
}
