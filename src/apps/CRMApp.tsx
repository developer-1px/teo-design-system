import { useState } from "react";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { Space } from "../design-system/token/token.const.1tier";
import { DEALS } from "./crm/CRMConstants";
import { CRMDrawer } from "./crm/CRMDrawer";
import { CRMHeader } from "./crm/CRMHeader";
import { CRMSidebar } from "./crm/CRMSidebar";
import { CRMTable } from "./crm/CRMTable";
import { CRMToolbar } from "./crm/CRMToolbar";

export function CRMApp() {
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const selectedDeal = DEALS.find((d) => d.id === selectedDealId) || null;

  return (
    <Frame
      fill
      layout={Layout.Row.AppContainer.Default}
      surface="base"
      override={{ p: Space.n0 }}
    >
      {/* Sidebar Section */}
      <CRMSidebar />

      {/* Main Content Area */}
      <Frame
        style={{
          position: "relative",
        }}
        override={{
          p: Space.n0,
        }}
        fill
        flex
        clip
        borderLeft
      >
        <CRMHeader />
        <CRMToolbar />

        <Frame flex fill scroll override={{ p: Space.n0 }}>
          <CRMTable
            deals={DEALS}
            selectedId={selectedDealId}
            onSelect={(id) => setSelectedDealId(id)}
          />
        </Frame>

        {/* Overlay Drawer */}
        <CRMDrawer
          isOpen={!!selectedDealId}
          onClose={() => setSelectedDealId(null)}
          deal={selectedDeal}
        />
      </Frame>
    </Frame>
  );
}
