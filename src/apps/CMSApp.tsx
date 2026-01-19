import {
  Download,
  Edit,
  Eye,
  Menu,
  Monitor,
  Play,
  Save,
  Smartphone,
  Tablet,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Overlay } from "../design-system/Overlay";
import {
  ContainerSize,
  Size,
  Space,
} from "../design-system/token/token.const.1tier";
import { Radius2 } from "../design-system/token/token.const.2tier";

// CMS Sections
import { BodyContentSection } from "./cms/BodyContentSection";
import { CMSDrawer } from "./cms/CMSDrawer";
import { CMSRightPanel } from "./cms/CMSRightPanel";
import { CMSSidebar } from "./cms/CMSSidebar";
import { FAQBoardFooter } from "./cms/FAQBoardFooter";
import { FeatureGridSection } from "./cms/FeatureGridSection";
import { HeaderHero } from "./cms/HeaderHero";
import { ImageFooterBanner } from "./cms/ImageFooterBanner";
import { MainFooter } from "./cms/MainFooter";
import { ScrollTabSection } from "./cms/ScrollTabSection";
import { SiteHeader } from "./cms/SiteHeader";

export function CMSApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [isRightPanelOpen, setRightPanelOpen] = useState(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(true);

  return (
    <Frame
      override={{ clip: true }}
      surface="base" // Base surface for the studio
      layout={Layout.Row.Stretch.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
    >
      <CMSSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area - Raised & Framed */}
      {/* Infinite Canvas Area */}
      <Frame
        override={{ clip: true, flex: 1 }}
        style={{
          background:
            "radial-gradient(circle, var(--border-color) 1px, transparent 1px) 0 0 / 24px 24px",
          backgroundColor: "var(--surface-sunken)", // Darker/Sunken canvas
          boxShadow: "inset 6px 0 24px -12px rgba(0,0,0,0.1)", // Inner shadow for depth
        }}
        layout={Layout.Col.Stretch.Start}
        spacing={Space.n0}
        w={Size.fill}
        h={Size.fill}
      >
        {/* Viewport Container */}
        <Frame
          override={{
            pb: Space.n96,
          }}
          scroll
          layout={Layout.Col.Center.Start}
          spacing={Space.n0}
          h={Size.fill}
        >
          {/* Viewport Frame */}
          <Frame
            override={{
              w:
                viewport === "mobile"
                  ? ContainerSize.n320
                  : viewport === "tablet"
                    ? ContainerSize.n768
                    : Size.fill,
              minHeight: Size.screen,
              clip: true, // Ensure content doesn't bleed
              elevation: "n5", // Deep shadow for floating effect
            }}
            surface="base" // The "Page" itself
            style={{
              transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              border: "1px solid var(--border-color)",
              borderRadius: viewport !== "desktop" ? "24px" : "0", // Rounded when mobile/tablet
            }}
          >
            <SiteHeader isSidebarOpen={isSidebarOpen} />
            <HeaderHero />
            <ScrollTabSection />
            <FeatureGridSection />
            <BodyContentSection />
            <ImageFooterBanner />
            <FAQBoardFooter />
            <MainFooter />
          </Frame>
        </Frame>

        {/* Viewport Selector - Top Center */}
        <ViewportSelector viewport={viewport} setViewport={setViewport} />

        {/* Bottom Toolbar */}
        <BottomToolbar
          isEditMode={isEditMode}
          toggleEditMode={() => setEditMode(!isEditMode)}
          isRightPanelOpen={isRightPanelOpen}
          toggleRightPanel={() => setRightPanelOpen(!isRightPanelOpen)}
          isDrawerOpen={isDrawerOpen}
          toggleDrawer={() => setDrawerOpen(!isDrawerOpen)}
        />
      </Frame>

      {isRightPanelOpen && (
        <CMSRightPanel onClose={() => setRightPanelOpen(false)} />
      )}

      {isDrawerOpen && <CMSDrawer onClose={() => setDrawerOpen(false)} />}
    </Frame>
  );
}

