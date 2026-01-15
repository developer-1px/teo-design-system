import {
  Menu,
  Monitor,
  PanelRight,
  Play,
  Smartphone,
  Tablet,
} from "lucide-react";
import { useState } from "react";
import { Action } from "../design-system/Action";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Overlay } from "../design-system/Overlay";
import { ContainerSize, Space } from "../design-system/token/token.const.1tier";
import { Radius2 } from "../design-system/token/token.const.2tier";

// CMS Sections
import { BodyContentSection } from "./cms/BodyContentSection";
import { CMSSidebar } from "./cms/CMSSidebar";
import { FAQBoardFooter } from "./cms/FAQBoardFooter";
import { FeatureGridSection } from "./cms/FeatureGridSection";
import { HeaderHero } from "./cms/HeaderHero";
import { ImageFooterBanner } from "./cms/ImageFooterBanner";
import { MainFooter } from "./cms/MainFooter";
import { ScrollTabSection } from "./cms/ScrollTabSection";
import { SiteHeader } from "./cms/SiteHeader";
import { CMSRightPanel } from "./cms/CMSRightPanel";

export function CMSApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [isRightPanelOpen, setRightPanelOpen] = useState(false);

  return (
    <Frame
      override={{ p: Space.n0 }}
      fill
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
            align: "center",
            pb: Space.n96,
          }}
        >
          {/* Viewport Frame */}
          <Frame
            override={{
              w:
                viewport === "mobile"
                  ? ContainerSize.n320
                  : viewport === "tablet"
                    ? ContainerSize.n768
                    : "full",
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
                viewport !== "desktop"
                  ? "var(--elevation-n4)"
                  : "none",
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

        {/* Floating Toolbar */}
        <FloatingToolbar
          viewport={viewport}
          setViewport={setViewport}
          isRightPanelOpen={isRightPanelOpen}
          toggleRightPanel={() => setRightPanelOpen(!isRightPanelOpen)}
        />
      </Frame>

      {isRightPanelOpen && (
        <CMSRightPanel onClose={() => setRightPanelOpen(false)} />
      )}
    </Frame>
  );
}

interface FloatingToolbarProps {
  viewport: "desktop" | "tablet" | "mobile";
  setViewport: (v: "desktop" | "tablet" | "mobile") => void;
  isRightPanelOpen: boolean;
  toggleRightPanel: () => void;
}

function FloatingToolbar({
  viewport,
  setViewport,
  isRightPanelOpen,
  toggleRightPanel,
}: FloatingToolbarProps) {
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
        style={{ border: "1px solid var(--border-color)" }}
        override={{ p: Space.n6, gap: Space.n4, shadow: "xl", align: "center" }}
      >
        <Frame layout={Layout.Row.Item.Compact} override={{ gap: Space.n2 }}>
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

        <Frame
          style={{
            width: "1px",
            height: "16px",
            backgroundColor: "var(--border-color)",
          }}
        />

        <Action
          icon={Play}
          variant="ghost"
          size="sm"
          rounded={Radius2.full}
          tooltip="Preview"
        />

        <Action
          icon={PanelRight}
          variant={isRightPanelOpen ? "primary" : "ghost"}
          size="sm"
          rounded={Radius2.full}
          onClick={toggleRightPanel}
          tooltip="Toggle Properties"
        />

        <Frame
          style={{
            width: "1px",
            height: "16px",
            backgroundColor: "var(--border-color)",
          }}
        />

        <Action
          icon={Menu}
          variant="ghost"
          size="sm"
          rounded={Radius2.full}
          tooltip="Options"
        />
      </Frame>
    </Overlay>
  );
}
