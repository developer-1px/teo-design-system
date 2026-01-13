import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { CMSApp } from "./apps/CMSApp";
import IdeDemoApp from "./apps/IdeDemoApp";
import { LandingApp } from "./apps/LandingApp";
import { LinearApp } from "./apps/LinearApp";
import { SlideApp } from "./apps/SlideApp";
import { TokensApp } from "./apps/TokensApp";
import { Text } from "./design-system/Text";
import { Frame } from "./design-system/Frame";
import { InspectorOverlay } from "./inspector/InspectorOverlay";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Frame
          p="1.5 3.5"
          rounded="full"
          surface={isActive ? "selected" : undefined}
          style={{
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
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
      zIndex={9999}
      style={{ bottom: 20, left: 20 }}
      surface="overlay"
      rounded="full"
      shadow="xl"
      p={1}
      row
      gap={1}
      border
    >
      <NavItem to="/" label="Home" />
      <NavItem to="/tokens" label="Tokens" />
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
          <Route path="/tokens" element={<TokensApp />} />
          <Route path="/slide" element={<SlideApp />} />
          <Route path="/linear" element={<LinearApp />} />
          <Route path="/ide" element={<IdeDemoApp />} />
          <Route path="/cms" element={<CMSApp />} />
        </Routes>
        <Navigation />
      </Frame>
    </HashRouter>
  );
}

export default App;
