import { useMemo, useEffect } from "react";
import { faker } from "@faker-js/faker";
import {
    ChevronDown,
    Search,
    Undo2,
    Redo2,
} from "lucide-react";

// Hook Import
import { useHeadlessTable } from "@/legacy-design-system/hooks/data/useHeadlessTable";

// New UI Components
import { Table, TableHeader, HeaderCell, TableRow, TableCell, TableInput } from "@/ui/table/Table";
import * as styles from "./TableApp.css";

// 1. Data Model
interface Rule {
    id: string;
    name: string;
    active: boolean;
    trigger: string;
    condition: string;
    action: string;
    priority: number;
    [key: string]: any;
}

const generateRules = (count: number): Rule[] => {
    return Array.from({ length: count }).map(() => ({
        id: faker.string.uuid(),
        name: faker.hacker.verb() + " " + faker.hacker.noun(),
        active: faker.datatype.boolean(),
        trigger: faker.helpers.arrayElement(["On Create", "On Update", "On Delete", "On Login"]),
        condition: `if (${faker.hacker.noun()} == ${faker.number.int({ max: 100 })})`,
        action: faker.hacker.ingverb(),
        priority: faker.number.int({ min: 1, max: 10 }),
    }));
};

export function TableApp() {
    // 2. Initial Config
    const COLUMNS = useMemo(() => ["name", "active", "trigger", "condition", "action", "priority"], []);
    const initialData = useMemo(() => generateRules(50), []);

    // 3. Headless Hook
    const {
        state: {
            cursor,
            selection,
            data,
            editing,
            search,
            copiedRange
        },
        actions,
        gridProps,
        getCellProps
    } = useHeadlessTable<Rule>({
        data: initialData,
        columns: COLUMNS,
        options: {
            loop: false,
            editOnType: true,
            moveOnEnter: "down"
        }
    });

    // Scroll into view effect
    useEffect(() => {
        if (!gridProps.ref.current) return;
        const container = gridProps.ref.current as HTMLElement;
        // Use a slight timeout to ensure render has updated if needed, though usually sync in React
        // But here we rely on the DOM update of the data-cursor attribute
        requestAnimationFrame(() => {
            const cursorCell = container.querySelector('[data-cursor="true"]') as HTMLElement;

            if (cursorCell) {
                const header = container.querySelector('[role="rowgroup"]') as HTMLElement;
                const headerHeight = header ? header.offsetHeight : 34; // approximate if not found

                // Sticky cols width (row header)
                const rowHeader = container.querySelector('[role="columnheader"]') as HTMLElement; // First one is likely #
                // const rowHeaderWidth = rowHeader ? rowHeader.offsetWidth : 60; // approximate

                const containerRect = container.getBoundingClientRect();
                const cellRect = cursorCell.getBoundingClientRect();

                // Vertical scroll - account for sticky header
                const visibleTop = containerRect.top + headerHeight;
                const visibleBottom = containerRect.bottom;

                if (cellRect.top < visibleTop) {
                    container.scrollTop -= (visibleTop - cellRect.top);
                } else if (cellRect.bottom > visibleBottom) {
                    container.scrollTop += (cellRect.bottom - visibleBottom);
                }

                // Horizontal scroll - account for sticky row number column (if we make it sticky later, for now row header in app is just first cell logic but visually sticky? 
                // In generic table, we haven't enforced sticky first col yet in CSS, but let's assume standard behavior or at least simple view check.
                // The current CSS doesn't make the first column sticky, only the header row.
                // So simple check is fine.

                const visibleLeft = containerRect.left;
                const visibleRight = containerRect.right;

                if (cellRect.left < visibleLeft) {
                    container.scrollLeft -= (visibleLeft - cellRect.left);
                } else if (cellRect.right > visibleRight) {
                    container.scrollLeft += (cellRect.right - visibleRight);
                }
            }
        });
    }, [cursor, gridProps.ref, search.isSearching]);

    // 4. Render Helpers
    const isSelected = (row: number, col: number) => {
        if (!selection) return false;
        const { start, end } = selection;
        const minRow = Math.min(start.row, end.row);
        const maxRow = Math.max(start.row, end.row);
        const minCol = Math.min(start.col, end.col);
        const maxCol = Math.max(start.col, end.col);
        return row >= minRow && row <= maxRow && col >= minCol && col <= maxCol;
    };

    const isCopied = (row: number, col: number) => {
        if (!copiedRange) return false;
        const { start, end } = copiedRange;
        return row >= Math.min(start.row, end.row) &&
            row <= Math.max(start.row, end.row) &&
            col >= Math.min(start.col, end.col) &&
            col <= Math.max(start.col, end.col);
    };

    const gridTemplateColumns = "60px " + COLUMNS.map(() => "minmax(150px, 1fr)").join(" ");

    return (
        <div className={styles.container}>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.titleGroup}>
                    <strong>Rule Engine</strong>
                    <div className={styles.divider} />
                    <button className={styles.actionButton} onClick={actions.undo}>
                        <Undo2 size={16} />
                    </button>
                    <button className={styles.actionButton} onClick={actions.redo}>
                        <Redo2 size={16} />
                    </button>
                    <div className={styles.divider} />
                    <button className={styles.actionButton} onClick={actions.openSearch}>
                        <Search size={16} />
                    </button>
                </div>

                {search.isSearching && (
                    <div className={styles.searchContainer}>
                        <Search size={14} />
                        <input
                            className={styles.searchInput}
                            autoFocus
                            placeholder="Find..."
                            value={search.query}
                            onChange={(e) => actions.setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) actions.findNext();
                                if (e.key === "Enter" && e.shiftKey) actions.findPrev();
                                if (e.key === "Escape") actions.closeSearch();
                            }}
                        />
                        <span className={styles.searchCounter}>
                            {search.matches.length > 0 ? `${search.activeIndex + 1}/${search.matches.length}` : "No results"}
                        </span>
                        <ChevronDown size={12} style={{ cursor: "pointer" }} onClick={actions.closeSearch} />
                    </div>
                )}
            </div>

            {/* Grid Container */}
            <Table
                {...gridProps}
                columnsTemplate={gridTemplateColumns}
                style={{ flex: 1 }} // Take remaining height
            >
                {/* Header Row */}
                <TableHeader>
                    <HeaderCell>#</HeaderCell>
                    {COLUMNS.map((col, i) => (
                        <HeaderCell key={col} style={{ borderBottom: cursor.col === i ? "2px solid #000" : undefined }}>
                            {col.toUpperCase()}
                        </HeaderCell>
                    ))}
                </TableHeader>

                {/* Data Rows */}
                {data.map((row, rIdx) => (
                    <TableRow key={row.id} selected={rIdx === cursor.row}>
                        {/* Row Header */}
                        <HeaderCell>{rIdx + 1}</HeaderCell>

                        {/* Cells */}
                        {COLUMNS.map((col, cIdx) => {
                            const isFocused = cursor.row === rIdx && cursor.col === cIdx;
                            const isEditActive = editing.active && isFocused;
                            const cellProps = getCellProps(rIdx, cIdx);
                            const isSel = isSelected(rIdx, cIdx);
                            const isCp = isCopied(rIdx, cIdx); // Note: Current TableCell doesn't support 'copied' style prop yet, but can update Table.css.ts if needed.
                            const isMatch = search.matches.some(m => m.row === rIdx && m.col === cIdx);
                            const isMatchActive = isMatch && search.activeIndex !== -1 && search.matches[search.activeIndex]?.row === rIdx && search.matches[search.activeIndex]?.col === cIdx;

                            return (
                                <TableCell
                                    key={cIdx}
                                    focused={isFocused}
                                    selected={isSel}
                                    match={isMatch}
                                    activeMatch={isMatchActive}
                                    editing={isEditActive}
                                    copied={isCp}
                                    data-cursor={isFocused}
                                    /* Pass down event handlers from hook */
                                    onMouseDown={(e) => {
                                        // Enforce Focus on Grid Container
                                        if (gridProps.ref.current) {
                                            gridProps.ref.current.focus({ preventScroll: true });
                                        }
                                        cellProps.onClick(e);
                                    }}
                                    onDoubleClick={cellProps.onDoubleClick as any}
                                >
                                    {isEditActive ? (
                                        <TableInput
                                            autoFocus
                                            value={editing.value}
                                            onChange={(e) => actions.setEditValue(e.target.value)}
                                            onBlur={() => actions.commitEditing({ refocus: false })}
                                        />
                                    ) : (
                                        renderValue(row[col], col)
                                    )}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </Table>
        </div>
    );
}

// Helper to render special types
function renderValue(val: any, col: string) {
    if (col === "active") {
        return <input type="checkbox" checked={!!val} readOnly tabIndex={-1} />;
    }
    return String(val);
}
