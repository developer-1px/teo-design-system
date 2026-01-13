import {
	BarChart2,
	Bell,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Circle,
	Clock,
	Filter,
	HelpCircle,
	Inbox,
	Layers,
	Layout,
	LayoutTemplate,
	List,
	MoreHorizontal,
	PlayCircle,
	Plus,
	Search,
	Settings,
	Signal,
	SlidersHorizontal,
	Star,
	UserCircle,
	Users,
	Zap,
} from "lucide-react";
import type React from "react";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame";
import { Text } from "../design-system/Text";

// --- Components ---

function LinearSidebar() {
	return (
		<Frame surface="sunken" border="right" p="3 0" gap={1} style={{ width: 240 }}>
			{/* Workspace Switcher */}
			<Frame p="0 3">
				<Action variant="ghost" rounded="md" w="100%">
					<Frame row gap={3} align="center" w="100%">
						<Frame
							style={{ width: 16, height: 16 }}
							rounded="sm"
							surface="overlay"
							pack
							border
						>
							<Text size={10} weight="bold">
								A
							</Text>
						</Frame>
						<Text weight="medium" size={13} color="primary">
							Acme Corp
						</Text>
						<Frame flex />
						<ChevronDown size={12} opacity={0.5} />
					</Frame>
				</Action>
			</Frame>
			<Frame h={2} />

			{/* Compose & Search */}
			<Frame p="0 3" gap={1}>
				<Action variant="surface" rounded="md" border shadow="sm">
					<Frame row gap={3} align="center" w="100%">
						<Plus size={14} color="var(--text-secondary)" />
						<Text weight="medium" size={13} color="primary">
							New Issue
						</Text>
						<Frame flex />
						<Frame surface="raised" p="0 1.5" rounded="sm" border>
							<Text size={10} color="tertiary">
								C
							</Text>
						</Frame>
					</Frame>
				</Action>
			</Frame>
			<Frame h={4} />

			{/* Main Navigation */}
			<Frame gap={0} p="0 3">
				<NavItem icon={Inbox} label="Inbox" count="2" />
				<NavItem icon={List} label="My Issues" active />
				<NavItem icon={Layers} label="Views" />
			</Frame>

			<Frame h={6} />

			{/* Favorites */}
			<SectionHeader label="FAVORITES" />
			<Frame gap={0} p="0 3">
				<NavItem icon={BarChart2} label="Cycle 24" />
				<NavItem icon={Layout} label="Roadmap Q4" />
			</Frame>

			<Frame h={6} />

			{/* Your Teams */}
			<SectionHeader label="YOUR TEAMS" actionIcon={Plus} />
			<Frame gap={0} p="0 3">
				<NavItem icon={Layout} label="Engineering" />
				<NavItem icon={Zap} label="Design" />
				<NavItem icon={Signal} label="Product" />
			</Frame>

			<Frame h={6} />

			{/* Projects */}
			<SectionHeader label="PROJECTS" actionIcon={Plus} />
			<Frame gap={0} p="0 3">
				<NavItem icon={PlayCircle} label="Q4 - Marketing Launch" />
				<NavItem icon={PlayCircle} label="Mobile App Redesign" />
			</Frame>

			<Frame flex />

			{/* Bottom Actions */}
			<Frame p="0 2" gap={0} border="top">
				<Frame h={2} />
				<NavItem icon={Users} label="Invite people" />
				<NavItem icon={HelpCircle} label="Help & Support" />
				<NavItem icon={Settings} label="Settings" />

				<Frame h={2} />
				<Action variant="ghost" rounded="md" w="100%">
					<Frame row gap={3} align="center">
						<Frame
							style={{ width: 20, height: 20 }}
							rounded="full"
							surface="overlay"
							pack
						>
							<UserCircle size={20} opacity={0.8} />
						</Frame>
						<Text size={13} weight="medium" color="primary">
							John Doe
						</Text>
					</Frame>
				</Action>
			</Frame>
		</Frame>
	);
}

// Helper: Section Headers with Indentation Rails
// Alignment Math:
// NavItem: Padding(8px) + Icon(14px) + Gap(12px) = 34px Indent for Text
// Header: Padding(Left) should align text to 34px.
// If we use p="0 4" (16px), we are short.
// Let's adjust NavItem to Gap(2) [8px].
// NavItem: Padding(8px[var(--space-2)]) + Icon(14px) + Gap(8px) = 30px.
// Header: Padding(Left) needs to be 30px. var(--space-6) is 32px. Close enough?
// Actually, let's just match padding.
// If header has p="0 4" (16px), keyline is 16px.
// NavItem has p="2" (8px). 8px + 14px + 8px = 30px.
// We want header text to align with NavItem text.
// So Header Padding Left should be 30px.
// padding-left: 30px is not a standard token.
// Let's use valid tokens.
// NavItem: p={2} (8px). Icon 14. Gap 3 (12). Total 34.
// Header: pl={?}.
// Let's just visually indent the header to match the LIST item padding, not the TEXT.
// Standard Linear: Headers align with the ICON, not the Text?
// No, standard Linear headers are actually flush with the list container padding, but often have no icon.
// Let's stick to the visual rail: px={3} (12px) for container.
// NavItem internal px={2} (8px). Total from screen edge = 20px.
// Header px={?}.
// Let's try `pl={8}` (36px)? Too much.
// I'll stick to a simple `p="0 4"` for headers and `p="0 3"` for the list container.

