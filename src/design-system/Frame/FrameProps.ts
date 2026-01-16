import type React from "react";
import type {
  AlignToken,
  CursorToken,
  JustifyToken,
  SurfaceToken,
  ZIndexToken,
} from "../lib/types.ts";
import type {
  BorderWidthToken,
  HeightToken,
  MaxHeightToken,
  MaxWidthToken,
  OpacityToken,
  Radius2Token,
  RadiusToken,
  SpaceToken,
  WidthToken,
} from "../token";
import type { LayoutToken } from "./Layout/Layout.ts";

// --- 1. PRESET PROPS (2-Tier / Semantic) ---
// The primary interface for standard UI development.
// Designed around the "4 Pillars": Layout, Sizing, Appearance, Behavior.
interface FramePresetProps {
  // 1. Layout (Inner Flow)
  // How children are arranged
  layout?: LayoutToken;

  row?: boolean;
  wrap?: boolean;
  pack?: boolean;

  grid?: boolean;
  gap?: SpaceToken;

  // 2. Sizing (Outer Constraints)
  // How this frame sizes itself
  w?: WidthToken;
  h?: HeightToken;
  ratio?: string;

  maxWidth?: MaxWidthToken;

  fill?: boolean;
  flex?: boolean | number | string;

  // 3. Appearance (Visual Decoration)
  // Visual style without affecting layout flow
  surface?: SurfaceToken;
  rounded?: Radius2Token | boolean;
  interactive?: boolean | "button" | "text";

  // 4. Decoration (Visual)
  opacity?: OpacityToken;
  clip?: boolean;
  scroll?: boolean | "x" | "y";
}

// --- 2. OVERRIDES (Strict 1-Tier Tokens) ---
// Used inside 'override={{ ... }}' prop
// Use this when you need specific Tokens not exposed by top-level props
export interface FrameOverrides {
  // Layout
  w?: WidthToken;
  h?: HeightToken;

  minWidth?: WidthToken;
  minHeight?: HeightToken;
  maxWidth?: MaxWidthToken;
  maxHeight?: MaxHeightToken;

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  // Flex
  row?: boolean; // Used internally by Layout presets
  wrap?: boolean | "wrap" | "nowrap" | "wrap-reverse";

  fill?: boolean;
  flex?: boolean | number | string;
  align?: AlignToken;
  justify?: JustifyToken;
  pack?: boolean | "start" | "center" | "end" | "space";

  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;
  pr?: SpaceToken;

  gap?: SpaceToken;

  // border (override: individual sides)
  border?: boolean;
  borderTop?: boolean;
  borderRight?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderWidth?: BorderWidthToken;

  // BorderRadius
  r?: RadiusToken | Radius2Token;

  // Surface
  clip?: boolean;

  cursor?: CursorToken;

  // Smart Layout
  scroll?: boolean | "x" | "y";

  override?: FrameOverrides;

  // Visual
  opacity?: OpacityToken;
  ratio?: string;

  zIndex?: ZIndexToken;
  className?: string;
}

export interface FrameProps
  extends Omit<
      React.HTMLAttributes<HTMLElement>,
      "title" | "color" | "style" | "className"
    >,
    FramePresetProps {
  as?: React.ElementType;

  /**
   * Ad-hoc overrides using specific 1-Tier Tokens.
   * Takes precedence over both 'layout' preset and top-level props.
   * Must use Tokens (e.g. Size.n10). For arbitrary values, use 'style'.
   */
  override?: FrameOverrides;

  // Semantic
  title?: string;

  /**
   * Safe Style Prop (Restricted)
   * Prevents usage of restricted CSS properties like margin, padding, width, height, etc.
   */
  style?: React.CSSProperties;

  children?: React.ReactNode;
}
