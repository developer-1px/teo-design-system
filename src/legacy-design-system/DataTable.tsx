
import React, { useMemo, useEffect } from "react";
// import { Frame } from "./Frame/Frame";
import { useHeadlessTable, type TableOptions } from "./hooks/data/useHeadlessTable";
// import { useHotKeys } from "./hooks/useHotKeys";

// Types
interface DataTableColumn<T> {
    key: string; // key in data T
    title: string;
    width?: string;
    render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> extends Omit<TableOptions<T>, 'columns'> {
    columns: DataTableColumn<T>[];
    height?: number | string;
    className?: string;
}

import { useEditorInput } from "./hooks/interaction/useEditorInput";
import { useBrowserShortcut } from "./hooks/interaction/useBrowserShortcut";
import { Layer } from "./Overlay";

// Editor Component
const CellEditor = ({
    value,
    onCommit,
    onCancel,
    autoFocus
}: {
    value: any;
    onCommit: (val: any) => void;
    onCancel: () => void;
    autoFocus?: boolean;
}) => {
    const { inputProps } = useEditorInput<HTMLInputElement>({
        onCommit,
        onCancel,
        autoFocus
    });

    return (
        <input
            {...inputProps}
            defaultValue={value}
            style={{
                width: "100%",
                height: "100%",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "inherit",
                font: "inherit",
                padding: "0 8px", // match cell padding
            }}
        />
    );
};

export function DataTable<T extends Record<string, any>>({
    data,
    columns: columnDefs,
    onChange,
    height = 500,
    options
}: DataTableProps<T>) {

    const colKeys = useMemo(() => columnDefs.map(c => c.key), [columnDefs]);

    const table = useHeadlessTable<T>({
        data,
        columns: colKeys,
        onChange,
        options
    });

    const {
        state: { cursor, data: tableData, getNormalizedRange },
        gridProps,
        getCellProps,
        actions
    } = table;

    const { startRow, endRow, startCol, endCol } = getNormalizedRange();

    // Grid Template
    const gridTemplateColumns = useMemo(() => {
        // 50px for row number + columns
        return `50px ` + columnDefs.map(c => c.width || "1fr").join(" ");
    }, [columnDefs]);

    // Manual Scroll into View
    // Since we prevent default scroll on arrow keys, we must manually scroll the container
    // to keep the cursor in view.
    useEffect(() => {
        if (!gridProps.ref.current) return;
        const container = gridProps.ref.current as HTMLElement;
        const cursorCell = container.querySelector('[data-cursor="true"]') as HTMLElement;

        if (cursorCell) {
            // Get header height by querying the sticky header
            const header = container.querySelector('[style*="position: sticky"]') as HTMLElement;
            const headerHeight = header ? header.offsetHeight : 40; // fallback to 40px
            const rowNumberWidth = 50; // fixed width

            const containerRect = container.getBoundingClientRect();
            const cellRect = cursorCell.getBoundingClientRect();

            // Vertical scroll - account for sticky header
            const visibleTop = containerRect.top + headerHeight;
            const visibleBottom = containerRect.bottom;

            if (cellRect.top < visibleTop) {
                // Cell is above visible area - scroll up
                container.scrollTop -= (visibleTop - cellRect.top);
            } else if (cellRect.bottom > visibleBottom) {
                // Cell is below visible area - scroll down
                container.scrollTop += (cellRect.bottom - visibleBottom);
            }

            // Horizontal scroll - account for sticky row number column
            const visibleLeft = containerRect.left + rowNumberWidth;
            const visibleRight = containerRect.right;

            if (cellRect.left < visibleLeft) {
                // Cell is left of visible area - scroll left
                container.scrollLeft -= (visibleLeft - cellRect.left);
            } else if (cellRect.right > visibleRight) {
                // Cell is right of visible area - scroll right
                container.scrollLeft += (cellRect.right - visibleRight);
            }
        }
    }, [cursor, gridProps.ref, table.state.search.isSearching]); // Re-run when cursor moves or search toggles

    // Local Search State
    const [localQuery, setLocalQuery] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [activeSuggestion, setActiveSuggestion] = React.useState(-1);

    // Sync local query when search opens/closes
    useEffect(() => {
        if (table.state.search.isSearching) {
            setLocalQuery(table.state.search.query);
        } else {
            setLocalQuery("");
            setSuggestions([]);
        }
    }, [table.state.search.isSearching, table.state.search.query]);

    // Autocomplete Logic
    const handleSearchChange = (value: string) => {
        setLocalQuery(value);
        setActiveSuggestion(-1);

        if (!value.trim()) {
            setSuggestions([]);
            return;
        }

        // Get unique values from data that match
        const matches = new Set<string>();
        for (const row of tableData) {
            for (const col of columnDefs) {
                const val = String(row[col.key]);
                if (val.toLowerCase().includes(value.toLowerCase())) {
                    matches.add(val);
                    if (matches.size >= 5) break; // Limit to 5 suggestions
                }
            }
            if (matches.size >= 5) break;
        }
        setSuggestions(Array.from(matches));
    };

    const commitSearch = (query: string) => {
        table.actions.setSearchQuery(query);
        setSuggestions([]);
        // gridProps.ref.current?.focus(); // Keep focus in input? No, typically Keep focus in input for next/prev.
    };

    // Shortcut Overrides (Cmd+F, Cmd+G)
    useBrowserShortcut({
        "cmd+f": () => {
            actions.openSearch();
            gridProps.ref.current?.focus();
        },
        "cmd+g": () => actions.findNext(),
        "cmd+shift+g": () => actions.findPrev()
    });

    // Substring Highlighting Helper
    const HighlightedText = ({ text, query }: { text: string, query: string }) => {
        if (!query) return <>{text}</>;
        const parts = text.split(new RegExp(`(${query})`, "gi"));
        return (
            <>
                {parts.map((part, i) =>
                    part.toLowerCase() === query.toLowerCase()
                        ? <span key={i} style={{ background: "var(--tone-warning-bg)", color: "var(--text-primary)" }}>{part}</span>
                        : part
                )}
            </>
        );
    };

    return (
        <div
            {...gridProps}
            className="mdk-data-table"
            style={{
                outline: "none",
                height: typeof height === 'number' ? `${height}px` : height,
                overflow: "auto",
                position: "relative",
                background: "var(--surface-base)",
                color: "var(--text-primary)",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
                fontFamily: "var(--font-sans)",
                fontSize: "13px",
            }}
        >
            {/* Find UI */}
            {table.state.search.isSearching && (
                <div
                    className="mdk-find-ui"
                    style={{
                        padding: "8px 12px",
                        background: "var(--surface-sunken-bg)",
                        borderBottom: "1px solid var(--border-color)",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        fontSize: "12px",
                        position: "sticky",
                        top: 0,
                        zIndex: Layer.Flat
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                        <span style={{ color: "var(--text-secondary)" }}>Find:</span>
                        <div style={{ position: "relative", flex: 1 }}>
                            <input
                                autoFocus
                                value={localQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                onKeyDown={(e) => {
                                    e.stopPropagation();
                                    if (e.key === "Enter") {
                                        if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
                                            const val = suggestions[activeSuggestion];
                                            setLocalQuery(val);
                                            commitSearch(val);
                                        } else {
                                            if (e.shiftKey) table.actions.findPrev();
                                            else {
                                                // If query changed, commit it first
                                                if (localQuery !== table.state.search.query) {
                                                    commitSearch(localQuery);
                                                } else {
                                                    table.actions.findNext();
                                                }
                                            }
                                        }
                                    }
                                    if (e.key === "ArrowDown") {
                                        e.preventDefault();
                                        setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
                                    }
                                    if (e.key === "ArrowUp") {
                                        e.preventDefault();
                                        setActiveSuggestion(prev => Math.max(prev - 1, -1));
                                    }
                                    if (e.key === "Escape") {
                                        if (suggestions.length > 0) setSuggestions([]);
                                        else table.actions.closeSearch();
                                    }
                                }}
                                style={{
                                    background: "var(--surface-sunken-bg)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    color: "var(--text-primary)",
                                    outline: "none",
                                    width: "100%",
                                    fontSize: "12px"
                                }}
                                placeholder="Type to search..."
                            />
                            {/* Autocomplete Dropdown */}
                            {suggestions.length > 0 && (
                                <div style={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    width: "100%",
                                    background: "var(--surface-overlay-bg)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "4px",
                                    marginTop: "4px",
                                    boxShadow: "var(--surface-overlay-shadow)",
                                    zIndex: Layer.Raised,
                                    maxHeight: "200px",
                                    overflowY: "auto"
                                }}>
                                    {suggestions.map((s, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                setLocalQuery(s);
                                                commitSearch(s);
                                            }}
                                            style={{
                                                padding: "6px 8px",
                                                cursor: "pointer",
                                                background: i === activeSuggestion ? "var(--control-bg-hover)" : "transparent",
                                                color: "var(--text-primary)",
                                                fontSize: "12px"
                                            }}
                                            onMouseEnter={() => setActiveSuggestion(i)}
                                        >
                                            <HighlightedText text={s} query={localQuery} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div style={{ color: "var(--text-secondary)", minWidth: "60px", textAlign: "right" }}>
                        {table.state.search.matches.length > 0
                            ? `${table.state.search.activeIndex + 1} of ${table.state.search.matches.length}`
                            : table.state.search.query ? "0 of 0" : ""}
                    </div>
                    <div style={{ display: "flex", gap: "2px" }}>
                        <button onClick={() => table.actions.findPrev()} style={{ padding: "2px 6px", cursor: "pointer", background: "none", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-primary)" }}>↑</button>
                        <button onClick={() => table.actions.findNext()} style={{ padding: "2px 6px", cursor: "pointer", background: "none", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-primary)" }}>↓</button>
                    </div>
                    <button onClick={() => table.actions.closeSearch()} style={{ padding: "2px 6px", cursor: "pointer", background: "none", border: "none", color: "var(--text-secondary)", fontSize: "14px" }}>✕</button>
                </div>
            )}

            {/* Header */}
            <div
                className="mdk-table-header"
                style={{
                    display: "grid",
                    gridTemplateColumns,
                    position: "sticky",
                    top: table.state.search.isSearching ? "36px" : 0,
                    zIndex: Layer.Flat,
                    background: "var(--surface-sunken-bg)",
                    borderBottom: "1px solid var(--border-color)",
                    userSelect: "none",
                }}
            >
                {/* Row Num Header */}
                <div style={{
                    padding: "8px",
                    borderRight: "1px solid var(--border-color)",
                    background: "var(--surface-sunken-bg)",
                }} />

                {columnDefs.map((col, i) => {
                    const isColSelected = i >= startCol && i <= endCol;

                    return (
                        <div
                            key={col.key}
                            onMouseDown={(e) => {
                                if (gridProps.ref.current) {
                                    gridProps.ref.current.focus({ preventScroll: true });
                                }
                                actions.selectColumn(i, e.shiftKey);
                            }}
                            style={{
                                padding: "8px 12px",
                                borderRight: i < columnDefs.length - 1 ? "1px solid var(--border-color)" : "none",
                                fontWeight: 500,
                                color: isColSelected ? "var(--primary-bg)" : "var(--text-body)",
                                background: isColSelected ? "var(--primary-bg-subtle)" : "var(--surface-sunken-bg)",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                cursor: "pointer",
                                transition: "all 0.1s ease"
                            }}
                        >
                            {col.title}
                        </div>
                    );
                })}
            </div>

            {/* Body */}
            <div style={{ position: "relative" }}>
                {tableData.map((row, rIdx) => {
                    // Perf: In real large tables, we render only visible.
                    // For now, render all.

                    return (
                        <div
                            key={rIdx}
                            style={{
                                display: "grid",
                                gridTemplateColumns,
                                borderBottom: "1px solid var(--border-color)",
                                background: "transparent"
                            }}
                        >
                            {/* Row Number (Row Header) */}
                            <div
                                onMouseDown={(e) => {
                                    if (gridProps.ref.current) {
                                        gridProps.ref.current.focus({ preventScroll: true });
                                    }
                                    actions.selectRow(rIdx, e.shiftKey);
                                }}
                                style={{
                                    padding: "0 8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: (rIdx >= startRow && rIdx <= endRow) ? "var(--primary-bg-subtle)" : "var(--surface-sunken-bg)",
                                    borderRight: "1px solid var(--border-color)",
                                    color: (rIdx >= startRow && rIdx <= endRow) ? "var(--primary-bg)" : "var(--text-body)",
                                    fontSize: "11px",
                                    userSelect: "none",
                                    cursor: "pointer",
                                    transition: "all 0.1s ease"
                                }}
                            >
                                {rIdx + 1}
                            </div>

                            {columnDefs.map((col, cIdx) => {
                                const cellState = getCellProps(rIdx, cIdx);
                                const isCursor = cellState["data-cursor"];
                                const isSelected = cellState["data-selected"];
                                const isEditing = cellState["data-editing"];
                                const isMatch = cellState["data-search-match"];
                                const isActiveMatch = cellState["data-search-active"];

                                // @ts-ignore
                                const value = row[col.key];

                                const handleMouseDown = (e: React.MouseEvent) => {
                                    // 1. Enforce Focus on Grid Container to ensure keyboard events are captured
                                    if (gridProps.ref.current) {
                                        gridProps.ref.current.focus({ preventScroll: true });
                                    }
                                    // 2. Delegate to hook logic (selection/cursor)
                                    cellState.onClick(e);
                                };

                                return (
                                    <div
                                        key={col.key}
                                        data-cursor={isCursor || undefined}
                                        data-selected={isSelected || undefined}
                                        data-copied={cellState["data-copied"] || undefined}
                                        data-editing={isEditing || undefined}
                                        data-search-match={isMatch || undefined}
                                        data-search-active={isActiveMatch || undefined}
                                        onMouseDown={handleMouseDown}
                                        onDoubleClick={cellState.onDoubleClick}
                                        style={{
                                            position: "relative",
                                            padding: isEditing ? 0 : "8px 12px",
                                            borderRight: cIdx < columnDefs.length - 1 ? "1px solid var(--border-color)" : "none",
                                            background: isActiveMatch
                                                ? "var(--tone-warning-bg)"
                                                : isMatch
                                                    ? "var(--tone-warning-bg-low)"
                                                    : isSelected
                                                        ? "var(--surface-selected-bg)"
                                                        : "transparent",
                                            color: isSelected && !isMatch && !isActiveMatch ? "var(--surface-selected-fg)" : "inherit",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            cursor: "default",
                                            outline: isActiveMatch
                                                ? "2px solid var(--tone-warning-border)"
                                                : isCursor
                                                    ? "2px solid var(--text-primary)"
                                                    : "none",
                                            outlineOffset: "-2px",
                                            zIndex: isActiveMatch || isCursor ? 2 : 1,
                                        }}
                                    >
                                        {isEditing ? (
                                            <CellEditor
                                                value={value}
                                                autoFocus
                                                onCommit={(val) => {
                                                    actions.setEditValue(val);
                                                    actions.commitEditing();
                                                }}
                                                onCancel={() => {
                                                    actions.cancelEditing();
                                                }}
                                            />
                                        ) : (
                                            isMatch ? (
                                                <HighlightedText text={String(value)} query={table.state.search.query} />
                                            ) : (
                                                col.render ? col.render(value, row) : value
                                            )
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

            {/* Hidden Focus Target or instructions could go here */}
        </div>
    );
}
