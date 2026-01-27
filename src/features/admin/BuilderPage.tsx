import React, { useState } from 'react';
import {
    Layout, Type, Table as TableIcon,
    Settings, Play, Share2,
    ChevronDown, Search, MousePointer2, Trash2
} from 'lucide-react';
import * as styles from './Builder.css';

// Types
interface WidgetData {
    id: string;
    type: 'Table' | 'Input' | 'Button' | 'Text' | 'Container';
    name: string;
    props: Record<string, any>;
}

const INITIAL_WIDGETS: WidgetData[] = [
    {
        id: 'w1', type: 'Table', name: 'table1',
        props: { label: 'Users Table', data: '{{ query1.data }}', showBorder: 'true' }
    },
    {
        id: 'w2', type: 'Input', name: 'textInput1',
        props: { placeholder: 'Search...', value: '' }
    },
    {
        id: 'w3', type: 'Button', name: 'button1',
        props: { text: 'Run Query', color: '#3b82f6' }
    }
];

export default function BuilderPage() {
    const [widgets, setWidgets] = useState<WidgetData[]>(INITIAL_WIDGETS);
    const [selectedId, setSelectedId] = useState<string | null>('w1');
    const [draggedType, setDraggedType] = useState<string | null>(null);

    const selectedWidget = widgets.find(w => w.id === selectedId);

    // Handlers
    const handleDragStart = (type: string) => {
        setDraggedType(type);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedType) return;

        const newId = `w${Date.now()}`;
        const newWidget: WidgetData = {
            id: newId,
            type: draggedType as any,
            name: `${draggedType.toLowerCase()}${widgets.length + 1}`,
            props: getDefaultProps(draggedType)
        };

        setWidgets([...widgets, newWidget]);
        setSelectedId(newId);
        setDraggedType(null);
    };

    const handlePropChange = (key: string, value: string) => {
        if (!selectedId) return;
        setWidgets(widgets.map(w =>
            w.id === selectedId
                ? { ...w, props: { ...w.props, [key]: value } }
                : w
        ));
    };

    const handleDelete = () => {
        if (!selectedId) return;
        setWidgets(widgets.filter(w => w.id !== selectedId));
        setSelectedId(null);
    }

    return (
        <div className={styles.container}>
            {/* 1. Header */}
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontWeight: 600 }}>Internal Tool v1</div>
                    <div style={{ fontSize: '12px', padding: '2px 8px', background: '#e0f2fe', color: '#0284c7', borderRadius: '4px' }}>
                        DEV
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Play size={16} /></button>
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><Share2 size={16} /></button>
                </div>
            </header>

            <div className={styles.workspace}>
                {/* 2. Left Panel: Component Library */}
                <aside className={styles.leftPanel}>
                    <div className={styles.panelHeader}>
                        <span>Components</span>
                        <Search size={14} />
                    </div>
                    <div className={styles.panelContent}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 600, color: '#888', marginBottom: '8px' }}>Common</div>
                            <DraggableItem type="Text" icon={Type} onDragStart={() => handleDragStart('Text')} />
                            <DraggableItem type="Table" icon={TableIcon} onDragStart={() => handleDragStart('Table')} />
                            <DraggableItem type="Container" icon={Layout} onDragStart={() => handleDragStart('Container')} />
                            <DraggableItem type="Button" icon={MousePointer2} onDragStart={() => handleDragStart('Button')} />
                            <DraggableItem type="Input" icon={Layout} onDragStart={() => handleDragStart('Input')} />
                        </div>
                    </div>
                </aside>

                {/* 3. Center: Canvas */}
                <div className={styles.centerPanel}>
                    <main
                        className={styles.canvas}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => setSelectedId(null)}
                    >
                        {/* Render Widgets at "virtual" relative layout for now (stack) */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', margin: '0 auto' }}>
                            {widgets.map(w => (
                                <CanvasWidget
                                    key={w.id}
                                    data={w}
                                    isSelected={selectedId === w.id}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedId(w.id);
                                    }}
                                />
                            ))}
                            {widgets.length === 0 && (
                                <div style={{ border: '2px dashed #ccc', borderRadius: 8, padding: 40, textAlign: 'center', color: '#999' }}>
                                    Drag components here
                                </div>
                            )}
                        </div>
                    </main>

                    {/* Bottom: Query Editor */}
                    <div className={styles.bottomPanel}>
                        <div className={styles.panelHeader}>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <span>Code</span>
                                <span style={{ borderBottom: '2px solid black' }}>State</span>
                                <span>Console</span>
                            </div>
                            <ChevronDown size={14} />
                        </div>
                        <div className={styles.panelContent}>
                            <div style={{ display: 'flex', gap: '16px', height: '100%' }}>
                                <div style={{ width: '200px', flexShrink: 0, borderRight: '1px solid #eee' }}>
                                    <div style={{ padding: '8px', fontWeight: 600, fontSize: '12px' }}>Resource</div>
                                    <div style={{ padding: '4px 8px', fontSize: '13px', background: '#f0f9ff', color: '#0284c7', borderRadius: 4 }}>postgres_prod</div>
                                </div>
                                <div style={{ flex: 1, fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }}>
                                    <span style={{ color: '#a855f7' }}>select</span> * <span style={{ color: '#a855f7' }}>from</span> users
                                    <br />
                                    <span style={{ color: '#a855f7' }}>where</span> active = <span style={{ color: '#22c55e' }}>true</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Right Panel: Inspector */}
                <aside className={styles.rightPanel}>
                    <div className={styles.panelHeader}>
                        <span>Inspector</span>
                        <Settings size={14} />
                    </div>

                    <div className={styles.panelContent}>
                        {selectedWidget ? (
                            <>
                                <div style={{ paddingBottom: '16px', borderBottom: '1px solid #eee', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{selectedWidget.name}</div>
                                        <div style={{ fontSize: '11px', color: '#666' }}>{selectedWidget.type} Component</div>
                                    </div>
                                    <button onClick={handleDelete} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <Section title="Properties">
                                    {Object.entries(selectedWidget.props).map(([key, value]) => (
                                        <Property
                                            key={key}
                                            label={key}
                                            value={value}
                                            onChange={(v) => handlePropChange(key, v)}
                                        />
                                    ))}
                                </Section>
                            </>
                        ) : (
                            <div style={{ color: '#999', fontSize: '13px', textAlign: 'center', marginTop: 40 }}>
                                Select a component to edit properties
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
}

// Sub-components

function DraggableItem({ type, icon: Icon, onDragStart }: { type: string, icon: any, onDragStart: () => void }) {
    return (
        <div draggable onDragStart={onDragStart} className={styles.componentItem}>
            <Icon size={14} style={{ opacity: 0.6 }} />
            <span>{type}</span>
        </div>
    );
}

function CanvasWidget({ data, isSelected, onClick }: { data: WidgetData, isSelected: boolean, onClick: (e: React.MouseEvent) => void }) {
    return (
        <div
            className={styles.canvasWidget}
            data-selected={isSelected}
            onClick={onClick}
        >
            <div className={styles.widgetHeader}>
                <span style={{ fontWeight: 600 }}>{data.name}</span>
                <span style={{ opacity: 0.5 }}>{data.type}</span>
            </div>

            <div style={{ pointerEvents: 'none' }}>
                <WidgetRenderer data={data} />
            </div>

            {isSelected && (
                <>
                    <div className={styles.resizeHandle} style={{ top: -4, left: -4, cursor: 'nw-resize' }} />
                    <div className={styles.resizeHandle} style={{ top: -4, right: -4, cursor: 'ne-resize' }} />
                    <div className={styles.resizeHandle} style={{ bottom: -4, left: -4, cursor: 'sw-resize' }} />
                    <div className={styles.resizeHandle} style={{ bottom: -4, right: -4, cursor: 'se-resize' }} />
                </>
            )}
        </div>
    );
}

function WidgetRenderer({ data }: { data: WidgetData }) {
    switch (data.type) {
        case 'Button':
            return (
                <button style={{
                    background: data.props.color || '#3b82f6',
                    color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', width: '100%'
                }}>
                    {data.props.text || 'Button'}
                </button>
            );
        case 'Input':
            return (
                <input
                    placeholder={data.props.placeholder}
                    defaultValue={data.props.value}
                    style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
            );
        case 'Table':
            return (
                <div style={{ border: '1px solid #eee', borderRadius: '4px', height: '120px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '12px' }}>
                    [ Table: {data.props.label} ]
                </div>
            );
        case 'Text':
            return <div>{data.props.text || 'Text Content'}</div>;
        default:
            return <div>Unknown Widget</div>
    }
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#888', marginBottom: '12px', textTransform: 'uppercase' }}>
                {title}
            </div>
            {children}
        </div>
    );
}

function Property({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
    return (
        <div className={styles.propertyRow}>
            <div className={styles.propertyLabel}>{label}</div>
            <input
                className={styles.propertyInput}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

function getDefaultProps(type: string) {
    switch (type) {
        case 'Button': return { text: 'New Button', color: '#3b82f6' };
        case 'Input': return { placeholder: 'Enter text...', value: '' };
        case 'Table': return { label: 'Data Table', data: '{{ query1.data }}' };
        case 'Text': return { text: 'Hello World' };
        default: return {};
    }
}
