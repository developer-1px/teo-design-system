import { useState, useMemo } from 'react';
import * as styles from './TableDesignerConcept.css';
import { faker, fakerKO } from '@faker-js/faker';
import {
    Table as TableIcon,
    CheckSquare,
    ChevronDown,
    Type,
    CheckCircle2,
    DownloadCloud,
    Trash2,
    Calendar,
    Hash,
    Tag,
    MoreHorizontal
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- Types ---
type ColumnType = 'Text' | 'Number' | 'Date' | 'Status';

interface ColumnConfig {
    id: string;
    label: string;
    type: ColumnType;
    width?: string;
    format?: string;
}

// --- Constants & Config ---
const CORE_COLUMNS: ColumnConfig[] = [
    { id: 'sku', label: 'Order ID', type: 'Text', width: 'minmax(120px, 0.8fr)' },
    { id: 'product', label: 'Product Name', type: 'Text', width: 'minmax(200px, 2fr)' },
    { id: 'status', label: 'Fulfillment', type: 'Status', width: 'minmax(120px, 1fr)' },
    { id: 'date', label: 'Order Date', type: 'Date', width: 'minmax(120px, 1fr)' },
    { id: 'amount', label: 'Total Amount', type: 'Number', format: 'currency', width: 'minmax(120px, 1fr)' },
];

const KO_PRODUCTS = ['Premium Wallet', 'NC Headset', 'Eco Kit', 'Curved Monitor', 'Jeju Tea', 'Smart Purifier', 'Keyboard'];
const STATUS_PRESETS = ['Ready', 'Shipped', 'Processing', 'Cancelled'];
const STATUS_COLORS: Record<string, string> = { 'Ready': 'gray', 'Shipped': 'green', 'Processing': 'blue', 'Cancelled': 'red' };

// --- Mock Data Generator ---
const generateMockRows = (count: number, locale: 'en' | 'ko') => {
    const f = locale === 'ko' ? fakerKO : faker;
    return Array.from({ length: count }).map(() => {
        const status = f.helpers.arrayElement(STATUS_PRESETS);
        return {
            id: f.string.uuid(),
            sku: `#ORD-${f.string.numeric(4)}`,
            product: locale === 'ko' ? f.helpers.arrayElement(KO_PRODUCTS) : f.commerce.productName(),
            status: status,
            date: f.date.recent({ days: 30 }).toISOString().split('T')[0],
            amount: parseFloat(f.commerce.price({ min: 100, max: 2000 })),
        };
    });
};

// --- Minimal Context Menu ---
interface ContextMenuProps {
    currentLabel: string;
    activeColType: ColumnType;
    onClose: () => void;
    onTypeChange: (newType: ColumnType) => void;
    onLabelChange: (val: string) => void;
}

const ContextualMenu = ({ currentLabel, activeColType, onClose, onTypeChange, onLabelChange }: ContextMenuProps) => {
    const typeOptions: { type: ColumnType; icon: any }[] = [
        { type: 'Text', icon: Type },
        { type: 'Number', icon: Hash },
        { type: 'Date', icon: Calendar },
        { type: 'Status', icon: Tag },
    ];

    return (
        <motion.div
            className={styles.contextMenu}
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.1 }}
            onClick={(e) => e.stopPropagation()}
        >
            {/* 1. Rename Input (Primary Action) */}
            <div style={{ padding: '8px 8px 4px 8px' }}>
                <input
                    className={styles.inlineInput}
                    style={{
                        fontSize: '13px',
                        padding: '6px 8px',
                        background: '#f4f4f5',
                        borderRadius: '6px',
                        width: '100%',
                        fontWeight: 600,
                        color: '#18181b',
                    }}
                    value={currentLabel}
                    onChange={(e) => onLabelChange(e.target.value)}
                    placeholder="Column Name"
                    autoFocus
                />
            </div>

            <div style={{ height: 1, background: '#f4f4f5', margin: '4px 0' }} />

            {/* 2. Type Selection (Grid) */}
            <div style={{ padding: '4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                {typeOptions.map((opt) => (
                    <div
                        key={opt.type}
                        className={styles.menuItem}
                        data-active={activeColType === opt.type}
                        onClick={() => { onTypeChange(opt.type); onClose(); }}
                        style={{ justifyContent: 'center', flexDirection: 'column', gap: 4, padding: '8px 0' }}
                    >
                        <opt.icon size={16} style={{ opacity: activeColType === opt.type ? 1 : 0.5 }} />
                        <span style={{ fontSize: '10px' }}>{opt.type}</span>
                    </div>
                ))}
            </div>

            <div style={{ height: 1, background: '#f4f4f5', margin: '4px 0' }} />

            {/* 3. Delete (Destructive) */}
            <div className={styles.menuItem} data-danger="true">
                <Trash2 size={14} />
                <span>Delete</span>
            </div>
        </motion.div>
    )
}

