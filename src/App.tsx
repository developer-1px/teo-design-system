import { Moon, Sun } from "lucide-react";
import { HashRouter, NavLink, Route, Routes } from "react-router-dom";
import { CMSApp } from "./apps/CMSApp";
import { CRMApp } from "./apps/crm/CRMApp.tsx";
import { LandingApp } from "./apps/LandingApp";
import { LoginApp } from "./apps/LoginApp";
import { MailApp } from "./apps/MailApp";
import { SlideApp } from "./apps/SlideApp";
import { TextSystemApp } from "./apps/TextSystemApp";
import { TokensApp } from "./apps/TokensApp";
import { Frame } from "./design-system/Frame/Frame.tsx";
import { Layout } from "./design-system/Frame/Layout/Layout.ts";
import { Icon } from "./design-system/Icon";
import { Text } from "./design-system/text/Text.tsx";
import { useTheme } from "./design-system/theme";
import { Space } from "./design-system/token/token.const.1tier";
import { FontSize, IconSize } from "./design-system/token/token.const.1tier.ts";
import { InspectorOverlay } from "./inspector/InspectorOverlay";

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink to={to} style={{ textDecoration: "none" }}>
      {({ isActive }) => (
        <Frame
          override={{
            py: Space.n6,
            px: Space.n14,
            rounded: "full",
          }}
          style={{
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
          }}
          surface={isActive ? "sunken" : undefined}
          cursor="pointer"
        >
          <Text size={FontSize.n12} weight={isActive ? "bold" : "medium"}>
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
      override={{
        rounded: "full",
        shadow: "xl",
        p: Space.n4,
        gap: Space.n4,
      }}
      style={{ position: "fixed", bottom: 20, left: 20, zIndex: 9999 }}
      surface="raised"
      layout={Layout.Row.Toolbar.Default}
    >
      <NavItem to="/" label="Home" />
      <NavItem to="/text" label="Text" />
      <NavItem to="/tokens" label="Tokens" />

      <NavItem to="/slide" label="Slide" />
      <NavItem to="/cms" label="CMS" />
      <NavItem to="/crm" label="CRM" />
      <NavItem to="/mail" label="Mail" />
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
      override={{
        p: Space.n8,
        rounded: "full",
      }}
      style={{
        color: "var(--text-secondary)",
      }}
      onClick={toggleTheme}
      cursor="pointer"
      surface="hover"
      align="center"
      justify="center"
    >
      {isDark ? (
        <Icon src={Sun} size={IconSize.n16} />
      ) : (
        <Icon src={Moon} size={IconSize.n16} />
      )}
    </Frame>
  );
}

function App() {
  return (
    <HashRouter>
      <InspectorOverlay />
      <Frame fill>
        <Routes>
          <Route path="/" element={<LandingApp />} />
          <Route path="/text" element={<TextSystemApp />} />
          <Route path="/tokens" element={<TokensApp />} />
          <Route path="/slide" element={<SlideApp />} />

          <Route path="/cms" element={<CMSApp />} />
          <Route path="/crm" element={<CRMApp />} />
          <Route path="/mail" element={<MailApp />} />
          <Route path="/login" element={<LoginApp />} />
        </Routes>
        <Navigation />
      </Frame>
    </HashRouter>
  );
}

export default App;
