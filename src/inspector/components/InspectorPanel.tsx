import {
  AppWindow,
  Box,
  Code,
  Copy,
  Layers,
  Layout as LayoutIcon,
  Lock,
  MousePointerClick,
  Palette,
  Type,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Layout } from "../../design-system/Frame/Layout/Layout.ts";
import { Text } from "../../design-system/text/Text";
import { FontSize, Space } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import type { ComponentStackItem } from "../lib/fiber-utils";
import { generateJSX } from "../lib/inspector-utils";
import {
  AppearanceControl,
  LayoutControl,
  SizingControl,
  TypographyControl,
} from "./InspectorControls";
import { PropertyTree } from "./PropertyTree";

const SECTION_MAPPING: Record<string, string> = {
  // Layout (Inner Flow)
  layout: "Layout",
  gap: "Layout",
  row: "Layout",
  wrap: "Layout",
  pack: "Layout",
  grid: "Layout",

  // Layout (Overrides)
  align: "Layout",
  justify: "Layout",
  p: "Layout",
  px: "Layout",
  py: "Layout",
  pt: "Layout",
  pb: "Layout",
  pl: "Layout",
  pr: "Layout",

  // Sizing (Outer Dimensions)
  w: "Sizing",
  h: "Sizing",
  fill: "Sizing",
  flex: "Sizing",
  maxWidth: "Sizing",
  minWidth: "Sizing",
  maxHeight: "Sizing",
  minHeight: "Sizing",
  ratio: "Sizing",

  // Appearance
  surface: "Appearance",
  opacity: "Appearance",
  clip: "Appearance",

  // Appearance (Overrides)
  border: "Appearance",
  borderTop: "Appearance",
  borderRight: "Appearance",
  borderBottom: "Appearance",
  borderLeft: "Appearance",
  borderWidth: "Appearance",
  r: "Appearance",
  shadow: "Appearance",
  cursor: "Appearance",
  zIndex: "Appearance",

  // Text
  size: "Typography",
  weight: "Typography",
  color: "Typography",

  // Behavior
  scroll: "Behavior",
  interactive: "Behavior",
};

const SECTION_ICONS: Record<string, any> = {
  Layout: LayoutIcon,
  Sizing: Box,
  Appearance: Palette,
  Behavior: MousePointerClick,
  Typography: Type,
  Other: Layers,
  Hierarchy: AppWindow,
};

