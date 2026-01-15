import { useState } from "react";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Space, Size } from "../design-system/token/token.const.1tier";

// import { ProseDocument } from "../design-system/Prose";

// CMS Sections
import { BodyContentSection } from "./cms/BodyContentSection";
import { TopCenterBar, TopRightBar } from "./cms/CMSNavigation";
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

  return (
    <Frame override={{ p: Space.n0 }} fill surface="raised" clip>
      <TopCenterBar />
      <TopRightBar />

      <Frame
        style={{ position: "relative" }}
        override={{}}
        layout={Layout.Row.AppContainer.Default}
        fill
        align="stretch"
      >
        <CMSSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setSidebarOpen(!isSidebarOpen)}
        />
        <Frame
          override={{ p: Space.n0 }}
          flex
          fill
          surface="overlay"
          align="center"
          justify="start"
          scroll
        >
          {/* The Canvas */}
          <Frame style={{ minHeight: "100%" }} override={{ w: Size.full }}>
            <SiteHeader
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
            />
            <ScrollTabSection />
            <HeaderHero />
            <FeatureGridSection />
            <BodyContentSection />
            <ImageFooterBanner />
            <FAQBoardFooter />
            <MainFooter />
          </Frame>
        </Frame>
      </Frame>
    </Frame>
  );
}
