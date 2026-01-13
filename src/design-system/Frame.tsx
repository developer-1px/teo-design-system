import type React from "react";
import "./tokens.css";
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
import { toToken } from "./utils";

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

export function Frame({
	children,
	as: Component = "div",

	p,
	gap = 0,
	pack,
	w,
	h,

	flex,
	row,
	wrap,
	fill,
	grid,
	columns,
	rows,
	areas,

	minWidth,
	minHeight,
	maxWidth,
	maxHeight,

	align,
	justify,

	surface,
	border,
	rounded,
	overflow,
	cursor,

	shadow,
	opacity,
	ratio,
	borderColor,

	position,
	top,
	bottom,
	left,
	right,
	zIndex,

	title,
	className = "",
	style = {},
	...props
}: FrameProps) {
	// Border Logic
	const computedBorder: React.CSSProperties = {};
	const finalBorder = border ?? (surface === "selected" ? true : undefined);

	const colorStr = borderColor
		? borderColor === "default"
			? "var(--border-color)"
			: borderColor === "transparent"
				? "transparent"
				: `var(--${borderColor})`
		: "var(--border-color)";

	if (finalBorder === true) computedBorder.border = `var(--border-width) solid ${colorStr}`;
	else if (typeof finalBorder === "string") {
		const key =
			`border${finalBorder.charAt(0).toUpperCase() + finalBorder.slice(1)}` as keyof React.CSSProperties;
		// @ts-expect-error
		computedBorder[key] = `var(--border-width) solid ${colorStr}`;
	}

	// Rounded Logic
	const borderRadius = toToken(rounded, "radius");

	// Pack Logic
	const effectiveAlign = align ?? (pack ? "center" : undefined);
	const effectiveJustify = justify ?? (pack ? "center" : undefined);

	// Padding Logic
	const finalP = p !== undefined ? p : surface ? 2 : 0;
	const resolvedPadding = toToken(finalP, "space");

	const computedStyle: React.CSSProperties = {
		backgroundColor: surface ? `var(--surface-${surface})` : undefined,
		borderRadius,
		padding: resolvedPadding as any,
		gap: toToken(gap, "space") as any,

		display: grid ? "grid" : "flex",
		gridTemplateColumns: columns,
		gridTemplateRows: rows,
		gridTemplateAreas: areas,
		flexDirection: row ? "row" : "column",
		flexWrap: wrap,
		alignItems:
			effectiveAlign === "start"
				? "flex-start"
				: effectiveAlign === "end"
					? "flex-end"
					: effectiveAlign,
		justifyContent:
			effectiveJustify === "start"
				? "flex-start"
				: effectiveJustify === "end"
					? "flex-end"
					: effectiveJustify === "between"
						? "space-between"
						: effectiveJustify === "around"
							? "space-around"
							: effectiveJustify,

		width:
			ratio && h && !w
				? undefined
				: fill
					? "100%"
					: (toToken(w, "size") as any),
		height:
			ratio && w
				? undefined
				: fill
					? "100%"
					: (toToken(h, "size") as any),
		minWidth: toToken(minWidth, "size") as any,
		minHeight: toToken(minHeight, "size") as any,
		maxWidth: toToken(maxWidth, "size") as any,
		maxHeight: toToken(maxHeight, "size") as any,

		flex: fill
			? 1
			: flex === true
				? 1
				: typeof flex === "number"
					? flex
					: undefined,
		flexShrink:
			w !== undefined || h !== undefined || ratio !== undefined
				? 0
				: 1,
		flexGrow: fill || flex ? 1 : 0,

		overflow,
		cursor,
		...computedBorder,

		// Visual Props
		boxShadow: shadow ? `var(--shadow-${shadow})` : undefined,
		opacity,
		aspectRatio: ratio,

		// Positioning
		position,
		zIndex,
		top: typeof top === "number" ? `var(--space-${top})` : top,
		bottom: typeof bottom === "number" ? `var(--space-${bottom})` : bottom,
		left: typeof left === "number" ? `var(--space-${left})` : left,
		right: typeof right === "number" ? `var(--space-${right})` : right,

		color: surface === "primary" ? "var(--primary-fg)" : "inherit",

		...style,
	};

	return (
		<Component
			className={`frame ${className}`}
			style={computedStyle}
			onClick={props.onClick}
			title={title}
			{...props}
		>
			{children}
		</Component>
	);
}
