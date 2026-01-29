import { useState, useMemo } from 'react';
import * as styles from './TableDesignerPage.css';
import { faker, fakerKO } from '@faker-js/faker';
import {
    Table as TableIcon,
    Settings2,
    Plus,
    Save,
    DownloadCloud,
    Search,
    Layout,
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
    CheckSquare,
    Type,
    Hash,
    Calendar,
    Tag,
    MoreHorizontal,
    User,
    Image as ImageIcon
} from 'lucide-react';
import { Tabs } from '../../components/ui/Tabs';

/**
 * 1. TYPES & DEFAULTS
 */
type UIType = 'Text' | 'Number' | 'Date' | 'Status' | 'Person' | 'Image';
type ToolbarItemType = 'Search' | 'Filter' | 'Action' | 'View';
type SelectionType = 'None' | 'Single' | 'Multiple';

interface ColumnConfig {
    id: string;
    label: string;
    uiType: UIType;
    width?: string;
    format?: string;
}

interface ToolbarConfig {
    id: string;
    type: ToolbarItemType;
    label: string;
}

const CORE_COLUMNS: ColumnConfig[] = [
    { id: 'image', label: 'Asset', uiType: 'Image', width: '80px' },
    { id: 'product', label: 'Product Name', uiType: 'Text', width: 'minmax(200px, 2fr)' },
    { id: 'assignee', label: 'Assignee', uiType: 'Person', width: 'minmax(150px, 1.2fr)' },
    { id: 'status', label: 'Fulfillment', uiType: 'Status', width: 'minmax(120px, 1fr)' },
    { id: 'date', label: 'Created At', uiType: 'Date', width: 'minmax(120px, 1fr)' },
    { id: 'amount', label: 'Total Amount', uiType: 'Number', format: 'currency', width: 'minmax(120px, 1fr)' },
];

const INITIAL_TOOLBAR: ToolbarConfig[] = [
    { id: 't1', type: 'Search', label: 'Search records...' },
    { id: 't2', type: 'Filter', label: 'Status' },
];

/**
 * 2. MOCK DATA
 */
const KO_PRODUCTS = ['Premium Wallet', 'NC Headset', 'Eco Kit', 'Curved Monitor', 'Jeju Tea', 'Smart Purifier', 'Keyboard'];
const STATUS_PRESETS = ['Ready', 'Shipped', 'Processing', 'Cancelled'];

const generateMockRows = (count: number, locale: 'en' | 'ko') => {
    const f = locale === 'ko' ? fakerKO : faker;
    return Array.from({ length: count }).map(() => {
        const personName = f.person.fullName();
        return {
            id: f.string.uuid(),
            sku: `#ORD-${f.string.numeric(4)}`,
            product: {
                title: locale === 'ko' ? f.helpers.arrayElement(KO_PRODUCTS) : f.commerce.productName(),
                subtitle: f.commerce.productAdjective() + ' series'
            },
            status: f.helpers.arrayElement(STATUS_PRESETS),
            date: f.date.recent({ days: 30 }).toISOString().split('T')[0],
            amount: parseFloat(f.commerce.price({ min: 100, max: 5000 })),
            assignee: {
                name: personName,
                email: f.internet.email({
                    firstName: personName.split(' ')[0],
                    lastName: personName.split(' ').slice(1).join(' '),
                    provider: 'teodesign.io'
                }).toLowerCase(),
                avatar: f.image.avatar(),
            },
            image: f.image.urlPicsumPhotos({ width: 240, height: 160 }),
        };
    });
};

/**
 * 3. MAIN PAGE
 */
