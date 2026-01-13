import type React from "react";
import "./tokens.css";
import type { FontWeight, TypographyVariant } from "./types";

interface TextProps {
	children: React.ReactNode;
	variant?: TypographyVariant;
	as?: any;

	// Overrides
	weight?: FontWeight;
	opacity?: number;
	size?: number; // Override pixel size

	className?: string; // Allow minimal overrides or layout positioning
	style?: React.CSSProperties;
}

export function Text({
	children,
	variant = 3,
	as,
	weight,
	opacity,
	size,
	className = "",
	style: styleProp = {},
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
	};

	const baseStyle = {
		color: colorMap[variant as keyof typeof colorMap] || "var(--text-body)",
		fontSize: size ? `${size}px` : `var(--font-size-${variant})`,
		fontWeight: weight
			? weight === "bold"
				? 600
				: weight === "medium"
					? 500
					: 400
			: variant <= 2
				? "var(--font-weight-bold)"
				: "var(--font-weight-regular)",
		lineHeight: 1.5,
		margin: 0,
		opacity,
	} as React.CSSProperties;

	return (
		<Tag className={className} style={{ ...baseStyle, ...styleProp }}>
			{children}
		</Tag>
	);
}
