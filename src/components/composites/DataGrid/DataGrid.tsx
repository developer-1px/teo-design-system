import React from 'react';
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
    const allSelected = data.length > 0 && selectedIds?.size === data.length;
    const someSelected = (selectedIds?.size || 0) > 0 && (selectedIds?.size || 0) < data.length;

    const handleSelectAll = (checked: boolean) => {
        if (!onSelectionChange) return;
        if (checked) {
            onSelectionChange(new Set(data.map(item => String(item[keyField]))));
        } else {
            onSelectionChange(new Set());
        }
    };

    const handleRowSelect = (id: string, checked: boolean) => {
        if (!onSelectionChange) return;
        const newSelected = new Set(selectedIds);
        if (checked) {
            newSelected.add(id);
        } else {
            newSelected.delete(id);
        }
        onSelectionChange(newSelected);
    };

    return (
        <div className={styles.container}>
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
                        return (
                            <tr
                                key={id}
                                className={styles.tr}
                                onClick={() => onRowClick && onRowClick(row)}
                                style={{
                                    backgroundColor: isSelected ? '#f0f9ff' : undefined
                                }}
                            >
                                {onSelectionChange && (
                                    <td className={styles.td} style={{ paddingRight: 0 }} onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={(e) => handleRowSelect(id, e.target.checked)}
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
