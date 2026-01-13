import {
	ChevronDown,
	Circle,
	Grid,
	Play,
	Plus,
	Share,
	Square,
	Type,
} from "lucide-react";
import { FloatingToolbar } from "../components/FloatingToolbar";
import { PropertiesPanel } from "../components/PropertiesPanel";
import { SlidesPanel } from "../components/SlidesPanel";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame";
import { Text } from "../design-system/Text";

export function SlideApp() {
	return (
		<Frame fill surface="sunken" overflow="hidden">
			{/* 1. Global Header */}
			<Frame
				row
				justify="between"
				align="center"
				p={2}
				position="absolute"
				top={0}
				left={0}
				right={0}
				zIndex={10}
				height={44}
			>
				<Frame row gap={3} align="center">
					<Action icon={Grid} iconSize={16} size={28} />
					<Frame row gap={2} align="center">
						<Text variant={2} weight="bold" size={12}>
							Untitled Presentation
						</Text>
						<Action icon={ChevronDown} iconSize={12} size={20} opacity={0.5} />
					</Frame>
				</Frame>
				<Frame row gap={2} align="center">
					<Frame
						row
						gap={1}
						align="center"
						surface="base"
						p={1}
						radius="full"
						shadow="sm"
					>
						<Frame width={16} height={16} surface="overlay" radius="full" />
						<Action icon={Plus} iconSize={10} size={20} />
					</Frame>
					<Action
						icon={Play}
						iconSize={14}
						label="Present"
						variant="primary"
						radius="full"
						size={24}
					/>
					<Action
						icon={Share}
						iconSize={14}
						label="Share"
						variant="surface"
						radius="full"
						size={24}
					/>
				</Frame>
			</Frame>

			{/* Main Layout Area */}
			<Frame flex row fill p={2} gap={2} style={{ paddingTop: 48 }}>
				{/* 2. Left Sidebar (Slides Strip) */}
				<SlidesPanel />

				{/* 3. Central Canvas Area */}
				<Frame
					flex
					fill
					position="relative"
					radius="full"
					overflow="hidden"
					as="main"
				>
					<Frame fill pack overflow="auto">
						<Frame surface="base" width={800} shadow="lg" pack ratio="16/9">
							<Frame gap={4} align="center">
								<Text variant={1} size={42} weight="bold">
									Minimal Design Kit
								</Text>
								<Text variant={3} size={14}>
									Refined & Polished UI.
								</Text>
								<Frame height={4} />
								<Frame row gap={3}>
									<Frame width={40} height={40} surface="sunken" radius="full" pack>
										<Square size={16} color="var(--text-body)" />
									</Frame>
									<Frame width={40} height={40} surface="raised" radius="full" pack>
										<Circle size={16} color="var(--text-body)" />
									</Frame>
									<Frame width={40} height={40} surface="overlay" radius="full" pack>
										<Type size={16} color="var(--text-body)" />
									</Frame>
								</Frame>
							</Frame>
						</Frame>
					</Frame>
				</Frame>

				{/* 4. Right Sidebar (Design Panel) */}
				<PropertiesPanel />
			</Frame>

			{/* 5. Bottom Floating Toolbar */}
			<FloatingToolbar />
		</Frame>
	);
}
