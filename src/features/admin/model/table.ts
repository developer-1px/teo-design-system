export type ColumnType = 'Text' | 'Number' | 'Date' | 'Status' | 'Select';

export interface ColumnConfig {
    id: string;
    label: string;
    type: ColumnType;
    width: number;
    description?: string;
    options?: string[];
}

export interface TableState {
    tableName: string;
    columns: ColumnConfig[];
}
