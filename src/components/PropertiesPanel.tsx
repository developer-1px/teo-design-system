import {
	AlignCenter,
	AlignJustify,
	AlignLeft,
	AlignRight,
	ChevronDown,
	CornerUpRight,
	Eye,
	Lock,
	Minus,
	MoreHorizontal,
	Plus,
	Settings,
	Sun,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Action } from "../design-system/Action";
import { Field } from "../design-system/Field";
import { Frame } from "../design-system/Frame";
import { Section } from "../design-system/Section";
import { Separator } from "../design-system/Separator";
import { Text } from "../design-system/Text";

// --- Data ---

const ALIGNMENT_TOOLS = [
	{ icon: AlignLeft, label: "Left" },
	{ icon: AlignCenter, label: "Center", surface: "selected" as const },
	{ icon: AlignRight, label: "Right" },
	{ separator: true },
	{ icon: AlignJustify, label: "Justify" },
	{ icon: AlignCenter, label: "Middle", rotation: 90 },
	{ icon: CornerUpRight, label: "Distribute" },
];

// --- Helpers ---

const PropertySection = ({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) => (
	<Frame gap={2}>
		<Frame row justify="between" align="center" p="2 2 0 2">
			<Text variant={3} weight="bold" size={5}>
				{title}
			</Text>
			<Action
				icon={Plus}
				iconSize={12}
				style={{ width: "20px", height: "20px" }}
				opacity={0.4}
			/>
		</Frame>
		<Frame gap={1} p="0 2 2 2">
			{children}
		</Frame>
		<Separator />
	</Frame>
);

const TransformField = ({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (val: string) => void;
}) => (
	<Frame flex>
		<Field
			label={label}
			value={value}
			onChange={(e) => onChange(e.target.value)}
		/>
	</Frame>
);

export function PropertiesPanel() {
	const [activeTab, setActiveTab] = useState<"DESIGN" | "ANIMATE">("DESIGN");
	const [transform, setTransform] = useState({
		x: "400",
		y: "225",
		w: "800",
		h: "450",
		r: "0",
		corner: "0",
	});

	const updateTransform = (key: string, value: string) =>
		setTransform((prev) => ({ ...prev, [key]: value }));

	return (
		<Section style={{ width: "260px" }} surface="base" rounded="lg" shadow="sm">
			{/* Tabs */}
			<Frame
				row
				p={1}
				gap={1}
				border="bottom"
				borderColor="default"
				style={{ flexShrink: 0, height: "40px" }}
			>
				{["DESIGN", "ANIMATE"].map((tab) => (
					<Frame
						key={tab}
						flex
						pack
						rounded="round"
						onClick={() => setActiveTab(tab as "DESIGN" | "ANIMATE")}
						style={{
							cursor: "pointer",
							backgroundColor:
								activeTab === tab ? "var(--tab-bg-active)" : "transparent",
						}}
					>
						<Text
							variant={4}
							weight={activeTab === tab ? "bold" : "medium"}
							size={5}
							style={{
								color:
									activeTab === tab
										? "var(--text-primary)"
										: "var(--text-muted)",
							}}
						>
							{tab}
						</Text>
					</Frame>
				))}
			</Frame>

			<Frame p={2} gap={2} overflow="auto" flex fill style={{ minHeight: 0 }}>
				{/* Alignment */}
				<Frame row justify="between" surface="sunken" rounded="md" border p={0.5}>
					{ALIGNMENT_TOOLS.map((tool, i) =>
						tool.separator ? (
							<Separator key={i} orientation="vertical" length="12px" />
						) : (
							<Action
								key={i}
								icon={tool.icon}
								iconSize={12}
								surface={(tool as any).surface}
								rounded="round"
								style={{ height: "24px" }}
								iconRotation={tool.rotation}
							/>
						),
					)}
				</Frame>
				<Separator />

				{/* Transform */}
				<Frame gap={2}>
					<Frame row gap={2} align="center">
						<TransformField
							label="X"
							value={transform.x}
							onChange={(v) => updateTransform("x", v)}
						/>
						<TransformField
							label="Y"
							value={transform.y}
							onChange={(v) => updateTransform("y", v)}
						/>
						<Frame style={{ width: "24px" }} />
					</Frame>
					<Frame row gap={2} align="center">
						<TransformField
							label="W"
							value={transform.w}
							onChange={(v) => updateTransform("w", v)}
						/>
						<TransformField
							label="H"
							value={transform.h}
							onChange={(v) => updateTransform("h", v)}
						/>
						<Frame style={{ width: "24px" }} pack>
							<Action
								icon={Lock}
								iconSize={10}
								style={{ width: "20px", height: "20px" }}
								opacity={0.3}
							/>
						</Frame>
					</Frame>
					<Frame row gap={2} align="center">
						<TransformField
							label="°"
							value={transform.r}
							onChange={(v) => updateTransform("r", v)}
						/>
						<TransformField
							label="R"
							value={transform.corner}
							onChange={(v) => updateTransform("corner", v)}
						/>
						<Frame style={{ width: "24px" }} />
					</Frame>
				</Frame>
				<Separator />

				{/* Properties */}
				<PropertySection title="LAYER">
					<Frame row justify="between" gap={3}>
						<Field value="Normal" rightIcon={<ChevronDown size={10} />} flex />
						<Field value="100%" icon={<Eye size={10} />} style={{ width: "70px" }} />
					</Frame>
				</PropertySection>

				<PropertySection title="TEXT">
					<Frame gap="6px">
						<Field value="Inter" rightIcon={<ChevronDown size={10} />} />
						<Frame row gap={2}>
							<Field
								value="Regular"
								rightIcon={<ChevronDown size={10} />}
								flex
							/>
							<Field value="42" style={{ width: "50px" }} />
						</Frame>
						<Frame row gap={2}>
							<Field label="LH" value="Auto" flex />
							<Field label="LS" value="0%" flex />
						</Frame>
						<Frame row align="center" surface="sunken" rounded="md" border p={0.5}>
							{[AlignLeft, AlignCenter, AlignRight, AlignJustify].map(
								(Icon, i) => (
									<Action
										key={i}
										icon={Icon}
										iconSize={12}
										surface={i === 0 ? "selected" : undefined}
										rounded="round"
										style={{ height: "24px" }}
									/>
								),
							)}
							<Action
								icon={MoreHorizontal}
								iconSize={12}
								rounded="round"
								style={{ height: "24px" }}
							/>
						</Frame>
					</Frame>
				</PropertySection>

				<PropertySection title="FILL">
					<Field
						value="F4F4F5"
						icon={
							<Frame
								style={{ width: "10px", height: "10px" }}
								surface="base"
								rounded="round"
								border
							/>
						}
						rightIcon={
							<Text variant={4} size={5}>
								100%
							</Text>
						}
					/>
				</PropertySection>

				<PropertySection title="STROKE">
					<Frame gap="6px">
						<Field
							value="000000"
							icon={
								<Frame
									style={{ width: "10px", height: "10px" }}
									border
									borderColor="text-primary"
									rounded="round"
								/>
							}
							rightIcon={
								<Frame row gap={2}>
									<Text variant={4} size={5}>
										100%
									</Text>
									<Action icon={Eye} iconSize={10} style={{ width: "16px", height: "16px" }} />
									<Action icon={Minus} iconSize={10} style={{ width: "16px", height: "16px" }} />
								</Frame>
							}
							style={{ flexShrink: 0 }}
						/>
						<Frame row gap={2} align="center">
							<Field value="1.5" style={{ width: "50px" }} />
							<Field
								value="Inside"
								rightIcon={<ChevronDown size={10} />}
								flex
							/>
							<Action icon={Settings} iconSize={10} rounded="round" style={{ height: "24px" }} />
						</Frame>
					</Frame>
				</PropertySection>

				<PropertySection title="EFFECTS">
					<Field
						value="Drop Shadow"
						icon={<Sun size={10} />}
						rightIcon={<Action icon={Settings} iconSize={10} style={{ width: "16px", height: "16px" }} />}
					/>
				</PropertySection>

				<PropertySection title="EXPORT">
					<Field
						value="PNG"
						rightIcon={<Action icon={Plus} iconSize={10} style={{ width: "16px", height: "16px" }} />}
					/>
				</PropertySection>

				<Frame style={{ height: "100px" }} />
			</Frame>
		</Section>
	);
}
