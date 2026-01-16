import { useCallback, useRef } from "react";
import { useControlledState } from "./utils/useControlledState";
import { useId } from "./utils/useId";

/**
 * Options for useTabs hook
 */
export interface UseTabsOptions {
  /** Array of tab IDs */
  tabs: string[];
  /** Default selected tab ID (uncontrolled mode) */
  defaultTab?: string;
  /** Controlled selected tab ID */
  selectedTab?: string;
  /** Callback when selected tab changes */
  onChange?: (tabId: string) => void;
  /** Orientation of the tab list */
  orientation?: "horizontal" | "vertical";
  /**
   * Keyboard activation mode
   * - "automatic": Tab changes on arrow key press (default)
   * - "manual": Arrow keys only move focus, Enter/Space activates
   */
  keyboardActivation?: "automatic" | "manual";
}

/**
 * Props for tab list container
 */
export interface TabListProps {
  /** ARIA role */
  role: "tablist";
  /** ARIA orientation */
  "aria-orientation": "horizontal" | "vertical";
  /** Keyboard event handler */
  onKeyDown: (e: React.KeyboardEvent) => void;
}

/**
 * Props for individual tab element
 */
export interface TabProps {
  /** ARIA role */
  role: "tab";
  /** Whether the tab is selected */
  "aria-selected": boolean;
  /** ID of the panel this tab controls */
  "aria-controls": string;
  /** Tab index for keyboard navigation */
  tabIndex: number;
  /** Click handler */
  onClick: () => void;
  /** Keyboard event handler */
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Unique ID for the tab */
  id: string;
}

/**
 * Props for tab panel element
 */
export interface TabPanelProps {
  /** ARIA role */
  role: "tabpanel";
  /** ID of the tab that controls this panel */
  "aria-labelledby": string;
  /** Whether the panel is hidden */
  hidden: boolean;
  /** Tab index for keyboard navigation */
  tabIndex: 0;
  /** Unique ID for the panel */
  id: string;
}

/**
 * Return value from useTabs hook
 */
export interface UseTabsReturn {
  /** Currently selected tab ID */
  selectedTab: string;
  /** Get props for tab list container */
  getTabListProps: () => TabListProps;
  /** Get props for individual tab */
  getTabProps: (id: string) => TabProps;
  /** Get props for tab panel */
  getTabPanelProps: (id: string) => TabPanelProps;
  /** Select a specific tab */
  selectTab: (id: string) => void;
}

