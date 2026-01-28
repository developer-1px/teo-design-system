import { useState } from 'react';
import * as styles from './FlowPage2.css';
import {
    Play, Database, Settings2,
    Type, Calendar, Layers, ChevronLeft, ChevronRight, DollarSign,
    Eye, EyeOff, GripVertical, Image as ImageIcon, BarChart
} from 'lucide-react';

import { faker } from '@faker-js/faker';

// DnD Kit Imports
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- MOCK DATA GENERATION (COMPLEX) ---
const generateData = () => {
    return Array.from({ length: 5 }).map((_, i) => ({
        id: 100 + i,
        // Product is a composite object in reality, or flattened
        product_name: faker.commerce.productName(),
        image_url: faker.image.urlPicsumPhotos({ width: 64, height: 64 }),
        sku: faker.string.alphanumeric(6).toUpperCase(),

        category: faker.commerce.department(),

        price: parseFloat(faker.commerce.price({ min: 10, max: 200 })),

        // Stock information usually comes nested or separate
        stock_level: faker.number.int({ min: 0, max: 100 }),
        stock_status: faker.helpers.arrayElement(['In Stock', 'Low Stock', 'Out of Stock']),

        status: faker.helpers.arrayElement(['Active', 'Draft', 'Archived']),
        last_updated: faker.date.recent().toISOString().split('T')[0],
    }));
};

const RESPONSE_LIST = {
    data: generateData(),
    meta: { page: 1, total: 145 }
};

// --- SCHEMA CONFIGURATION (RICH TYPES) ---
const INITIAL_SCHEMA_CONFIG = [
    // Composite Column: Combines Image + Name + SKU
    { key: 'product_profile', ui: 'Product Profile', icon: ImageIcon, visible: true, sourceKeys: ['image_url', 'product_name', 'sku'] },

    { key: 'category', ui: 'Text Cell', icon: Type, visible: true },

    // Status Badge
    { key: 'status', ui: 'Badge Cell', icon: Layers, visible: true },

    // Numeric + Visual
    { key: 'stock_level', ui: 'Stock Level', icon: BarChart, visible: true },

    { key: 'price', ui: 'Currency Cell', icon: DollarSign, visible: true },
    { key: 'last_updated', ui: 'Date Cell', icon: Calendar, visible: false },
];

/**
 * SortableItem Component
 */
function SortableItem(props: {
    item: any;
    toggleVisibility: (key: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: props.item.key });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 999 : 'auto',
        position: 'relative' as const,
        opacity: props.item.visible ? 1 : 0.6
    };

    const { item, toggleVisibility } = props;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className={styles.logicCard}
        >
            {/* LEFT GROUP: Grip + Icon + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                    {...listeners}
                    style={{ color: '#d4d4d8', cursor: 'grab', display: 'flex', alignItems: 'center' }}
                >
                    <GripVertical size={12} />
                </div>
                <item.icon size={14} color={item.visible ? "#52525b" : "#a1a1aa"} />
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#3f3f46' }}>
                    {item.key === 'product_profile' ? 'Product Info' : item.key}
                </span>
            </div>

            {/* RIGHT GROUP: Select + Eye */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <select
                    className={styles.compactSelect}
                    defaultValue={item.ui}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                >
                    <option>Product Profile</option>
                    <option>Stock Level</option>
                    <option>Badge Cell</option>
                    <option>Text Cell</option>
                    <option>Currency Cell</option>
                    <option>Date Cell</option>
                </select>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(item.key);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        padding: 4,
                        display: 'flex',
                        color: item.visible ? '#3b82f6' : '#a1a1aa'
                    }}
                >
                    {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
            </div>
        </div>
    );
}

