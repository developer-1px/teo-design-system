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
import * as styles from "./cms/CMSApp.css";

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
import { PricingSection } from "./cms/PricingSection";
import { ScrollTabSection } from "./cms/ScrollTabSection";
import { SiteHeader } from "./cms/SiteHeader";
import { TestimonialsSection } from "./cms/TestimonialsSection";

export function CMSApp() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [isRightPanelOpen, setRightPanelOpen] = useState(true);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(true);

  return (
    <div className={styles.app}>
      <CMSSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      <main className={styles.main}>
        {/* Scrollable Canvas */}
        <div className={styles.canvasScroll}>
          {/* Viewport Frame with Variant */}
          <div className={styles.viewportFrame({ mode: viewport })}>
            <SiteHeader isSidebarOpen={isSidebarOpen} />
            <HeaderHero />
            <ScrollTabSection />
            <FeatureGridSection />
            <BodyContentSection />
            <PricingSection />
            <TestimonialsSection />
            <ImageFooterBanner />
            <FAQBoardFooter />
            <MainFooter />
          </div>
        </div>
      </main>

      {/* Floating Overlays - positioned fixed via CSS */}
      <ViewportSelector viewport={viewport} setViewport={setViewport} />

      <BottomToolbar
        isEditMode={isEditMode}
        toggleEditMode={() => setEditMode(!isEditMode)}
        isRightPanelOpen={isRightPanelOpen}
        toggleRightPanel={() => setRightPanelOpen(!isRightPanelOpen)}
        isDrawerOpen={isDrawerOpen}
        toggleDrawer={() => setDrawerOpen(!isDrawerOpen)}
      />

      {isRightPanelOpen && (
        <CMSRightPanel onClose={() => setRightPanelOpen(false)} />
      )}

      {isDrawerOpen && <CMSDrawer onClose={() => setDrawerOpen(false)} />}
    </div>
  );
}

function ViewportSelector({ viewport, setViewport }: any) {
  return (
    <div className={styles.viewportSelector}>
      <button
        className={styles.iconBtn({ active: viewport === "desktop" })}
        onClick={() => setViewport("desktop")}
        title="Desktop"
      >
        <Monitor size={16} />
      </button>
      <button
        className={styles.iconBtn({ active: viewport === "tablet" })}
        onClick={() => setViewport("tablet")}
        title="Tablet"
      >
        <Tablet size={16} />
      </button>
      <button
        className={styles.iconBtn({ active: viewport === "mobile" })}
        onClick={() => setViewport("mobile")}
        title="Mobile"
      >
        <Smartphone size={16} />
      </button>
    </div>
  );
}

function BottomToolbar({ isEditMode, toggleEditMode, toggleDrawer }: any) {
  return (
    <div className={styles.bottomToolbar}>
      <button
        className={styles.iconBtn({ active: isEditMode })}
        onClick={toggleEditMode}
        title={isEditMode ? "Edit Mode" : "Preview Mode"}
      >
        {isEditMode ? <Edit size={16} /> : <Eye size={16} />}
      </button>
      <button className={styles.iconBtn()} title="Save"><Save size={16} /></button>
      <div className={styles.dividerV} />
      <button className={styles.iconBtn()} title="Preview"><Play size={16} /></button>
      <div className={styles.dividerV} />
      <button className={styles.iconBtn()} title="Import"><Upload size={16} /></button>
      <button className={styles.iconBtn()} title="Export"><Download size={16} /></button>
      <div className={styles.dividerV} />
      <button className={styles.iconBtn()} onClick={toggleDrawer} title="Options"><Menu size={16} /></button>
    </div>
  );
}
