import {
  AlertCircle,
  Bug,
  ChevronDown,
  ChevronRight,
  Files,
  GitBranch,
  LayoutGrid,
  MoreHorizontal,
  RefreshCw,
  Search,
  Settings,
  Split,
  UserCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import { Action } from "../design-system/Action";
import { Space } from "../design-system/token/token.const.1tier";
import { Text } from "../design-system/text/Text.tsx";
import { Frame } from "../design-system/Frame";
import { Icon } from "../design-system/Icon";
import { IconSize, FontSize } from "../design-system/token/token.const.1tier";

// --- Activity Bar ---

function ActivityBar({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const isActive = (tab: string) => activeTab === tab;

  return (
    <Frame
      override={{
        w: 48,
        style: { borderRight: "1px solid var(--border-color)" },
        p: "2 0",
        gap: Space.n8,
      }}
      fill
      surface="sunken"
      align="center"
    >
      <Action
        icon={Files}
        variant="ghost"
        size={FontSize.n48}
        iconSize={IconSize.n24}
        opacity={isActive("explorer") ? 1 : 0.5}
        onClick={() => onTabChange("explorer")}
        style={{
          borderLeftWidth: isActive("explorer") ? 2 : 0,
          borderColor: "var(--text-primary)",
        }}
      />
      <Action
        icon={Search}
        variant="ghost"
        size={48}
        iconSize={IconSize.n24}
        opacity={isActive("search") ? 1 : 0.5}
        onClick={() => onTabChange("search")}
      />
      <Action
        icon={GitBranch}
        variant="ghost"
        size={48}
        iconSize={IconSize.n24}
        opacity={isActive("source-control") ? 1 : 0.5}
        onClick={() => onTabChange("source-control")}
      />
      <Action
        icon={Bug}
        variant="ghost"
        size={48}
        iconSize={IconSize.n24}
        opacity={isActive("debug") ? 1 : 0.5}
        onClick={() => onTabChange("debug")}
      />
      <Action
        icon={LayoutGrid}
        variant="ghost"
        size={48}
        iconSize={IconSize.n24}
        opacity={isActive("extensions") ? 1 : 0.5}
        onClick={() => onTabChange("extensions")}
      />

      <Frame flex />

      <Action
        icon={UserCircle}
        variant="ghost"
        size={48}
        iconSize={IconSize.n24}
        opacity={0.5}
      />
      <Action
        icon={Settings}
        variant="ghost"
        size={48}
        iconSize={IconSize.n24}
        opacity={0.5}
      />
    </Frame>
  );
}

// --- Sidebar ---

function Sidebar({ activeTab }: { activeTab: string }) {
  const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);
  const [projectExpanded, setProjectExpanded] = useState(true);

  if (activeTab !== "explorer") {
    // Placeholder for other tabs
    return (
      <Frame
        override={{
          style: { width: 250, borderRight: "1px solid var(--border-color)" },
        }}
        fill
        surface="sunken"
      >
        <Frame override={{ style: { height: 35 }, p: "0 4" }} justify="center">
          <Text size={FontSize.n9} weight="medium" opacity={0.6}>
            {activeTab.toUpperCase()}
          </Text>
        </Frame>
      </Frame>
    );
  }

  return (
    <Frame
      override={{
        style: { width: 250, borderRight: "1px solid var(--border-color)" },
      }}
      fill
      surface="sunken"
    >
      <Frame
        override={{ style: { height: 35 }, p: "0 5" }}
        align="center"
        justify="between"
        row
      >
        <Text size={FontSize.n9} weight="medium">
          EXPLORER
        </Text>
        <Action
          icon={MoreHorizontal}
          size={FontSize.n20}
          iconSize={IconSize.n14}
          variant="ghost"
          opacity={0.5}
        />
      </Frame>

      <Frame flex fill overflow="auto">
        {/* Section: Open Editors */}
        <Frame>
          <Action
            variant="ghost"
            rounded="none"
            onClick={() => setOpenEditorsExpanded(!openEditorsExpanded)}
          >
            <Frame override={{ gap: Space.n4 }} row align="center">
              {openEditorsExpanded ? (
                <Icon src={ChevronDown} size={IconSize.n12} />
              ) : (
                <Icon src={ChevronRight} size={IconSize.n12} />
              )}
              <Text size={FontSize.n9} weight="bold" opacity={0.8}>
                OPEN EDITORS
              </Text>
            </Frame>
          </Action>
          {openEditorsExpanded && (
            <Frame>
              <FileItem name="App" icon="react" active />
              <FileItem name="IDEApp" icon="react" modified />
              <FileItem name="useStore.ts" icon="ts" />
            </Frame>
          )}
        </Frame>

        {/* Section: Project */}
        <Frame>
          <Action
            variant="ghost"
            rounded="none"
            onClick={() => setProjectExpanded(!projectExpanded)}
          >
            <Frame override={{ gap: Space.n4 }} row align="center">
              {projectExpanded ? (
                <Icon src={ChevronDown} size={IconSize.n12} />
              ) : (
                <Icon src={ChevronRight} size={IconSize.n12} />
              )}
              <Text size={FontSize.n9} weight="bold" opacity={0.8}>
                MINIMAL-DESIGN-KIT
              </Text>
            </Frame>
          </Action>
          {projectExpanded && (
            <Frame>
              <FolderItem name="src" expanded>
                <FolderItem name="apps" expanded>
                  <FileItem name="CMSApp" icon="react" />
                  <FileItem name="IDEApp" icon="react" />

                  <FileItem name="SlideApp" icon="react" />
                </FolderItem>
                <FolderItem name="design-system">
                  <FileItem name="Frame" icon="react" />
                  <FileItem name="Action" icon="react" />
                </FolderItem>
                <FileItem name="App" icon="react" />
                <FileItem name="main" icon="react" />
              </FolderItem>
              <FileItem name="package.json" icon="json" />
              <FileItem name="tsconfig.json" icon="json" />
              <FileItem name="vite.config.ts" icon="ts" />
            </Frame>
          )}
        </Frame>
      </Frame>
    </Frame>
  );
}

function FolderItem({
  name,
  expanded: initialExpanded,
  children,
}: {
  name: string;
  expanded?: boolean;
  children?: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <Frame>
      <Action
        variant="ghost"
        rounded="none"
        onClick={() => setExpanded(!expanded)}
      >
        <Frame override={{ gap: Space.n8, p: "0 0 0 4" }} row align="center">
          {expanded ? (
            <Icon src={ChevronDown} size={IconSize.n12} style={{ opacity: 0.6 }} />
          ) : (
            <Icon src={ChevronRight} size={IconSize.n12} style={{ opacity: 0.6 }} />
          )}
          <Text size={FontSize.n13} color="secondary">
            {name}
          </Text>
        </Frame>
      </Action>
      {expanded && (
        <Frame
          override={{
            p: "0 0 0 12",
            style: {
              borderLeftColor: "transparent",
              borderLeft: "1px solid var(--border-color)",
            },
          }}
        >
          {children}
        </Frame>
      )}
    </Frame>
  );
}

function FileItem({
  name,
  icon,
  active,
  modified,
}: {
  name: string;
  icon: "react" | "ts" | "json";
  active?: boolean;
  modified?: boolean;
}) {
  const getIconColor = () => {
    if (icon === "react") return "#61DAFB";
    if (icon === "ts") return "#3178C6";
    if (icon === "json") return "#F1E05A";
    return "var(--text-secondary)";
  };

  return (
    <Action
      variant={active ? "surface" : "ghost"}
      surface={active ? "raised" : undefined}
      rounded="none"
    >
      <Frame override={{ gap: Space.n8, p: "0 0 0 16", w: "100%" }} row align="center">
        <Frame override={{ style: { width: 12, height: 12 } }} pack>
          <Text size={FontSize.n10} style={{ color: getIconColor(), fontWeight: "bold" }}>
            {icon === "react" ? "TSX" : icon === "ts" ? "TS" : "{}"}
          </Text>
        </Frame>
        <Text size={FontSize.n13} color={active ? "primary" : "secondary"}>
          {name}
        </Text>
        {modified && (
          <>
            <Frame flex />
            <Frame
              override={{
                style: {
                  width: 8,
                  height: 8,
                  backgroundColor: "var(--text-secondary)",
                },
                rounded: "full",
              }}
              surface="sunken"
            />
          </>
        )}
      </Frame>
    </Action>
  );
}

// --- Editor Area ---

function EditorTabs() {
  return (
    <Frame
      override={{
        style: { height: 35, borderBottom: "1px solid var(--border-color)" },
      }}
      row
      surface="sunken"
    >
      <Tab title="App" icon="react" active />
      <Tab title="IDEApp" icon="react" modified />
      <Tab title="useStore.ts" icon="ts" />
      <Frame flex />
      <Frame override={{ p: "0 2", gap: Space.n4 }} row align="center">
        <Action
          icon={Split}
          variant="ghost"
          style={{ width: 28, height: 28 }}
          iconSize={IconSize.n14}
          opacity={0.6}
        />
        <Action
          icon={MoreHorizontal}
          variant="ghost"
          style={{ width: 28, height: 28 }}
          iconSize={IconSize.n14}
          opacity={0.6}
        />
      </Frame>
    </Frame>
  );
}

function Tab({
  title,
  icon,
  active,
  modified,
}: {
  title: string;
  icon: "react" | "ts";
  active?: boolean;
  modified?: boolean;
}) {
  const getIconColor = () => {
    if (icon === "react") return "#61DAFB";
    if (icon === "ts") return "#3178C6";
    return "var(--text-secondary)";
  };

  return (
    <Frame
      override={{
        style: {
          width: 120,
          height: "100%",
          cursor: "pointer",
          borderTopColor: active ? "var(--text-primary)" : "transparent",
          borderRight: "1px solid var(--border-color)",
          borderTop: active ? "1px solid var(--border-color)" : undefined,
        },
        p: "0 3",
      }}
      row
      align="center"
      justify="between"
    >
      <Frame override={{ gap: Space.n8 }} row align="center">
        <Text size={FontSize.n10} style={{ color: getIconColor(), fontWeight: "bold" }}>
          {icon === "react" ? "TSX" : "TS"}
        </Text>
        <Text size={FontSize.n13} color={active ? "primary" : "secondary"}>
          {title}
        </Text>
      </Frame>
      <Action
        icon={modified ? undefined : X}
        style={{ width: 20, height: 20 }}
        iconSize={IconSize.n12}
        variant="ghost"
        opacity={0.5}
        onClick={(e) => {
          e.stopPropagation();
          // onClose(file.id);
        }}
      >
        {modified ? (
          <Frame
            override={{ style: { width: 8, height: 8 }, rounded: "full" }}
            surface="overlay"
          />
        ) : undefined}
      </Action>
    </Frame>
  );
}

function Breadcrumbs() {
  return (
    <Frame
      override={{ style: { height: 22 }, p: "0 4", gap: Space.n4 }}
      row
      align="center"
      surface="base"
    >
      <Text size={FontSize.n12} color="tertiary">
        src
      </Text>
      <Icon src={ChevronRight} size={IconSize.n12} style={{ color: "var(--text-tertiary)" }} />
      <Text size={FontSize.n12} color="tertiary">
        App
      </Text>
    </Frame>
  );
}

function CodeEditor() {
  return (
    <Frame flex fill surface="base" row overflow="hidden">
      {/* Gutter */}
      <Frame
        override={{
          w: 50,
          p: "4 0",
          gap: Space.n0,
          opacity: 0.4,
          style: { userSelect: "none" },
        }}
        align="end"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <Text
            key={i}
            size={FontSize.n13}
            mono
            style={{ lineHeight: "20px", paddingRight: 16 }}
          >
            {i + 1}
          </Text>
        ))}
      </Frame>
      {/* Code */}
      <Frame override={{ p: "4 0", style: { position: "relative" } }} flex fill>
        <Text size={FontSize.n13} mono style={{ lineHeight: "20px", whiteSpace: "pre" }}>
          <span style={{ color: "#C586C0" }}>import</span>{" "}
          <span style={{ color: "#9CDCFE" }}>{"{"}</span>{" "}
          <span style={{ color: "#9CDCFE" }}>Routes</span>,{" "}
          <span style={{ color: "#9CDCFE" }}>Route</span>,{" "}
          <span style={{ color: "#9CDCFE" }}>Navigate</span>{" "}
          <span style={{ color: "#9CDCFE" }}>{"}"}</span>{" "}
          <span style={{ color: "#C586C0" }}>from</span>{" "}
          <span style={{ color: "#CE9178" }}>'react-router-dom'</span>
          {"\n"}
          <span style={{ color: "#C586C0" }}>import</span>{" "}
          <span style={{ color: "#9CDCFE" }}>{"{"}</span>{" "}
          <span style={{ color: "#9CDCFE" }}>Frame</span>{" "}
          <span style={{ color: "#9CDCFE" }}>{"}"}</span>{" "}
          <span style={{ color: "#C586C0" }}>from</span>{" "}
          <span style={{ color: "#CE9178" }}>'./design-system/Frame'</span>
          {"\n"}
          {"\n"}
          <span style={{ color: "#569CD6" }}>function</span>{" "}
          <span style={{ color: "#DCDCAA" }}>App</span>(){" "}
          <span style={{ color: "#9CDCFE" }}>{"{"}</span>
          {"\n"}
          {"  "}
          <span style={{ color: "#C586C0" }}>return</span>
          {" ("}
          {"\n"}
          {"    "}
          <span style={{ color: "#808080" }}>{"<>"}</span>
          {"\n"}
          {"      "}
          <span style={{ color: "#808080" }}>{"<"}</span>
          <span style={{ color: "#4EC9B0" }}>Routes</span>
          <span style={{ color: "#808080" }}>{">"}</span>
          {"\n"}
          {"        "}
          <span style={{ color: "#808080" }}>{"<"}</span>
          <span style={{ color: "#4EC9B0" }}>Route</span>{" "}
          <span style={{ color: "#9CDCFE" }}>path</span>=
          <span style={{ color: "#CE9178" }}>"/"</span>{" "}
          <span style={{ color: "#9CDCFE" }}>element</span>=
          <span style={{ color: "#569CD6" }}>{"{"}</span>
          <span style={{ color: "#808080" }}>{"<"}</span>
          <span style={{ color: "#4EC9B0" }}>Navigate</span>{" "}
          <span style={{ color: "#9CDCFE" }}>to</span>=
          <span style={{ color: "#CE9178" }}>"/slide"</span>{" "}
          <span style={{ color: "#808080" }}>{">"}</span>
          <span style={{ color: "#569CD6" }}>{"}"}</span>{" "}
          <span style={{ color: "#808080" }}>{"/>"}</span>
          {"\n"}
          {"      "}
          <span style={{ color: "#808080" }}>{"</"}</span>
          <span style={{ color: "#4EC9B0" }}>Routes</span>
          <span style={{ color: "#808080" }}>{">"}</span>
          {"\n"}
          {"    "}
          <span style={{ color: "#808080" }}>{"</>"}</span>
          {"\n"}
          {"  "}
          {")"}
          {"\n"}
          <span style={{ color: "#9CDCFE" }}>{"}"}</span>
        </Text>
      </Frame>
    </Frame>
  );
}

