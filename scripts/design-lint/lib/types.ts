/**
 * Type definitions for design-lint
 */

// Re-export ts-morph types for convenience
export type {
  JsxAttribute,
  JsxOpeningElement,
  JsxSelfClosingElement,
  Project,
  SourceFile,
} from "ts-morph";
export { Node, SyntaxKind } from "ts-morph";

/**
 * Lint issue found in code
 */
export interface Issue {
  file: string;
  line: number;
  column: number;
  rule: string;
  message: string;
  severity: "error" | "warn"; // default "error"
  code?: string;
  fixable?: boolean;
  redundantKeys?: string[]; // For redundant override fix
}

/**
 * Frame component props extracted from JSX
 */
export interface FrameProps {
  surface?: string;
  border?: boolean | string;
  rounded?: string | boolean;
  layout?: string;
  p?: string | number;
  px?: string | number;
  py?: string | number;
  pt?: string | number;
  pb?: string | number;
  pl?: string | number;
  pr?: string | number;
  [key: string]: any;
}

/**
 * Computed CSS properties for Frame component
 * Result of executing runtime logic
 */
export interface ComputedCSS {
  hasBackground: boolean;
  hasPadding: boolean;
  hasBorder: boolean;
  hasRadius: boolean;
  isFloating: boolean;
  rawCSS: any;
}

/**
 * Token conversion result
 */
export interface TokenConversion {
  cssProp: string;
  cssValue: string;
  overrideProp: string;
  tokenValue: string;
}

/**
 * Border style fix result
 */
export interface BorderFixResult {
  fixable: boolean;
  borderType:
  | "border"
  | "borderTop"
  | "borderBottom"
  | "borderLeft"
  | "borderRight"
  | null;
}

/**
 * Style tokenization result
 */
export interface TokenizationResult {
  fixable: boolean;
  conversions: TokenConversion[];
}
