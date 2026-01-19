import {
  ChevronRight,
  FileText,
  Grid2X2,
  PanelLeft,
  Plus,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Icon } from "../../design-system/Icon";
import { ResizeHandle, useResizable } from "../../design-system/Resizable";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

interface CMSSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function CMSSidebar({ isOpen, onToggle }: CMSSidebarProps) {
  // Resizable hook (only when open)
  const { size, resizeHandleProps } = useResizable({
    direction: "left",
    defaultSize: 240,
    minSize: 200,
    maxSize: 400,
    storageKey: "cms-sidebar-width",
  });

  return (
    <Frame
      override={{
        h: Size.fill,
        p: Space.n4,
        clip: true,
      }}
      style={{
        width: isOpen ? `${size}px` : "var(--size-n64)",
        whiteSpace: "nowrap",
        transformOrigin: "top left",
        transition: isOpen
          ? "none"
          : "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        position: "relative",
      }}
      surface="sunken"
      layout={Layout.Col.Stretch.Start}
      spacing={Space.n4}
    >
      {isOpen && <ResizeHandle direction="left" {...resizeHandleProps} />}
      {/* Toggle Button - Top Right */}
      <Frame
        override={{
          py: Space.n0,
          px: Space.n4,
        }}
        layout={Layout.Row.Middle.End}
        spacing={Space.n8}
      >
        <Action
          icon={PanelLeft}
          variant="ghost"
          size="sm"
          rounded={Radius2.md}
          onClick={onToggle}
          tooltip={isOpen ? "Collapse" : "Expand"}
        />
      </Frame>

      {/* Content - Hidden when closed */}
      <Frame
        style={{
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.2s",
          pointerEvents: isOpen ? "auto" : "none",
          display: isOpen ? "flex" : "none",
        }}
        override={{ flex: 1 }}
        scroll
        layout={Layout.Col.Stretch.Start}
        spacing={Space.n0}
      >
        <SidebarSection title="PAGES" />
        <Frame override={{ gap: Space.n2, px: Space.n8 }}>
          <TreeItem label="Home" icon={FileText} level={0} active />
          <TreeItem label="Features" icon={FileText} level={0} />
          <TreeItem label="Pricing" icon={FileText} level={0} />
          <TreeItem label="Blog" icon={FileText} level={0} collapsed>
            <TreeItem label="2024 Design Trends" icon={FileText} level={1} />
            <TreeItem label="Engineering Culture" icon={FileText} level={1} />
          </TreeItem>
          <TreeItem label="Contact" icon={FileText} level={0} />
        </Frame>

        <Frame override={{ h: Size.n16 }} />

        <SidebarSection title="COMPONENTS" />
        <Frame override={{ gap: Space.n2, px: Space.n8 }}>
          <TreeItem label="Navigation" icon={Grid2X2} level={0} />
          <TreeItem label="Hero Section" icon={Grid2X2} level={0} />
          <TreeItem label="Feature Grid" icon={Grid2X2} level={0} />
          <TreeItem label="Testimonials" icon={Grid2X2} level={0} />
          <TreeItem label="Footer" icon={Grid2X2} level={0} />
        </Frame>
      </Frame>

      {/* Footer Settings */}
      <Frame
        style={{
          opacity: isOpen ? 1 : 0,
          transition: "opacity 0.2s",
          display: isOpen ? "flex" : "none",
        }}
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        override={{ p: Space.n12, border: true, minHeight: Size.n40 }}
      >
        <Frame
          override={{ w: Size.n32, h: Size.n32, pack: true }}
          rounded={Radius2.full}
          surface="sunken"
        >
          <Icon src={Settings} size={IconSize.n16} />
        </Frame>
        <Frame layout={Layout.Col.Left.Start} spacing={Space.n0}>
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

function SidebarSection({ title }: { title: string }) {
  return (
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n8}
      override={{ px: Space.n16, py: Space.n8, minHeight: Size.n32 }}
    >
      <Text.Card.Note
        weight="bold"
        size={FontSize.n11}
        style={{ color: "var(--text-tertiary)", letterSpacing: "0.05em" }}
      >
        {title}
      </Text.Card.Note>
      <Frame override={{ flex: 1 }} />
      <Action icon={Plus} size="xs" variant="ghost" rounded={Radius2.sm} />
    </Frame>
  );
}

interface TreeItemProps {
  label: string;
  icon: React.ElementType;
  level: number;
  active?: boolean;
  collapsed?: boolean;
  children?: React.ReactNode;
}

function TreeItem({
  label,
  icon: IconSrc,
  level,
  active,
  collapsed,
  children,
}: TreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  return (
    <Frame layout={Layout.Col.Left.Start} spacing={Space.n0}>
      <Frame
        rounded={Radius2.sm}
        layout={Layout.Row.Middle.Center}
        spacing={Space.n8}
        surface={active ? "raised" : undefined}
        style={{
          paddingLeft: `calc(var(--space-n8) + ${level * 12}px)`,
          backgroundColor: active ? "var(--surface-raised)" : "transparent",
          color: active ? "var(--text-primary)" : "var(--text-secondary)",
        }}
        override={{
          h: Size.n32,
          gap: Space.n6,
          cursor: "pointer",
          w: Size.fill,
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Frame
          override={{
            w: Size.n16,
            h: Size.n16,
            align: "center",
            justify: "center",
          }}
        >
          {children ? (
            <Icon
              src={ChevronRight}
              size={IconSize.n12}
              style={{
                transform: isExpanded ? "rotate(90deg)" : "none",
                transition: "transform 0.2s",
                opacity: 0.6,
              }}
            />
          ) : (
            <Frame
              override={{ w: Size.n4, h: Size.n4, r: Radius2.full }}
              style={{
                backgroundColor: active ? "var(--primary-bg)" : "transparent",
              }}
            />
          )}
        </Frame>

        <Icon
          src={IconSrc}
          size={IconSize.n14}
          style={{ opacity: active ? 1 : 0.7 }}
        />

        <Text.Card.Title
          size={FontSize.n13}
          weight={active ? "medium" : "regular"}
          style={{ flex: 1 }}
        >
          {label}
        </Text.Card.Title>
      </Frame>

      {isExpanded && children && (
        <Frame override={{ w: Size.fill }}>{children}</Frame>
      )}
    </Frame>
  );
}
