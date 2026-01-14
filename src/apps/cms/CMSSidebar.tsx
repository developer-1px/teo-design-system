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
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Action } from "../../design-system/Action";
import { Space } from "../../design-system/token/token.const.1tier";
import { Icon } from "../../design-system/Icon";
import { IconSize, Size } from "../../design-system/token/token.const.1tier";

export interface CMSSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function CMSSidebar({ isOpen, onToggle }: CMSSidebarProps) {
  const [viewMode, setViewMode] = useState<"bar" | "thumbnail">("thumbnail");

  return (
    <Frame
      override={{
        h: Size.full,
        p: Space.n4,
        gap: Space.n4,
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
      <Frame override={{ gap: Space.n12, py: Space.n0, px: Space.n4 }} row align="center">
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
            gap: Space.n8,
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
          gap: Space.n8,
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
          override={{ gap: Space.n8, pt: Space.n0, pr: Space.n8, pb: Space.n8, pl: Space.n8 }}
          row
          align="center"
          justify="between"
        >
          <Frame override={{ gap: Space.n8 }} row align="center">
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
            override={{ gap: Space.n4, style: { padding: "2px" }, rounded: "md" }}
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

        <Frame override={{ gap: viewMode === "thumbnail" ? Space.n12 : Space.n4 }}>
          <LayerItem label="Hero Section" active viewMode={viewMode} />
          <LayerItem label="Feature Grid" viewMode={viewMode} />
          <LayerItem label="Testimonials" viewMode={viewMode} />
          <LayerItem label="Footer" viewMode={viewMode} />
        </Frame>
      </Frame>

      {/* Footer Settings */}
      <Frame
        override={{
          gap: Space.n12,
          p: Space.n12,
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
          <Icon src={Settings} size={IconSize.n16} />
        </Frame>
        <Frame override={{ gap: Space.n2 }}>
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
      <Frame override={{ gap: Space.n6, py: Space.n0, px: Space.n8 }}>
        <Frame override={{ gap: Space.n8 }} row align="center">
          <Icon src={FileText} size={IconSize.n10} style={{ opacity: 0.5 }} />
          <Text.Card.Note
            style={{ fontSize: 11, fontWeight: active ? "bold" : "medium" }}
          >
            {label}
          </Text.Card.Note>
        </Frame>
        <Frame
          override={{
            w: Size.full,
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
              override={{ w: Size.n8, h: Size.n8, rounded: "full", shadow: "sm" }}
              surface="primary"
            />
          )}
        </Frame>
      </Frame>
    );
  }

  return (
    <Frame
      override={{ py: Space.n8, px: Space.n12, rounded: "md" }}
      row
      align="center"
      justify="between"
      surface={active ? "raised" : undefined}
      cursor="pointer"
    >
      <Frame override={{ gap: Space.n8 }} row align="center">
        <Icon src={FileText} size={IconSize.n14} style={{ opacity: 0.5 }} />
        <Text.Card.Title
          style={{ fontSize: 13, fontWeight: active ? "bold" : "medium" }}
        >
          {label}
        </Text.Card.Title>
      </Frame>
      {active && <Icon src={ChevronRight} size={IconSize.n12} style={{ opacity: 0.5 }} />}
    </Frame>
  );
}
