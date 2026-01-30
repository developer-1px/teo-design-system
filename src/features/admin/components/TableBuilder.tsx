import { useState } from 'react';
import {
    Plus,
    MoreHorizontal,
    Type,
    Hash,
    Calendar,
    Tag,
    Settings2,
    Trash2,
    Undo2,
    CheckCircle2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useTableBuilder } from '../hooks/useTableBuilder';
import * as styles from './TableBuilder.css';
import type { ColumnConfig, ColumnType } from '../model/table';

// --- Sortable Header Item ---
interface SortableHeaderProps {
    column: ColumnConfig;
    isSelected: boolean;
    onSelect: () => void;
    onUpdate: (updates: Partial<ColumnConfig>) => void;
    onDelete: () => void;
}

const SortableHeader = ({ column, isSelected, onSelect, onUpdate, onDelete }: SortableHeaderProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: column.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: column.width,
        zIndex: isDragging ? 10 : 1,
    };

    const TypeIcon =
        column.type === 'Number' ? Hash :
            column.type === 'Date' ? Calendar :
                column.type === 'Status' ? Tag :
                    column.type === 'Select' ? Settings2 : Type;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`${styles.headerCell} ${isDragging ? styles.ghost : ''}`}
            onClick={onSelect}
        >
            <div className={styles.shyIcon} {...attributes} {...listeners}>
                <TypeIcon size={14} />
            </div>
            <span>{column.label}</span>
            <button className={styles.moreBtn} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
                <MoreHorizontal size={14} />
            </button>
            <div className={styles.resizeHandle} />

            {/* Simple Context Menu (Inlined for logic simplicity in MVP) */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            background: 'white',
                            border: '1px solid #e4e4e7',
                            borderRadius: '8px',
                            padding: '8px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                            zIndex: 100,
                            minWidth: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            value={column.label}
                            onChange={(e) => onUpdate({ label: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '4px 8px',
                                marginBottom: '8px',
                                border: '1px solid #e4e4e7',
                                borderRadius: '4px',
                                fontSize: '13px'
                            }}
                            autoFocus
                        />
                        {(['Text', 'Number', 'Date', 'Status'] as ColumnType[]).map(t => (
                            <button
                                key={t}
                                onClick={() => onUpdate({ type: t })}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '6px 8px',
                                    background: column.type === t ? '#eff6ff' : 'transparent',
                                    color: column.type === t ? '#3b82f6' : '#52525b',
                                    border: 'none',
                                    borderRadius: '4px',
                                    textAlign: 'left',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                {t}
                            </button>
                        ))}
                        <hr style={{ border: 'none', borderTop: '1px solid #f4f4f5', margin: '4px 0' }} />
                        <button
                            onClick={onDelete}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 8px',
                                color: '#ef4444',
                                background: 'transparent',
                                border: 'none',
                                textAlign: 'left',
                                fontSize: '12px',
                                cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={14} /> Delete Column
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main Component ---
export default function TableBuilder() {
    const {
        tableName,
        setTableName,
        columns,
        mockData,
        addColumn,
        updateColumn,
        deleteColumn,
        undoDelete,
        showUndoToast,
        reorderColumns
    } = useTableBuilder();

    const [selectedId, setSelectedId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            reorderColumns(active.id, over.id);
        }
    };

    return (
        <div className={styles.container} onClick={() => setSelectedId(null)}>
            <div className={styles.canvas}>
                {/* Table Header / Name */}
                <div style={{ marginBottom: '32px', width: '100%', maxWidth: '1200px' }}>
                    <input
                        className={styles.addBtn} // Reusing styles for now
                        style={{
                            fontSize: '24px',
                            fontWeight: 800,
                            color: '#18181b',
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            padding: 0,
                            cursor: 'text'
                        }}
                        value={tableName}
                        onChange={(e) => setTableName(e.target.value)}
                    />
                    <p style={{ fontSize: '13px', color: '#71717a', marginTop: '4px' }}>
                        Schema Designer • {columns.length} Fields
                    </p>
                </div>

                <div className={styles.tableWrapper}>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <div className={styles.gridTable} style={{ gridTemplateColumns: `48px ${columns.map(c => `${c.width}px`).join(' ')} 48px` }}>
                            {/* Static Checkbox Header */}
                            <div className={styles.headerCell} style={{ justifyContent: 'center', width: 48 }}>
                                <CheckCircle2 size={14} color="#cbd5e1" />
                            </div>

                            {/* Sortable Column Headers */}
                            <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
                                {columns.map(col => (
                                    <SortableHeader
                                        key={col.id}
                                        column={col}
                                        isSelected={selectedId === col.id}
                                        onSelect={() => setSelectedId(col.id)}
                                        onUpdate={(updates) => updateColumn(col.id, updates)}
                                        onDelete={() => deleteColumn(col.id)}
                                    />
                                ))}
                            </SortableContext>

                            {/* Add Column Button */}
                            <button className={styles.addBtn} onClick={(e) => { e.stopPropagation(); addColumn(); }}>
                                <Plus size={18} />
                            </button>

                            {/* Data Rows */}
                            {mockData.map((row) => (
                                <div key={row.id} style={{ display: 'contents' }}>
                                    <div className={styles.cell} style={{ justifyContent: 'center' }}>
                                        <div style={{ width: 14, height: 14, borderRadius: 4, border: '1px solid #e4e4e7' }} />
                                    </div>
                                    {columns.map(col => (
                                        <div
                                            key={col.id}
                                            className={styles.cell}
                                            style={{
                                                width: col.width,
                                                justifyContent: col.type === 'Number' ? 'flex-end' : 'flex-start'
                                            }}
                                        >
                                            {col.type === 'Status' ? (
                                                <div className={styles.badge} style={{
                                                    background: '#f4f4f5',
                                                    color: '#52525b'
                                                }}>
                                                    {row[col.id]}
                                                </div>
                                            ) : (
                                                <span style={{
                                                    fontFamily: col.type === 'Number' ? 'monospace' : 'inherit',
                                                    color: col.type === 'Date' ? '#71717a' : '#18181b'
                                                }}>
                                                    {row[col.id]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                    <div className={styles.cell} /> {/* Spacer for Add button column */}
                                </div>
                            ))}
                        </div>
                    </DndContext>
                </div>
            </div>

            {/* Undo Toast */}
            <AnimatePresence>
                {showUndoToast && (
                    <motion.div
                        className={styles.undoToast}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                    >
                        <Trash2 size={16} />
                        <span>Column removed</span>
                        <button className={styles.undoBtn} onClick={undoDelete}>
                            <Undo2 size={14} style={{ marginRight: 6 }} /> Undo
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
