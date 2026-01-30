import * as styles from './DataTable.css';
import { DataGrid, type ColumnDef } from '../../../components/composites/DataGrid';

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

    // Define columns
    const columns: ColumnDef<DataRow>[] = [
        {
            id: 'id',
            header: 'ID',
            accessorKey: 'id',
            cell: (row) => <span className={styles.idCell}>{row.id}</span>
        },
        {
            id: 'name',
            header: 'Title',
            accessorKey: 'name',
            cell: (row) => <span style={{ fontWeight: 500 }}>{row.name}</span>
        },
        {
            id: 'email',
            header: 'Assignee',
            accessorKey: 'email'
        },
        {
            id: 'role',
            header: 'Role',
            accessorKey: 'role'
        },
        {
            id: 'status',
            header: 'Status',
            cell: (row) => <StatusBadge status={row.status} />
        },
        {
            id: 'joined',
            header: 'Updated',
            accessorKey: 'joined',
            cell: (row) => <span className={styles.idCell}>{row.joined}</span>
        }
    ];

    return (
        <DataGrid
            data={data}
            columns={columns}
            keyField="id"
            selectedIds={selectedIds}
            onRowClick={onRowClick}
            onSelectionChange={(newSet) => {
                if (!onSelectAll && !onRowSelect) return;

                const prevSet = selectedIds || new Set();

                // Detect Select All (0 or partial -> All)
                // Note: Logic allows explicit clearing or selecting all.
                // If size is full, we assume select all.
                if (newSet.size === data.length && prevSet.size < data.length) {
                    onSelectAll?.(true);
                    return;
                }
                // Detect Deselect All (All -> 0)
                if (newSet.size === 0 && prevSet.size === data.length) {
                    onSelectAll?.(false);
                    return;
                }
                // Also handle clearing from partial
                if (newSet.size === 0 && prevSet.size > 0 && prevSet.size < data.length) {
                    onSelectAll?.(false); // Or maybe loop removals? Usually clearing means "Select None".
                    return;
                }

                // Changes
                // Find added
                for (const id of newSet) {
                    if (!prevSet.has(id)) {
                        onRowSelect?.(id, true);
                    }
                }
                // Find removed
                for (const id of prevSet) {
                    if (!newSet.has(id)) {
                        onRowSelect?.(id, false);
                    }
                }
            }}
        />
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
