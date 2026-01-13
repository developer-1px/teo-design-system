import {
	AlertCircle,
	Bug,
	ChevronDown,
	ChevronRight,
	Files,
	GitBranch,
	LayoutGrid,
	MoreHorizontal,
	RefreshCw,
	Search,
	Settings,
	Split,
	UserCircle,
	X,
} from "lucide-react";
import { useState } from "react";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame";
import { Text } from "../design-system/Text";

// --- Activity Bar ---

function ActivityBar({
	activeTab,
	onTabChange,
}: {
	activeTab: string;
	onTabChange: (tab: string) => void;
}) {
	const isActive = (tab: string) => activeTab === tab;

	return (
		<Frame
			w={48}
			fill
			surface="sunken"
			border="right"
			align="center"
			p="2 0"
			gap={2}
		>
			<Action
				icon={Files}
				variant="ghost"
				size={48}
				iconSize={24}
				opacity={isActive("explorer") ? 1 : 0.5}
				onClick={() => onTabChange("explorer")}
				style={{
					borderLeftWidth: isActive("explorer") ? 2 : 0,
					borderColor: "var(--text-primary)",
				}}
			/>
			<Action
				icon={Search}
				variant="ghost"
				size={48}
				iconSize={24}
				opacity={isActive("search") ? 1 : 0.5}
				onClick={() => onTabChange("search")}
			/>
			<Action
				icon={GitBranch}
				variant="ghost"
				size={48}
				iconSize={24}
				opacity={isActive("source-control") ? 1 : 0.5}
				onClick={() => onTabChange("source-control")}
			/>
			<Action
				icon={Bug}
				variant="ghost"
				size={48}
				iconSize={24}
				opacity={isActive("debug") ? 1 : 0.5}
				onClick={() => onTabChange("debug")}
			/>
			<Action
				icon={LayoutGrid}
				variant="ghost"
				size={48}
				iconSize={24}
				opacity={isActive("extensions") ? 1 : 0.5}
				onClick={() => onTabChange("extensions")}
			/>

			<Frame flex />

			<Action
				icon={UserCircle}
				variant="ghost"
				size={48}
				iconSize={24}
				opacity={0.5}
			/>
			<Action
				icon={Settings}
				variant="ghost"
				size={48}
				iconSize={24}
				opacity={0.5}
			/>
		</Frame>
	);
}

// --- Sidebar ---

function Sidebar({ activeTab }: { activeTab: string }) {
	const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);
	const [projectExpanded, setProjectExpanded] = useState(true);

	if (activeTab !== "explorer") {
		// Placeholder for other tabs
		return (
			<Frame w={250} fill surface="sunken" border="right">
				<Frame h={35} p="0 4" justify="center">
					<Text size={11} weight="medium" opacity={0.6}>
						{activeTab.toUpperCase()}
					</Text>
				</Frame>
			</Frame>
		);
	}

	return (
		<Frame w={250} fill surface="sunken" border="right">
			<Frame h={35} p="0 5" align="center" justify="between" row>
				<Text size={11} weight="medium">
					EXPLORER
				</Text>
				<Action
					icon={MoreHorizontal}
					size={20}
					iconSize={14}
					variant="ghost"
					opacity={0.5}
				/>
			</Frame>

			<Frame flex fill overflow="auto">
				{/* Section: Open Editors */}
				<Frame>
					<Action
						variant="ghost"
						rounded="none"
						onClick={() => setOpenEditorsExpanded(!openEditorsExpanded)}
					>
						<Frame row align="center" gap={1}>
							{openEditorsExpanded ? (
								<ChevronDown size={12} />
							) : (
								<ChevronRight size={12} />
							)}
							<Text size={11} weight="bold" opacity={0.8}>
								OPEN EDITORS
							</Text>
						</Frame>
					</Action>
					{openEditorsExpanded && (
						<Frame>
							<FileItem name="App.tsx" icon="react" active />
							<FileItem name="IDEApp.tsx" icon="react" modified />
							<FileItem name="useStore.ts" icon="ts" />
						</Frame>
					)}
				</Frame>

				{/* Section: Project */}
				<Frame>
					<Action
						variant="ghost"
						rounded="none"
						onClick={() => setProjectExpanded(!projectExpanded)}
					>
						<Frame row align="center" gap={1}>
							{projectExpanded ? (
								<ChevronDown size={12} />
							) : (
								<ChevronRight size={12} />
							)}
							<Text size={11} weight="bold" opacity={0.8}>
								MINIMAL-DESIGN-KIT
							</Text>
						</Frame>
					</Action>
					{projectExpanded && (
						<Frame>
							<FolderItem name="src" expanded>
								<FolderItem name="apps" expanded>
									<FileItem name="CMSApp.tsx" icon="react" />
									<FileItem name="IDEApp.tsx" icon="react" />
									<FileItem name="LinearApp.tsx" icon="react" />
									<FileItem name="SlideApp.tsx" icon="react" />
								</FolderItem>
								<FolderItem name="design-system">
									<FileItem name="Frame.tsx" icon="react" />
									<FileItem name="Action.tsx" icon="react" />
								</FolderItem>
								<FileItem name="App.tsx" icon="react" />
								<FileItem name="main.tsx" icon="react" />
							</FolderItem>
							<FileItem name="package.json" icon="json" />
							<FileItem name="tsconfig.json" icon="json" />
							<FileItem name="vite.config.ts" icon="ts" />
						</Frame>
					)}
				</Frame>
			</Frame>
		</Frame>
	);
}