function Panel() {
  return (
    <Frame
      override={{
        style: { height: 150, borderTop: "1px solid var(--border-color)" },
      }}
      surface="base"
    >
      <Frame
        override={{ style: { height: 35 }, p: "0 4", gap: Space.n16 }}
        row
        align="center"
      >
        <Text size={FontSize.n9} weight="medium" opacity={0.6}>
          PROBLEMS
        </Text>
        <Text size={FontSize.n9} weight="medium" opacity={0.6}>
          OUTPUT
        </Text>
        <Text size={FontSize.n9} weight="medium" opacity={0.6}>
          DEBUG CONSOLE
        </Text>
        <Text
          size={FontSize.n9}
          weight="medium"
          style={{ borderBottom: "1px solid var(--text-primary)" }}
        >
          TERMINAL
        </Text>
      </Frame>
      <Frame
        override={{ p: "2 4", style: { fontFamily: "monospace" } }}
        flex
        fill
      >
        <Frame override={{ gap: Space.n8 }} row align="center">
          <Text size={FontSize.n12} color="secondary">
            ➜ minimal-design-kit
          </Text>
          <Text size={FontSize.n12} color="primary">
            git status
          </Text>
        </Frame>
        <Text size={FontSize.n12} color="secondary">
          On branch main
        </Text>
        <Text size={FontSize.n12} color="secondary">
          Your branch is up to date with 'origin/main'.
        </Text>
        <Text size={FontSize.n12} color="secondary">
          nothing to commit, working tree clean
        </Text>
        <Frame override={{ gap: Space.n8, p: "2 0 0 0" }} row align="center">
          <Text size={FontSize.n12} color="secondary">
            ➜ minimal-design-kit
          </Text>
          <Frame
            override={{ style: { width: 6, height: 14 }, opacity: 0.8 }}
            surface="overlay"
          />
        </Frame>
      </Frame>
    </Frame>
  );
}

