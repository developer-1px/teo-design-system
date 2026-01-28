import { useState } from 'react';
import { Plus, Download, Trash2, MoreHorizontal, ChevronDown } from 'lucide-react';
import * as styles from './ListPage.css';
import { DataTable } from './DataTable';
import { SmartFilter } from './SmartFilter';
import { Drawer } from '@/components/overlay/Drawer';
import { vars } from '@/styles/vars.css';

// Mock Data: Users (CRM Style)
interface DataRow {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Editor' | 'Viewer';
    status: 'Active' | 'Inactive' | 'Pending';
    joined: string;
}

const MOCK_DATA: DataRow[] = Array.from({ length: 50 }).map((_, i) => ({
    id: `USR-${1000 + i}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i % 5 === 0 ? 'Admin' : i % 3 === 0 ? 'Editor' : 'Viewer',
    status: i % 10 === 0 ? 'Inactive' : i % 20 === 0 ? 'Pending' : 'Active',
    joined: 'Oct 24, 2024',
}));

export function ListPage() {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [searchQuery] = useState('');
    const [activeRowId, setActiveRowId] = useState<string | null>(null);

    // Filter Logic
    // Filter Logic
    const filteredData = MOCK_DATA.filter(row =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(new Set(filteredData.map(d => d.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleRowSelect = (id: string, checked: boolean) => {
        const newSet = new Set(selectedIds);
        if (checked) newSet.add(id);
        else newSet.delete(id);
        setSelectedIds(newSet);
    };

    const activeRow = MOCK_DATA.find(r => r.id === activeRowId);

    return (
        <div className={styles.listPageContainer}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerTop}>
                    <h1 className={styles.title}>Users</h1>
                    <div className={styles.actions}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 12px', borderRadius: 6,
                            border: `1px solid ${vars.border.subtle}`,
                            background: vars.surface.base.bg,
                            fontSize: 13, fontWeight: 500, cursor: 'pointer'
                        }}>
                            <Download size={14} /> Export
                        </button>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: 6,
                            padding: '6px 12px', borderRadius: 6,
                            background: vars.color.gray800, color: 'white',
                            border: 'none',
                            fontSize: 13, fontWeight: 500, cursor: 'pointer'
                        }}>
                            <Plus size={14} /> New User
                        </button>
                    </div>
                </div>

                <div className={styles.filterBar}>
                    <SmartFilter />
                </div>
            </div>

            {/* Selection Bar */}
            {selectedIds.size > 0 && (
                <div className={styles.selectionBar}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ padding: '2px 6px', background: '#3b82f6', color: 'white', borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                            {selectedIds.size}
                        </div>
                        items selected
                    </div>
                    <div className={styles.clearSelection} onClick={() => setSelectedIds(new Set())}>
                        Clear selection
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                        <button style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
            )}

            {/* Table Area */}
            {/* 
                NOTE: For the "Checkbox" support, we would ideally extend DataTable props. 
                For now, I'll pass the data directly or implement a wrapper.
                Since DataTable is reused, let's update DataTable to support selection.
            */}
            <DataTable
                data={filteredData}
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onRowSelect={handleRowSelect}
                onRowClick={(row) => setActiveRowId(row.id)}
            />

            {/* Detail Drawer */}
            <Drawer
                isOpen={!!activeRow}
                onClose={() => setActiveRowId(null)}
                title={activeRow ? activeRow.id : ''}
            >
                {activeRow && (
                    <div style={{ padding: '0 4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                            <div style={{ fontSize: 18, fontWeight: 600, color: vars.color.gray800 }}>
                                {activeRow.name}
                            </div>
                            <MoreHorizontal size={16} color={'#6b7280'} style={{ cursor: 'pointer' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 20, fontSize: 13 }}>
                            <div style={{ color: '#6b7280' }}>Email</div>
                            <div>{activeRow.email}</div>

                            <div style={{ color: '#6b7280' }}>Role</div>
                            <div>{activeRow.role}</div>

                            <div style={{ color: '#6b7280' }}>Status</div>
                            <StatusSelect current={activeRow.status} />

                            <div style={{ color: '#6b7280' }}>Joined</div>
                            <div>{activeRow.joined}</div>
                        </div>

                        <div style={{ marginTop: 32, borderTop: `1px solid ${vars.border.subtle}`, paddingTop: 24 }}>
                            <div style={{ color: '#6b7280', marginBottom: 8, fontSize: 12, fontWeight: 600 }}>DESCRIPTION</div>
                            <p style={{ lineHeight: 1.6, color: '#374151' }}>
                                This is a placeholder description for the task. In a real application, this would pull from a markdown field or database text column.
                            </p>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}

function StatusSelect({ current }: { current: string }) {
    const color =
        current === 'Active' ? '#10B981' :
            current === 'Draft' ? '#6B7280' :
                '#F59E0B';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
            <span style={{ fontWeight: 500 }}>{current}</span>
            <ChevronDown size={12} color="#999" />
        </div>
    )
}


