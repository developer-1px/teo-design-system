import {
  ChevronRight,
  FileText,
  Grid2X2,
  Layout,
  List,
  Menu,
  Plus,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";
import { Action } from "../../design-system/Action";

export interface CMSSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function CMSSidebar({ isOpen, onToggle }: CMSSidebarProps) {
  const [viewMode, setViewMode] = useState<"bar" | "thumbnail">("thumbnail");

  return (
    <Frame
      override={{
        h: "100%",
        p: 1,
        gap: 1,
        style: {
          borderRight: "1px solid var(--border-color)",
          width: isOpen ? 240 : 60,
          overflow: "hidden",
          whiteSpace: "nowrap",
          transformOrigin: "top left",
          transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        },
      }}
      surface="raised"
    >
      {/* Header with Toggle */}
      <Frame override={{ gap: 3, p: "0 4px" }} row align="center">
        <Action
          icon={isOpen ? Layout : Menu}
          variant="ghost"
          size="sm"
          rounded="md"
          onClick={onToggle}
          tooltip={isOpen ? "Collapse" : "Expand"}
        />

        <Frame
          override={{
            gap: 2,
            style: {
              opacity: isOpen ? 1 : 0,
              transition: "opacity 0.2s",
              pointerEvents: isOpen ? "auto" : "none",
            },
          }}
          row
          align="center"
        ></Frame>
      </Frame>

      {/* Content - Hidden when closed */}
      <Frame
        override={{
          gap: "8px",
          style: {
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: isOpen ? "auto" : "none",
            display: isOpen ? "flex" : "none", // Fully hide to prevent layout issues
          },
        }}
        flex
        overflow="scroll"
      >
        <Frame
          override={{ gap: 2, p: "0px 8px 8px 8px" }}
          row
          align="center"
          justify="between"
        >
          <Frame override={{ gap: 2 }} row align="center">
            <Text.Card.Note
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: "var(--text-tertiary)",
              }}
            >
              SECTIONS
            </Text.Card.Note>
            <Action
              icon={Plus}
              size="xs" // smallest size
              variant="ghost"
              rounded="full"
              tooltip="Add Section"
              onClick={() => console.log("Add Section")}
            />
          </Frame>
          <Frame
            override={{ gap: 1, p: "2px", rounded: "md" }}
            row
            surface="sunken"
          >
            <Action
              icon={Grid2X2}
              size={5}
              variant={viewMode === "thumbnail" ? "surface" : "ghost"}
              rounded="sm"
              onClick={() => setViewMode("thumbnail")}
            />
            <Action
              icon={List}
              size={5}
              variant={viewMode === "bar" ? "surface" : "ghost"}
              rounded="sm"
              onClick={() => setViewMode("bar")}
            />
          </Frame>
        </Frame>

        <Frame override={{ gap: viewMode === "thumbnail" ? "12px" : "4px" }}>
          <LayerItem label="Hero Section" active viewMode={viewMode} />
          <LayerItem label="Feature Grid" viewMode={viewMode} />
          <LayerItem label="Testimonials" viewMode={viewMode} />
          <LayerItem label="Footer" viewMode={viewMode} />
        </Frame>
      </Frame>

      {/* Footer Settings */}
      <Frame
        override={{
          gap: 3,
          p: 3,
          style: {
            borderTop: "1px solid var(--border-color)",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.2s",
            display: isOpen ? "flex" : "none",
          },
        }}
        row
        align="center"
      >
        <Frame
          override={{ style: { width: 32, height: 32 }, rounded: "full" }}
          surface="sunken"
          pack
        >
          <Settings size={16} />
        </Frame>
        <Frame override={{ gap: "2px" }}>
          <Text.Card.Title style={{ fontSize: 13, fontWeight: 500 }}>
            Site Settings
          </Text.Card.Title>
          <Text.Card.Note
            style={{ fontSize: 11, color: "var(--text-tertiary)" }}
          >
            General, SEO, Analytics
          </Text.Card.Note>
        </Frame>
      </Frame>
    </Frame>
  );
}

interface LayerItemProps {
  label: string;
  active?: boolean;
  viewMode: "bar" | "thumbnail";
}

function LayerItem({ label, active, viewMode }: LayerItemProps) {
  if (viewMode === "thumbnail") {
    return (
      <Frame override={{ gap: 1.5, p: "0 8px" }}>
        <Frame override={{ gap: 2 }} row align="center">
          <FileText size={10} opacity={0.5} />
          <Text.Card.Note
            style={{ fontSize: 11, fontWeight: active ? "bold" : "medium" }}
          >
            {label}
          </Text.Card.Note>
        </Frame>
        <Frame
          override={{
            w: "100%",
            rounded: "md",
            style: {
              border: "1px solid var(--border-color)",
              boxShadow: active ? "0 0 0 1.5px var(--text-primary)" : "none",
              borderColor: active
                ? "var(--text-primary)"
                : "var(--border-color)",
            },
          }}
          ratio="16/9"
          surface={active ? "base" : "sunken"}
          pack
          cursor="pointer"
        >
          {active && (
            <Frame
              override={{ w: 8, h: 8, rounded: "full", shadow: "sm" }}
              surface="primary"
            />
          )}
        </Frame>
      </Frame>
    );
  }

  return (
    <Frame
      override={{ p: "8px 12px", rounded: "md" }}
      row
      align="center"
      justify="between"
      surface={active ? "raised" : undefined}
      cursor="pointer"
    >
      <Frame override={{ gap: "8px" }} row align="center">
        <FileText size={14} opacity={0.5} />
        <Text.Card.Title
          style={{ fontSize: 13, fontWeight: active ? "bold" : "medium" }}
        >
          {label}
        </Text.Card.Title>
      </Frame>
      {active && <ChevronRight size={12} opacity={0.5} />}
    </Frame>
  );
}
