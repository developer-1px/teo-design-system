// Dataset types
export interface DatasetMeta {
  name: string;
  label: string;
  icon: string;
  path: string;
}

// Generic data row type for dynamic tables
export type DataRow = Record<string, unknown>;
