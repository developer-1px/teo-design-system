import type React from "react";
import "./tokens.css";
import type { FontWeight, TypographyVariant } from "./types";
import { toToken } from "./utils";

interface TextProps
	extends Omit<React.HTMLAttributes<HTMLElement>, "style" | "className" | "color"> {
	children: React.ReactNode;
	variant?: TypographyVariant;
	as?: React.ElementType;

	// Overrides
	weight?: FontWeight;
	mono?: boolean;
	opacity?: number;
	size?: number | string; // Override size (number for token, string for px)
	color?: string; // Explicit color override

	className?: string; // Allow minimal overrides or layout positioning
	style?: React.CSSProperties;
}

export function Text({
	children,
	variant = 3,
	as,
	weight,
	mono,
	opacity,
	size,
	color,
	className = "",
	style: styleProp = {},
	...props
}: TextProps) {
	// Map hierarchy to automatic tags if not specified
	const Tag =
		as ||
		(variant === 1
			? "h1"
			: variant === 2
				? "h2"
				: variant === 3
					? "p"
					: "span");

	const colorMap = {
		1: "var(--text-primary)",
		2: "var(--text-body)",
		3: "var(--text-subtle)",
		4: "var(--text-muted)",
		5: "var(--text-muted)",
		6: "var(--text-dim)",
	};

	const baseStyle = {
		color: color || colorMap[variant as keyof typeof colorMap] || "var(--text-body)",
		fontSize: size ? toToken(size, "font-size") : `var(--font-size-${variant})`,
		fontWeight: weight
			? toToken(weight, "font-weight")
			: variant <= 2
				? "var(--font-weight-bold)"
				: "var(--font-weight-regular)",
		lineHeight: 1.5,
		margin: 0,
		fontFamily: mono ? "monospace" : undefined,
		opacity,
	} as React.CSSProperties;

	return (
		<Tag className={className} style={{ ...baseStyle, ...styleProp }} {...props}>
			{children}
		</Tag>
	);
}
