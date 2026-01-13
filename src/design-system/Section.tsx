import type React from "react";
import { Frame } from "./Frame";
import { Text } from "./Text";
import "./tokens.css";

import type { RoundedToken, SurfaceToken } from "./types";

interface SectionProps {
	children?: React.ReactNode;
	title?: string;
	icon?: React.ReactNode;
	// Layout props passthrough
	fill?: boolean;
	style?: React.CSSProperties;
	border?: boolean | "top" | "bottom" | "left" | "right";
	w?: string | number;
	h?: string | number;
	rounded?: RoundedToken;
	surface?: SurfaceToken;
	shadow?: "sm" | "md" | "lg";
}

export function Section({
	children,
	title,
	icon,
	fill,
	...props
}: SectionProps) {
	return (
		<Frame
			surface="base"
			{...props}
			p={0} // Force zero padding so children/separators can hit edges
			fill={fill}
			style={{
				border: "1px solid var(--border-color)",
				overflow: "hidden",
				position: "relative",
				display: "flex",
				flexDirection: "column",
				...props.style,
			}}
		>
			{(title || icon) && (
				<Frame
					row
					align="center"
					gap={2}
					p={2}
					style={{
						borderBottom: "1px solid var(--border-color)",
						flexShrink: 0,
					}}
				>
					{icon && <span style={{ color: "var(--text-subtle)" }}>{icon}</span>}
					{title && (
						<Text
							variant={4}
							style={{
								textTransform: "uppercase",
								letterSpacing: "0.05em",
								fontWeight: "bold",
							}}
						>
							{title}
						</Text>
					)}
				</Frame>
			)}
			<Frame fill flex style={{ overflow: "auto", minHeight: 0 }}>
				{children}
			</Frame>
		</Frame>
	);
}