export default function FlowPage2() {
    const [data, setData] = useState(RESPONSE_LIST);
    const [schema, setSchema] = useState(INITIAL_SCHEMA_CONFIG);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            setSchema((items) => {
                const oldIndex = items.findIndex((i) => i.key === active.id);
                const newIndex = items.findIndex((i) => i.key === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const toggleVisibility = (key: string) => {
        setSchema(prev => prev.map(item =>
            item.key === key ? { ...item, visible: !item.visible } : item
        ));
    };

    const handleRun = () => {
        setData({ ...RESPONSE_LIST, data: generateData() });
    };

    // Calculate Grid Template
    const visibleCols = schema.filter(i => i.visible);
    const gridTemplate = visibleCols.map(c => {
        if (c.ui === 'Product Profile') return 'minmax(240px, 3fr)'; // Wide column for profile
        if (c.ui === 'Stock Level') return 'minmax(140px, 1.5fr)';
        return 'minmax(100px, 1fr)';
    }).join(' ');


    return (
        <div className={styles.container}>
            {/* Headers */}
            <header className={styles.topBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className={styles.methodBadge} style={{ background: '#0ea5e9' }}>GET</div>
                    <span className={styles.urlText}>api.store.com/v2/products</span>
                </div>
                <button className={styles.playButton} onClick={handleRun}>
                    <Play size={14} fill="currentColor" />
                    Run
                </button>
            </header>

            <div className={styles.flowContainerScrollable}>

                {/* 1. Source */}
                <div className={styles.sourceColFixed}>
                    <div className={styles.colHeader}>
                        <span>1. Raw Response</span>
                        <Database size={14} />
                    </div>
                    <div className={styles.scrollArea}>
                        <div className={styles.arrayBlock}>
                            <div className={styles.arrayHeader}>meta</div>
                            <div className={styles.jsonNode}><span className={styles.jsonKey}>total</span>: 145</div>
                        </div>

                        <div className={styles.arrayBlock} style={{ borderColor: '#3b82f6' }}>
                            <div className={styles.arrayHeader} style={{ background: '#eff6ff', color: '#1e40af' }}>
                                data [Array(5)]
                            </div>
                            {/* Show raw keys including the ones that get combined */}
                            {Object.entries(RESPONSE_LIST.data[0]).slice(0, 7).map(([k, v]) => (
                                <div key={k} className={styles.jsonNode}>
                                    <span className={styles.jsonKey}>{k}</span>
                                    <span style={{ color: '#ccc' }}>:</span>
                                    <span className={styles.jsonVal}>
                                        {typeof v === 'string' && v.startsWith('http') ? '"https://..."' : String(v)}
                                    </span>
                                </div>
                            ))}
                            <div style={{ padding: '4px 20px', fontSize: '11px', color: '#999' }}>...</div>
                        </div>
                    </div>
                </div>

                {/* 2. Logic */}
                <div className={styles.logicColFixed}>
                    <div className={styles.colHeader}>
                        <span>2. Columns Map</span>
                        <Settings2 size={14} />
                    </div>
                    <div className={styles.scrollArea} style={{ background: '#fafafa' }}>
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={schema.map(i => i.key)} strategy={verticalListSortingStrategy}>
                                {schema.map((item) => (
                                    <SortableItem key={item.key} item={item} toggleVisibility={toggleVisibility} />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {/* Static Pagination Logic */}
                        <div className={styles.logicCard} style={{ borderStyle: 'dashed', background: 'transparent', cursor: 'default' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Layers size={14} color="#a1a1aa" />
                                <span style={{ fontSize: '13px', color: '#71717a' }}>Pagination Logic</span>
                            </div>
                            <span style={{ fontSize: '11px', color: '#a1a1aa' }}>meta.page → UI</span>
                        </div>
                    </div>
                </div>

                {/* 3. Preview */}
                <div className={styles.previewColFluid}>
                    <div className={styles.colHeader}>
                        <span>3. Live Preview</span>
                    </div>
                    <div className={styles.previewStage} style={{ display: 'block', padding: 40 }}>
                        <div style={{
                            background: '#fff',
                            border: '1px solid #e4e4e7',
                            borderRadius: 8,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                            overflow: 'hidden'
                        }}>
                            <div className={styles.previewHeader}>
                                <span style={{ fontWeight: 600 }}>Products Inventory</span>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button style={{ fontSize: '11px', padding: '4px 8px', border: '1px solid #e4e4e7', borderRadius: 4 }}>Filter</button>
                                    <button style={{ fontSize: '11px', padding: '4px 8px', background: '#18181b', color: 'white', border: 'none', borderRadius: 4 }}>+ Item</button>
                                </div>
                            </div>

                            <div className={styles.tableContainer}>
                                {/* Header */}
                                <div className={styles.tableRow} style={{ gridTemplateColumns: gridTemplate, background: '#fafafa', borderBottom: '1px solid #e4e4e7' }}>
                                    {visibleCols.map(col => (
                                        <div key={col.key} className={styles.cell} style={{ fontWeight: 600, fontSize: '11px', color: '#71717a' }}>
                                            {col.key === 'product_profile' ? 'PRODUCT NAME' : col.key.toUpperCase().replace('_', ' ')}
                                        </div>
                                    ))}
                                </div>

                                {/* Body */}
                                <div>
                                    {data.data.map((row) => (
                                        <div key={row.id} className={styles.tableRow} style={{ gridTemplateColumns: gridTemplate, height: 'auto', padding: '8px 16px' }}>
                                            {visibleCols.map(col => {
                                                const val = (row as any)[col.key];

                                                // RENDERER SWITCH
                                                if (col.ui === 'Product Profile') {
                                                    return (
                                                        <div key={col.key} className={styles.productCell}>
                                                            <img src={row.image_url} className={styles.thumb} alt="" />
                                                            <div className={styles.textStack}>
                                                                <span style={{ fontWeight: 500, color: '#18181b' }}>{row.product_name}</span>
                                                                <span className={styles.subtitle}>{row.sku}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                if (col.ui === 'Stock Level') {
                                                    const stock = row.stock_level;
                                                    const color = stock < 20 ? '#ef4444' : stock < 50 ? '#f59e0b' : '#3b82f6';
                                                    return (
                                                        <div key={col.key} style={{ width: '100%', paddingRight: 20 }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                                                <span>{stock} units</span>
                                                                <span style={{ color }}>{row.stock_status}</span>
                                                            </div>
                                                            <div className={styles.stockBarBg}>
                                                                <div className={styles.stockBarFill} style={{ width: `${stock}%`, background: color }} />
                                                            </div>
                                                        </div>
                                                    );
                                                }

                                                if (col.ui === 'Badge Cell') {
                                                    const status = row.status;
                                                    const bg = status === 'Active' ? '#dcfce7' : status === 'Draft' ? '#f3f4f6' : '#fee2e2';
                                                    const txt = status === 'Active' ? '#166534' : status === 'Draft' ? '#4b5563' : '#991b1b';
                                                    return (
                                                        <div key={col.key} style={{ display: 'flex' }}>
                                                            <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 12, fontWeight: 600, background: bg, color: txt }}>
                                                                {status}
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                if (col.ui === 'Currency Cell') {
                                                    return <div key={col.key} className={styles.cell}>${val.toFixed(2)}</div>;
                                                }

                                                return <div key={col.key} className={styles.cell}>{val}</div>;
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pagination Footer */}
                            <div className={styles.paginationBar}>
                                <div style={{ fontSize: '11px', color: '#71717a' }}>Showing 1-5 of 145</div>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    <button className={styles.pageBtn} disabled><ChevronLeft size={12} /></button>
                                    <button className={styles.pageBtn} style={{ background: '#f4f4f5', fontWeight: 600 }}>1</button>
                                    <button className={styles.pageBtn}>2</button>
                                    <button className={styles.pageBtn}>...</button>
                                    <button className={styles.pageBtn}>29</button>
                                    <button className={styles.pageBtn}><ChevronRight size={12} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
