import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { CRMDrawer } from "./CRMDrawer";
import { CRMHeader } from "./CRMHeader";
import { CRMSidebar } from "./CRMSidebar";
import { CRMTable } from "./CRMTable";
import { CRMToolbar } from "./CRMToolbar";
import { loadDataset } from "./dataLoader";
import { currentDataAtom, isLoadingAtom, selectedDatasetAtom } from "./store";
import { Radius2 } from "@/legacy-design-system/token/radius2";

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
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        justifyContent: "flex-start",
        backgroundColor: "var(--surface-base)",
      }}
    >
      {/* Sidebar: Sunken + Border Right */}
      <CRMSidebar />

      {/* Main Content Area: Flat, Border Separated */}
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          borderRight: "1px solid var(--border-subtle)",
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            position: "relative",
            backgroundColor: "var(--surface-base)",
            overflow: "hidden",
          }}
        >
          <CRMHeader />
          <CRMToolbar />

          <div style={{ flex: 1, width: "100%", height: "100%", padding: 0, position: "relative" }}>
            {isLoading ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: "2px solid var(--border-color)",
                    borderTopColor: "var(--text-primary)",
                    animation: "spin 1s linear infinite",
                  }}
                />
              </div>
            ) : (
              <CRMTable />
            )}
          </div>

          {/* Overlay Drawer */}
          <CRMDrawer />
        </div>
      </div>
    </div>
  );
}