// --- Status Bar ---

function StatusBar() {
  return (
    <Frame
      override={{ style: { height: 22 }, p: "0 3" }}
      surface="overlay"
      row
      align="center"
      justify="between"
    >
      <Frame override={{ gap: Space.n12 }} row>
        <Frame override={{ gap: Space.n4 }} row align="center">
          <Icon src={GitBranch} size={IconSize.n10} style={{ color: "white" }} />
          <Text size={FontSize.n11} color="white" weight="medium">
            main*
          </Text>
        </Frame>
        <Frame override={{ gap: Space.n4 }} row align="center">
          <Icon src={RefreshCw} size={IconSize.n10} style={{ color: "white" }} />
        </Frame>
        <Frame override={{ gap: Space.n4, p: "0 0 0 2" }} row align="center">
          <Icon src={AlertCircle} size={IconSize.n10} style={{ color: "white" }} />
          <Text size={FontSize.n11} color="white">
            0
          </Text>
          <Icon src={AlertCircle} size={IconSize.n10} style={{ color: "white" }} />
          <Text size={FontSize.n11} color="white">
            0
          </Text>
        </Frame>
      </Frame>

      <Frame override={{ gap: Space.n16 }} row>
        <Text size={FontSize.n11} color="white">
          Ln 5, Col 24
        </Text>
        <Text size={FontSize.n11} color="white">
          Spaces: 2
        </Text>
        <Text size={FontSize.n11} color="white">
          UTF-8
        </Text>
        <Text size={FontSize.n11} color="white">
          TypeScript JSX
        </Text>
        <Frame override={{ gap: Space.n4 }} row align="center">
          <Text size={FontSize.n11} color="white">
            Prettier
          </Text>
        </Frame>
        <Action
          icon={UserCircle}
          style={{ width: 14, height: 14, color: "white" }}
          iconSize={IconSize.n10}
          variant="ghost"
        />
      </Frame>
    </Frame>
  );
}

// --- Main App ---

export function IDEApp() {
  const [activeTab, setActiveTab] = useState("explorer");

  return (
    <Frame
      fill
      surface="base"
      overflow="hidden"
      grid
      columns="48px 250px 1fr"
      rows="1fr 22px"
      areas="'activity sidebar editor' 'status status status'"
    >
      {/* Main Layout Components placed via gridArea */}
      <Frame override={{ style: { gridArea: "activity" } }}>
        <ActivityBar activeTab={activeTab} onTabChange={setActiveTab} />
      </Frame>

      <Frame override={{ style: { gridArea: "sidebar" } }}>
        <Sidebar activeTab={activeTab} />
      </Frame>

      {/* Editor Area */}
      <Frame
        override={{ style: { gridArea: "editor" } }}
        grid
        rows="35px 22px 1fr 150px"
      >
        <EditorTabs />
        <Breadcrumbs />
        <CodeEditor />
        <Panel />
      </Frame>

      {/* Status Bar */}
      <Frame override={{ style: { gridArea: "status" } }}>
        <StatusBar />
      </Frame>
    </Frame>
  );
}
