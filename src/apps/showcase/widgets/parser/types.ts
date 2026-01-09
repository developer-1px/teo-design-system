/**
 * Showcase Parser Types
 *
 * TypeScript AST 파싱으로 추출한 컴포넌트 메타데이터
 */

/**
 * Prop 타입 정의
 */
export type PropType =
  | { kind: 'string' }
  | { kind: 'number' }
  | { kind: 'boolean' }
  | { kind: 'enum'; values: string[] }
  | { kind: 'union'; types: PropType[] }
  | { kind: 'ReactNode' }
  | { kind: 'function' }
  | { kind: 'object'; properties?: Record<string, PropType> }
  | { kind: 'array'; itemType?: PropType }
  | { kind: 'unknown' };

/**
 * 단일 Prop 정보
 */
export interface PropInfo {
  name: string;
  type: PropType;
  required: boolean;
  defaultValue?: any;
  description?: string; // JSDoc에서 추출
}

/**
 * 컴포넌트 메타데이터
 */
export interface ComponentMetadata {
  // 기본 정보
  name: string;
  filePath: string;
  sourceCode: string;

  // 문서
  description?: string; // JSDoc → Markdown
  examples?: string[]; // @example 태그에서 추출

  // Props
  props: Record<string, PropInfo>;

  // Dependencies
  imports: ImportInfo[];
  externalDeps: string[]; // 외부 라이브러리 (mock 필요)

  // Export 정보
  isDefaultExport: boolean;
  exportedNames: string[]; // export const, export function 등
}

/**
 * Import 정보
 */
export interface ImportInfo {
  source: string; // from '...'
  imports: {
    name: string;
    alias?: string;
    isDefault: boolean;
    isNamespace: boolean; // import * as X
  }[];
}

/**
 * 파일 트리 노드
 */
export interface FileTreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileTreeNode[];
  metadata?: ComponentMetadata;
  componentModule?: () => Promise<any>; // Vite glob loader
}

/**
 * Props 값 (런타임)
 */
export type PropValue = any;

/**
 * Mock 데이터
 */
export interface MockData {
  [importName: string]: any;
}