// Viewport Selector - Top Center
interface ViewportSelectorProps {
  viewport: "desktop" | "tablet" | "mobile";
  setViewport: (v: "desktop" | "tablet" | "mobile") => void;
}

function ViewportSelector({ viewport, setViewport }: ViewportSelectorProps) {
  return (
    <Overlay
      position="absolute"
      x="50%"
      top="var(--space-n24)"
      zIndex={200}
      style={{ transform: "translateX(-50%)" }}
    >
      <Frame
        surface="overlay" // Glass-like surface
        rounded={Radius2.full}
        layout={Layout.Row.Middle.End}
        spacing={Space.n8}
        override={{ p: Space.n4, gap: Space.n2, border: true }}
        style={{
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          backgroundColor: "rgba(255, 255, 255, 0.5)", // More translucent
        }}
      >
        <Action
          icon={Monitor}
          variant={viewport === "desktop" ? "surface" : "ghost"}
          size="sm"
          rounded={Radius2.full}
          onClick={() => setViewport("desktop")}
          tooltip="Desktop"
        />
        <Action
          icon={Tablet}
          variant={viewport === "tablet" ? "surface" : "ghost"}
          size="sm"
          rounded={Radius2.full}
          onClick={() => setViewport("tablet")}
          tooltip="Tablet"
        />
        <Action
          icon={Smartphone}
          variant={viewport === "mobile" ? "surface" : "ghost"}
          size="sm"
          rounded={Radius2.full}
          onClick={() => setViewport("mobile")}
          tooltip="Mobile"
        />
      </Frame>
    </Overlay>
  );
}

// Bottom Toolbar
interface BottomToolbarProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
}

function BottomToolbar({
  isEditMode,
  toggleEditMode,
  isDrawerOpen,
  toggleDrawer,
}: BottomToolbarProps) {
  return (
    <Overlay
      position="absolute"
      x="50%"
      bottom="var(--space-n32)"
      zIndex={200}
      style={{ transform: "translateX(-50%)" }}
    >
      <Frame
        surface="overlay" // Glass styling
        rounded={Radius2.full}
        layout={Layout.Row.Middle.End}
        spacing={Space.n8}
        override={{ p: Space.n6, gap: Space.n4, border: true }}
        style={{
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
        }}
      >
        {/* Edit Mode Toggle - Left */}
        <Action
          icon={isEditMode ? Edit : Eye}
          variant={isEditMode ? "primary" : "ghost"}
          size="sm"
          rounded={Radius2.full}
          onClick={toggleEditMode}
          tooltip={isEditMode ? "Edit Mode" : "Preview Mode"}
        />

        <Action
          icon={Save}
          variant="ghost"
          size="sm"
          rounded={Radius2.full}
          tooltip="Save"
        />

        <Frame
          style={{
            width: "1px",
            backgroundColor: "var(--border-color)",
          }}
          override={{ h: Size.n16 }}
        />

        <Action
          icon={Play}
          variant="ghost"
          size="sm"
          rounded={Radius2.full}
          tooltip="Preview"
        />

        <Frame
          style={{
            width: "1px",
            backgroundColor: "var(--border-color)",
          }}
          override={{ h: Size.n16 }}
        />

        <Action
          icon={Upload}
          variant="ghost"
          size="sm"
          rounded={Radius2.full}
          tooltip="Import"
        />

        <Action
          icon={Download}
          variant="ghost"
          size="sm"
          rounded={Radius2.full}
          tooltip="Export"
        />

        <Frame
          style={{
            width: "1px",
            backgroundColor: "var(--border-color)",
          }}
          override={{ h: Size.n16 }}
        />

        <Action
          icon={Menu}
          variant={isDrawerOpen ? "primary" : "ghost"}
          size="sm"
          rounded={Radius2.full}
          onClick={toggleDrawer}
          tooltip="Options"
        />
      </Frame>
    </Overlay>
  );
}
