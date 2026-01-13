import type React from "react";
import "./lib/tokens.css";
import type { AlignToken, JustifyToken } from "./lib/types.ts";
import { toToken } from "./lib/utils.ts";

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  as?: React.ElementType;

  // Layout
  direction?: "row" | "column" | "horizontal" | "vertical";
  gap?: number | string;
  wrap?: boolean | "wrap" | "nowrap" | "wrap-reverse";

  align?: AlignToken;
  justify?: JustifyToken;

  fill?: boolean; // flex: 1
  grow?: boolean | number;
  shrink?: boolean | number;

  // Dimensions
  w?: string | number;
  h?: string | number;
  minW?: string | number;
  minH?: string | number;
  maxW?: string | number;
  maxH?: string | number;

  // Grid support
  grid?: boolean;
  columns?: string;
  rows?: string;
  areas?: string;

  // Padding
  p?: number | string;
}

export function Stack({
  children,
  as: Component = "div",
  direction = "column",
  gap = 0,
  wrap,
  align,
  justify,
  fill,
  grow,
  shrink,
  w,
  h,
  minW,
  minH,
  maxW,
  maxH,
  grid,
  columns,
  rows,
  areas,
  p,
  style,
  className = "",
  ...props
}: StackProps) {
  // Normalize direction
  const isRow = direction === "row" || direction === "horizontal";
  const flexDir = isRow ? "row" : "column";

  // Normalize align/justify
  const mapAlign = (v: string | undefined) => {
    if (v === "start") return "flex-start";
    if (v === "end") return "flex-end";
    return v;
  };

  const mapJustify = (v: string | undefined) => {
    if (v === "start") return "flex-start";
    if (v === "end") return "flex-end";
    if (v === "between") return "space-between";
    if (v === "around") return "space-around";
    if (v === "evenly") return "space-evenly";
    return v;
  };

  const computedStyle: React.CSSProperties = {
    display: grid ? "grid" : "flex",
    flexDirection: grid ? undefined : flexDir,
    gap: toToken(gap, "space") as any,
    flexWrap: wrap === true ? "wrap" : (wrap as any),

    padding: toToken(p, "space") as any,

    alignItems: mapAlign(align),
    justifyContent: mapJustify(justify),

    gridTemplateColumns: columns,
    gridTemplateRows: rows,
    gridTemplateAreas: areas,

    // Sizing
    width: w ? (toToken(w, "size") as any) : fill ? "100%" : undefined,
    height: h ? (toToken(h, "size") as any) : fill ? "100%" : undefined,
    minWidth: minW ? (toToken(minW, "size") as any) : undefined,
    minHeight: minH ? (toToken(minH, "size") as any) : undefined,
    maxWidth: maxW ? (toToken(maxW, "size") as any) : undefined,
    maxHeight: maxH ? (toToken(maxH, "size") as any) : undefined,

    // Flex Items
    flex: fill ? 1 : undefined,
    flexGrow: grow === true ? 1 : typeof grow === "number" ? grow : undefined,
    flexShrink:
      shrink === true ? 1 : typeof shrink === "number" ? shrink : undefined,

    ...style,
  };

  return (
    <Component
      className={`stack ${className}`}
      style={computedStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
