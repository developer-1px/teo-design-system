import React, { useState, useMemo } from 'react';
import * as styles from './TableDesignerPage.css';
import { faker, fakerKO } from '@faker-js/faker';
import {
    Table as TableIcon,
    Settings2,
    Plus,
    Save,
    DownloadCloud,
    Type,
    BarChart2,
    BadgeCheck,
    Search,
    ChevronDown,
    Layout,
    CheckCircle2,
    XCircle,
    TrendingUp,
    TrendingDown,
    UserCircle,
    CircleDashed,
    Filter,
    PlusCircle,
    Trash2,
    MousePointer2,
    Move,
    Check,
    ListFilter,
    ArrowRight,
    ArrowLeft,
    Square,
    CheckSquare
} from 'lucide-react';

/**
 * 1. TYPES & DEFAULTS
 */
type UIType = 'Profile' | 'Badge' | 'Boolean' | 'Stack' | 'Single' | 'Progress' | 'Trend';
type ToolbarItemType = 'Search' | 'Filter' | 'Action' | 'View';
type SelectionType = 'None' | 'Single' | 'Multiple';

interface ColumnConfig {
    id: string;
    label: string;
    uiType: UIType;
    width?: string;
}

interface ToolbarConfig {
    id: string;
    type: ToolbarItemType;
    label: string;
}

const CORE_COLUMNS: ColumnConfig[] = [
    { id: 'product', label: 'Product', uiType: 'Profile', width: 'minmax(240px, 2fr)' },
    { id: 'category', label: 'Category', uiType: 'Badge', width: 'minmax(120px, 1fr)' },
    { id: 'inventory', label: 'Stock', uiType: 'Progress', width: 'minmax(150px, 1.2fr)' },
    { id: 'performance', label: 'Sales', uiType: 'Trend', width: 'minmax(130px, 1fr)' },
    { id: 'is_active', label: 'Status', uiType: 'Boolean', width: '80px' },
];

const INITIAL_TOOLBAR: ToolbarConfig[] = [
    { id: 't1', type: 'Search', label: 'Search records...' },
    { id: 't2', type: 'Filter', label: 'All Categories' },
];

/**
 * 2. MOCK DATA
 */
const KO_PRODUCTS = ['Premium Wallet', 'NC Headset', 'Eco Kit', 'Curved Monitor', 'Jeju Tea', 'Smart Purifier', 'Keyboard'];
const generateMockRows = (count: number, locale: 'en' | 'ko') => {
    const f = locale === 'ko' ? fakerKO : faker;
    return Array.from({ length: count }).map(() => ({
        id: f.string.uuid(),
        product: {
            name: locale === 'ko' ? f.helpers.arrayElement(KO_PRODUCTS) : f.commerce.productName(),
            sku: f.string.alphanumeric(8).toUpperCase(),
            image: f.image.urlPicsumPhotos({ width: 64, height: 64 })
        },
        category: f.commerce.department(),
        inventory: { stock: f.number.int({ min: 0, max: 200 }), percent: f.number.int({ min: 10, max: 100 }) },
        performance: { value: parseFloat(f.commerce.price({ min: 100, max: 5000 })), change: f.number.int({ min: -20, max: 40 }) },
        is_active: f.datatype.boolean()
    }));
};

/**
 * 3. MAIN PAGE
 */