export default function TableDesignerPage() {
    const [locale, setLocale] = useState<'en' | 'ko'>('ko');
    const [tableName, setTableName] = useState('Order Management');
    const [selectionType, setSelectionType] = useState<SelectionType>('Multiple');
    const [showPagination, setShowPagination] = useState(true);
    const [columns, setColumns] = useState<ColumnConfig[]>(CORE_COLUMNS);
    const [selectedColId, setSelectedColId] = useState<string | null>(null);
    const [toolbarItems, setToolbarItems] = useState<ToolbarConfig[]>(INITIAL_TOOLBAR);
    const [activeTab, setActiveTab] = useState<'General' | 'Columns' | 'Toolbar'>('General');

    const mockData = useMemo(() => generateMockRows(12, locale), [locale]);

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
                        <p style={{ fontSize: '11px', color: '#71717a' }}>Universal Admin Table Patterns</p>
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

                                const TypeIcon =
                                    col.uiType === 'Text' ? Type :
                                        col.uiType === 'Number' ? Hash :
                                            col.uiType === 'Date' ? Calendar :
                                                col.uiType === 'Status' ? Tag :
                                                    col.uiType === 'Person' ? User : ImageIcon;

                                return (
                                    <div key={col.id} className={headerClasses} onClick={() => setSelectedColId(col.id)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                                            <TypeIcon size={12} color={isSelected ? '#3b82f6' : '#a1a1aa'} />
                                            <span>{col.label}</span>
                                        </div>
                                        <div className={styles.shyTrigger} style={{ opacity: isSelected ? 1 : 0 }}>
                                            <MoreHorizontal size={14} />
                                        </div>
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
                                        // Dynamic Mock Mapping: Determine what data to show based on the UI Type
                                        let data = (row as any)[col.id];
                                        if (col.uiType === 'Person') data = row.assignee;
                                        if (col.uiType === 'Image') data = row.image;
                                        if (col.uiType === 'Date' && typeof data !== 'string') data = row.date;
                                        if (col.uiType === 'Number' && typeof data !== 'number') data = row.amount;
                                        if (col.uiType === 'Status' && typeof data !== 'string') data = row.status;
                                        if (col.uiType === 'Text' && typeof data === 'string') data = { title: data, subtitle: row.sku };

                                        const isSelected = selectedColId === col.id;
                                        const cellClasses = [styles.cell, isSelected ? styles.selectedCell : ''].join(' ');

                                        return (
                                            <div key={`${row.id}-${col.id}`} className={cellClasses} onClick={() => setSelectedColId(col.id)} style={{ justifyContent: col.uiType === 'Number' ? 'flex-end' : 'flex-start' }}>
                                                {col.uiType === 'Text' && (
                                                    <div className={styles.textStack}>
                                                        <span className={styles.primaryText}>
                                                            {typeof data === 'string' ? data : data?.title || data?.name || String(data)}
                                                        </span>
                                                        {(col.format === 'double' || !col.format) && (
                                                            <span className={styles.secondaryText}>
                                                                {data?.subtitle || data?.email || 'Secondary Label'}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {col.uiType === 'Number' && (
                                                    <span style={{ fontFamily: 'monospace', letterSpacing: '-0.02em', color: '#18181b', fontWeight: 600 }}>
                                                        {col.format === 'currency' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(data)) :
                                                            col.format === 'percent' ? `${(Number(data) / 5000 * 100).toFixed(1)}%` :
                                                                Number(data).toLocaleString()}
                                                    </span>
                                                )}

                                                {col.uiType === 'Date' && (
                                                    <span style={{ color: '#71717a', fontSize: '12px', fontWeight: 500 }}>
                                                        {col.format === 'relative' ? '2 days ago' :
                                                            col.format === 'datetime' ? `${String(data)} 14:30` :
                                                                String(data)}
                                                    </span>
                                                )}

                                                {col.uiType === 'Status' && (
                                                    <>
                                                        {col.format === 'indicator' ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                                <div style={{ width: 6, height: 6, borderRadius: '50%', background: data === 'Cancelled' ? '#ef4444' : '#10b981' }} />
                                                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#18181b' }}>{String(data)}</span>
                                                            </div>
                                                        ) : (
                                                            <div className={styles.badge} style={{
                                                                backgroundColor:
                                                                    data === 'Shipped' ? '#ecfdf5' :
                                                                        data === 'Cancelled' ? '#fef2f2' :
                                                                            data === 'Processing' ? '#eff6ff' : '#f4f4f5',
                                                                color:
                                                                    data === 'Shipped' ? '#059669' :
                                                                        data === 'Cancelled' ? '#dc2626' :
                                                                            data === 'Processing' ? '#2563eb' : '#52525b'
                                                            }}>
                                                                {String(data)}
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {col.uiType === 'Person' && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        {(col.format === 'avatar' || !col.format) && <img src={data.avatar} className={styles.avatar} alt="" />}
                                                        {col.format === 'initial' && (
                                                            <div className={styles.avatar} style={{ background: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800 }}>
                                                                {data.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <div className={styles.textStack}>
                                                            <span className={styles.primaryText} style={{ fontSize: '12px' }}>{data.name}</span>
                                                            <span className={styles.secondaryText}>{data.email}</span>
                                                        </div>
                                                    </div>
                                                )}

                                                {col.uiType === 'Image' && (
                                                    <div className={styles.assetThumb}>
                                                        <img src={data} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
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
                                <div>Showing 1 - 12 of 250 records</div>
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
                    <div style={{ marginBottom: 24 }}>
                        <Tabs
                            items={[
                                { id: 'General', label: 'General' },
                                { id: 'Columns', label: 'Columns' },
                                { id: 'Toolbar', label: 'Toolbar' }
                            ]}
                            value={activeTab}
                            onChange={(val) => setActiveTab(val as any)}
                            variant="segment"
                        />
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

                                    <div className={styles.sectionLabel}>Universal Type</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                                        {(['Text', 'Number', 'Date', 'Status', 'Person', 'Image'] as UIType[]).map(type => (
                                            <button key={type} onClick={() => updateCol(selectedColumn.id, { uiType: type, format: undefined })} className={styles.paletteItem} style={{
                                                flexDirection: 'column', padding: '8px 4px', fontSize: '10px',
                                                borderColor: selectedColumn.uiType === type ? '#3b82f6' : '#e4e4e7',
                                                background: selectedColumn.uiType === type ? '#3b82f608' : '#fff',
                                            }}>
                                                {type === 'Text' && <Type size={14} />}
                                                {type === 'Number' && <Hash size={14} />}
                                                {type === 'Date' && <Calendar size={14} />}
                                                {type === 'Status' && <Tag size={14} />}
                                                {type === 'Person' && <User size={14} />}
                                                {type === 'Image' && <ImageIcon size={14} />}
                                                <span style={{ marginTop: 4 }}>{type}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className={styles.sectionLabel}>Detailed Format</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                        {selectedColumn.uiType === 'Number' && (
                                            <>
                                                {['decimal', 'currency', 'percent'].map(f => (
                                                    <button key={f} onClick={() => updateCol(selectedColumn.id, { format: f })} className={styles.paletteItem} style={{
                                                        justifyContent: 'flex-start',
                                                        background: selectedColumn.format === f ? '#f8fafc' : '#fff',
                                                        borderColor: selectedColumn.format === f ? '#3b82f6' : '#e4e4e7'
                                                    }}>
                                                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1px solid ${selectedColumn.format === f ? '#3b82f6' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {selectedColumn.format === f && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />}
                                                        </div>
                                                        <span style={{ textTransform: 'capitalize' }}>{f}</span>
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                        {selectedColumn.uiType === 'Date' && (
                                            <>
                                                {['absolute', 'relative', 'datetime'].map(f => (
                                                    <button key={f} onClick={() => updateCol(selectedColumn.id, { format: f })} className={styles.paletteItem} style={{
                                                        justifyContent: 'flex-start',
                                                        background: selectedColumn.format === f ? '#f8fafc' : '#fff',
                                                        borderColor: selectedColumn.format === f ? '#3b82f6' : '#e4e4e7'
                                                    }}>
                                                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1px solid ${selectedColumn.format === f ? '#3b82f6' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {selectedColumn.format === f && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />}
                                                        </div>
                                                        <span style={{ textTransform: 'capitalize' }}>{f}</span>
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                        {selectedColumn.uiType === 'Text' && (
                                            <>
                                                {['single', 'double'].map(f => (
                                                    <button key={f} onClick={() => updateCol(selectedColumn.id, { format: f })} className={styles.paletteItem} style={{
                                                        justifyContent: 'flex-start',
                                                        background: selectedColumn.format === f || (!selectedColumn.format && f === 'double') ? '#f8fafc' : '#fff',
                                                        borderColor: selectedColumn.format === f || (!selectedColumn.format && f === 'double') ? '#3b82f6' : '#e4e4e7'
                                                    }}>
                                                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1px solid (selectedColumn.format === f || (!selectedColumn.format && f === 'double')) ? '#3b82f6' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {(selectedColumn.format === f || (!selectedColumn.format && f === 'double')) && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />}
                                                        </div>
                                                        <span style={{ textTransform: 'capitalize' }}>{f === 'double' ? 'Entity (Title + Sub)' : 'Plain Text'}</span>
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                        {selectedColumn.uiType === 'Status' && (
                                            <>
                                                {['badge', 'indicator'].map(f => (
                                                    <button key={f} onClick={() => updateCol(selectedColumn.id, { format: f })} className={styles.paletteItem} style={{
                                                        justifyContent: 'flex-start',
                                                        background: selectedColumn.format === f || (!selectedColumn.format && f === 'badge') ? '#f8fafc' : '#fff',
                                                        borderColor: selectedColumn.format === f || (!selectedColumn.format && f === 'badge') ? '#3b82f6' : '#e4e4e7'
                                                    }}>
                                                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1px solid (selectedColumn.format === f || (!selectedColumn.format && f === 'badge')) ? '#3b82f6' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {(selectedColumn.format === f || (!selectedColumn.format && f === 'badge')) && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />}
                                                        </div>
                                                        <span style={{ textTransform: 'capitalize' }}>{f}</span>
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                        {selectedColumn.uiType === 'Person' && (
                                            <>
                                                {['avatar', 'initial', 'text'].map(f => (
                                                    <button key={f} onClick={() => updateCol(selectedColumn.id, { format: f })} className={styles.paletteItem} style={{
                                                        justifyContent: 'flex-start',
                                                        background: selectedColumn.format === f || (!selectedColumn.format && f === 'avatar') ? '#f8fafc' : '#fff',
                                                        borderColor: selectedColumn.format === f || (!selectedColumn.format && f === 'avatar') ? '#3b82f6' : '#e4e4e7'
                                                    }}>
                                                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: `1px solid ${(selectedColumn.format === f || (!selectedColumn.format && f === 'avatar')) ? '#3b82f6' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            {(selectedColumn.format === f || (!selectedColumn.format && f === 'avatar')) && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />}
                                                        </div>
                                                        <span style={{ textTransform: 'capitalize' }}>
                                                            {f === 'avatar' ? 'Full (Avatar + Info)' : f === 'initial' ? 'Initial Circle' : 'Plain Meta (No Avatar)'}
                                                        </span>
                                                    </button>
                                                ))}
                                            </>
                                        )}
                                        {/* Fallback for others */}
                                        {(!['Number', 'Date', 'Text', 'Status', 'Person'].includes(selectedColumn.uiType)) && (
                                            <p style={{ fontSize: '11px', color: '#a1a1aa', textAlign: 'center', padding: '12px 0' }}>No specific formats available for this type</p>
                                        )}
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
