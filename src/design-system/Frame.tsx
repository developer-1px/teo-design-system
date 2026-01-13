import type React from "react";
import "./tokens.css";
import type {
	AlignToken,
	BorderToken,
	CursorToken,
	FrameSizeToken,
	JustifyToken,
	OverflowToken,
	RadiusToken,
	ShadowToken,
	SurfaceToken,
} from "./types";

interface FrameProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "style" | "title" | "color"> {
	children?: React.ReactNode;
	as?: React.ElementType;
	style?: React.CSSProperties;
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
	onClick?: () => void;

	// Layout
	p?: number | string; // Shorthand for padding
	gap?: number | string;
	pack?: boolean;

	width?: FrameSizeToken | string | number;
	height?: FrameSizeToken | string | number;

	flex?: boolean | number;
	row?: boolean;
	fill?: boolean;

	align?: AlignToken;
	justify?: JustifyToken;

	// Surface
	surface?: SurfaceToken;
	border?: BorderToken;
	radius?: RadiusToken;
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
	width,
	height,

	flex,
	row,
	fill,
	align,
	justify,

	surface,
	border,
	radius,
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
			: `var(--${borderColor})`
		: "var(--border-color)";

	if (finalBorder === true) computedBorder.border = `1px solid ${colorStr}`;
	else if (typeof finalBorder === "string") {
		const key =
			`border${finalBorder.charAt(0).toUpperCase() + finalBorder.slice(1)}` as keyof React.CSSProperties;
		// @ts-expect-error
		computedBorder[key] = `1px solid ${colorStr}`;
	}

	// Radius Logic
	let borderRadius: string | undefined;
	if (radius === "full") borderRadius = "var(--radius-full)";
	else if (radius === "round") borderRadius = "var(--radius-round-md)";
	else if (radius === "none") borderRadius = "var(--radius-none)";

	// Pack Logic
	const effectiveAlign = align ?? (pack ? "center" : undefined);
	const effectiveJustify = justify ?? (pack ? "center" : undefined);

	const computedStyle: React.CSSProperties = {
		backgroundColor: surface ? `var(--surface-${surface})` : undefined,
		borderRadius,
		padding:
			typeof p === "number" ? (p > 0 ? `var(--space-${p})` : undefined) : p,
		gap:
			typeof gap === "number"
				? gap > 0 && gap <= 6
					? `var(--space-${gap})`
					: `${gap}px`
				: gap,

		display: "flex",
		flexDirection: row ? "row" : "column",
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
			ratio && height && !width
				? undefined
				: fill
					? "100%"
					: typeof width === "number"
						? `${width}px`
						: width,
		height:
			ratio && width
				? undefined
				: fill
					? "100%"
					: typeof height === "number"
						? `${height}px`
						: height,

		flex: fill
			? 1
			: flex === true
				? 1
				: typeof flex === "number"
					? flex
					: undefined,
		flexShrink:
			width !== undefined || height !== undefined || ratio !== undefined
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
		top:
			typeof top === "number"
				? top >= 0 && top <= 6
					? `var(--space-${top})`
					: `${top}px`
				: top,
		bottom:
			typeof bottom === "number"
				? bottom >= 0 && bottom <= 6
					? `var(--space-${bottom})`
					: `${bottom}px`
				: bottom,
		left:
			typeof left === "number"
				? left >= 0 && left <= 6
					? `var(--space-${left})`
					: `${left}px`
				: left,
		right:
			typeof right === "number"
				? right >= 0 && right <= 6
					? `var(--space-${right})`
					: `${right}px`
				: right,

		color: surface === "primary" ? "var(--primary-fg)" : "inherit",

		...style,
	};

	return (
		<Component
			className={className}
			style={computedStyle}
			onClick={props.onClick}
			title={title}
			{...props}
		>
			{children}
		</Component>
	);
}
