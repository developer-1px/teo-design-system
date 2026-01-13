import type React from "react";
import type {
    AlignToken,
    BorderToken,
    CursorToken,
    FrameSizeToken,
    JustifyToken,
    OverflowToken,
    RoundedToken,
    ShadowToken,
    SurfaceToken,
} from "./types";

export interface FrameProps
    extends Omit<React.HTMLAttributes<HTMLElement>, "style" | "title" | "color"> {
    children?: React.ReactNode;
    as?: React.ElementType;
    style?: React.CSSProperties;
    className?: React.HTMLAttributes<HTMLDivElement>["className"];
    onClick?: React.MouseEventHandler<HTMLElement>;

    // Layout
    p?: number | string; // Shorthand for padding
    gap?: number | string;
    pack?: boolean;

    w?: FrameSizeToken | string | number;
    h?: FrameSizeToken | string | number;

    flex?: boolean | number;
    row?: boolean;
    wrap?: "wrap" | "nowrap" | "wrap-reverse";
    fill?: boolean;

    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;

    // Grid
    grid?: boolean;
    columns?: string;
    rows?: string;
    areas?: string;

    align?: AlignToken;
    justify?: JustifyToken;

    // Surface
    surface?: SurfaceToken;
    border?: BorderToken;
    rounded?: RoundedToken;
    overflow?: OverflowToken;
    cursor?: CursorToken;

    // Visual
    shadow?: ShadowToken;
    opacity?: number;
    ratio?: string;
    borderColor?: "default" | "text-4" | "text-primary" | "transparent";

    // Positioning
    position?: "relative" | "absolute" | "fixed" | "sticky";
    top?: number | string;
    bottom?: number | string;
    left?: number | string;
    right?: number | string;
    zIndex?: number;

    // Semantic
    title?: string;
}
