import React, { useState } from 'react';
import * as styles from './SchemaDocPage.css';

type FieldStatus = 'new' | 'deleted' | 'modified' | 'none';

interface SchemaField {
    id: string;
    name: string;
    type: string;
    prevType?: string;
    required: boolean;
    description: string;
    status: FieldStatus;
    children?: SchemaField[];
}

const SAMPLE_DATA: SchemaField[] = [
    {
        id: '4',
        name: 'user_id',
        type: 'uuid',
        required: true,
        description: '사용자의 고유 식별자',
        status: 'none',
    },
    {
        id: '6',
        name: 'order_items',
        type: 'array<object>',
        required: true,
        description: '주문 항목 목록',
        status: 'none',
        children: [
            {
                id: '6-1',
                name: 'product_id',
                type: 'string',
                required: true,
                description: '상품 고유 번호',
                status: 'none',
            },
            {
                id: '1',
                name: 'discount_code',
                type: 'string',
                required: false,
                description: '프로모션 적용을 위한 할인 코드',
                status: 'new',
            },
            {
                id: '3',
                name: 'price',
                type: 'float',
                prevType: 'int',
                required: true,
                description: '단가 (소수점 지원 추가)',
                status: 'modified',
            }
        ]
    },
    {
        id: '2',
        name: 'old_tax_id',
        type: 'number',
        required: true,
        description: '시스템 통합으로 인해 삭제됨',
        status: 'deleted',
    },
    {
        id: '5',
        name: 'metadata',
        type: 'object',
        required: false,
        description: '추가 확장을 위한 키-값 쌍',
        status: 'new',
        children: [
            {
                id: '5-1',
                name: 'trace_id',
                type: 'string',
                required: false,
                description: '로깅용 추적 ID',
                status: 'new',
            }
        ]
    },
];

const HISTORY = [
    { version: 'v1.2.4', title: '할인 코드 필드 추가', date: '2024.01.29', active: true },
    { version: 'v1.2.3', title: '결제 응답 타입 최적화', date: '2024.01.20', active: false },
    { version: 'v1.2.2', title: '유저 프로필 필수값 변경', date: '2024.01.15', active: false },
    { version: 'v1.2.1', title: '에러 핸들링 구조 개선', date: '2024.01.05', active: false },
];

