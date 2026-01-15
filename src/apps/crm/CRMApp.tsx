import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Size, Space } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { CRMDrawer } from "./CRMDrawer";
import { CRMHeader } from "./CRMHeader";
import { CRMSidebar } from "./CRMSidebar";
import { CRMTable } from "./CRMTable";
import { CRMToolbar } from "./CRMToolbar";
import { loadDataset } from "./dataLoader";
import { currentDataAtom, isLoadingAtom, selectedDatasetAtom } from "./store";

export function CRMApp() {
  const selectedDataset = useAtomValue(selectedDatasetAtom);
  const setCurrentData = useSetAtom(currentDataAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);

  // Load data when selected dataset changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await loadDataset(selectedDataset);
      setCurrentData(data);
      setIsLoading(false);
    };

    loadData();
  }, [selectedDataset, setCurrentData, setIsLoading]);

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
          borderLeft: true,
        }}
        fill
        flex
        clip
      >
        <CRMHeader />
        <CRMToolbar />

        <Frame flex fill scroll override={{ p: Space.n0 }}>
          {isLoading ? (
            <Frame fill pack override={{ align: "center", justify: "center" }}>
              <Frame
                override={{ w: Size.n24, h: Size.n24 }}
                rounded={Radius2.full}
                style={{
                  border: "2px solid var(--border-color)",
                  borderTopColor: "var(--text-primary)",
                  animation: "spin 1s linear infinite",
                }}
              />
            </Frame>
          ) : (
            <CRMTable />
          )}
        </Frame>

        {/* Overlay Drawer */}
        <CRMDrawer />
      </Frame>
    </Frame>
  );
}
