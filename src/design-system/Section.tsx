import type React from "react";
import { Frame } from "./Frame";
import { Text } from "./Text";
import "./tokens.css";

interface SectionProps {
	children?: React.ReactNode;
	title?: string;
	icon?: React.ReactNode;
	// Layout props passthrough
	fill?: boolean;
	style?: React.CSSProperties;
	border?: boolean | "top" | "bottom" | "left" | "right";
	radius?: "none" | "pill" | "round";
	surface?: 1 | 2 | 3 | 4;
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
			radius="none"
			fill={fill}
			{...props}
			style={{
				border: "1px solid var(--border-color)",
				overflow: "hidden", // Sections usually contain stuff
				position: "relative",
				...props.style,
			}}
		>
			{(title || icon) && (
				<Frame
					row
					align="center"
					gap={2}
					padding={3}
					style={{ borderBottom: "1px solid var(--border-color)" }}
				>
					{icon && <span style={{ color: "var(--text-subtle)" }}>{icon}</span>}
					{title && (
						<Text
							variant={4}
							style={{ textTransform: "uppercase", letterSpacing: "0.05em" }}
						>
							{title}
						</Text>
					)}
				</Frame>
			)}
			<Frame fill flex style={{ overflow: "auto" }}>
				{children}
			</Frame>
		</Frame>
	);
}
