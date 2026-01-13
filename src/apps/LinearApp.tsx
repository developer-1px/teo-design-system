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
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame";
import { Text } from "../design-system/Text";

// --- Components ---

function LinearSidebar() {
	return (
		<Frame w={240} surface="sunken" border="right" p="3   0" gap={1}>
			{/* Workspace Switcher */}
			<Frame p="0 2">
				<Action variant="ghost" rounded="md">
					<Frame row gap={2} align="center" w="100%">
						<Frame w={16} h={16} rounded="sm" surface="overlay" pack border>
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
			<Frame h={8} />

			{/* Compose & Search */}
			<Frame p="0 2" gap={1}>
				<Action variant="surface" rounded="md">
					<Frame row gap={2} align="center" w="100%">
						<Plus size={14} color="var(--text-secondary)" />
						<Text weight="medium" size={13} color="secondary">
							New Issue
						</Text>
						<Frame flex />
						<Frame surface="raised" p="0 1" rounded="sm" border>
							<Text size={10} color="tertiary">
								C
							</Text>
						</Frame>
					</Frame>
				</Action>
			</Frame>
			<Frame h={16} />

			{/* Main Navigation */}
			<Frame gap={0} p="0 2">
				<NavItem icon={Inbox} label="Inbox" count="2" />
				<NavItem icon={List} label="My Issues" active />
				<NavItem icon={Layers} label="Views" />
			</Frame>

			<Frame h={16} />

			{/* Favorites */}
			<Frame p="0 4" row align="center" justify="between">
				<Frame row gap={2} align="center" opacity={0.6} className="hover-item">
					<Star size={12} />
					<Text size={11} weight="medium">
						FAVORITES
					</Text>
				</Frame>
			</Frame>
			<Frame h={4} />
			<Frame gap={0} p="0 2">
				<NavItem icon={BarChart2} label="Cycle 24" />
				<NavItem icon={Layout} label="Roadmap Q4" />
			</Frame>

			<Frame h={24} />

			{/* Your Teams */}
			<Frame p="0 4" row align="center" justify="between">
				<Text size={11} weight="medium" color="tertiary">
					YOUR TEAMS
				</Text>
				<Action
					icon={Plus}
					iconSize={12}
					size={20}
					rounded="full"
					opacity={0.5}
				/>
			</Frame>
			<Frame h={4} />
			<Frame gap={0} p="0 2">
				<NavItem icon={Layout} label="Engineering" />
				<NavItem icon={Zap} label="Design" />
				<NavItem icon={Signal} label="Product" />
			</Frame>

			<Frame h={24} />

			{/* Projects */}
			<Frame p="0 4" row align="center" justify="between">
				<Text size={11} weight="medium" color="tertiary">
					PROJECTS
				</Text>
				<Action
					icon={Plus}
					iconSize={12}
					size={20}
					rounded="full"
					opacity={0.5}
				/>
			</Frame>
			<Frame h={4} />
			<Frame gap={0} p="0 2">
				<NavItem icon={PlayCircle} label="Q4 - Marketing Launch" />
				<NavItem icon={PlayCircle} label="Mobile App Redesign" />
			</Frame>

			<Frame flex />

			{/* Bottom Actions */}
			<Frame p="0 2" gap={0} border="top">
				<Frame h={8} />
				<NavItem icon={Users} label="Invite people" />
				<NavItem icon={HelpCircle} label="Help & Support" />
				<NavItem icon={Settings} label="Settings" />

				<Frame h={8} />
				<Action variant="ghost" rounded="md">
					<Frame row gap={2} align="center">
						<Frame w={20} h={20} rounded="full" surface="overlay" pack>
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
		<Action variant={active ? "surface" : "ghost"} rounded="md">
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
const ISSUE_GRID_COLS = "80px 40px 40px 1fr 40px 80px";

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

	// Priority Icon logic
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
		<Action variant="ghost" rounded="none">
			<Frame
				grid
				columns={ISSUE_GRID_COLS}
				align="center"
				h={40}
				border="bottom"
				p="0 5"
				gap={3}
				w="100%"
			>
				<Frame row align="center" gap={1}>
					<Action
						icon={CheckCircle2}
						size={16}
						iconSize={12}
						opacity={0.1}
						rounded="sm"
					/>
					<Text size={12} color="tertiary" mono>
						{id}
					</Text>
				</Frame>
				<Frame row align="center" justify="start">
					{/* @ts-expect-error -- Icon is valid */}
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
				<Frame row justify="center">
					<Frame w={18} h={18} rounded="full" surface="raised" border pack>
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
				h={56}
				p="0 6"
				border="bottom"
			>
				<Frame row gap={3} align="center">
					<Frame row align="center" gap={2}>
						<Frame w={20} h={20} rounded="sm" surface="sunken" pack>
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
					<Action icon={Search} variant="ghost" size={28} />
					<Action icon={Bell} variant="ghost" size={28} />
					<Frame p="0 2">
						<Frame w={1} h={16} surface="raised" />
					</Frame>
					<Action
						icon={LayoutTemplate}
						variant="ghost"
						size={28}
						opacity={0.6}
					/>
				</Frame>
			</Frame>

			{/* View Controls */}
			<Frame
				row
				justify="between"
				align="center"
				h={48}
				p="0 6"
				border="bottom"
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
				h={36}
				border="bottom"
				p="0 5"
				gap={3}
				surface="base"
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
				<Frame justify="center">
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
