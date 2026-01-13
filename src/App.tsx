import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { CMSApp } from "./apps/CMSApp";
import { IDEApp } from "./apps/IDEApp";
import { LandingApp } from "./apps/LandingApp";
import { LinearApp } from "./apps/LinearApp";
import { SlideApp } from "./apps/SlideApp";
import { InspectorOverlay } from "./components/InspectorOverlay";
import { Frame } from "./design-system/Frame";
import { Text } from "./design-system/Text";

function NavItem({ to, label }: { to: string; label: string }) {
	return (
		<NavLink to={to} style={{ textDecoration: "none" }}>
			{({ isActive }) => (
				<Frame
					p="2 3"
					radius="md"
					surface={isActive ? "raised" : undefined}
					style={{
						color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
						transition: "all 0.2s ease",
					}}
					cursor="pointer"
				>
					<Text variant={4} weight={isActive ? "bold" : "medium"}>
						{label}
					</Text>
				</Frame>
			)}
		</NavLink>
	);
}

function Navigation() {
	return (
		<Frame
			position="fixed"
			bottom={20}
			left={20}
			zIndex={9999}
			surface="overlay"
			radius="full"
			shadow="lg"
			p={1}
			row
			gap={1}
			border
		>
			<NavItem to="/" label="Home" />
			<NavItem to="/slide" label="Slide" />
			<NavItem to="/linear" label="Linear" />
			<NavItem to="/ide" label="IDE" />
			<NavItem to="/cms" label="CMS" />
		</Frame>
	);
}

function App() {
	return (
		<HashRouter>
			<InspectorOverlay />
			<Frame fill overflow="hidden">
				<Routes>
					<Route path="/" element={<LandingApp />} />
					<Route path="/slide" element={<SlideApp />} />
					<Route path="/linear" element={<LinearApp />} />
					<Route path="/ide" element={<IDEApp />} />
					<Route path="/cms" element={<CMSApp />} />
				</Routes>
				<Navigation />
			</Frame>
		</HashRouter>
	);
}

export default App;
