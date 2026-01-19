
import React, { useMemo, useRef, useEffect } from "react";
// import { Frame } from "./Frame/Frame";
import { useHeadlessTable, type TableOptions } from "./hooks/useHeadlessTable";
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

// Editor Component
const CellEditor = ({
    value,
    onCommit,
    // onCancel,
    autoFocus
}: {
    value: any;
    onCommit: (val: any) => void;
    onCancel: () => void;
    autoFocus?: boolean;
}) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (autoFocus && ref.current) {
            ref.current.focus();
            ref.current.select();
        }
    }, [autoFocus]);

    return (
        <input
            ref={ref}
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
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault(); // prevent newline if generic input
                    onCommit(ref.current?.value);
                }
                else if (e.key === "Escape") {
                    // handled by parent or here? headless hook handles escape usually via global but local is safer
                    // onCancel();
                    // Actually hook handles it on container, but input captures focus.
                    // Let's forward to hook via specialized handler or just bubble?
                    // The hook's gridProps.onKeyDown might not fire if input stops propagation?
                    // Actually input should handle it.
                    // e.stopPropagation(); 
                }
            }}
            onBlur={() => onCommit(ref.current?.value)}
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
        state: { cursor, selection, data: tableData },
        gridProps,
        getCellProps,
        actions
    } = table;

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
    }, [cursor, gridProps.ref]); // Re-run when cursor moves

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
            {/* Header */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns,
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
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

                {columnDefs.map((col, i) => (
                    <div
                        key={col.key}
                        style={{
                            padding: "8px 12px",
                            borderRight: i < columnDefs.length - 1 ? "1px solid var(--border-color)" : "none",
                            fontWeight: 500,
                            color: "var(--text-body)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }}
                    >
                        {col.title}
                    </div>
                ))}
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
                            {/* Row Number */}
                            <div style={{
                                padding: "0 8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "var(--surface-sunken-bg)",
                                borderRight: "1px solid var(--border-color)",
                                color: "var(--text-body)",
                                fontSize: "11px",
                                userSelect: "none"
                            }}>
                                {rIdx + 1}
                            </div>

                            {columnDefs.map((col, cIdx) => {
                                const cellState = getCellProps(rIdx, cIdx);
                                const isCursor = cellState["data-cursor"];
                                const isSelected = cellState["data-selected"];
                                const isEditing = cellState["data-editing"];

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
                                        data-editing={isEditing || undefined}
                                        onMouseDown={handleMouseDown}
                                        onDoubleClick={cellState.onDoubleClick}
                                        style={{
                                            position: "relative",
                                            padding: isEditing ? 0 : "8px 12px",
                                            borderRight: cIdx < columnDefs.length - 1 ? "1px solid var(--border-color)" : "none",
                                            background: isSelected ? "var(--surface-selected-bg)" : "transparent",
                                            color: isSelected ? "var(--surface-selected-fg)" : "inherit",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            cursor: "default",
                                            outline: isCursor ? "2px solid var(--text-primary)" : "none",
                                            outlineOffset: "-2px",
                                            zIndex: isCursor ? 2 : 1,
                                        }}
                                    >
                                        {isEditing ? (
                                            <CellEditor
                                                value={value}
                                                autoFocus
                                                onCommit={(val) => {
                                                    actions.commitEditing(val);
                                                    // Restore focus to grid after editing
                                                    gridProps.ref.current?.focus({ preventScroll: true });
                                                }}
                                                onCancel={() => {
                                                    actions.cancelEditing();
                                                    // Restore focus to grid after cancel
                                                    gridProps.ref.current?.focus({ preventScroll: true });
                                                }}
                                            />
                                        ) : (
                                            col.render ? col.render(value, row) : value
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