function SectionHeader({
	label,
	actionIcon: ActionIcon,
}: {
	label: string;
	actionIcon?: React.ElementType;
}) {
	return (
		<Frame
			row
			align="center"
			justify="between"
			style={{ paddingLeft: 18, paddingRight: 12, height: 28 }} // Custom rail alignment
		>
			<Text size={11} weight="bold" color="tertiary">
				{label}
			</Text>
			{ActionIcon && (
				<Action
					icon={ActionIcon}
					iconSize={12}
					style={{ width: 20, height: 20 }}
					rounded="sm"
					opacity={0.5}
				/>
			)}
		</Frame>
	);
}

function NavItem({
	icon: Icon,
	label,
	count,
	active,
}: {
	icon: React.ElementType;
	label: string;
	count?: string;
	active?: boolean;
}) {
	return (
		<Action variant={active ? "surface" : "ghost"} rounded="md" w="100%">
			<Frame row align="center" gap={3} w="100%">
				<Icon
					size={14}
					color={active ? "var(--text-primary)" : "var(--text-secondary)"}
				/>
				<Text
					size={13}
					weight={active ? "medium" : "regular"}
					style={{
						color: active ? "var(--text-primary)" : "var(--text-secondary)",
					}}
				>
					{label}
				</Text>
				{count && (
					<>
						<Frame flex />
						<Text size={12} color="tertiary">
							{count}
						</Text>
					</>
				)}
			</Frame>
		</Action>
	);
}

// Grid Template
// 80px ID | 32px Status | 32px Priority | 1fr Title | 100px Assignee | 80px Date
const ISSUE_GRID_COLS = "80px 40px 40px 1fr 60px 80px";

function IssueRow({
	id,
	title,
	status = "todo",
	priority = "none",
	assigneeStr = "JD",
}: {
	id: string;
	title: string;
	status?: "todo" | "done" | "progress";
	priority?: "high" | "medium" | "low" | "none";
	assigneeStr?: string;
}) {
	const StatusIcon =
		status === "done" ? CheckCircle2 : status === "progress" ? Clock : Circle;
	const statusColor =
		status === "done"
			? "var(--color-primary)"
			: status === "progress"
				? "var(--color-warning)"
				: "var(--text-tertiary)";

	let priorityIcon = (
		<MoreHorizontal
			size={14}
			color="var(--text-tertiary)"
			style={{ opacity: 0.3 }}
		/>
	);
	if (priority === "high")
		priorityIcon = <Signal size={14} color="var(--color-critical)" />;
	if (priority === "medium")
		priorityIcon = (
			<Signal size={14} color="var(--color-warning)" style={{ opacity: 0.8 }} />
		);
	if (priority === "low")
		priorityIcon = (
			<Signal size={14} color="var(--text-tertiary)" style={{ opacity: 0.5 }} />
		);

	return (
		<Action variant="ghost" rounded="none" w="100%">
			<Frame
				grid
				columns={ISSUE_GRID_COLS}
				align="center"
				border="bottom"
				p="0 5"
				gap={3}
				w="100%"
				style={{ height: 40 }}
			>
				<Frame row align="center" gap={2}>
					<Frame opacity={0.5}>
						<CheckCircle2 size={14} />
					</Frame>
					<Text size={12} color="tertiary" mono>
						{id}
					</Text>
				</Frame>
				<Frame row align="center" justify="start">
					<StatusIcon size={14} color={statusColor} />
				</Frame>
				<Frame row align="center" justify="start">
					{priorityIcon}
				</Frame>
				<Frame align="start">
					<Text size={13} weight="medium" color="primary">
						{title}
					</Text>
				</Frame>
				<Frame row justify="start">
					<Frame
						style={{ width: 18, height: 18 }}
						rounded="full"
						surface="raised"
						border
						pack
					>
						<Text size={9} weight="bold" color="secondary">
							{assigneeStr}
						</Text>
					</Frame>
				</Frame>
				<Frame row justify="end">
					<Text size={12} color="tertiary">
						Oct 24
					</Text>
				</Frame>
			</Frame>
		</Action>
	);
}