function FolderItem({
	name,
	expanded: initialExpanded,
	children,
}: {
	name: string;
	expanded?: boolean;
	children?: React.ReactNode;
}) {
	const [expanded, setExpanded] = useState(initialExpanded);

	return (
		<Frame>
			<Action
				variant="ghost"
				rounded="none"
				onClick={() => setExpanded(!expanded)}
			>
				<Frame row align="center" gap={2} p="0 0 0 4">
					{expanded ? (
						<ChevronDown size={12} opacity={0.6} />
					) : (
						<ChevronRight size={12} opacity={0.6} />
					)}
					<Text size={13} color="secondary">
						{name}
					</Text>
				</Frame>
			</Action>
			{expanded && (
				<Frame
					p="0 0 0 12"
					border="left"
					style={{ borderLeftColor: "transparent" }}
				>
					{children}
				</Frame>
			)}
		</Frame>
	);
}

function FileItem({
	name,
	icon,
	active,
	modified,
}: {
	name: string;
	icon: "react" | "ts" | "json";
	active?: boolean;
	modified?: boolean;
}) {
	const getIconColor = () => {
		if (icon === "react") return "#61DAFB";
		if (icon === "ts") return "#3178C6";
		if (icon === "json") return "#F1E05A";
		return "var(--text-secondary)";
	};

	return (
		<Action
			variant={active ? "surface" : "ghost"}
			surface={active ? "raised" : undefined}
			rounded="none"
		>
			<Frame row align="center" gap={2} p="0 0 0 16" w="100%">
				<Frame w={12} h={12} pack>
					<Text size={10} style={{ color: getIconColor(), fontWeight: "bold" }}>
						{icon === "react" ? "TSX" : icon === "ts" ? "TS" : "{}"}
					</Text>
				</Frame>
				<Text size={13} color={active ? "primary" : "secondary"}>
					{name}
				</Text>
				{modified && (
					<>
						<Frame flex />
						<Frame
							w={8}
							h={8}
							rounded="full"
							surface="sunken"
							style={{ backgroundColor: "var(--text-secondary)" }}
						/>
					</>
				)}
			</Frame>
		</Action>
	);
}

// --- Editor Area ---

function EditorTabs() {
	return (
		<Frame row h={35} surface="sunken" border="bottom">
			<Tab title="App.tsx" icon="react" active />
			<Tab title="IDEApp.tsx" icon="react" modified />
			<Tab title="useStore.ts" icon="ts" />
			<Frame flex />
			<Frame row align="center" p="0 2" gap={1}>
				<Action
					icon={Split}
					variant="ghost"
					size={28}
					iconSize={14}
					opacity={0.6}
				/>
				<Action
					icon={MoreHorizontal}
					variant="ghost"
					size={28}
					iconSize={14}
					opacity={0.6}
				/>
			</Frame>
		</Frame>
	);
}