export const SchemaDocPage: React.FC = () => {
    const [viewMode, setViewMode] = useState<'SPEC' | 'DIFF'>('DIFF');

    const renderRows = (fields: SchemaField[], depth = 0): React.ReactNode => {
        return fields.flatMap((field) => {
            // Logic for filtering in SPEC mode
            if (viewMode === 'SPEC' && field.status === 'deleted') return [];

            const isNew = field.status === 'new' && viewMode === 'DIFF';
            const isDeleted = field.status === 'deleted' && viewMode === 'DIFF';
            const isModified = field.status === 'modified' && viewMode === 'DIFF';

            const row = (
                <tr
                    key={field.id}
                    className={
                        isNew ? styles.rowNew :
                            isDeleted ? styles.rowDel :
                                isModified ? styles.rowMod : ''
                    }
                >
                    <td className={styles.tableCell}>
                        {viewMode === 'DIFF' && (
                            <>
                                {field.status === 'new' && <span style={{ color: '#059669', fontWeight: 'bold' }}>New</span>}
                                {field.status === 'deleted' && <span style={{ color: '#DC2626', fontWeight: 'bold' }}>Del</span>}
                                {field.status === 'modified' && <span style={{ color: '#D97706', fontWeight: 'bold' }}>Mod</span>}
                                {field.status === 'none' && <span style={{ color: '#9CA3AF' }}>-</span>}
                            </>
                        )}
                        {viewMode === 'SPEC' && <span style={{ color: '#9CA3AF' }}>•</span>}
                    </td>
                    <td className={styles.tableCell}>
                        <div className={styles.fieldNameContainer} style={{ paddingLeft: depth * 24 }}>
                            {depth > 0 && <span className={styles.treeLine}>└</span>}
                            <span>{field.name}</span>
                        </div>
                    </td>
                    <td className={styles.tableCell}>
                        <div className={styles.typeChange}>
                            {isModified && field.prevType && (
                                <>
                                    <span style={{ textDecoration: 'line-through', opacity: 0.6 }}>{field.prevType}</span>
                                    <span className={styles.typeArrow}>→</span>
                                </>
                            )}
                            <span style={{
                                fontWeight: isModified ? '600' : '400',
                                color: isModified ? '#D97706' : 'inherit'
                            }}>
                                {field.type}
                            </span>
                        </div>
                    </td>
                    <td className={styles.tableCell} style={{ textAlign: 'center' }}>
                        {field.required ? 'Y' : 'N'}
                    </td>
                    <td className={styles.tableCell}>
                        {field.description}
                    </td>
                </tr>
            );

            const children = field.children ? renderRows(field.children, depth + 1) : [];
            return [row, ... (Array.isArray(children) ? children : [children])];
        });
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>주문 내역(Order History) API</h1>
                    <div className={styles.subtitle}>
                        <span>v1.2.4</span>
                        <span className={styles.badgeStable}>Stable</span>
                        <span>•</span>
                        <span>최종 업데이트: 2024.01.29</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: '1px solid #E4E4E7',
                        backgroundColor: 'white',
                        fontSize: '13px',
                        cursor: 'pointer'
                    }}>문서 내보내기</button>
                    <button style={{
                        padding: '8px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: '#18181B',
                        color: 'white',
                        fontSize: '13px',
                        cursor: 'pointer'
                    }}>API 테스트 실행</button>
                </div>
            </header>

            {/* Main Layout */}
            <div className={styles.mainLayout}>
                <div className={styles.contentArea}>

                    {/* Tabs */}
                    <div className={styles.tabGroup}>
                        <button
                            className={`${styles.tab} ${viewMode === 'DIFF' ? styles.tabActive : ''}`}
                            onClick={() => setViewMode('DIFF')}
                        >
                            Visual Diff (v1.2.4)
                        </button>
                        <button
                            className={`${styles.tab} ${viewMode === 'SPEC' ? styles.tabActive : ''}`}
                            onClick={() => setViewMode('SPEC')}
                        >
                            Latest Release Spec
                        </button>
                    </div>

                    {/* Conditional Summary (Only in Diff Mode) */}
                    {viewMode === 'DIFF' && (
                        <section>
                            <div className={styles.summaryContainer}>
                                <div className={`${styles.summaryChip} ${styles.chipNew}`}>
                                    <span>+ 3 New Fields</span>
                                </div>
                                <div className={`${styles.summaryChip} ${styles.chipDel}`}>
                                    <span>- 1 Deleted</span>
                                </div>
                                <div className={`${styles.summaryChip} ${styles.chipMod}`}>
                                    <span>Δ 1 Type Changed</span>
                                </div>
                                <div className={`${styles.summaryChip}`} style={{ borderColor: '#FCA5A5', color: '#B91C1C', backgroundColor: '#FEF2F2' }}>
                                    <span>⚠️ 1 Breaking Change</span>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Schema Table */}
                    <section>
                        <table className={styles.tableContainer}>
                            <thead>
                                <tr>
                                    <th className={styles.tableHeader} style={{ width: '80px' }}>상태</th>
                                    <th className={styles.tableHeader}>필드명</th>
                                    <th className={styles.tableHeader}>타입</th>
                                    <th className={styles.tableHeader} style={{ textAlign: 'center' }}>필수</th>
                                    <th className={styles.tableHeader}>설명</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderRows(SAMPLE_DATA)}
                            </tbody>
                        </table>
                    </section>

                    {/* Impact Analysis (Only in Diff Mode) */}
                    {viewMode === 'DIFF' && (
                        <section className={styles.impactSection}>
                            <div className={styles.impactTitle}>
                                <span>⚠️ Breaking Change 영향도 분석</span>
                            </div>
                            <div className={styles.impactContent}>
                                삭제된 <code>old_tax_id</code> 필드는 현재 <strong>결제 모듈(Payment Bridge)</strong>에서 사용 중입니다.
                                해당 모듈을 <code>v1.3.0</code>으로 업데이트하기 전까지는 이전 필드 호환성을 유지해야 합니다.
                            </div>
                        </section>
                    )}
                </div>

                {/* Revision History Panel */}
                <aside className={styles.sidePanel}>
                    <div className={styles.panelHeader}>리비전 히스토리</div>
                    <ul className={styles.historyList}>
                        {HISTORY.map((item, idx) => (
                            <li
                                key={idx}
                                className={`${styles.historyItem} ${item.active ? styles.historyActive : ''}`}
                            >
                                <div className={styles.historyTitle}>{item.title}</div>
                                <div className={styles.historyMeta}>
                                    <span>{item.version}</span>
                                    <span> • </span>
                                    <span>{item.date}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default SchemaDocPage;