function LinearIssueList() {
	return (
		<Frame flex fill surface="base" overflow="hidden">
			{/* Header */}
			<Frame
				row
				justify="between"
				align="center"
				p="0 6"
				border="bottom"
				style={{ height: 56 }}
			>
				<Frame row gap={3} align="center">
					<Frame row align="center" gap={2}>
						<Frame
							style={{ width: 20, height: 20 }}
							rounded="sm"
							surface="sunken"
							pack
						>
							<Circle size={12} color="var(--text-secondary)" />
						</Frame>
						<Text size={14} weight="medium" color="tertiary">
							Acme Corp
						</Text>
						<ChevronRight size={14} color="var(--text-tertiary)" />
						<Text size={14} weight="medium" color="primary">
							Active Issues
						</Text>
					</Frame>
				</Frame>
				<Frame row gap={1} align="center">
					<Action
						icon={Search}
						variant="ghost"
						style={{ width: 28, height: 28 }}
					/>
					<Action
						icon={Bell}
						variant="ghost"
						style={{ width: 28, height: 28 }}
					/>
					<Frame p="0 2">
						<Frame style={{ width: 1, height: 16 }} surface="raised" />
					</Frame>
					<Action
						icon={LayoutTemplate}
						variant="ghost"
						style={{ width: 28, height: 28 }}
						opacity={0.6}
					/>
				</Frame>
			</Frame>

			{/* View Controls */}
			<Frame
				row
				justify="between"
				align="center"
				p="0 6"
				border="bottom"
				style={{ height: 48 }}
			>
				<Frame row gap={1} align="center">
					<Action variant="ghost" rounded="md">
						<Frame row gap={2} align="center">
							<Filter size={14} color="var(--text-secondary)" />
							<Text size={13} color="secondary">
								Filter
							</Text>
						</Frame>
					</Action>
					<Action variant="ghost" rounded="md">
						<Frame row gap={2} align="center">
							<SlidersHorizontal size={14} color="var(--text-secondary)" />
							<Text size={13} color="secondary">
								Display
							</Text>
						</Frame>
					</Action>
				</Frame>
				<Frame row gap={1}>
					<Action icon={BarChart2} variant="ghost" label="Insights" />
				</Frame>
			</Frame>

			{/* List Header */}
			<Frame
				grid
				columns={ISSUE_GRID_COLS}
				align="center"
				border="bottom"
				p="0 5"
				gap={3}
				surface="base"
				style={{ height: 36 }}
			>
				<Frame>
					<Text size={11} weight="medium" color="tertiary">
						ID
					</Text>
				</Frame>
				<Frame justify="start">
					<Text size={11} weight="medium" color="tertiary">
						Status
					</Text>
				</Frame>
				<Frame justify="start">
					<Text size={11} weight="medium" color="tertiary">
						Priority
					</Text>
				</Frame>
				<Frame>
					<Text size={11} weight="medium" color="tertiary">
						Title
					</Text>
				</Frame>
				<Frame justify="start">
					<Text size={11} weight="medium" color="tertiary">
						Assignee
					</Text>
				</Frame>
				<Frame row justify="end">
					<Text size={11} weight="medium" color="tertiary">
						Updated
					</Text>
				</Frame>
			</Frame>

			{/* List */}
			<Frame flex fill overflow="auto">
				<IssueRow
					id="LIN-3821"
					title="Implement new authentication flow"
					status="progress"
					priority="high"
					assigneeStr="AB"
				/>
				<IssueRow
					id="LIN-3822"
					title="Fix sidebar navigation bug"
					status="todo"
					priority="medium"
					assigneeStr="JD"
				/>
				<IssueRow
					id="LIN-3825"
					title="Update design tokens"
					status="done"
					priority="low"
					assigneeStr="SA"
				/>
				<IssueRow
					id="LIN-3829"
					title="Review pull requests for release"
					status="todo"
					priority="high"
					assigneeStr="MR"
				/>
				<IssueRow
					id="LIN-3841"
					title="Optimize database queries"
					status="progress"
					assigneeStr="KT"
				/>
				<IssueRow
					id="LIN-3844"
					title="Add filtered view for team backlog"
					status="todo"
					assigneeStr="JD"
				/>
				<IssueRow
					id="LIN-3848"
					title="Fix scrolling issues in Firefox"
					status="done"
					priority="low"
					assigneeStr="LC"
				/>
				<IssueRow
					id="LIN-3850"
					title="Refactor Frame component props"
					status="done"
					priority="high"
					assigneeStr="ME"
				/>
				<IssueRow
					id="LIN-3852"
					title="Add keyboard shortcuts"
					status="todo"
					priority="medium"
				/>
				<IssueRow
					id="LIN-3853"
					title="Update documentation"
					status="todo"
					priority="medium"
				/>
				<IssueRow
					id="LIN-3854"
					title="Fix dark mode flash"
					status="done"
					priority="low"
				/>
				<IssueRow
					id="LIN-3855"
					title="Improve load times"
					status="progress"
					priority="high"
				/>
			</Frame>
		</Frame>
	);
}

export function LinearApp() {
	return (
		<Frame fill grid columns="240px 1fr" surface="base">
			<LinearSidebar />
			<LinearIssueList />
		</Frame>
	);
}
