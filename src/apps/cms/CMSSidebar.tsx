import {
  ChevronRight,
  FileText,
  Grid2X2,
  Layout as LayoutIcon,
  List,
  Menu,
  Plus,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";

interface CMSSidebarProps {
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
        clip: true,
      }}
      style={{
        width: isOpen ? "var(--size-n240)" : "var(--size-n64)",
        whiteSpace: "nowrap",
        transformOrigin: "top left",
        transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      surface="sunken"
    >
      {/* Header with Toggle */}
      <Frame
        override={{ gap: Space.n12, py: Space.n0, px: Space.n4 }}
        layout={Layout.Row.Header.Default}
        align="center"
      >
        <Action
          icon={isOpen ? LayoutIcon : Menu}
          variant="ghost"
          size="sm"
          rounded="md"
          onClick={onToggle}
          tooltip={isOpen ? "Collapse" : "Expand"}
        />

        <Frame
          override={{
            gap: Space.n8,
          }}
          style={{
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: isOpen ? "auto" : "none",
          }}
          layout={Layout.Row.Actions.Default}
          align="center"
        ></Frame>
      </Frame>

      {/* Content - Hidden when closed */}
      <Frame
        override={{
          gap: Space.n8,
        }}
        style={{
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.2s",
          pointerEvents: isOpen ? "auto" : "none",
          display: isOpen ? "flex" : "none",
        }}
        flex
        scroll
      >
        <Frame
          override={{
            gap: Space.n8,
            pt: Space.n0,
            pr: Space.n8,
            pb: Space.n8,
            pl: Space.n8,
          }}
          layout={Layout.Row.Header.Default}
          align="center"
          justify="between"
        >
          <Frame
            override={{ gap: Space.n8 }}
            layout={Layout.Row.Item.Default}
            align="center"
          >
            <Text.Card.Note
              weight="bold"
              size={FontSize.n11}
              style={{ color: "var(--text-tertiary)" }}
            >
              SECTIONS
            </Text.Card.Note>
            <Action
              icon={Plus}
              size="xs"
              variant="ghost"
              rounded="full"
              tooltip="Add Section"
              onClick={() => console.log("Add Section")}
            />
          </Frame>
          <Frame
            override={{ gap: Space.n4, p: Space.n4}} rounded="md"
            layout={Layout.Row.Actions.Default}
            surface="sunken"
          >
            <Action
              icon={Grid2X2}
              size="xs"
              variant={viewMode === "thumbnail" ? "surface" : "ghost"}
              rounded="sm"
              onClick={() => setViewMode("thumbnail")}
            />
            <Action
              icon={List}
              size="xs"
              variant={viewMode === "bar" ? "surface" : "ghost"}
              rounded="sm"
              onClick={() => setViewMode("bar")}
            />
          </Frame>
        </Frame>

        <Frame
          override={{ gap: viewMode === "thumbnail" ? Space.n12 : Space.n4 }}
        >
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
        }}
        style={{
          borderTop: "1px solid var(--border-color)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.2s",
          display: isOpen ? "flex" : "none",
        }}
        layout={Layout.Row.Item.Default}
        align="center"
      >
        <Frame
          override={{ w: Size.n32, h: Size.n32}} rounded="full"
          surface="sunken"
          pack
        >
          <Icon src={Settings} size={IconSize.n16} />
        </Frame>
        <Frame override={{ gap: Space.n0 }}>
          <Text.Card.Title size={FontSize.n13} weight="medium">
            Site Settings
          </Text.Card.Title>
          <Text.Card.Note
            size={FontSize.n11}
            style={{ color: "var(--text-tertiary)" }}
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
        <Frame
          override={{ gap: Space.n8 }}
          layout={Layout.Row.Meta.Default}
          align="center"
        >
          <Icon src={FileText} size={IconSize.n10} style={{ opacity: 0.5 }} />
          <Text.Card.Note
            size={FontSize.n11}
            weight={active ? "bold" : "medium"}
          >
            {label}
          </Text.Card.Note>
        </Frame>
        <Frame
          override={{w: Size.full,
            cursor: "pointer"}} rounded="md"
          style={{
            border: "1px solid var(--border-color)",
            boxShadow: active ? "0 0 0 1.5px var(--text-primary)" : "none",
            borderColor: active ? "var(--text-primary)" : "var(--border-color)",
          }}
          ratio="16/9"
          surface={active ? "base" : "sunken"}
          pack
        >
          {active && (
            <Frame
              override={{w: Size.n8,
                h: Size.n8,
                shadow: "sm"}} rounded="full"
              surface="primary"
            />
          )}
        </Frame>
      </Frame>
    );
  }

  return (
    <Frame
      override={{py: Space.n8, px: Space.n12, cursor: "pointer"}} rounded="md"
      layout={Layout.Row.Item.Default}
      align="center"
      justify="between"
      surface={active ? "raised" : undefined}
    >
      <Frame
        override={{ gap: Space.n8 }}
        layout={Layout.Row.Item.Tight}
        align="center"
      >
        <Icon src={FileText} size={IconSize.n14} style={{ opacity: 0.5 }} />
        <Text.Card.Title
          size={FontSize.n13}
          weight={active ? "bold" : "medium"}
        >
          {label}
        </Text.Card.Title>
      </Frame>
      {active && (
        <Icon src={ChevronRight} size={IconSize.n12} style={{ opacity: 0.5 }} />
      )}
    </Frame>
  );
}
