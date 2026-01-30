import { useState, useEffect, useCallback } from 'react';
import { faker, fakerKO } from '@faker-js/faker';
import type { ColumnConfig } from '../model/table';

const STORAGE_KEY = 'antigravity_table_builder_state';

const DEFAULT_COLUMNS: ColumnConfig[] = [
    { id: 'id', label: 'ID', type: 'Text', width: 100 },
    { id: 'name', label: 'Name', type: 'Text', width: 200 },
    { id: 'amount', label: 'Amount', type: 'Number', width: 150 },
    { id: 'status', label: 'Status', type: 'Status', width: 120, options: ['Active', 'Pending', 'Closed'] },
    { id: 'createdAt', label: 'Created At', type: 'Date', width: 150 },
];

export const useTableBuilder = (locale: 'en' | 'ko' = 'ko') => {
    const f = locale === 'ko' ? fakerKO : faker;

    // 1. State
    const [tableName, setTableName] = useState('New Table');
    const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
    const [mockData, setMockData] = useState<any[]>([]);
    const [undoStack, setUndoStack] = useState<{ columns: ColumnConfig[] } | null>(null);
    const [showUndoToast, setShowUndoToast] = useState(false);

    // 2. Persistence (Load)
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.columns) setColumns(parsed.columns);
                if (parsed.tableName) setTableName(parsed.tableName);
            } catch (e) {
                console.error('Failed to load table state', e);
            }
        }
    }, []);

    // 3. Persistence (Save)
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ columns, tableName }));
    }, [columns, tableName]);

    // 4. Data Generation Logic
    const generateValue = useCallback((col: ColumnConfig) => {
        const label = col.label.toLowerCase();

        switch (col.type) {
            case 'Number':
                if (label.includes('price') || label.includes('amount') || label.includes('cost')) {
                    return parseFloat(f.commerce.price());
                }
                return f.number.int({ min: 1, max: 10000 });
            case 'Date':
                return f.date.recent().toISOString().split('T')[0];
            case 'Status':
                return f.helpers.arrayElement(col.options || ['Todo', 'Doing', 'Done']);
            case 'Select':
                return f.helpers.arrayElement(col.options || ['Option 1', 'Option 2']);
            case 'Text':
            default:
                if (label.includes('email')) return f.internet.email();
                if (label.includes('name')) return f.person.fullName();
                if (label.includes('id')) return `ID-${f.string.numeric(4)}`;
                return f.lorem.words(2);
        }
    }, [f]);

    const refreshData = useCallback((cols: ColumnConfig[]) => {
        const newData = Array.from({ length: 10 }).map(() => {
            const row: any = { id: crypto.randomUUID() };
            cols.forEach(col => {
                row[col.id] = generateValue(col);
            });
            return row;
        });
        setMockData(newData);
    }, [generateValue]);

    // Initial data load
    useEffect(() => {
        if (mockData.length === 0) {
            refreshData(columns);
        }
    }, [columns, refreshData, mockData.length]);

    // 5. Actions
    const addColumn = useCallback(() => {
        const newCol: ColumnConfig = {
            id: `col_${crypto.randomUUID().slice(0, 4)}`,
            label: 'New Column',
            type: 'Text',
            width: 150,
        };
        const nextCols = [...columns, newCol];
        setColumns(nextCols);
        refreshData(nextCols); // Full refresh to match new schema quality
    }, [columns, refreshData]);

    const updateColumn = useCallback((id: string, updates: Partial<ColumnConfig>) => {
        setColumns(prev => {
            const next = prev.map(c => c.id === id ? { ...c, ...updates } : c);
            // If type changed, we should ideally refresh data for that column
            // PRD Rule 6.2: Discard and regenerate
            if (updates.type) {
                refreshData(next);
            }
            return next;
        });
    }, [refreshData]);

    const deleteColumn = useCallback((id: string) => {
        setUndoStack({ columns: [...columns] });
        const nextCols = columns.filter(c => c.id !== id);
        setColumns(nextCols);
        setShowUndoToast(true);
        setTimeout(() => setShowUndoToast(false), 5000);
    }, [columns]);

    const undoDelete = useCallback(() => {
        if (undoStack) {
            setColumns(undoStack.columns);
            setUndoStack(null);
            setShowUndoToast(false);
        }
    }, [undoStack]);

    const reorderColumns = useCallback((activeId: string, overId: string) => {
        setColumns(prev => {
            const oldIndex = prev.findIndex(c => c.id === activeId);
            const newIndex = prev.findIndex(c => c.id === overId);
            if (oldIndex === -1 || newIndex === -1) return prev;

            const next = [...prev];
            const [moved] = next.splice(oldIndex, 1);
            next.splice(newIndex, 0, moved);
            return next;
        });
    }, []);

    return {
        tableName,
        setTableName,
        columns,
        mockData,
        addColumn,
        updateColumn,
        deleteColumn,
        undoDelete,
        showUndoToast,
        reorderColumns,
    };
};