export default function TableDesignerPage() {
    const [locale, setLocale] = useState<'en' | 'ko'>('ko');
    const [tableName, setTableName] = useState('Product Management');
    const [selectionType, setSelectionType] = useState<SelectionType>('Multiple');
    const [showPagination, setShowPagination] = useState(true);
    const [columns, setColumns] = useState<ColumnConfig[]>(CORE_COLUMNS);
    const [selectedColId, setSelectedColId] = useState<string | null>(null);
    const [toolbarItems, setToolbarItems] = useState<ToolbarConfig[]>(INITIAL_TOOLBAR);
    const [activeTab, setActiveTab] = useState<'General' | 'Columns' | 'Toolbar'>('General');

    const mockData = useMemo(() => generateMockRows(5, locale), [locale]);

    // Grid Template Calculation including Checkbox Column
    const checkboxWidth = selectionType !== 'None' ? '48px ' : '';
    const gridTemplate = checkboxWidth + columns.map(c => c.width || '1fr').join(' ');

    const selectedColumn = columns.find(c => c.id === selectedColId);

    const updateCol = (id: string, patch: Partial<ColumnConfig>) => {
        setColumns(cols => cols.map(c => c.id === id ? { ...c, ...patch } : c));
    };

    const addToolbarItem = (type: ToolbarItemType) => {
        const newItem: ToolbarConfig = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            label: type === 'Search' ? 'Search...' : type === 'Action' ? 'New Button' : type
        };
        setToolbarItems([...toolbarItems, newItem]);
    };

    const removeToolbarItem = (id: string) => {
        setToolbarItems(toolbarItems.filter(item => item.id !== id));
    };

    return (
        <div className={styles.container}>
            <header className={styles.topBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ background: '#18181b', color: '#fff', padding: '6px', borderRadius: '6px' }}><TableIcon size={18} /></div>
                    <div>
                        <h1 style={{ fontSize: '15px', fontWeight: 800 }}>Table Builder</h1>
                        <p style={{ fontSize: '11px', color: '#71717a' }}>Define patterns for high-density data</p>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f4f4f5', padding: '1px', borderRadius: '6px' }}>
                        {(['en', 'ko'] as const).map(l => (
                            <button key={l} onClick={() => setLocale(l)} style={{
                                padding: '4px 12px', fontSize: '11px', border: 'none', borderRadius: '5px', cursor: 'pointer',
                                background: locale === l ? '#fff' : 'transparent', color: locale === l ? '#18181b' : '#71717a',
                                fontWeight: locale === l ? 700 : 500, boxShadow: locale === l ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                            }}>{l.toUpperCase()}</button>
                        ))}
                    </div>
                    <button className={styles.chip}><DownloadCloud size={14} style={{ marginRight: 6 }} /> Sync</button>
                </div>
            </header>

            <div className={styles.mainLayout}>
                <main className={styles.canvas}>
                    {/* TABLE TITLE & ACTIONS */}
                    <div style={{ width: '100%', maxWidth: '1100px', marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                            <div>
                                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#18181b' }}>{tableName}</h2>
                                <p style={{ fontSize: '12px', color: '#71717a' }}>{mockData.length} records found</p>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className={styles.chip}><ListFilter size={14} style={{ marginRight: 6 }} /> View Actions</button>
                                <button className={styles.chip} style={{ background: '#3b82f6', color: '#fff', border: 'none' }}><Plus size={14} style={{ marginRight: 6 }} /> Create New</button>
                            </div>
                        </div>

                        {/* TOOLBAR */}
                        <div className={styles.toolbar} style={{ padding: '0 4px' }}>
                            <div style={{ display: 'flex', flex: 1, alignItems: 'center', gap: 8 }}>
                                {toolbarItems.map(item => (
                                    <div key={item.id}>
                                        {item.type === 'Search' && (
                                            <div className={styles.searchWrapper}>
                                                <Search size={14} style={{ position: 'absolute', left: 10, top: 10, color: '#a1a1aa' }} />
                                                <input className={styles.searchInput} placeholder={item.label} readOnly />
                                            </div>
                                        )}
                                        {item.type === 'Filter' && <button className={styles.chip} style={{ borderRadius: 20 }}><Filter size={14} style={{ marginRight: 6 }} /> {item.label}</button>}
                                        {item.type === 'View' && <button className={styles.chip} style={{ borderRadius: 20 }}><Layout size={14} style={{ marginRight: 6 }} /> {item.label}</button>}
                                        {item.type === 'Action' && <button className={styles.chip} style={{ background: '#3b82f6', color: '#fff', border: 'none' }}>{item.label}</button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={styles.tableWrapper}>
                        <div className={styles.gridTable} style={{ gridTemplateColumns: gridTemplate }}>
                            {/* CHECKBOX HEADER */}
                            {selectionType !== 'None' && (
                                <div className={styles.headerCell} style={{ justifyContent: 'center', padding: '12px 0' }}>
                                    {selectionType === 'Multiple' ? <CheckSquare size={16} color="#cbd5e1" /> : <Square size={16} color="#cbd5e1" />}
                                </div>
                            )}

                            {/* COLUMN HEADERS */}
                            {columns.map(col => {
                                const isSelected = selectedColId === col.id;
                                const headerClasses = [styles.headerCell, isSelected ? styles.selectedHeader : ''].join(' ');
                                return (
                                    <div key={col.id} className={headerClasses} onClick={() => setSelectedColId(col.id)}>
                                        <span>{col.label}</span>
                                        <div className={styles.patternBadge}>{col.uiType.toUpperCase()}</div>
                                    </div>
                                );
                            })}

                            {/* BODY ROWS */}
                            {mockData.map((row, idx) => (
                                <div key={row.id} style={{ display: 'contents' }}>
                                    {selectionType !== 'None' && (
                                        <div className={styles.cell} style={{ justifyContent: 'center' }}>
                                            <div className={styles.checkbox} data-state={idx === 0 ? "checked" : ""}>
                                                {idx === 0 && <Check size={12} />}
                                            </div>
                                        </div>
                                    )}
                                    {columns.map(col => {
                                        const raw = (row as any)[col.id];
                                        const isSelected = selectedColId === col.id;
                                        const cellClasses = [styles.cell, isSelected ? styles.selectedCell : ''].join(' ');
                                        return (
                                            <div key={`${row.id}-${col.id}`} className={cellClasses} onClick={() => setSelectedColId(col.id)}>
                                                {col.uiType === 'Profile' && (
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div className={styles.avatar} style={{ backgroundImage: `url(${row.product.image})` }} />
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <span style={{ fontWeight: 600, color: '#18181b' }}>{row.product.name}</span>
                                                            <span style={{ fontSize: '11px', color: '#a1a1aa' }}>{row.product.sku}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                {col.uiType === 'Single' && <span style={{ color: '#18181b' }}>{String(raw)}</span>}
                                                {col.uiType === 'Badge' && <span className={styles.badge} style={{ background: '#f4f4f5', color: '#71717a' }}>{String(raw)}</span>}
                                                {col.uiType === 'Boolean' && (
                                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                        {raw ? <CheckCircle2 size={18} color="#10b981" fill="#d1fae5" /> : <XCircle size={18} color="#f43f5e" fill="#ffe4e6" />}
                                                    </div>
                                                )}
                                                {col.uiType === 'Progress' && (
                                                    <div style={{ width: '100%', paddingRight: 20 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: 4 }}>
                                                            <span style={{ fontWeight: 600 }}>{row.inventory.stock} Items</span>
                                                            <span style={{ color: '#a1a1aa' }}>{row.inventory.percent}%</span>
                                                        </div>
                                                        <div className={styles.progressBarBg}><div className={styles.progressBarFill} style={{ width: `${row.inventory.percent}%` }} /></div>
                                                    </div>
                                                )}
                                                {col.uiType === 'Trend' && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <span style={{ fontWeight: 700 }}>${row.performance.value.toLocaleString()}</span>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '2px 6px', borderRadius: 4, fontSize: '10px', fontWeight: 700, background: row.performance.change > 0 ? '#dcfce7' : '#fee2e2', color: row.performance.change > 0 ? '#166534' : '#991b1b' }}>
                                                            {row.performance.change > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                                            {Math.abs(row.performance.change)}%
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        {/* PAGINATION */}
                        {showPagination && (
                            <div className={styles.pagination}>
                                <div>Showing 1 - 5 of 250 records</div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className={styles.chip} disabled><ArrowLeft size={14} /></button>
                                    <button className={styles.chip}><ArrowRight size={14} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* INSPECTOR */}
                <aside className={styles.sidebar}>
                    <div style={{ display: 'flex', background: '#f4f4f5', padding: '2px', borderRadius: '8px', marginBottom: 24 }}>
                        {(['General', 'Columns', 'Toolbar'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} style={{
                                flex: 1, padding: '8px', fontSize: '11px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                                background: activeTab === tab ? '#fff' : 'transparent', fontWeight: activeTab === tab ? 700 : 500
                            }}>{tab}</button>
                        ))}
                    </div>

                    {activeTab === 'General' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <Settings2 size={16} color="#71717a" />
                                <span style={{ fontWeight: 600 }}>Table Identity</span>
                            </div>
                            <div className={styles.sectionLabel}>Table Name</div>
                            <input className={styles.selectField} value={tableName} onChange={(e) => setTableName(e.target.value)} />

                            <div className={styles.sectionLabel}>Selection Behavior</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {(['None', 'Single', 'Multiple'] as SelectionType[]).map(type => (
                                    <button key={type} onClick={() => setSelectionType(type)} className={styles.paletteItem} style={{
                                        borderColor: selectionType === type ? '#3b82f6' : '#e4e4e7',
                                        background: selectionType === type ? '#3b82f608' : '#fff'
                                    }}>
                                        {type === 'Multiple' ? <CheckSquare size={14} /> : <Square size={14} />}
                                        {type} Selection
                                    </button>
                                ))}
                            </div>

                            <div className={styles.sectionLabel}>Navigation</div>
                            <button onClick={() => setShowPagination(!showPagination)} className={styles.paletteItem} style={{
                                borderColor: showPagination ? '#3b82f6' : '#e4e4e7',
                                background: showPagination ? '#3b82f608' : '#fff'
                            }}>
                                <ArrowRight size={14} /> Show Pagination
                            </button>
                        </>
                    )}

                    {activeTab === 'Columns' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <MousePointer2 size={16} color="#71717a" />
                                <span style={{ fontWeight: 600 }}>Column Config</span>
                            </div>
                            {selectedColumn ? (
                                <>
                                    <div className={styles.sectionLabel}>Display Name</div>
                                    <input className={styles.selectField} value={selectedColumn.label} onChange={(e) => updateCol(selectedColumn.id, { label: e.target.value })} />
                                    <div className={styles.sectionLabel}>Patterns</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                                        {['Profile', 'Single', 'Badge', 'Boolean', 'Progress', 'Trend'].map(type => (
                                            <button key={type} onClick={() => updateCol(selectedColumn.id, { uiType: type as UIType })} className={styles.paletteItem} style={{
                                                flexDirection: 'column', padding: '12px 8px',
                                                borderColor: selectedColumn.uiType === type ? '#3b82f6' : '#e4e4e7',
                                                background: selectedColumn.uiType === type ? '#3b82f608' : '#fff', fontSize: '10px'
                                            }}>{type}</button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p style={{ fontSize: '12px', color: '#a1a1aa', textAlign: 'center', marginTop: 40 }}>Select a column to edit</p>
                            )}
                        </>
                    )}

                    {activeTab === 'Toolbar' && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <Layout size={16} color="#71717a" />
                                <span style={{ fontWeight: 600 }}>Toolbar Palette</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                                <div className={styles.paletteItem} onClick={() => addToolbarItem('Search')}><Search size={14} /> Search Input</div>
                                <div className={styles.paletteItem} onClick={() => addToolbarItem('Filter')}><Filter size={14} /> Filter Dropdown</div>
                                <div className={styles.paletteItem} onClick={() => addToolbarItem('View')}><Settings2 size={14} /> View Settings</div>
                                <div className={styles.paletteItem} onClick={() => addToolbarItem('Action')}><PlusCircle size={14} /> Action Button</div>
                            </div>

                            <div className={styles.sectionLabel}>Active Items</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {toolbarItems.map((item) => (
                                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                        <Move size={12} color="#94a3b8" />
                                        <span style={{ fontSize: '12px', flex: 1, fontWeight: 500 }}>{item.type}: {item.label}</span>
                                        <button onClick={() => removeToolbarItem(item.id)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#f43f5e' }}><Trash2 size={12} /></button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    <footer className={styles.sidebarFooter}>
                        <button style={{ width: '100%', padding: '12px', background: '#18181b', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                            <Save size={16} /> Save Template
                        </button>
                    </footer>
                </aside>
            </div>
        </div>
    );
}
