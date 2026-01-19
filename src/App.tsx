import { useState } from "react";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import {
  Bot,
  FileCode,
  FileText,
  Home,
  LogIn,
  Mail,
  MessageSquare,
  Moon,
  Presentation,
  Sun,
  Table as TableIcon,
  Users,
} from "lucide-react";

import { AgentEditorApp } from "./apps/AgentEditorApp";
import { CMSApp } from "./apps/CMSApp";
import { DesignSystemApp } from "./apps/DesignSystemApp";
import { DiscordApp } from "./apps/DiscordApp";
import { LoginApp } from "./apps/LoginApp";
import { MailApp } from "./apps/MailApp";
import { SlideApp } from "./apps/SlideApp";
import { TableApp } from "./apps/TableApp";
import { CRMApp } from "./apps/crm/CRMApp";

import { Frame } from "./design-system/Frame/Frame";
import { Layout } from "./design-system/Frame/Layout/Layout";
import { Icon } from "./design-system/Icon";
import { Text } from "./design-system/text/Text";
import { useTheme } from "./design-system/theme";
import { Radius2 } from "./design-system/token/token.const.2tier";
import {
  FontSize,
  IconSize,
  Radius,
  Size,
  Space,
  ZIndex,
} from "./design-system/token/token.const.1tier";

import { InspectorOverlay } from "./inspector/InspectorOverlay";

function NavItem({
  to,
  label,
  icon: IconComponent,
}: {
  to: string;
  label: string;
  icon: React.ElementType;
}) {
  const [hovered, setHovered] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      style={{ position: "relative", textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Frame
        w={Size.n32}
        h={Size.n32}
        layout={Layout.Row.Middle.Center}
        rounded={Radius2.md}
        style={{
          color: isActive || hovered ? "var(--text-primary)" : "var(--text-tertiary)",
          backgroundColor: isActive || hovered ? "var(--surface-sunken)" : "transparent",
          transition: "all 0.2s ease",
        }}
      >
        <Icon src={IconComponent} size={IconSize.n20} />
      </Frame>

      {hovered && (
        <Frame
          override={{
            p: Space.n4,
            px: Space.n8,
            zIndex: ZIndex.n200,
          }}
          rounded={Radius2.sm}
          style={{
            backgroundColor: "var(--surface-inverse)",
            color: "var(--text-inverse)",
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            pointerEvents: "none",
          }}
        >
          <Text size={FontSize.n12}>{label}</Text>
        </Frame>
      )}
    </Link>
  );
}

function ThemeToggleItem() {
  const { toggleTheme, theme } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <Frame
      onClick={toggleTheme}
      w={Size.n32}
      h={Size.n32}
      layout={Layout.Row.Middle.Center}
      rounded={Radius2.md}
      style={{
        cursor: "pointer",
        color: hovered ? "var(--text-primary)" : "var(--text-tertiary)",
        backgroundColor: hovered ? "var(--surface-sunken)" : "transparent",
        transition: "all 0.2s ease",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon src={theme === "light" ? Moon : Sun} size={IconSize.n20} />
      {hovered && (
        <Frame
          override={{
            p: Space.n4,
            px: Space.n8,
            zIndex: ZIndex.n200,
          }}
          rounded={Radius2.sm}
          style={{
            backgroundColor: "var(--surface-inverse)",
            color: "var(--text-inverse)",
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            pointerEvents: "none",
          }}
        >
          <Text size={FontSize.n12}>Toggle Theme</Text>
        </Frame>
      )}
    </Frame>
  );
}

import { CodeNotebookApp } from "./apps/CodeNotebook/CodeNotebookApp";

function Navigation() {
  return (
    <Frame
      override={{
        p: Space.n4,
        gap: Space.n4,
        zIndex: ZIndex.n100,
      }}
      rounded={Radius2.full}
      style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)" }}
      surface="raised"
      layout={Layout.Row.Middle.Center}
      h={Size.n40}
    >
      <NavItem to="/" label="Design System" icon={Home} />
      <NavItem to="/table" label="Table" icon={TableIcon} />
      <NavItem to="/cms" label="CMS" icon={FileText} />
      <NavItem to="/crm" label="CRM" icon={Users} />
      <NavItem to="/notebook" label="Code" icon={FileCode} />

      <Frame
        style={{ width: 1, height: 16, background: "var(--border-subtle)" }}
      />
      <NavItem to="/agent-editor" label="Agent" icon={Bot} />

      <Frame
        style={{ width: 1, height: 16, background: "var(--border-subtle)" }}
      />

      <NavItem to="/slide" label="Slide" icon={Presentation} />
      <NavItem to="/mail" label="Mail" icon={Mail} />
      <NavItem to="/discord" label="Discord" icon={MessageSquare} />
      <NavItem to="/login" label="Login" icon={LogIn} />

      <ThemeToggleItem />
    </Frame>
  );
}

function App() {
  return (
    <HashRouter>
      <InspectorOverlay />
      <Frame override={{ minHeight: Size.screen }}>
        <Routes>
          <Route path="/" element={<DesignSystemApp />} />
          <Route path="/table" element={<TableApp />} />
          <Route path="/agent-editor" element={<AgentEditorApp />} />

          <Route path="/slide" element={<SlideApp />} />

          <Route path="/cms" element={<CMSApp />} />
          <Route path="/crm" element={<CRMApp />} />
          <Route path="/mail" element={<MailApp />} />
          <Route path="/discord" element={<DiscordApp />} />
          <Route path="/login" element={<LoginApp />} />
          <Route path="/notebook" element={<CodeNotebookApp />} />
        </Routes>
        <Navigation />
      </Frame>
    </HashRouter>
  );
}

export default App;
