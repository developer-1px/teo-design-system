import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { Frame } from "@/design-system/Frame/Frame.tsx";
import { Layout } from "@/design-system/Frame/Layout/Layout.ts";
import { CRMDrawer } from "./CRMDrawer";
import { CRMHeader } from "./CRMHeader";
import { CRMSidebar } from "./CRMSidebar";
import { CRMTable } from "./CRMTable";
import { CRMToolbar } from "./CRMToolbar";
import { loadDataset } from "./dataLoader";
import { currentDataAtom, isLoadingAtom, selectedDatasetAtom } from "./store";
import { Radius2 } from "@/design-system/token/radius2";

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
      override={{ w: Size.screen, h: Size.screen }}
      layout={Layout.Row.Stretch.Start}
      spacing={Space.n0}
      w={Size.fill}
      h={Size.fill}
      surface="base" // 1. Flat base foundation
    >
      {/* Sidebar: Sunken + Border Right */}
      <CRMSidebar />

      {/* Main Content Area: Flat, Border Separated */}
      <Frame
        override={{ fill: true, borderRight: true, minWidth: Size.n0, flex: 1 }}
      >
        <Frame
          override={{ fill: true, clip: true, flex: 1 }}
          surface="base"
          style={{
            position: "relative",
          }}
        >
          <CRMHeader />
          <CRMToolbar />

          <Frame override={{ fill: true, p: Space.n0, flex: 1 }}>
            {isLoading ? (
              <Frame
                override={{
                  fill: true,
                  pack: true,
                  align: "center",
                  justify: "center",
                }}
              >
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
    </Frame>
  );
}
