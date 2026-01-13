import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { CMSApp } from "./apps/CMSApp";
import IdeDemoApp from "./apps/IdeDemoApp";
import { LandingApp } from "./apps/LandingApp";

import { SlideApp } from "./apps/SlideApp";
import { TokensApp } from "./apps/TokensApp";
import { Text } from "./design-system/Text";
import { Frame } from "./design-system/Frame";

import { InspectorOverlay } from "./inspector/InspectorOverlay";

import { CRMApp } from "./apps/CRMApp";
import { LoginApp } from "./apps/LoginApp";
import { TextSystemApp } from "./apps/TextSystemApp";
import { useTheme } from "./design-system/theme";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Frame
          p="1.5 3.5"
          rounded="full"
          surface={isActive ? "sunken" : undefined}
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
      surface="raised"
      rounded="full"
      shadow="xl"
      p={1}
      row
      gap={1}
      style={{ bottom: 20, left: 20 }}
    >
      <NavItem to="/" label="Home" />
      <NavItem to="/text" label="Text" />
      <NavItem to="/tokens" label="Tokens" />
      <NavItem to="/slide" label="Slide" />

      <NavItem to="/ide" label="IDE" />
      <NavItem to="/cms" label="CMS" />

      <NavItem to="/crm" label="CRM" />
      <NavItem to="/login" label="Login" />
      <ThemeToggleItem />
    </Frame>
  );
}

function ThemeToggleItem() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Frame
      onClick={toggleTheme}
      p={2}
      rounded="full"
      style={{
        color: "var(--text-secondary)",
      }}
      cursor="pointer"
      surface="hover"
      align="center"
      justify="center"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
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
          <Route path="/text" element={<TextSystemApp />} />
          <Route path="/tokens" element={<TokensApp />} />
          <Route path="/slide" element={<SlideApp />} />

          <Route path="/ide" element={<IdeDemoApp />} />
          <Route path="/cms" element={<CMSApp />} />
          <Route path="/crm" element={<CRMApp />} />
          <Route path="/login" element={<LoginApp />} />
        </Routes>
        <Navigation />
      </Frame>
    </HashRouter>
  );
}

export default App;
