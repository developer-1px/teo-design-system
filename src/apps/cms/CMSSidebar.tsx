import {
  Box,
  ChevronRight,
  Columns,
  FileText,
  Grid2X2,
  Image as ImageIcon,
  Layout,
  Layers,
  List,
  Menu,
  Settings,
  Type,
} from "lucide-react";
import { useState } from "react";
import { Card } from "../../design-system/text/Card";
import { Frame } from "../../design-system/Frame";
import { Action } from "../../design-system/Action";
import { Overlay } from "../../design-system/Overlay";

export interface CMSSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function CMSSidebar({ isOpen, onToggle }: CMSSidebarProps) {
  const [viewMode, setViewMode] = useState<"bar" | "thumbnail">("bar");

  return (
    <Overlay
      position="absolute"
      y="56px"
      x="12px"
      zIndex={200}
      clickOutsideToDismiss={false}
      style={{ pointerEvents: "auto" }}
    >
      <Frame
        h="auto"
        maxHeight="80vh"
        surface="raised"
        style={{
          border: "1px solid var(--border-color)",
          width: isOpen ? 260 : 60,
          overflow: "hidden",
          whiteSpace: "nowrap",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          transformOrigin: "top left",
        }}
      >
        {/* Header with Toggle */}
        <Frame row align="center" gap={3} p="0 4px">
          <Action
            icon={isOpen ? Layout : Menu}
            variant="ghost"
            size="sm"
            rounded="md"
            onClick={onToggle}
            tooltip={isOpen ? "Collapse" : "Expand"}
          />

          <Frame
            row
            align="center"
            gap={2}
            style={{
              opacity: isOpen ? 1 : 0,
              transition: "opacity 0.2s",
              pointerEvents: isOpen ? "auto" : "none"
            }}
          >
            <Frame
              style={{ width: 24, height: 24 }}
              rounded="md"
              surface="primary"
              pack
            >
              <Layers size={14} color="#fff" />
            </Frame>
            <Card.Title style={{ fontWeight: "bold", fontSize: 16 }}>
              Visual Builder
            </Card.Title>
          </Frame>
        </Frame>

        {/* Content - Hidden when closed */}
        <Frame
          flex
          gap="8px"
          overflow="scroll"
          style={{
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: isOpen ? "auto" : "none",
            display: isOpen ? "flex" : "none" // Fully hide to prevent layout issues
          }}
        >
          <Frame>
            <Frame p="0px 8px 8px 8px">
              <Card.Note style={{ fontSize: 11, fontWeight: "bold", color: "var(--text-tertiary)" }}>
                ELEMENTS
              </Card.Note>
            </Frame>
            <Frame grid columns="1fr 1fr" gap="8px">
              <ElementButton icon={Type} label="Text" />
              <ElementButton icon={ImageIcon} label="Image" />
              <ElementButton icon={Box} label="Box" />
              <ElementButton icon={Columns} label="Columns" />
            </Frame>
          </Frame>

          <Frame
            h="1px"
            surface="overlay"
            w="100%"
            style={{ margin: "16px 0" }}
          />

          <Frame gap="8px">
            <Frame row align="center" justify="between" p="0px 8px 8px 8px">
              <Card.Note style={{ fontSize: 11, fontWeight: "bold", color: "var(--text-tertiary)" }}>
                LAYERS
              </Card.Note>
              <Frame row gap={1} surface="sunken" p="2px" rounded="md">
                <Action
                  icon={List}
                  size={5}
                  variant={viewMode === "bar" ? "surface" : "ghost"}
                  rounded="sm"
                  onClick={() => setViewMode("bar")}
                />
                <Action
                  icon={Grid2X2}
                  size={5}
                  variant={viewMode === "thumbnail" ? "surface" : "ghost"}
                  rounded="sm"
                  onClick={() => setViewMode("thumbnail")}
                />
              </Frame>
            </Frame>
            <Frame gap={viewMode === "thumbnail" ? "12px" : "4px"}>
              <LayerItem label="Hero Section" active viewMode={viewMode} />
              <LayerItem label="Feature Grid" viewMode={viewMode} />
              <LayerItem label="Testimonials" viewMode={viewMode} />
              <LayerItem label="Footer" viewMode={viewMode} />
            </Frame>
          </Frame>
        </Frame>

        {/* Footer Settings */}
        <Frame
          style={{
            borderTop: "1px solid var(--border-color)",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.2s",
            display: isOpen ? "flex" : "none"
          }}
        >
          <Frame
            style={{ width: 32, height: 32 }}
            rounded="full"
            surface="sunken"
            pack
          >
            <Settings size={16} />
          </Frame>
          <Frame gap="2px">
            <Card.Title style={{ fontSize: 13, fontWeight: 500 }}>
              Site Settings
            </Card.Title>
            <Card.Note style={{ fontSize: 11, color: "var(--text-tertiary)" }}>
              General, SEO, Analytics
            </Card.Note>
          </Frame>
        </Frame>
      </Frame>
    </Overlay>
  );
}

interface ElementButtonProps {
  icon: React.ElementType;
  label: string;
}

function ElementButton({ icon: Icon, label }: ElementButtonProps) {
  return (
    <Frame
      surface="sunken"
      p="12px"
      rounded="lg"
      align="center"
      gap="8px"
      cursor="grab"
      style={{ border: "1px solid var(--border-color)" }}
    >
      <Icon size={20} opacity={0.6} />
      <Card.Title style={{ fontSize: 12, fontWeight: 500 }}>
        {label}
      </Card.Title>
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
      <Frame gap={1.5} p="0 8px">
        <Frame row gap={2} align="center">
          <FileText size={10} opacity={0.5} />
          <Card.Note style={{ fontSize: 11, fontWeight: active ? "bold" : "medium" }}>
            {label}
          </Card.Note>
        </Frame>
        <Frame
          w="100%"
          ratio="16/9"
          surface={active ? "base" : "sunken"}
          rounded="md"
          pack
          cursor="pointer"
          style={{
            border: "1px solid var(--border-color)",
            boxShadow: active ? "0 0 0 1.5px var(--text-primary)" : "none",
            borderColor: active ? "var(--text-primary)" : "var(--border-color)",
          }}
        >
          {active && (
            <Frame w={8} h={8} rounded="full" surface="primary" shadow="sm" />
          )}
        </Frame>
      </Frame>
    );
  }

  return (
    <Frame
      row
      align="center"
      justify="between"
      p="8px 12px"
      rounded="md"
      surface={active ? "raised" : undefined}
      cursor="pointer"
    >
      <Frame row gap="8px" align="center">
        <FileText size={14} opacity={0.5} />
        <Card.Title style={{ fontSize: 13, fontWeight: active ? "bold" : "medium" }}>
          {label}
        </Card.Title>
      </Frame>
      {active && <ChevronRight size={12} opacity={0.5} />}
    </Frame>
  );
}
