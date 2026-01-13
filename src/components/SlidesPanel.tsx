import { MoreHorizontal } from "lucide-react";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame";
import { Section } from "../design-system/Section";
import { Text } from "../design-system/Text";

export function SlidesPanel() {
	const slides = Array.from({ length: 12 }, (_, i) => i + 1);

	return (
		<Section
			title="Slides"
			style={{ width: "220px", minWidth: "200px" }}
			surface="base"
			rounded="round"
			shadow="sm"
		>
			<Frame p={2} gap={2} overflow="auto" flex fill style={{ minHeight: 0 }}>
				{slides.map((num) => (
					<Frame
						key={num}
						gap={1}
						style={{ flexShrink: 0 }}
						opacity={num === 1 ? 1 : 0.6}
					>
						<Frame row justify="between" align="center">
							<Text
								variant={4}
								style={{
									fontSize: "11px",
									color:
										num === 1 ? "var(--text-primary)" : "var(--text-subtle)",
								}}
							>
								{num}
							</Text>
							<Action
								icon={MoreHorizontal}
								iconSize={12}
								style={{ width: "20px", height: "20px" }}
								opacity={num === 1 ? 0.6 : 0}
							/>
						</Frame>
						<Frame
							w="100%"
							ratio="16/9"
							border
							borderColor={num === 1 ? "default" : "transparent"}
							surface={num === 1 ? "base" : "raised"}
							rounded="round"
							flex
							align="center"
							justify="center"
							overflow="hidden"
							style={{
								boxShadow:
									num === 1 ? "0 0 0 1.5px var(--text-primary)" : "none",
							}}
						>
							{num === 1 ? (
								<Frame w="60%" style={{ height: "2px" }} surface="sunken" />
							) : (
								<Text variant={4} size={5}>
									{num}
								</Text>
							)}
						</Frame>
					</Frame>
				))}
			</Frame>
		</Section>
	);
}