export default function TableDesignerConcept() {
    const [locale, setLocale] = useState<'en' | 'ko'>('ko');
    const [tableName, setTableName] = useState('Order Management');
    const [columns, setColumns] = useState<ColumnConfig[]>(CORE_COLUMNS);
    const [selectedColId, setSelectedColId] = useState<string | null>(null);

    const mockData = useMemo(() => generateMockRows(8, locale), [locale]);
    const checkboxWidth = '48px ';
    const gridTemplate = checkboxWidth + columns.map(c => c.width || '1fr').join(' ');

    return (
        <div className={styles.container} onClick={() => setSelectedColId(null)}>
            <header className={styles.topBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ background: '#18181b', color: '#fff', padding: '6px', borderRadius: '6px' }}><TableIcon size={18} /></div>
                    <div>
                        <h1 style={{ fontSize: '15px', fontWeight: 800 }}>Table Builder</h1>
                        <p style={{ fontSize: '11px', color: '#71717a' }}>Minimalist "Shy Icon" Interaction</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button className={styles.chip}><DownloadCloud size={14} style={{ marginRight: 6 }} /> Sync Schema</button>
                    <button className={styles.chip} style={{ background: '#18181b', color: '#fff', borderColor: '#18181b' }}>Publish</button>
                </div>
            </header>

            <div className={styles.mainLayout}>
                <main className={styles.canvas}>
                    <div style={{ width: '100%', maxWidth: '1100px', marginBottom: 24, textAlign: 'center' }}>
                        <input
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            style={{ fontSize: '24px', fontWeight: 800, textAlign: 'center', border: 'none', background: 'transparent', outline: 'none' }}
                        />
                        <p style={{ color: '#a1a1aa', fontSize: '13px' }}>Reflecting the Pareto Principle (80/20 Rule)</p>
                    </div>

                    <div className={styles.tableWrapper} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.gridTable} style={{ gridTemplateColumns: gridTemplate }}>
                            {/* Checkbox Header */}
                            <div className={styles.headerCell} style={{ justifyContent: 'center' }}>
                                <CheckSquare size={16} color="#cbd5e1" />
                            </div>

                            {/* Shy Icon Headers */}
                            {columns.map(col => {
                                const isSelected = selectedColId === col.id;

                                // Determine Icon
                                const TypeIcon =
                                    col.type === 'Text' ? Type :
                                        col.type === 'Number' ? Hash :
                                            col.type === 'Date' ? Calendar : Tag;

                                return (
                                    <div
                                        key={col.id}
                                        className={[styles.headerCell, isSelected ? styles.selectedHeader : ''].join(' ')}
                                        onClick={(e) => { e.stopPropagation(); setSelectedColId(col.id); }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                            {/* Type Icon is part of the name lockup now */}
                                            <TypeIcon size={12} color={isSelected ? '#3b82f6' : '#a1a1aa'} />
                                            <span>{col.label}</span>
                                        </div>

                                        {/* Shy Interaction Trigger */}
                                        <div className={styles.shyTrigger} style={{ opacity: isSelected ? 1 : 0 }}>
                                            <MoreHorizontal size={14} />
                                        </div>

                                        {/* Minimal Context Menu */}
                                        <AnimatePresence>
                                            {isSelected && (
                                                <ContextualMenu
                                                    currentLabel={col.label}
                                                    activeColType={col.type}
                                                    onClose={() => setSelectedColId(null)}
                                                    onTypeChange={(newType) => setColumns(cols => cols.map(c => c.id === col.id ? { ...c, type: newType } : c))}
                                                    onLabelChange={(val) => setColumns(cols => cols.map(c => c.id === col.id ? { ...c, label: val } : c))}
                                                />
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}

                            {/* Data Rows */}
                            {mockData.map((row) => (
                                <div key={row.id} style={{ display: 'contents' }}>
                                    <div className={styles.cell} style={{ justifyContent: 'center' }}>
                                        <div style={{ width: 14, height: 14, borderRadius: 4, border: '1px solid #e4e4e7' }} />
                                    </div>

                                    {columns.map(col => {
                                        const cellValue = (row as any)[col.id];
                                        return (
                                            <div key={col.id} className={styles.cell} style={{ opacity: selectedColId === col.id ? 1 : 0.8, justifyContent: col.type === 'Number' ? 'flex-end' : 'flex-start' }}>
                                                {/* Text */}
                                                {col.type === 'Text' && <span style={{ fontSize: '13px', color: '#18181b' }}>{cellValue}</span>}

                                                {/* Number */}
                                                {col.type === 'Number' && <span style={{ fontFamily: 'monospace', letterSpacing: '-0.02em', color: '#18181b' }}>
                                                    {col.format === 'currency' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cellValue) : cellValue}
                                                </span>}

                                                {/* Date */}
                                                {col.type === 'Date' && <span style={{ color: '#71717a', fontSize: '12px' }}>{cellValue}</span>}

                                                {/* Status */}
                                                {col.type === 'Status' && (
                                                    <div className={styles.badge} style={{
                                                        backgroundColor:
                                                            cellValue === 'Shipped' ? '#ecfdf5' :
                                                                cellValue === 'Cancelled' ? '#fef2f2' :
                                                                    cellValue === 'Processing' ? '#eff6ff' : '#f4f4f5',
                                                        color:
                                                            cellValue === 'Shipped' ? '#059669' :
                                                                cellValue === 'Cancelled' ? '#dc2626' :
                                                                    cellValue === 'Processing' ? '#2563eb' : '#52525b'
                                                    }}>
                                                        {cellValue}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
