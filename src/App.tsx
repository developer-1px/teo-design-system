import { useState, useMemo, useEffect } from "react";
import { HashRouter, Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  FileCode,
  FileText,
  Home,
  Keyboard,
  Mail,
  Moon,
  Presentation,
  HelpCircle,
  Sun,
  Table as TableIcon,
  Users,
  LayoutGrid,
} from "lucide-react";


import { CMSApp } from "./apps/CMSApp";
import { DesignSystemApp } from "./apps/DesignSystemApp";

import { MailApp } from "./apps/MailApp";
import { SlideApp } from "./apps/slide/SlideApp";
import { TableApp } from "./apps/TableApp";
import { WhyApp } from "./apps/WhyApp";
import { CRMApp } from "./apps/crm/CRMApp";
import { DocsApp } from "@/apps/DocsApp/DocsApp";

import { Icon } from "@/ui/primitives/Icon";
import { useTheme } from "@/design-system/theme";
import { vars } from "@/design-system/theme.css.ts";

import { InspectorOverlay } from "./inspector/InspectorOverlay";
import { MainApp } from "./apps/MainApp/MainApp";
import { CodeNotebookApp } from "./apps/CodeNotebook/CodeNotebookApp";
import { CalendarApp } from "./apps/CalendarApp";

import { CommandPalette, type PaletteItem } from "@/ui/CommandPalette/CommandPalette";
import { useCommandSystem } from "@/design-system/hooks/interaction/useCommandSystem";
import { SystemCommand } from "@/design-system/hooks/interaction/commands";
import { PlaygroundApp } from "./apps/Playground/PlaygroundApp";
import GridPlayground from "./apps/GridPlayground";

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
      <div
        style={{
          width: vars.space.n32,
          height: vars.space.n32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: vars.radius.n12, // MD
          color: isActive || hovered ? vars.color.text.primary : vars.color.text.tertiary,
          backgroundColor: isActive || hovered ? vars.color.surface.sunken : "transparent",
          transition: "all 0.2s ease",
        }}
      >
        <Icon src={IconComponent} size={20} />
      </div>

      {hovered && (
        <div
          style={{
            padding: `${vars.space.n4} ${vars.space.n8}`,
            zIndex: 200,
            borderRadius: vars.radius.n6,
            backgroundColor: vars.color.text.primary, // Inverse roughly
            color: vars.color.text.inverse,
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
            whiteSpace: "nowrap",
            boxShadow: vars.elevation.n2,
            pointerEvents: "none",
          }}
        >
          <span style={{ fontSize: vars.font.size.n12 }}>{label}</span>
        </div>
      )}
    </Link>
  );
}

