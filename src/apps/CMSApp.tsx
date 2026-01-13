import {
	ArrowUpRight,
	Check,
	Code,
	Command,
	Cpu,
	Eye,
	Globe,
	HelpCircle,
	Image as ImageIcon,
	Layout,
	MessageSquare,
	Monitor,
	PanelLeft,
	Plus,
	Redo,
	Settings,
	Shield,
	Smartphone,
	Sparkles,
	Tablet,
	Type,
	Undo,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame";
import { Text } from "../design-system/Text";

// --- Types ---

interface ElementButtonProps {
	icon: React.ElementType;
	label: string;
}

interface LayerItemProps {
	icon: React.ElementType;
	label: string;
	active?: boolean;
}

interface EditableWrapperProps {
	children: React.ReactNode;
	onEdit?: () => void;
	style?: React.CSSProperties;
}

interface FeatureCardSmallProps {
	icon: React.ElementType;
	title: string;
	desc: string;
	flex?: number | boolean;
}

interface FeatureCardLargeProps {
	icon: React.ElementType;
	title: string;
	desc: string;
	flex?: number | boolean;
	image?: boolean;
}

interface CheckItemProps {
	title: string;
	desc: string;
}

interface FAQRowProps {
	q: string;
	a: string;
}

interface FooterLinkColumnProps {
	title: string;
	links: string[];
}

// --- CMS UI: Floating Toolbars ---

function TopCenterBar() {
	return (
		<Frame
			position="absolute"
			top={24}
			left="50%"
			style={{ transform: "translateX(-50%)" }}
			zIndex={100}
			surface="raised"
			rounded="full"
			border
			shadow="lg"
			p={1}
			row
			gap={1}
			h={44}
			align="center"
		>
			<Action icon={Monitor} variant="surface" size={32} p={1} rounded="full" />
			<Action
				icon={Tablet}
				variant="ghost"
				size={32}
				p={1}
				opacity={0.3}
				rounded="full"
			/>
			<Action
				icon={Smartphone}
				variant="ghost"
				size={32}
				p={1}
				opacity={0.3}
				rounded="full"
			/>
		</Frame>
	);
}

function TopRightBar() {
	return (
		<Frame
			position="absolute"
			top={24}
			right={24}
			zIndex={100}
			surface="raised"
			rounded="full"
			border
			shadow="lg"
			p="1 2"
			row
			gap={2}
			h={44}
			align="center"
		>
			<Action
				icon={Undo}
				variant="ghost"
				size={32}
				opacity={0.3}
				rounded="full"
			/>
			<Action
				icon={Redo}
				variant="ghost"
				size={32}
				opacity={0.3}
				rounded="full"
			/>
			<Frame w={1} h={16} surface="overlay" />
			<Action
				label="Preview"
				icon={Eye}
				variant="ghost"
				h={32}
				rounded="full"
			/>
			<Action label="Publish" variant="primary" h={32} rounded="full" glow />
		</Frame>
	);
}

function SidebarToggle({
	isOpen,
	onClick,
}: {
	isOpen: boolean;
	onClick: () => void;
}) {
	return (
		<Frame
			position="absolute"
			top={24}
			left={24}
			zIndex={100}
			surface={isOpen ? "overlay" : "raised"}
			rounded="md"
			border
			shadow="lg"
			w={44}
			h={44}
			pack
			onClick={onClick}
			cursor="pointer"
			className="hover-scale"
		>
			<PanelLeft
				size={20}
				color={isOpen ? "var(--color-primary)" : "var(--text-secondary)"}
			/>
		</Frame>
	);
}

// --- CMS UI: Sidebar ---

function CMSSidebar({ isOpen }: { isOpen: boolean }) {
	if (!isOpen) return null;

	return (
		<Frame
			w={280}
			surface="sunken"
			border="right"
			p="6 0"
			gap={8}
			h="100%"
			overflow="auto"
			style={{ paddingTop: 80 }}
		>
			<Frame p="0 4" gap={4}>
				<Frame gap={1.5}>
					<Text
						size={10}
						weight="bold"
						color="tertiary"
						style={{ letterSpacing: "0.05em" }}
					>
						PAGE ELEMENTS
					</Text>
					<Text size={13} color="secondary">
						Drag elements to the canvas
					</Text>
				</Frame>
				<Frame grid columns="1fr 1fr" gap={2}>
					<ElementButton icon={Type} label="Headline" />
					<ElementButton icon={Layout} label="Section" />
					<ElementButton icon={ImageIcon} label="Image" />
					<ElementButton icon={ArrowUpRight} label="Button" />
					<ElementButton icon={MessageSquare} label="Form" />
					<ElementButton icon={Code} label="Embed" />
				</Frame>
			</Frame>

			<Frame p="0 4" gap={4} flex>
				<Frame gap={1.5}>
					<Text
						size={10}
						weight="bold"
						color="tertiary"
						style={{ letterSpacing: "0.05em" }}
					>
						LAYERS
					</Text>
				</Frame>
				<Frame gap={1}>
					<LayerItem icon={Sparkles} label="Hero: Premium Launch" active />
					<LayerItem icon={Globe} label="Features: Bento Grid" />
					<LayerItem icon={Zap} label="Workflow: Visual Steps" />
					<LayerItem icon={Shield} label="Social Proof: Banner" />
					<LayerItem icon={MessageSquare} label="FAQ: Accordion" />
					<LayerItem icon={Layout} label="Footer: Multi-column" />
				</Frame>
			</Frame>
		</Frame>
	);
}

function ElementButton({ icon: Icon, label }: ElementButtonProps) {
	return (
		<Frame
			w="48%"
			h={72}
			surface="raised"
			rounded="lg"
			border
			pack
			gap={1.5}
			cursor="grab"
			className="hover-scale"
		>
			<Icon size={18} opacity={0.5} />
			<Text size={11} weight="medium">
				{label}
			</Text>
		</Frame>
	);
}

function LayerItem({ icon: Icon, label, active }: LayerItemProps) {
	return (
		<Frame
			row
			gap={2}
			align="center"
			p="2 3"
			rounded="md"
			surface={active ? "raised" : "base"}
			border={active}
		>
			<Icon
				size={14}
				opacity={active ? 1 : 0.4}
				color={active ? "var(--color-primary)" : "inherit"}
			/>
			<Text
				size={13}
				weight={active ? "medium" : "regular"}
				color={active ? "primary" : "secondary"}
			>
				{label}
			</Text>
			{active && (
				<>
					<Frame flex />
					<Settings size={12} opacity={0.5} />
				</>
			)}
		</Frame>
	);
}

// --- Editable Component Utility ---

function EditableWrapper({ children, onEdit, style }: EditableWrapperProps) {
	const [isHovered, setIsHovered] = useState(false);
	return (
		<Frame
			position="relative"
			style={{
				outline: isHovered
					? "2px solid var(--color-primary)"
					: "2px solid transparent",
				outlineOffset: "2px",
				transition: "all 0.2s",
				...style,
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			cursor="text"
			onClick={(e) => {
				e.stopPropagation();
				onEdit?.();
			}}
		>
			{isHovered && (
				<Frame
					position="absolute"
					top={-24}
					left={0}
					surface="primary"
					p="0 2"
					rounded="sm"
					zIndex={50}
					h={20}
					align="center"
				>
					<Text size={10} weight="bold" color="#fff">
						EDIT
					</Text>
				</Frame>
			)}
			{children}
		</Frame>
	);
}

// --- Content Sections: Premium Design Composition ---

function SiteHeader() {
	return (
		<Frame
			w="100%"
			h={80}
			p="0 12"
			row
			align="center"
			justify="between"
			surface="base"
			border="bottom"
			position="sticky"
			top={0}
			zIndex={40}
			style={{
				backdropFilter: "blur(12px)",
				backgroundColor: "rgba(255, 255, 255, 0.8)",
			}}
		>
			<Frame row gap={3} align="center">
				<Frame w={32} h={32} rounded="lg" surface="primary" pack>
					<Sparkles size={18} color="#fff" />
				</Frame>
				<Text weight="bold" size={18} style={{ letterSpacing: "-0.02em" }}>
					VisualEngine
				</Text>
			</Frame>

			<Frame row gap={8} align="center">
				<EditableWrapper>
					<Text size={14} weight="medium" color="secondary">
						Features
					</Text>
				</EditableWrapper>
				<EditableWrapper>
					<Text size={14} weight="medium" color="secondary">
						Solutions
					</Text>
				</EditableWrapper>
				<EditableWrapper>
					<Text size={14} weight="medium" color="secondary">
						Pricing
					</Text>
				</EditableWrapper>
				<EditableWrapper>
					<Text size={14} weight="medium" color="secondary">
						Resources
					</Text>
				</EditableWrapper>
			</Frame>

			<Frame row gap={4} align="center">
				<Action label="Log in" variant="ghost" h={40} p="0 4" rounded="lg" />
				<Action
					label="Get Started"
					variant="primary"
					h={40}
					p="0 6"
					rounded="full"
					glow
				/>
			</Frame>
		</Frame>
	);
}

function HeaderHero() {
	return (
		<Frame
			w="100%"
			p="84 24"
			pack
			gap={12}
			surface="base"
			style={{ minHeight: "90vh", position: "relative", overflow: "hidden" }}
		>
			{/* Background Decoration */}
			<Frame
				position="absolute"
				top={-100}
				right={-100}
				w={400}
				h={400}
				rounded="full"
				style={{
					background: "var(--color-primary)",
					filter: "blur(150px)",
					opacity: 0.1,
				}}
			/>
			<Frame
				position="absolute"
				bottom={-100}
				left={-100}
				w={400}
				h={400}
				rounded="full"
				style={{
					background: "var(--color-warning)",
					filter: "blur(150px)",
					opacity: 0.15,
				}}
			/>

			<Frame align="center" gap={6} w="100%" maxWidth={900}>
				<Frame
					p="1 3"
					rounded="full"
					surface="raised"
					border
					row
					gap={2}
					align="center"
					className="hover-scale"
				>
					<Sparkles size={12} color="var(--color-primary)" />
					<Text
						size={12}
						weight="bold"
						color="secondary"
						style={{ letterSpacing: "0.02em" }}
					>
						NEXT GENERATION CMS IS HERE
					</Text>
				</Frame>

				<EditableWrapper style={{ width: "100%" }}>
					<Text
						align="center"
						size={80}
						weight="bold"
						style={{ lineHeight: 1, letterSpacing: "-0.04em" }}
					>
						Build your dream site <br />
						<span style={{ color: "var(--color-primary)" }}>
							pixel by pixel.
						</span>
					</Text>
				</EditableWrapper>

				<EditableWrapper style={{ maxWidth: 600 }}>
					<Text
						size={22}
						color="secondary"
						align="center"
						style={{ lineHeight: 1.5, opacity: 0.8 }}
					>
						The visual engine for creators who demand perfection. No code, no
						constraints, just pure creativity.
					</Text>
				</EditableWrapper>

				<Frame row gap={4} p={4}>
					<Action
						label="Start Creating"
						variant="primary"
						size="lg"
						glow
						h={56}
						rounded="full"
					>
						<ArrowUpRight size={20} />
					</Action>
					<Action
						label="Talk to Sales"
						variant="surface"
						size="lg"
						h={56}
						p="0 8"
						rounded="full"
					/>
				</Frame>
			</Frame>

			{/* Hero Visual: Mockup UI */}
			<Frame
				w="100%"
				maxWidth={1000}
				h={500}
				surface="sunken"
				rounded="2xl"
				border
				shadow="2xl"
				style={{
					position: "relative",
					marginTop: 80,
					transform: "perspective(1000px) rotateX(5deg)",
				}}
				overflow="hidden"
			>
				<Frame
					h={40}
					surface="raised"
					border="bottom"
					row
					align="center"
					p="0 4"
					gap={1.5}
				>
					<Frame w={10} h={10} rounded="full" surface="overlay" />
					<Frame w={10} h={10} rounded="full" surface="overlay" />
					<Frame w={10} h={10} rounded="full" surface="overlay" />
					<Frame flex />
					<Command size={14} opacity={0.3} />
				</Frame>
				<Frame row fill contentStart>
					<Frame w={200} border="right" surface="sunken" p={4} gap={4}>
						<Frame h={12} w="80%" surface="overlay" rounded="full" />
						<Frame h={12} w="60%" surface="overlay" rounded="full" />
						<Frame flex />
						<Frame h={40} w="100%" surface="overlay" rounded="lg" />
					</Frame>
					<Frame flex surface="base" p={12} gap={6} pack>
						<Frame
							w={80}
							h={80}
							rounded="2xl"
							surface="raised"
							shadow="lg"
							border
							pack
						>
							<Sparkles size={32} color="var(--color-primary)" />
						</Frame>
						<Frame gap={2} align="center">
							<Frame h={20} w={200} surface="overlay" rounded="full" />
							<Frame h={12} w={300} surface="raised" rounded="full" />
						</Frame>
					</Frame>
				</Frame>
			</Frame>
		</Frame>
	);
}

function FeatureGridSection() {
	return (
		<Frame w="100%" p="96 24" gap={16} surface="base" border="bottom">
			<Frame gap={3} align="center" maxWidth={700} style={{ margin: "0 auto" }}>
				<Text
					size={12}
					weight="bold"
					color="primary"
					style={{ letterSpacing: "0.1em" }}
				>
					CAPABILITIES
				</Text>
				<Text
					size={56}
					weight="bold"
					align="center"
					style={{ letterSpacing: "-0.02em" }}
				>
					Crafted for detail.
				</Text>
				<Text
					size={18}
					color="secondary"
					align="center"
					style={{ lineHeight: 1.6, opacity: 0.6 }}
				>
					Every component is built with the highest design standards in mind.
					From typography to interactions, it's all handled.
				</Text>
			</Frame>

			<Frame gap={4}>
				{/* Bento Grid Layout - Refactored to CSS Grid */}
				<Frame grid columns={3} gap={6}>
					<FeatureCardSmall
						icon={Zap}
						title="Instant Preview"
						desc="See changes in real-time."
					/>
					<Frame style={{ gridColumn: "span 2" }}>
						<FeatureCardLarge
							icon={Globe}
							title="Global Design Systems"
							desc="Manage your typography, colors, and components from a single source of truth."
							image
							flex={1}
						/>
					</Frame>

					<Frame style={{ gridColumn: "span 2" }}>
						<FeatureCardLarge
							icon={Shield}
							title="Enterprise Security"
							desc="Built for teams that demand safety and role-based access control."
							flex={1}
						/>
					</Frame>
					<FeatureCardSmall
						icon={Cpu}
						title="AI Automation"
						desc="Let AI generate layouts."
					/>
				</Frame>
			</Frame>
		</Frame>
	);
}

function FeatureCardSmall({
	icon: Icon,
	title,
	desc,
	flex,
}: FeatureCardSmallProps) {
	return (
		<Frame
			flex={flex}
			p={6}
			surface="base"
			rounded="2xl"
			border
			gap={4}
			className="hover-card"
		>
			<Frame w={48} h={48} rounded="xl" surface="sunken" border pack>
				<Icon size={24} color="var(--color-primary)" />
			</Frame>
			<Frame gap={2}>
				<EditableWrapper>
					<Text variant={1} size={20} weight="bold">
						{title}
					</Text>
				</EditableWrapper>
				<EditableWrapper>
					<Text variant={3} size={15} style={{ lineHeight: 1.5 }}>
						{desc}
					</Text>
				</EditableWrapper>
			</Frame>
		</Frame>
	);
}

function FeatureCardLarge({
	icon: Icon,
	title,
	desc,
	flex,
	image,
}: FeatureCardLargeProps) {
	return (
		<Frame
			flex={flex}
			surface="base"
			rounded="2xl"
			border
			overflow="hidden"
			row
			className="hover-card"
		>
			<Frame flex p={6} gap={4} justify="center">
				<Frame w={48} h={48} rounded="xl" surface="sunken" border pack>
					<Icon size={24} color="var(--color-primary)" />
				</Frame>
				<Frame gap={2}>
					<EditableWrapper>
						<Text variant={1} size={24} weight="bold">
							{title}
						</Text>
					</EditableWrapper>
					<EditableWrapper>
						<Text variant={3} size={16} style={{ lineHeight: 1.5 }}>
							{desc}
						</Text>
					</EditableWrapper>
				</Frame>
			</Frame>
			{image && (
				<Frame
					w="40%"
					surface="raised"
					border="left"
					style={{
						background:
							"linear-gradient(45deg, var(--surface-sunken), var(--surface-overlay))",
					}}
					pack
				>
					<Frame w={120} h={160} surface="base" rounded="lg" shadow="xl" border />
				</Frame>
			)}
		</Frame>
	);
}

function BodyContentSection() {
	return (
		<Frame
			w="100%"
			p="96 24"
			gap={24}
			surface="sunken"
			border="bottom"
			row
			align="center"
		>
			<Frame w="50%" gap={8}>
				<Frame gap={4}>
					<Text size={14} weight="bold" color="primary">
						THE PROCESS
					</Text>
					<Text
						size={64}
						weight="bold"
						style={{ lineHeight: 1.1, letterSpacing: "-0.03em" }}
					>
						Unleash your <br /> internal creative.
					</Text>
				</Frame>
				<Text size={20} color="secondary" style={{ lineHeight: 1.6 }}>
					Workflow shouldn't be a bottleneck. Our platform allows developers to
					focus on logic while designers handle the visuals.
				</Text>
				<Frame gap={4}>
					<CheckItem
						title="Pure Token-based design"
						desc="Align with your existing CSS/Tailwind system effortlessly."
					/>
					<CheckItem
						title="Developer-friendly export"
						desc="Export clean React, Vue, or HTML code at any time."
					/>
					<CheckItem
						title="Real-time collaboration"
						desc="Work with your team in the same canvas simultaneously."
					/>
				</Frame>
			</Frame>
			<Frame flex pack>
				<Frame
					w={400}
					h={500}
					surface="raised"
					rounded="3xl"
					shadow="2xl"
					border
					style={{ position: "relative" }}
				>
					<Frame
						position="absolute"
						top={40}
						left={-40}
						width={180}
						height={180}
						surface="base"
						radius="2xl"
						shadow="lg"
						border
						p={6}
						gap={4}
					>
						<Zap size={32} color="var(--color-warning)" />
						<Frame gap={2}>
							<Frame height={10} width="100%" surface="overlay" radius="full" />
							<Frame height={10} width="60%" surface="overlay" radius="full" />
						</Frame>
					</Frame>
					<Frame
						position="absolute"
						bottom={40}
						right={-40}
						width={220}
						height={220}
						surface="base"
						radius="2xl"
						shadow="lg"
						border
						p={6}
						gap={4}
					>
						<MessageSquare size={32} color="var(--color-primary)" />
						<Frame gap={2}>
							<Frame row gap={2} align="center">
								<Frame width={24} height={24} radius="full" surface="overlay" />
								<Frame height={8} width={100} surface="overlay" radius="full" />
							</Frame>
							<Frame height={8} width="100%" surface="raised" radius="full" />
						</Frame>
					</Frame>
				</Frame>
			</Frame>
		</Frame>
	);
}

function CheckItem({ title, desc }: CheckItemProps) {
	return (
		<Frame row gap={4} align="start">
			<Frame
				width={24}
				height={24}
				radius="full"
				surface="primary"
				pack
				style={{ marginTop: 2 }}
			>
				<Check size={14} color="#fff" />
			</Frame>
			<Frame gap={1}>
				<Text weight="bold" size={16}>
					{title}
				</Text>
				<Text size={14} color="secondary" opacity={0.7}>
					{desc}
				</Text>
			</Frame>
		</Frame>
	);
}

function ImageFooterBanner() {
	return (
		<Frame width="100%" p="96 24" surface="base" border="bottom">
			<Frame
				width="100%"
				height={500}
				radius="3xl"
				overflow="hidden"
				position="relative"
				pack
				style={{ background: "linear-gradient(225deg, #1a1a1a, #000)" }}
			>
				{/* Visual texture */}
				<Frame
					position="absolute"
					fill
					style={{
						opacity: 0.1,
						backgroundImage:
							"radial-gradient(circle at center, #fff 1px, transparent 1px)",
						backgroundSize: "32px 32px",
					}}
				/>

				<Frame gap={6} align="center" zIndex={10} maxWidth={700}>
					<Text
						color="#fff"
						size={64}
						weight="bold"
						align="center"
						style={{ letterSpacing: "-0.04em" }}
					>
						Ready to elevate <br /> your web presence?
					</Text>
					<Text
						color="#fff"
						opacity={0.6}
						size={20}
						align="center"
						style={{ lineHeight: 1.5 }}
					>
						Join 2,000+ companies building high-performance marketing sites with
						our Visual Engine.
					</Text>
					<Frame row gap={4}>
						<Action
							label="Start for Free"
							variant="primary"
							size="lg"
							glow
							height={56}
							p="0 8"
							radius="full"
						/>
						<Action
							label="Browse Templates"
							variant="surface"
							size="lg"
							height={56}
							p="0 8"
							radius="full"
						/>
					</Frame>
				</Frame>
			</Frame>

			{/* Partner Logos */}
			<Frame p="12 0 0 0" gap={6} align="center">
				<Text size={12} weight="bold" color="tertiary" opacity={0.5}>
					TRUSTED WORLDWIDE
				</Text>
				<Frame row gap={12} justify="center" opacity={0.3} wrap="wrap">
					<Frame row gap={2} align="center">
						<Zap size={24} />
						<Text size={24} weight="bold">
							Bolt
						</Text>
					</Frame>
					<Frame row gap={2} align="center">
						<Globe size={24} />
						<Text size={24} weight="bold">
							Stripe
						</Text>
					</Frame>
					<Frame row gap={2} align="center">
						<Shield size={24} />
						<Text size={24} weight="bold">
							Linear
						</Text>
					</Frame>
					<Frame row gap={2} align="center">
						<Cpu size={24} />
						<Text size={24} weight="bold">
							Vercel
						</Text>
					</Frame>
				</Frame>
			</Frame>
		</Frame>
	);
}

function FAQBoardFooter() {
	return (
		<Frame width="100%" p="96 24" gap={12} surface="base" align="center">
			<Frame gap={2} align="center">
				<Text size={12} weight="bold" color="primary">
					SUPPORT
				</Text>
				<Text size={48} weight="bold">
					Common questions
				</Text>
			</Frame>

			<Frame width="100%" maxWidth={800} gap={4}>
				<FAQRow
					q="How secure is my data?"
					a="We use industry-standard encryption and SOC2 certification to ensure your data stays protected at all times."
				/>
				<FAQRow
					q="Can I export code for local hosting?"
					a="Yes, you can export your site as a static bundle and host it anywhere you like."
				/>
				<FAQRow
					q="Do you support custom domains?"
					a="Absolutely. You can connect any domain you own with a single click."
				/>
				<FAQRow
					q="Is there a limit on bandwidth?"
					a="Our Enterprise plans offer unlimited bandwidth, while Pro plans have generous limits."
				/>
			</Frame>

			<Frame
				p={8}
				surface={1}
				radius="2xl"
				border
				row
				gap={6}
				align="center"
				width="100%"
				maxWidth={800}
				style={{ margin: "40px auto 0" }}
			>
				<Frame
					width={56}
					height={56}
					radius="full"
					surface={3}
					pack
				>
					<HelpCircle size={24} />
				</Frame>
				<Frame gap={1}>
					<Text weight="bold" size={18}>
						Still have questions?
					</Text>
					<Text size={15} color="secondary">
						We're here to help. Contact our support team 24/7.
					</Text>
				</Frame>
				<Frame flex />
				<Action
					label="Chat with us"
					variant="surface"
					height={44}
					p="0 4"
					radius="lg"
				/>
			</Frame>
		</Frame>
	);
}

function FAQRow({ q, a }: FAQRowProps) {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Frame
			width="100%"
			p="6 0"
			border="bottom"
			gap={4}
			onClick={() => setIsOpen(!isOpen)}
			cursor="pointer"
		>
			<Frame row justify="between" align="center" width="100%">
				<Text size={20} weight="bold">
					{q}
				</Text>
				<Plus
					size={20}
					style={{
						transform: isOpen ? "rotate(45deg)" : "none",
						transition: "transform 0.3s",
					}}
					opacity={0.4}
				/>
			</Frame>
			{isOpen && (
				<Frame p="0 8 4 0">
					<Text
						size={16}
						color="secondary"
						style={{ lineHeight: 1.6, opacity: 0.8 }}
					>
						{a}
					</Text>
				</Frame>
			)}
		</Frame>
	);
}

function MainFooter() {
	return (
		<Frame width="100%" p="64 24" surface="sunken" gap={16}>
			<Frame row justify="between" align="start">
				<Frame gap={6} width="35%">
					<Frame row gap={3} align="center">
						<Frame
							width={40}
							height={40}
							radius="xl"
							surface="primary"
							pack
							shadow="lg"
						>
							<Sparkles size={20} color="#fff" />
						</Frame>
						<Text weight="bold" size={20} style={{ letterSpacing: "-0.02em" }}>
							VisualEngine
						</Text>
					</Frame>
					<Text
						size={16}
						color="secondary"
						style={{ lineHeight: 1.6, opacity: 0.7 }}
					>
						Building the future of the visual web. Join us in redefining how
						websites are crafted.
					</Text>
					<Frame row gap={4}>
						<Globe size={20} opacity={0.4} />
						<MessageSquare size={20} opacity={0.4} />
						<ArrowUpRight size={20} opacity={0.4} />
					</Frame>
				</Frame>

				<Frame row gap={16}>
					<FooterLinkColumn
						title="PRODUCT"
						links={["Features", "Design", "Automation", "Templates"]}
					/>
					<FooterLinkColumn
						title="RESOURCES"
						links={["Documentation", "API", "Community", "Guides"]}
					/>
					<FooterLinkColumn
						title="COMPANY"
						links={["About Us", "Legal", "Careers", "News"]}
					/>
				</Frame>
			</Frame>

			<Frame border="top" paddingTop={8} row justify="between" align="center">
				<Text size={13} color="tertiary">
					© 2024 VisualEngine Inc. All rights reserved.
				</Text>
				<Frame row gap={6}>
					<Text size={13} color="tertiary">
						Privacy Policy
					</Text>
					<Text size={13} color="tertiary">
						Terms of Service
					</Text>
				</Frame>
			</Frame>
		</Frame>
	);
}

function FooterLinkColumn({ title, links }: FooterLinkColumnProps) {
	return (
		<Frame gap={4}>
			<Text
				size={11}
				weight="bold"
				color="tertiary"
				style={{ letterSpacing: "0.05em" }}
			>
				{title}
			</Text>
			{links.map((link: string) => (
				<Text key={link} size={15} color="secondary" opacity={0.6}>
					{link}
				</Text>
			))}
		</Frame>
	);
}

// --- CMS App Entry ---

export function CMSApp() {
	const [isSidebarOpen, setSidebarOpen] = useState(true);

	return (
		<Frame fill surface="raised" overflow="hidden">
			<TopCenterBar />
			<TopRightBar />
			<SidebarToggle
				isOpen={isSidebarOpen}
				onClick={() => setSidebarOpen(!isSidebarOpen)}
			/>

			<Frame row fill>
				<CMSSidebar isOpen={isSidebarOpen} />
				<Frame
					flex
					fill
					surface="overlay"
					align="center"
					justify="start"
					p="28 8 12 8"
					overflow="auto"
				>
					{/* The Canvas */}
					<Frame
						width="100%"
						maxWidth={isSidebarOpen ? 1000 : 1200}
						surface="base"
						shadow="2xl"
						radius="3xl"
						overflow="hidden"
						style={{
							minHeight: "100%",
							transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
						}}
						border
					>
						<SiteHeader />
						<HeaderHero />
						<FeatureGridSection />
						<BodyContentSection />
						<ImageFooterBanner />
						<FAQBoardFooter />
						<MainFooter />
					</Frame>
					<Frame height={160} />
				</Frame>
			</Frame>
		</Frame>
	);
}