function Tab({
	title,
	icon,
	active,
	modified,
}: {
	title: string;
	icon: "react" | "ts";
	active?: boolean;
	modified?: boolean;
}) {
	const getIconColor = () => {
		if (icon === "react") return "#61DAFB";
		if (icon === "ts") return "#3178C6";
		return "var(--text-secondary)";
	};

	return (
		<Frame
			w={120}
			h="100%"
			surface={active ? 1 : 2}
			border={active ? "top" : undefined}
			p="0 3"
			row
			align="center"
			justify="between"
			style={{
				borderTopColor: active ? "var(--text-primary)" : "transparent",
				borderRight: "1px solid var(--border-color)",
				cursor: "pointer",
			}}
		>
			<Frame row align="center" gap={2}>
				<Text size={10} style={{ color: getIconColor(), fontWeight: "bold" }}>
					{icon === "react" ? "TSX" : "TS"}
				</Text>
				<Text size={13} color={active ? "primary" : "secondary"}>
					{title}
				</Text>
			</Frame>
			<Action
				icon={modified ? undefined : X}
				size={20}
				iconSize={12}
				variant="ghost"
				opacity={0.5}
				onClick={(e) => {
					e.stopPropagation();
					onClose(file.id);
				}}
			>
				{modified ? (
					<Frame w={8} h={8} rounded="full" surface="overlay" />
				) : undefined}
			</Action>
		</Frame>
	);
}

function Breadcrumbs() {
	return (
		<Frame row h={22} align="center" p="0 4" gap={1} surface="base">
			<Text size={12} color="tertiary">
				src
			</Text>
			<ChevronRight size={12} color="var(--text-tertiary)" />
			<Text size={12} color="tertiary">
				App.tsx
			</Text>
		</Frame>
	);
}

function CodeEditor() {
	return (
		<Frame flex fill surface="base" row overflow="hidden">
			{/* Gutter */}
			<Frame
				w={50}
				p="4 0"
				align="end"
				gap={0}
				opacity={0.4}
				style={{ userSelect: "none" }}
			>
				{Array.from({ length: 20 }).map((_, i) => (
					<Text
						key={i}
						size={13}
						mono
						style={{ lineHeight: "20px", paddingRight: 16 }}
					>
						{i + 1}
					</Text>
				))}
			</Frame>
			{/* Code */}
			<Frame flex fill p="4 0" style={{ position: "relative" }}>
				<Text size={13} mono style={{ lineHeight: "20px", whiteSpace: "pre" }}>
					<span style={{ color: "#C586C0" }}>import</span>{" "}
					<span style={{ color: "#9CDCFE" }}>{"{"}</span>{" "}
					<span style={{ color: "#9CDCFE" }}>Routes</span>,{" "}
					<span style={{ color: "#9CDCFE" }}>Route</span>,{" "}
					<span style={{ color: "#9CDCFE" }}>Navigate</span>{" "}
					<span style={{ color: "#9CDCFE" }}>{"}"}</span>{" "}
					<span style={{ color: "#C586C0" }}>from</span>{" "}
					<span style={{ color: "#CE9178" }}>'react-router-dom'</span>
					{"\n"}
					<span style={{ color: "#C586C0" }}>import</span>{" "}
					<span style={{ color: "#9CDCFE" }}>{"{"}</span>{" "}
					<span style={{ color: "#9CDCFE" }}>Frame</span>{" "}
					<span style={{ color: "#9CDCFE" }}>{"}"}</span>{" "}
					<span style={{ color: "#C586C0" }}>from</span>{" "}
					<span style={{ color: "#CE9178" }}>'./design-system/Frame'</span>
					{"\n"}
					{"\n"}
					<span style={{ color: "#569CD6" }}>function</span>{" "}
					<span style={{ color: "#DCDCAA" }}>App</span>(){" "}
					<span style={{ color: "#9CDCFE" }}>{"{"}</span>
					{"\n"}
					{"  "}
					<span style={{ color: "#C586C0" }}>return</span>
					{" ("}
					{"\n"}
					{"    "}
					<span style={{ color: "#808080" }}>{"<>"}</span>
					{"\n"}
					{"      "}
					<span style={{ color: "#808080" }}>{"<"}</span>
					<span style={{ color: "#4EC9B0" }}>Routes</span>
					<span style={{ color: "#808080" }}>{">"}</span>
					{"\n"}
					{"        "}
					<span style={{ color: "#808080" }}>{"<"}</span>
					<span style={{ color: "#4EC9B0" }}>Route</span>{" "}
					<span style={{ color: "#9CDCFE" }}>path</span>=
					<span style={{ color: "#CE9178" }}>"/"</span>{" "}
					<span style={{ color: "#9CDCFE" }}>element</span>=
					<span style={{ color: "#569CD6" }}>{"{"}</span>
					<span style={{ color: "#808080" }}>{"<"}</span>
					<span style={{ color: "#4EC9B0" }}>Navigate</span>{" "}
					<span style={{ color: "#9CDCFE" }}>to</span>=
					<span style={{ color: "#CE9178" }}>"/slide"</span>{" "}
					<span style={{ color: "#808080" }}>{">"}</span>
					<span style={{ color: "#569CD6" }}>{"}"}</span>{" "}
					<span style={{ color: "#808080" }}>{"/>"}</span>
					{"\n"}
					{"      "}
					<span style={{ color: "#808080" }}>{"</"}</span>
					<span style={{ color: "#4EC9B0" }}>Routes</span>
					<span style={{ color: "#808080" }}>{">"}</span>
					{"\n"}
					{"    "}
					<span style={{ color: "#808080" }}>{"</>"}</span>
					{"\n"}
					{"  "}
					{")"}
					{"\n"}
					<span style={{ color: "#9CDCFE" }}>{"}"}</span>
				</Text>
			</Frame>
		</Frame>
	);
}

