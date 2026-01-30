import React, { useState, useCallback } from 'react';
import * as styles from './DataGrid.css';

export interface ColumnDef<T> {
    id: string;
    header: string;
    width?: string | number;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
}

export interface DataGridProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    keyField: keyof T;
    selectedIds?: Set<string>;
    onSelectionChange?: (ids: Set<string>) => void;
    onRowClick?: (item: T) => void;
}

export function DataGrid<T>({
    data,
    columns,
    keyField,
    selectedIds,
    onSelectionChange,
    onRowClick
}: DataGridProps<T>) {
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const [pivotId, setPivotId] = useState<string | null>(null);

    const allIds = data.map(item => String(item[keyField]));
    const allSelected = data.length > 0 && selectedIds?.size === data.length;
    const someSelected = (selectedIds?.size || 0) > 0 && (selectedIds?.size || 0) < data.length;

    const handleSelectAll = useCallback((checked: boolean) => {
        if (!onSelectionChange) return;
        if (checked) {
            onSelectionChange(new Set(allIds));
        } else {
            onSelectionChange(new Set());
        }
    }, [allIds, onSelectionChange]);

    const handleRowSelect = useCallback((id: string, checked: boolean, extend = false) => {
        if (!onSelectionChange) return;
        const newSelected = new Set(selectedIds);

        if (extend && pivotId) {
            const startIdx = allIds.indexOf(pivotId);
            const endIdx = allIds.indexOf(id);
            const [min, max] = [Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)];
            const rangeIds = allIds.slice(min, max + 1);

            rangeIds.forEach(rid => newSelected.add(rid));
        } else {
            if (checked) {
                newSelected.add(id);
            } else {
                newSelected.delete(id);
            }
        }
        onSelectionChange(newSelected);
    }, [allIds, onSelectionChange, pivotId, selectedIds]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        const isMod = e.metaKey || e.ctrlKey;
        const isShift = e.shiftKey;

        // 1. Select All (Cmd + A)
        if (isMod && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            handleSelectAll(true);
            return;
        }

        // 2. Navigation
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const currentIdx = focusedId ? allIds.indexOf(focusedId) : -1;
            let nextIdx = e.key === 'ArrowDown' ? currentIdx + 1 : currentIdx - 1;

            if (nextIdx < 0) nextIdx = 0;
            if (nextIdx >= allIds.length) nextIdx = allIds.length - 1;

            const nextId = allIds[nextIdx];
            setFocusedId(nextId);

            if (isShift) {
                if (!pivotId) setPivotId(focusedId || allIds[0]);
                handleRowSelect(nextId, true, true);
            } else {
                setPivotId(nextId);
            }
        }
    };

    return (
        <div
            className={styles.container}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{ outline: 'none' }}
        >
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        {onSelectionChange && (
                            <th className={styles.th} style={{ width: '32px', paddingRight: 0 }}>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={input => { if (input) input.indeterminate = someSelected; }}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </th>
                        )}
                        {columns.map(col => (
                            <th key={col.id} className={styles.th} style={{ width: col.width }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => {
                        const id = String(row[keyField]);
                        const isSelected = selectedIds?.has(id);
                        const isFocused = focusedId === id;

                        return (
                            <tr
                                key={id}
                                className={styles.tr}
                                onClick={(e) => {
                                    setFocusedId(id);
                                    if (e.shiftKey && pivotId) {
                                        handleRowSelect(id, true, true);
                                    } else {
                                        setPivotId(id);
                                        onRowClick && onRowClick(row);
                                    }
                                }}
                                data-selected={isSelected}
                                data-focused={isFocused}
                            >
                                {onSelectionChange && (
                                    <td className={styles.td} style={{ paddingRight: 0 }} onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => {
                                                handleRowSelect(id, e.target.checked);
                                                setFocusedId(id);
                                                setPivotId(id);
                                            }}
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </td>
                                )}
                                {columns.map(col => (
                                    <td key={col.id} className={styles.td}>
                                        {col.cell ? col.cell(row) : String(row[col.accessorKey as keyof T])}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