/**
 * Headless tabs hook with full ARIA support
 * Follows WAI-ARIA Tabs Pattern and React Aria design
 *
 * Features:
 * - Arrow key navigation (←→ for horizontal, ↑↓ for vertical)
 * - Home/End key support
 * - Automatic or manual keyboard activation
 * - Full ARIA attributes
 *
 * @param options - Configuration options
 * @returns Tabs state and prop getters
 *
 * @example
 * ```tsx
 * function MyTabs() {
 *   const { selectedTab, getTabListProps, getTabProps, getTabPanelProps } = useTabs({
 *     tabs: ["overview", "activity", "settings"],
 *     defaultTab: "overview",
 *   });
 *
 *   return (
 *     <div>
 *       <div {...getTabListProps()}>
 *         {tabs.map((tab) => (
 *           <button key={tab.id} {...getTabProps(tab.id)}>
 *             {tab.label}
 *           </button>
 *         ))}
 *       </div>
 *       {tabs.map((tab) => (
 *         <div key={tab.id} {...getTabPanelProps(tab.id)}>
 *           {tab.content}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useTabs(options: UseTabsOptions): UseTabsReturn {
  const {
    tabs,
    defaultTab = tabs[0],
    selectedTab: controlledSelectedTab,
    onChange,
    orientation = "horizontal",
    keyboardActivation = "automatic",
  } = options;

  const baseId = useId("tabs");
  const focusedTabRef = useRef<string | null>(null);

  // Use controlled state pattern
  const [selectedTab, setSelectedTab] = useControlledState(
    controlledSelectedTab,
    defaultTab,
    onChange,
  );

  /**
   * Select a specific tab
   */
  const selectTab = useCallback(
    (id: string) => {
      if (tabs.includes(id)) {
        setSelectedTab(id);
        focusedTabRef.current = id;
      }
    },
    [tabs, setSelectedTab],
  );

  /**
   * Move focus to next/previous tab
   */
  const moveFocus = useCallback(
    (direction: number) => {
      const currentIndex = tabs.indexOf(focusedTabRef.current ?? selectedTab);
      let nextIndex = currentIndex + direction;

      // Wrap around
      if (nextIndex < 0) nextIndex = tabs.length - 1;
      if (nextIndex >= tabs.length) nextIndex = 0;

      const nextTab = tabs[nextIndex];
      focusedTabRef.current = nextTab;

      // Auto-select if keyboard activation is automatic
      if (keyboardActivation === "automatic") {
        setSelectedTab(nextTab);
      }

      return nextTab;
    },
    [tabs, selectedTab, keyboardActivation, setSelectedTab],
  );

  /**
   * Handle keyboard navigation for tab list
   */
  const handleTabListKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const isHorizontal = orientation === "horizontal";

      switch (e.key) {
        case isHorizontal ? "ArrowRight" : "ArrowDown":
          e.preventDefault();
          moveFocus(1);
          break;

        case isHorizontal ? "ArrowLeft" : "ArrowUp":
          e.preventDefault();
          moveFocus(-1);
          break;

        case "Home":
          e.preventDefault();
          focusedTabRef.current = tabs[0];
          if (keyboardActivation === "automatic") {
            setSelectedTab(tabs[0]);
          }
          break;

        case "End":
          e.preventDefault();
          focusedTabRef.current = tabs[tabs.length - 1];
          if (keyboardActivation === "automatic") {
            setSelectedTab(tabs[tabs.length - 1]);
          }
          break;
      }
    },
    [orientation, tabs, keyboardActivation, moveFocus, setSelectedTab],
  );

  /**
   * Handle keyboard activation for individual tab (manual mode)
   */
  const handleTabKeyDown = useCallback(
    (id: string) => (e: React.KeyboardEvent) => {
      if (keyboardActivation === "manual") {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectTab(id);
        }
      }
    },
    [keyboardActivation, selectTab],
  );

  /**
   * Get props for tab list container
   */
  const getTabListProps = useCallback(
    (): TabListProps => ({
      role: "tablist",
      "aria-orientation": orientation,
      onKeyDown: handleTabListKeyDown,
    }),
    [orientation, handleTabListKeyDown],
  );

  /**
   * Get props for individual tab
   */
  const getTabProps = useCallback(
    (id: string): TabProps => {
      const tabId = `${baseId}-tab-${id}`;
      const panelId = `${baseId}-panel-${id}`;
      const isSelected = selectedTab === id;

      return {
        role: "tab",
        "aria-selected": isSelected,
        "aria-controls": panelId,
        // Selected tab is tabbable (0), others are not (-1)
        tabIndex: isSelected ? 0 : -1,
        onClick: () => selectTab(id),
        onKeyDown: handleTabKeyDown(id),
        id: tabId,
      };
    },
    [baseId, selectedTab, selectTab, handleTabKeyDown],
  );

  /**
   * Get props for tab panel
   */
  const getTabPanelProps = useCallback(
    (id: string): TabPanelProps => {
      const tabId = `${baseId}-tab-${id}`;
      const panelId = `${baseId}-panel-${id}`;
      const isSelected = selectedTab === id;

      return {
        role: "tabpanel",
        "aria-labelledby": tabId,
        hidden: !isSelected,
        tabIndex: 0,
        id: panelId,
      };
    },
    [baseId, selectedTab],
  );

  return {
    selectedTab,
    getTabListProps,
    getTabProps,
    getTabPanelProps,
    selectTab,
  };
}
