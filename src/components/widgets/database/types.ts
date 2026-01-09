/**
 * Database Types - Notion Database 스타일 타입 정의
 */

export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type ViewType = 'table' | 'board' | 'gallery' | 'list' | 'calendar' | 'timeline';

export interface PropertyConfig {
  key: string;
  name?: string; // 표시할 이름
  type?: 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multiSelect' | 'url' | 'email';
  visible?: boolean; // 표시 여부
  width?: number; // 컬럼 너비 (table용)
}

export interface FilterConfig {
  key: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
  value: JsonValue;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface GroupConfig {
  by: string; // 그룹핑할 키
  direction?: 'asc' | 'desc';
}

export interface ViewConfig {
  id: string;
  type: ViewType;
  name: string;
  icon?: string;
  properties?: PropertyConfig[];
  filter?: FilterConfig[];
  sort?: SortConfig[];
  group?: GroupConfig;
  // View별 설정
  cardSize?: 'sm' | 'md' | 'lg'; // Gallery용
  showImage?: boolean; // Gallery용
  imageKey?: string; // Gallery용
  dateKey?: string; // Calendar용
  startDateKey?: string; // Timeline용
  endDateKey?: string; // Timeline용
}

export interface DatabaseConfig {
  data: JsonArray;
  views: ViewConfig[];
  defaultView?: string;
  title?: string;
  description?: string;
}
