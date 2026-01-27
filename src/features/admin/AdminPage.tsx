import { useState } from 'react';
import * as styles from './AdminPage.css';
import { SmartFilter } from './SmartFilter';
import { DataTable } from './DataTable';
import { Drawer } from '../../components/overlay/Drawer';
import { vars } from '../../styles/vars.css';

export default function AdminPage() {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.title}>Issues</div>
                <SmartFilter />
            </header>

            <main className={styles.main}>
                <DataTable
                    onRowClick={(row) => setSelectedId(row.id)}
                />
            </main>

            {/* Detail Drawer */}
            <Drawer
                isOpen={!!selectedId}
                onClose={() => setSelectedId(null)}
                title={selectedId || 'Detail'}
            >
                <div style={{ padding: '0 4px' }}>
                    <div style={{
                        fontSize: '18px',
                        fontWeight: 600,
                        marginBottom: '24px',
                        color: vars.color.gray800
                    }}>
                        Update component documentation for v2.0
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', fontSize: '13px' }}>
                        <div style={{ color: vars.color.gray600 }}>Status</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                            Active
                        </div>

                        <div style={{ color: vars.color.gray600 }}>Priority</div>
                        <div>High</div>

                        <div style={{ color: vars.color.gray600 }}>Assignee</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#E5E7EB' }} />
                            User 1
                        </div>
                    </div>

                    <div style={{ marginTop: '32px', borderTop: `1px solid ${vars.border.subtle}`, paddingTop: '24px' }}>
                        <div style={{ color: vars.color.gray600, marginBottom: '8px', fontSize: '13px' }}>Description</div>
                        <p style={{ lineHeight: 1.6, color: vars.surface.base.text, fontSize: '14px' }}>
                            The documentation needs to be updated to reflect the new API changes in version 2.0.
                            Specifically, the "Button" component has new props that need coverage.
                        </p>
                    </div>
                </div>
            </Drawer>
        </div>
    );
}
