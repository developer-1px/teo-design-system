import * as styles from './DataTable.css';

interface DataRow {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    status: 'Active' | 'Inactive' | 'Pending';
    joined: string;
}

interface DataTableProps {
    data?: DataRow[]; // Allow passing data
    onRowClick: (row: DataRow) => void;
    // Selection Props
    selectedIds?: Set<string>;
    onSelectAll?: (checked: boolean) => void;
    onRowSelect?: (id: string, checked: boolean) => void;
}

const DEFAULT_MOCK_DATA: DataRow[] = Array.from({ length: 20 }).map((_, i) => ({
    id: `USR-${1000 + i}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 5 === 0 ? 'Admin' : i % 3 === 0 ? 'Editor' : 'Viewer',
    status: i % 10 === 0 ? 'Inactive' : i % 20 === 0 ? 'Pending' : 'Active',
    joined: 'Oct 24, 2024',
}));

export function DataTable({
    data = DEFAULT_MOCK_DATA,
    onRowClick,
    selectedIds,
    onSelectAll,
    onRowSelect
}: DataTableProps) {
    const allSelected = data.length > 0 && selectedIds?.size === data.length;
    const someSelected = (selectedIds?.size || 0) > 0 && (selectedIds?.size || 0) < data.length;

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead className={styles.thead}>
                    <tr>
                        {onSelectAll && (
                            <th className={styles.th} style={{ width: '32px', paddingRight: 0 }}>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={input => { if (input) input.indeterminate = someSelected; }}
                                    onChange={(e) => onSelectAll(e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </th>
                        )}
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Title</th>
                        <th className={styles.th}>Status</th>
                        <th className={styles.th}>Priority</th>
                        <th className={styles.th}>Assignee</th>
                        <th className={styles.th}>Updated</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr
                            key={row.id}
                            className={styles.tr}
                            onClick={() => onRowClick(row)}
                            style={{
                                backgroundColor: selectedIds?.has(row.id) ? '#f0f9ff' : undefined
                            }}
                        >
                            {onRowSelect && (
                                <td className={styles.td} style={{ paddingRight: 0 }} onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds?.has(row.id)}
                                        onChange={(e) => onRowSelect(row.id, e.target.checked)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </td>
                            )}
                            <td className={`${styles.td} ${styles.idCell}`}>{row.id}</td>
                            <td className={styles.td} style={{ fontWeight: 500 }}>{row.name}</td>
                            <td className={styles.td}>{row.email}</td>
                            <td className={styles.td}>{row.role}</td>
                            <td className={styles.td}>
                                <StatusBadge status={row.status} />
                            </td>
                            <td className={`${styles.td} ${styles.idCell}`}>{row.joined}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatusBadge({ status }: { status: DataRow['status'] }) {
    const color =
        status === 'Active' ? '#10B981' : // Green
            status === 'Pending' ? '#F59E0B' : // Amber
                '#6B7280'; // Gray (Inactive)

    return (
        <span className={styles.statusBadge}>
            <span className={styles.statusDot} style={{ backgroundColor: color }} />
            {status}
        </span>
    );
}