function Panel() {
	return (
		<Frame h={150} surface="base" border="top">
			<Frame row h={35} p="0 4" gap={4} align="center">
				<Text size={11} weight="medium" opacity={0.6}>
					PROBLEMS
				</Text>
				<Text size={11} weight="medium" opacity={0.6}>
					OUTPUT
				</Text>
				<Text size={11} weight="medium" opacity={0.6}>
					DEBUG CONSOLE
				</Text>
				<Text
					size={11}
					weight="medium"
					style={{ borderBottom: "1px solid var(--text-primary)" }}
				>
					TERMINAL
				</Text>
			</Frame>
			<Frame flex fill p="2 4" style={{ fontFamily: "monospace" }}>
				<Frame row align="center" gap={2}>
					<Text size={12} color="secondary">
						➜ minimal-design-kit
					</Text>
					<Text size={12} color="primary">
						git status
					</Text>
				</Frame>
				<Text size={12} color="secondary">
					On branch main
				</Text>
				<Text size={12} color="secondary">
					Your branch is up to date with 'origin/main'.
				</Text>
				<Text size={12} color="secondary">
					nothing to commit, working tree clean
				</Text>
				<Frame row align="center" gap={2} p="2 0 0 0">
					<Text size={12} color="secondary">
						➜ minimal-design-kit
					</Text>
					<Frame w={6} h={14} surface="overlay" opacity={0.8} />
				</Frame>
			</Frame>
		</Frame>
	);
}

// --- Status Bar ---

function StatusBar() {
	return (
		<Frame h={22} surface="overlay" row align="center" justify="between" p="0 3">
			<Frame row gap={3}>
				<Frame row gap={1} align="center">
					<GitBranch size={10} color="white" />
					<Text size={11} color="white" weight="medium">
						main*
					</Text>
				</Frame>
				<Frame row gap={1} align="center">
					<RefreshCw size={10} color="white" />
				</Frame>
				<Frame row gap={1} align="center" p="0 0 0 2">
					<AlertCircle size={10} color="white" />
					<Text size={11} color="white">
						0
					</Text>
					<AlertCircle size={10} color="white" />
					<Text size={11} color="white">
						0
					</Text>
				</Frame>
			</Frame>

			<Frame row gap={4}>
				<Text size={11} color="white">
					Ln 5, Col 24
				</Text>
				<Text size={11} color="white">
					Spaces: 2
				</Text>
				<Text size={11} color="white">
					UTF-8
				</Text>
				<Text size={11} color="white">
					TypeScript JSX
				</Text>
				<Frame row gap={1} align="center">
					<Text size={11} color="white">
						Prettier
					</Text>
				</Frame>
				<Action
					icon={UserCircle}
					size={14}
					iconSize={10}
					variant="ghost"
					style={{ color: "white" }}
				/>
			</Frame>
		</Frame>
	);
}

// --- Main App ---

export function IDEApp() {
	const [activeTab, setActiveTab] = useState("explorer");

	return (
		<Frame
			fill
			surface="base"
			overflow="hidden"
			grid
			columns="48px 250px 1fr"
			rows="1fr 22px"
			areas="'activity sidebar editor' 'status status status'"
		>
			{/* Main Layout Components placed via gridArea */}
			<Frame style={{ gridArea: "activity" }}>
				<ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />
			</Frame>

			<Frame style={{ gridArea: "sidebar" }}>
				<Sidebar activeTab={activeTab} />
			</Frame>

			{/* Editor Area */}
			<Frame style={{ gridArea: "editor" }} grid rows="35px 22px 1fr 150px">
				<EditorTabs />
				<Breadcrumbs />
				<CodeEditor />
				<Panel />
			</Frame>

			{/* Status Bar */}
			<Frame style={{ gridArea: "status" }}>
				<StatusBar />
			</Frame>
		</Frame>
	);
}
