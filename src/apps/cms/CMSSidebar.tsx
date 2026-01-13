import {
  Box,
  ChevronRight,
  Columns,
  FileText,
  Grid2X2,
  Image as ImageIcon,
  Layers,
  List,
  Settings,
  Type,
} from "lucide-react";
import { useState } from "react";
import { Text } from "../../design-system/Text";
import { Frame } from "../../design-system/Frame";
import { Action } from "../../design-system/Action";

export interface CMSSidebarProps {
  isOpen: boolean;
}

export function CMSSidebar({ isOpen }: CMSSidebarProps) {
  const [viewMode, setViewMode] = useState<"bar" | "thumbnail">("bar");

  return (
    <Frame
      surface="base"
      border="right"
      p={isOpen ? 2 : 0}
      style={{
        width: isOpen ? 280 : 0,
        gap: 24,
        opacity: isOpen ? 1 : 0,
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <Frame row align="center" gap="8px" p="0px 8px">
        <Frame
          style={{ width: 24, height: 24 }}
          rounded="md"
          surface="primary"
          pack
        >
          <Layers size={14} color="#fff" />
        </Frame>
        <Text weight="bold" style={{ fontSize: 16 }}>
          Visual Builder
        </Text>
      </Frame>

      <Frame flex gap="8px" overflow="scroll">
        <Frame>
          <Frame p="0px 8px 8px 8px">
            <Text style={{ fontSize: 11 }} weight="bold" color="tertiary">
              ELEMENTS
            </Text>
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
            <Text style={{ fontSize: 11 }} weight="bold" color="tertiary">
              LAYERS
            </Text>
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

      <Frame border="top" p="16px 0px 0px 0px" row align="center" gap="8px">
        <Frame
          style={{ width: 32, height: 32 }}
          rounded="full"
          surface="sunken"
          pack
        >
          <Settings size={16} />
        </Frame>
        <Frame gap="2px">
          <Text style={{ fontSize: 13 }} weight="medium">
            Site Settings
          </Text>
          <Text style={{ fontSize: 11 }} color="tertiary">
            General, SEO, Analytics
          </Text>
        </Frame>
      </Frame>
    </Frame>
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
      border
    >
      <Icon size={20} opacity={0.6} />
      <Text style={{ fontSize: 12 }} weight="medium">
        {label}
      </Text>
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
          <Text style={{ fontSize: 11 }} weight={active ? "bold" : "medium"}>
            {label}
          </Text>
        </Frame>
        <Frame
          w="100%"
          ratio="16/9"
          border
          borderColor={active ? "text-primary" : "default"}
          surface={active ? "base" : "sunken"}
          rounded="md"
          pack
          cursor="pointer"
          style={{
            boxShadow: active ? "0 0 0 1.5px var(--text-primary)" : "none",
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
        <Text style={{ fontSize: 13 }} weight={active ? "bold" : "medium"}>
          {label}
        </Text>
      </Frame>
      {active && <ChevronRight size={12} opacity={0.5} />}
    </Frame>
  );
}
