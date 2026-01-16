import {Download, Edit, Eye, Menu, Monitor, Play, Save, Smartphone, Tablet, Upload,} from "lucide-react"
import {useState} from "react"
import {Action} from "../design-system/Action"
import {Frame} from "../design-system/Frame/Frame.tsx"
import {Layout} from "../design-system/Frame/Layout/Layout.ts"
import {Overlay} from "../design-system/Overlay"
import {ContainerSize, Size, Space,} from "../design-system/token/token.const.1tier"
import {Radius2} from "../design-system/token/token.const.2tier"

// CMS Sections
import {BodyContentSection} from "./cms/BodyContentSection"
import {CMSDrawer} from "./cms/CMSDrawer"
import {CMSRightPanel} from "./cms/CMSRightPanel"
import {CMSSidebar} from "./cms/CMSSidebar"
import {FAQBoardFooter} from "./cms/FAQBoardFooter"
import {FeatureGridSection} from "./cms/FeatureGridSection"
import {HeaderHero} from "./cms/HeaderHero"
import {ImageFooterBanner} from "./cms/ImageFooterBanner"
import {MainFooter} from "./cms/MainFooter"
import {ScrollTabSection} from "./cms/ScrollTabSection"
import {SiteHeader} from "./cms/SiteHeader"

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
      override={{ p: Space.n0, w: Size.screen, h: Size.screen }}
      surface="sunken"
      clip
      layout={Layout.Row.AppContainer.Default}
    >
      <CMSSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content Area - Raised & Framed */}
      <Frame
        fill
        flex
        override={{
          shadow: "lg",
          clip: true,
        }}
        rounded={Radius2["2xl"]}
        surface="raised"
        style={{
          margin: "var(--space-n4)",
          marginLeft: isSidebarOpen ? "0" : "var(--space-n4)",
          transition: "margin 0.3s ease",
          position: "relative",
        }}
      >
        {/* Viewport Container */}
        <Frame
          fill
          scroll
          override={{
            pb: Space.n96,
          }}
          layout={Layout.Center.Default}
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
            }}
            surface="raised"
            style={{
              transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              borderLeft:
                viewport !== "desktop"
                  ? "1px solid var(--border-color)"
                  : "none",
              borderRight:
                viewport !== "desktop"
                  ? "1px solid var(--border-color)"
                  : "none",
              boxShadow:
                viewport !== "desktop" ? "var(--elevation-n4)" : "none",
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
      top="var(--space-n16)"
      zIndex={200}
      style={{ transform: "translateX(-50%)" }}
    >
      <Frame
        surface="raised"
        rounded={Radius2.full}
        layout={Layout.Row.Actions.Default}
        override={{ p: Space.n6, gap: Space.n2, shadow: "xl", border: true }}
      >
        <Action
          icon={Monitor}
          variant={viewport === "desktop" ? "primary" : "ghost"}
          size="sm"
          rounded={Radius2.full}
          onClick={() => setViewport("desktop")}
          tooltip="Desktop"
        />
        <Action
          icon={Tablet}
          variant={viewport === "tablet" ? "primary" : "ghost"}
          size="sm"
          rounded={Radius2.full}
          onClick={() => setViewport("tablet")}
          tooltip="Tablet"
        />
        <Action
          icon={Smartphone}
          variant={viewport === "mobile" ? "primary" : "ghost"}
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
        surface="raised"
        rounded={Radius2.full}
        layout={Layout.Row.Actions.Default}
        override={{ p: Space.n6, gap: Space.n4, shadow: "xl", border: true }}
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
