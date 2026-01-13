import React from "react";
import { Frame } from "./Frame";
import { Text } from "./Text";
import "./tokens.css";
import type { ActionVariant, RadiusToken, SurfaceToken } from "./types";

interface ActionProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
	children?: React.ReactNode;
	icon?: React.ReactNode | React.ElementType;
	label?: string;
	variant?: ActionVariant;

	// Layout overrides
	radius?: RadiusToken;

	// Shortcuts
	size?: number; // Sets unique width & height (square)
	iconSize?: number; // Sets icon size if icon is a component
	iconRotation?: number; // Internalized rotation

	// Visual
	opacity?: number;
	surface?: SurfaceToken; // Explicit surface control
	tooltip?: string;
}

export function Action({
	children,
	icon,
	label,
	variant,
	radius = "round",
	size,
	iconSize = 16,
	iconRotation,
	opacity,
	surface,
	tooltip,
	className = "",
	style: styleOverride,
	...props
}: ActionProps) {
	// Helper to render icon
	const renderIcon = () => {
		if (!icon) return null;
		if (React.isValidElement(icon)) return icon;

		const Icon = icon as React.ElementType;
		// @ts-expect-error
		return <Icon size={iconSize} />;
	};

	// Logic: Actions with a label default to 'surface' if variant not specified.
	// This provides a professional "button" look for textual actions.
	const finalVariant = variant ?? (label ? "surface" : "ghost");

	// Dimension logic: If label is present, width should be auto to fit text.
	// size/width props can still override this if explicitly provided.
	const finalWidth = label ? "auto" : size;
	const finalHeight = size;

	// Logic: If variant is 'surface', ensure radius defaults to 'round' (8px) if not overridden.
	// Although the prop default is 'round', this makes the intent explicit and robust vs future prop changes.
	const finalRadius =
		radius ?? (finalVariant === "surface" ? "round" : "round");

	return (
		<Frame
			as="button"
			className={`action-base action-${finalVariant} ${className}`}
			title={tooltip}
			width={finalWidth}
			height={finalHeight}
			radius={finalRadius}
			surface={surface}
			p={label ? 2 : 0}
			gap="6px"
			row
			pack
			opacity={opacity}
			style={{
				minWidth: !label && size ? size : undefined, // Ensure square for icons
				cursor: "pointer", // Indicate interactivity
				color: finalVariant === "primary" ? "var(--primary-fg)" : "inherit",
				...styleOverride,
			}}
			{...props}
		>
			{icon && (
				<span
					className="action-icon"
					style={{
						display: "flex",
						transform: iconRotation ? `rotate(${iconRotation}deg)` : undefined,
						transition: "transform 0.2s ease",
					}}
				>
					{renderIcon()}
				</span>
			)}
			{label && (
				<Text
					variant={4}
					weight="medium"
					style={{
						fontSize: 10,
						lineHeight: 1,
						whiteSpace: "nowrap",
						color: "inherit",
					}}
				>
					{label}
				</Text>
			)}
			{children}
		</Frame>
	);
}