export function InspectorPanel({
  element,
  name,
  stack,
  props,
  initialX,
  initialY,
  onClose,
  onCopy,
}: {
  element: HTMLElement;
  name: string;
  stack: ComponentStackItem[];
  props: Record<string, any>;
  initialX: number;
  initialY: number;
  onClose: () => void;
  onCopy: (msg: string) => void;
}) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Organize Properties
  const sections: Record<string, Record<string, any>> = {
    Layout: {},
    Sizing: {},
    Appearance: {},
    Typography: {},
    Behavior: {},
  };

  // Flatten and Categorize
  const processProp = (key: string, value: any) => {
    if (key === "children") return;

    // Special handling for override object
    if (key === "override" && typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([k, v]) => processProp(k, v));
      return;
    }

    const section = SECTION_MAPPING[key];
    if (section && sections[section]) {
      sections[section][key] = value;
    }
  };

  Object.entries(props).forEach(([key, value]) => {
    processProp(key, value);
  });

  // Prepare renderable list
  const properties = Object.entries(sections)
    .filter(([_, items]) => Object.keys(items).length > 0)
    .map(([section, items]) => ({
      section,
      items, // Keep as object for custom controls
    }));

  // Raw Props (Override & Style)
  const rawSections: { title: string; data: Record<string, any>; icon: any }[] =
    [];

  if (props.override && Object.keys(props.override).length > 0) {
    rawSections.push({ title: "Override", data: props.override, icon: Code });
  }

  if (props.style && Object.keys(props.style).length > 0) {
    rawSections.push({ title: "Style", data: props.style, icon: Code });
  }

  // Add Hierarchy
  const hierarchyStack =
    stack && stack.length > 0
      ? stack.map((item, i) => ({
        key: `${i + 1}`,
        value: `${item.fileName}:${item.lineNumber}(${item.name})`,
      }))
      : [];

  const handleCopy = () => {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.innerHTML = "";
    const shell = clone.outerHTML;
    const jsx = generateJSX(name, props);
    const location = stack[0]
      ? `${stack[0].fileName}:${stack[0].lineNumber}`
      : "";
    const textToCopy = `${location ? `${location}\n` : ""}${jsx}\n\n// HTML:\n// ${shell}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      onCopy("Full component info copied!");
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "c") {
        e.preventDefault();
        handleCopy();
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [element, name, props, stack]);

  const title = stack.length > 0 ? stack[0].name : "Element";

  return (
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 10003,
        pointerEvents: "auto",
      }}
    >
      <Frame
        override={{
          shadow: "2xl",
          r: Radius2.lg,
          border: true,
        }}
        style={
          {
            maxHeight: "80vh",
            width: 260,
          } as React.CSSProperties
        }
        surface="base"
      >
        {/* Header */}
        <Frame
          override={{
            py: Space.n0,
            px: Space.n4,
            justify: "between",
            border: true,
          }}
          style={{
            cursor: "grab",
            userSelect: "none",
          }}
          surface="sunken"
          layout={Layout.Row.Header.Default}
          onMouseDown={handleMouseDown}
        >
          <Frame
            override={{ gap: Space.n6 }}
            layout={Layout.Row.Item.Tight}
            flex
          >
            <Lock size={12} className="text-primary" />
            <Text weight="bold" size={FontSize.n10}>
              {title}
            </Text>
          </Frame>
          <Frame
            override={{ gap: Space.n2 }}
            layout={Layout.Row.Actions.Default}
          >
            <Action
              icon={Copy}
              variant="ghost"
              size="xs"
              iconSize={12}
              tooltip="Copy HTML"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
            />
            <Action
              icon={X}
              variant="ghost"
              size="xs"
              iconSize={12}
              tooltip="Close Inspector"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            />
          </Frame>
        </Frame>

        {/* Content */}
        <Frame override={{ py: Space.n8, px: Space.n0 }} scroll>
          {/* File Path */}
          <Frame
            override={{
              pt: Space.n0,
              pr: Space.n8,
              pb: Space.n8,
              pl: Space.n8,
            }}
          >
            <Text
              size={FontSize.n13}
              color="tertiary"
              style={{ wordBreak: "break-all" }}
            >
              {name}
            </Text>
          </Frame>

          {/* Properties Sections */}
          {properties.map((section) => {
            const SectionIcon = SECTION_ICONS[section.section] || Layers;

            return (
              <Frame
                override={{
                  gap: Space.n2,
                  pt: Space.n0,
                  pr: Space.n8,
                  pb: Space.n8,
                  pl: Space.n8,
                }}
                key={section.section}
              >
                <Frame
                  layout={Layout.Row.Item.Tight}
                  override={{ gap: Space.n4, py: Space.n4 }}
                >
                  <SectionIcon size={10} className="text-tertiary" />
                  <Text
                    weight="bold"
                    size={FontSize.n9}
                    color="tertiary"
                    style={{
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {section.section}
                  </Text>
                </Frame>

                {/* Visual Controls */}
                {section.section === "Layout" ? (
                  <LayoutControl props={section.items} />
                ) : section.section === "Sizing" ? (
                  <SizingControl props={section.items} />
                ) : section.section === "Appearance" ? (
                  <AppearanceControl props={section.items} />
                ) : section.section === "Typography" ? (
                  <TypographyControl props={section.items} />
                ) : (
                  <Frame
                    override={{ gap: Space.n0, r: Radius2.sm, border: true }}
                    clip
                  >
                    {Object.entries(section.items).map(([key, value], i) => (
                      <PropertyTree
                        key={key}
                        label={key}
                        value={value}
                        background={i % 2 === 0 ? "base" : "sunken"}
                      />
                    ))}
                  </Frame>
                )}
              </Frame>
            );
          })}

          {/* Raw Sections (Override & Style) */}
          {rawSections.map((section) => (
            <Frame
              override={{
                gap: Space.n2,
                pt: Space.n0,
                pr: Space.n8,
                pb: Space.n8,
                pl: Space.n8,
              }}
              key={section.title}
            >
              <Frame
                layout={Layout.Row.Item.Tight}
                override={{ gap: Space.n4, py: Space.n4 }}
              >
                <section.icon size={10} className="text-tertiary" />
                <Text
                  weight="bold"
                  size={FontSize.n9}
                  color="tertiary"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {section.title}
                </Text>
              </Frame>
              <Frame
                override={{ gap: Space.n0, r: Radius2.sm, border: true }}
                clip
              >
                {Object.entries(section.data).map(([key, value], i) => (
                  <PropertyTree
                    key={key}
                    label={key}
                    value={value}
                    background={i % 2 === 0 ? "base" : "sunken"}
                  />
                ))}
              </Frame>
            </Frame>
          ))}

          {/* Hierarchy */}
          {hierarchyStack.length > 0 && (
            <Frame
              override={{
                gap: Space.n2,
                pt: Space.n0,
                pr: Space.n8,
                pb: Space.n8,
                pl: Space.n8,
              }}
            >
              <Frame
                layout={Layout.Row.Item.Tight}
                override={{ gap: Space.n4, py: Space.n4 }}
              >
                <AppWindow size={10} className="text-tertiary" />
                <Text
                  weight="bold"
                  size={FontSize.n9}
                  color="tertiary"
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Hierarchy
                </Text>
              </Frame>
              <Frame
                override={{ gap: Space.n0, r: Radius2.sm, border: true }}
                clip
              >
                {hierarchyStack.map((item, i) => (
                  <PropertyTree
                    key={item.key}
                    label={item.key}
                    value={item.value}
                    background={i % 2 === 0 ? "base" : "sunken"}
                  />
                ))}
              </Frame>
            </Frame>
          )}
        </Frame>
      </Frame>
    </div>
  );
}