function ThemeToggleItem() {
  const { toggleTheme, theme } = useTheme();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={toggleTheme}
      style={{
        width: vars.space.n32,
        height: vars.space.n32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: vars.radius.n12,
        cursor: "pointer",
        color: hovered ? vars.color.text.primary : vars.color.text.tertiary,
        backgroundColor: hovered ? vars.color.surface.sunken : "transparent",
        transition: "all 0.2s ease",
        position: "relative",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon src={theme === "light" ? Moon : Sun} size={20} />
      {hovered && (
        <div
          style={{
            padding: `${vars.space.n4} ${vars.space.n8}`,
            zIndex: 200,
            borderRadius: vars.radius.n6,
            backgroundColor: vars.color.text.primary,
            color: vars.color.text.inverse,
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: "8px",
            whiteSpace: "nowrap",
            boxShadow: vars.elevation.n2,
            pointerEvents: "none",
          }}
        >
          <span style={{ fontSize: vars.font.size.n12 }}>Toggle Theme</span>
        </div>
      )}
    </div>
  );
}

function Navigation() {
  return (
    <div
      style={{
        padding: vars.space.n4,
        gap: vars.space.n4,
        zIndex: 100,
        borderRadius: vars.radius.full,
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: vars.color.surface.raised,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: vars.space.n40,
        boxShadow: vars.elevation.n3,
      }}
    >
      <NavItem to="/" label="Home" icon={Home} />
      <NavItem to="/design-system" label="Design System" icon={LayoutGrid} />
      <NavItem to="/table" label="Table" icon={TableIcon} />
      <NavItem to="/calendar" label="Calendar" icon={FileText} />
      <NavItem to="/docs" label="Docs" icon={FileText} />
      <NavItem to="/cms" label="CMS" icon={FileText} />
      <NavItem to="/crm" label="CRM" icon={Users} />
      <NavItem to="/notebook" label="Code" icon={FileCode} />
      <NavItem to="/playground" label="Playground" icon={Keyboard} />

      <div
        style={{ width: 1, height: 16, background: vars.color.border.subtle }}
      />


      <NavItem to="/slide" label="Slide" icon={Presentation} />
      <NavItem to="/mail" label="Mail" icon={Mail} />
      <NavItem to="/why" label="Why?" icon={HelpCircle} />


      <ThemeToggleItem />
    </div>
  );
}

function AppContent() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  const paletteItems: PaletteItem[] = useMemo(() => [
    {
      id: "nav-home",
      label: "Go to Dashboard",
      description: "Main application hub",
      icon: Home,
      onSelect: () => navigate("/")
    },
    {
      id: "nav-ds",
      label: "Design System",
      description: "Overview of components and tokens",
      icon: LayoutGrid,
      onSelect: () => navigate("/design-system")
    },
    {
      id: "nav-table",
      label: "Open DataTable",
      description: "Powerful grid with keyboard navigation",
      icon: TableIcon,
      onSelect: () => navigate("/table")
    },
    {
      id: "nav-calendar",
      label: "Open Calendar",
      description: "Schedule and manage appointments",
      icon: FileText,
      onSelect: () => navigate("/calendar")
    },
    {
      id: "nav-cms",
      label: "Open CMS",
      description: "Content management system",
      icon: FileText,
      onSelect: () => navigate("/cms")
    },
    {
      id: "nav-crm",
      label: "Open CRM",
      description: "Customer relationship management",
      icon: Users,
      onSelect: () => navigate("/crm")
    },
    {
      id: "theme-toggle",
      label: "Toggle Theme",
      description: "Switch between light and dark mode",
      icon: Sun,
      onSelect: () => toggleTheme()
    }
  ], [navigate, toggleTheme]);

  // Global Commands
  const commandRegistry = {
    [SystemCommand.OpenPalette]: () => setIsPaletteOpen(true),
    [SystemCommand.ToggleTheme]: () => toggleTheme(),
    [SystemCommand.Navigate]: ({ path }: { path: string }) => navigate(path),
  };

  const keybindings = [
    { key: "cmd+k", command: SystemCommand.OpenPalette },
    { key: "cmd+/", command: SystemCommand.OpenPalette },
  ];

  const { onKeyDown } = useCommandSystem(keybindings, commandRegistry);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <div
      style={{
        minHeight: "100vh",
        outline: "none"
      }}
      tabIndex={-1}
      onKeyDown={onKeyDown}
    >
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        items={paletteItems}
      />
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/design-system" element={<DesignSystemApp />} />
        <Route path="/table" element={<TableApp />} />

        <Route path="/slide" element={<SlideApp />} />
        <Route path="/cms" element={<CMSApp />} />
        <Route path="/crm" element={<CRMApp />} />
        <Route path="/mail" element={<MailApp />} />
        <Route path="/mail" element={<MailApp />} />
        <Route path="/docs/*" element={<DocsApp />} />
        <Route path="/why" element={<WhyApp />} />

        <Route path="/notebook" element={<CodeNotebookApp />} />
        <Route path="/calendar" element={<CalendarApp />} />
        <Route path="/playground" element={<PlaygroundApp />} />
        <Route path="/grid" element={<GridPlayground />} />
      </Routes>
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <HashRouter>
      <InspectorOverlay />
      <AppContent />
    </HashRouter>
  );
}

export default App;
