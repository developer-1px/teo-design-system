import type React from "react";
import type {
  AlignToken,
  CursorToken,
  JustifyToken,
  ShadowToken,
  SurfaceToken,
} from "../lib/types.ts";
import type {
  HeightToken,
  MaxHeightToken,
  MaxWidthToken,
  OpacityToken,
  RadiusToken,
  SpaceToken,
  WidthToken,
} from "../token/token.const.1tier.ts";
import type { Radius2Token } from "../token/token.const.2tier.ts";

// --- 1. LOOSE OVERRIDES (Token | string | number) ---
// Used inside 'override={{ ... }}' prop
export interface FrameOverrides {
  // Layout
  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;
  pr?: SpaceToken;

  gap?: SpaceToken;
  pack?: boolean;

  w?: WidthToken;
  h?: HeightToken;

  row?: boolean; // Used internally by Layout presets
  wrap?: "wrap" | "nowrap" | "wrap-reverse";

  fill?: boolean;
  flex?: boolean | number | string;

  minWidth?: WidthToken | (string & {});
  minHeight?: HeightToken | (string & {});
  maxWidth?: MaxWidthToken | (string & {});
  maxHeight?: MaxHeightToken | (string & {});

  // border
  border?: boolean | string;
  borderTop?: boolean | string;
  borderRight?: boolean | string;
  borderBottom?: boolean | string;
  borderLeft?: boolean | string;
  borderColor?: string;

  // BorderRadius
  r?: RadiusToken;

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  align?: AlignToken;
  justify?: JustifyToken;

  // Surface
  surface?: SurfaceToken;
  rounded?: Radius2Token | boolean;
  // deprecated overflow removed
  clip?: boolean;

  cursor?: CursorToken;

  // Smart Layout
  scroll?: boolean | "x" | "y";
  shrink?: boolean | number;

  override?: FrameOverrides;

  // Visual
  shadow?: ShadowToken;
  opacity?: OpacityToken;
  ratio?: string;

  className?: string;
}

// --- 2. STRICT PROPS (Token Only) ---
// Used as top-level props on <Frame ... />
interface FrameStrictProps {
  // Layout
  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;
  pr?: SpaceToken;

  gap?: SpaceToken;
  pack?: boolean;

  w?: WidthToken;
  h?: HeightToken;

  row?: boolean;
  wrap?: "wrap" | "nowrap" | "wrap-reverse";

  fill?: boolean;
  flex?: boolean | number | string;

  minWidth?: WidthToken | (string & {});
  minHeight?: HeightToken | (string & {});
  maxWidth?: MaxWidthToken | (string & {});
  maxHeight?: MaxHeightToken | (string & {});

  // border
  border?: boolean | string;
  borderTop?: boolean | string;
  borderRight?: boolean | string;
  borderBottom?: boolean | string;
  borderLeft?: boolean | string;
  borderColor?: string;

  // Grid
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  align?: AlignToken;
  justify?: JustifyToken;

  // Surface
  surface?: SurfaceToken;
  rounded?: Radius2Token | boolean;
  clip?: boolean;

  cursor?: CursorToken;

  // Smart Layout
  scroll?: boolean | "x" | "y";
  shrink?: boolean | number;

  // Visual
  shadow?: ShadowToken;
  opacity?: OpacityToken;
  ratio?: string;
}

export interface FrameProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title" | "color">,
    FrameStrictProps {
  children?: React.ReactNode;
  as?: React.ElementType;

  /**
   * High-level layout preset.
   */
  layout?: import("./Layout/Layout.ts").LayoutToken;

  /**
   * Ad-hoc overrides for specific instances.
   * Takes precedence over both 'layout' preset and top-level props.
   * Use this for loose values (numbers, raw strings).
   */
  override?: FrameOverrides;

  // Semantic
  title?: string;
}
