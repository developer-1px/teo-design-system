import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
  ChevronRight,
  CornerUpRight,
  Eye,
  Lock,
  Minus,
  MoreHorizontal,
  Plus,
  Settings,
  Sun,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { Action } from "../design-system/Action";
import { Field } from "../design-system/Field";
import { Frame } from "../design-system/Frame/Frame.tsx";
import { Layout } from "../design-system/Frame/Layout/Layout.ts";
import { useAccordion } from "../design-system/hooks";
import { Icon } from "../design-system/Icon";
import { Section } from "../design-system/Section";
import { Separator } from "../design-system/Separator";
import { Text } from "../design-system/text/Text";
import {
  IconSize,
  Opacity,
  Size,
  Space,
} from "../design-system/token/token.const.1tier";
import { Radius2 } from "../design-system/token/token.const.2tier";

// --- Data ---

type AlignmentToolItem = {
  icon: any;
  label: string;
  surface?: "selected";
  rotation?: number;
};
type AlignmentToolSeparator = { separator: true };
type AlignmentTool = AlignmentToolItem | AlignmentToolSeparator;

const isSeparator = (tool: AlignmentTool): tool is AlignmentToolSeparator => {
  return "separator" in tool && tool.separator === true;
};

const ALIGNMENT_TOOLS: AlignmentTool[] = [
  { icon: AlignLeft, label: "Left" },
  { icon: AlignCenter, label: "Center", surface: "selected" },
  { icon: AlignRight, label: "Right" },
  { separator: true },
  { icon: AlignJustify, label: "Justify" },
  { icon: AlignCenter, label: "Middle", rotation: 90 },
  { icon: CornerUpRight, label: "Distribute" },
];

// --- Helpers ---

const PropertySection = ({
  id,
  title,
  children,
  getItemProps,
  getPanelProps,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  getItemProps: (id: string) => any;
  getPanelProps: (id: string) => any;
}) => {
  const itemProps = getItemProps(id);
  const panelProps = getPanelProps(id);

  return (
    <Frame override={{ gap: Space.n8 }}>
      {/* Collapsible Header */}
      <Frame
        {...itemProps}
        override={{ px: Space.n8, cursor: "pointer" }}
        layout={Layout.Row.Actions.Between}
        onClick={itemProps.onToggle}
      >
        <Frame override={{ gap: Space.n6 }} layout={Layout.Row.Item.Default}>
          <Icon
            src={itemProps.expanded ? ChevronDown : ChevronRight}
            size={IconSize.n12}
            style={{ color: "var(--text-tertiary)" }}
          />
          <Text.Menu.Group style={{ padding: "8px 0 4px" }}>
            {title}
          </Text.Menu.Group>
        </Frame>
        <Action
          icon={Plus}
          iconSize={IconSize.n12}
          style={{ width: "20px", height: "20px" }}
          opacity={Opacity.n40}
        />
      </Frame>

      {/* Collapsible Content */}
      <Frame
        {...panelProps}
        override={{
          gap: Space.n4,
          pt: Space.n0,
          pr: Space.n8,
          pb: Space.n8,
          pl: Space.n8,
        }}
      >
        {children}
      </Frame>
      <Separator />
    </Frame>
  );
};

const TransformField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <Frame flex>
    <Field
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </Frame>
);

export function PropertiesPanel() {
  const [activeTab, setActiveTab] = useState<"DESIGN" | "ANIMATE">("DESIGN");
  const [transform, setTransform] = useState({
    x: "400",
    y: "225",
    w: "800",
    h: "450",
    r: "0",
    corner: "0",
  });

  const updateTransform = (key: string, value: string) =>
    setTransform((prev) => ({ ...prev, [key]: value }));

  // Accordion for collapsible sections
  const sections = ["LAYER", "TEXT", "FILL", "STROKE", "EFFECTS", "EXPORT"];
  const { getItemProps, getPanelProps } = useAccordion({
    items: sections,
    defaultExpanded: ["LAYER", "TEXT", "FILL"], // Default open sections
    allowMultiple: true,
  });

  return (
    <Section w={Size.n256} surface="base" rounded={Radius2.lg} shadow="sm">
      {/* Tabs */}
      <Frame
        override={{
          p: Space.n4,
          gap: Space.n4,
        }}
        style={{
          flexShrink: 0,
          height: "40px",
          borderBottom: "1px solid var(--border-color)",
          borderColor: "var(--border-color)",
        }}
        layout={Layout.Row.Toolbar.Compact}
      >
        {["DESIGN", "ANIMATE"].map((tab) => (
          <Action
            key={tab}
            flex
            variant="ghost"
            onClick={() => setActiveTab(tab as "DESIGN" | "ANIMATE")}
            style={{
              backgroundColor:
                activeTab === tab ? "var(--tab-bg-active)" : undefined,
            }}
          >
            <Text.Menu.Item
              style={{
                fontWeight: activeTab === tab ? "bold" : "medium",
                fontSize: "12px",
                color:
                  activeTab === tab
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
              }}
            >
              {tab}
            </Text.Menu.Item>
          </Action>
        ))}
      </Frame>

      <Frame
        override={{ p: Space.n8, gap: Space.n8, minHeight: Size.n0 }}
        scroll
        flex
        fill
      >
        {/* Alignment */}
        <Frame
          rounded={Radius2.md}
          style={{
            border: "1px solid var(--border-color)",
            padding: "1px",
            gap: "1px",
          }} // 1px style override
          layout={Layout.Row.Toolbar.Default}
          surface="sunken"
          override={{ justify: "between" }}
        >
          {ALIGNMENT_TOOLS.map((tool, i) =>
            isSeparator(tool) ? (
              <Separator key={i} orientation="vertical" length={Space.n12} />
            ) : (
              <Action
                key={i}
                icon={tool.icon}
                iconSize={IconSize.n12}
                surface={tool.surface}
                rounded={Radius2.md}
                size="xs"
                flex
                iconRotation={tool.rotation}
              />
            ),
          )}
        </Frame>
        <Separator />

        {/* Transform */}
        <Frame override={{ gap: Space.n8 }}>
          <Frame
            layout={Layout.Row.Item.Default}
            override={{ gap: Space.n8, align: "center" }}
          >
            <TransformField
              label="X"
              value={transform.x}
              onChange={(v) => updateTransform("x", v)}
            />
            <TransformField
              label="Y"
              value={transform.y}
              onChange={(v) => updateTransform("y", v)}
            />
            <Frame override={{ w: Size.n24 }} />
          </Frame>
          <Frame
            layout={Layout.Row.Item.Default}
            override={{ gap: Space.n8, align: "center" }}
          >
            <TransformField
              label="W"
              value={transform.w}
              onChange={(v) => updateTransform("w", v)}
            />
            <TransformField
              label="H"
              value={transform.h}
              onChange={(v) => updateTransform("h", v)}
            />
            <Frame override={{ w: Size.n24 }} pack>
              <Action
                icon={Lock}
                iconSize={IconSize.n10}
                style={{ width: "20px", height: "20px" }}
                opacity={Opacity.n30}
              />
            </Frame>
          </Frame>
          <Frame
            layout={Layout.Row.Item.Default}
            override={{ gap: Space.n8, align: "center" }}
          >
            <TransformField
              label="°"
              value={transform.r}
              onChange={(v) => updateTransform("r", v)}
            />
            <TransformField
              label="R"
              value={transform.corner}
              onChange={(v) => updateTransform("corner", v)}
            />
            <Frame override={{ w: Size.n24 }} />
          </Frame>
        </Frame>
        <Separator />

        {/* Properties */}
        <PropertySection
          id="LAYER"
          title="LAYER"
          getItemProps={getItemProps}
          getPanelProps={getPanelProps}
        >
          <Frame
            layout={Layout.Row.Item.Default}
            override={{ gap: Space.n12, justify: "between" }}
          >
            <Field
              value="Normal"
              rightIcon={<Icon src={ChevronDown} size={IconSize.n10} />}
              flex
            />
            <Field
              value="100%"
              icon={<Icon src={Eye} size={IconSize.n10} />}
              w={Size.n72}
            />
          </Frame>
        </PropertySection>

        <PropertySection
          id="TEXT"
          title="TEXT"
          getItemProps={getItemProps}
          getPanelProps={getPanelProps}
        >
          <Frame override={{ gap: Space.n6 }}>
            <Field
              value="Inter"
              rightIcon={<Icon src={ChevronDown} size={IconSize.n10} />}
            />
            <Frame
              override={{ gap: Space.n8 }}
              layout={Layout.Row.Item.Default}
            >
              <Field
                value="Regular"
                rightIcon={<Icon src={ChevronDown} size={IconSize.n10} />}
                flex
              />
              <Field value="42" w={Size.n48} />
            </Frame>
            <Frame
              override={{ gap: Space.n8 }}
              layout={Layout.Row.Item.Default}
            >
              <Field label="LH" value="Auto" flex />
              <Field label="LS" value="0%" flex />
            </Frame>
            <Frame
              rounded={Radius2.md}
              style={{
                border: "1px solid var(--border-color)",
                padding: "1px",
                gap: "1px",
              }}
              layout={Layout.Row.Toolbar.Compact}
              surface="sunken"
              override={{ justify: "between" }}
            >
              {[
                AlignLeft,
                AlignCenter,
                AlignRight,
                AlignJustify,
                MoreHorizontal,
              ].map((Icon, i) => (
                <Action
                  key={i}
                  icon={Icon}
                  iconSize={IconSize.n12}
                  surface={i === 0 ? "selected" : undefined}
                  rounded={Radius2.md}
                  size="xs"
                  flex
                />
              ))}
            </Frame>
          </Frame>
        </PropertySection>

        <PropertySection
          id="FILL"
          title="FILL"
          getItemProps={getItemProps}
          getPanelProps={getPanelProps}
        >
          <Field
            value="F4F4F5"
            icon={
              <Frame
                override={{}}
                rounded={Radius2.full}
                style={{
                  width: "10px",
                  height: "10px",
                  border: "1px solid var(--border-color)",
                }}
                surface="base"
              />
            }
            rightIcon={
              <Text.Card.Note style={{ fontSize: "12px" }}>100%</Text.Card.Note>
            }
          />
        </PropertySection>

        <PropertySection
          id="STROKE"
          title="STROKE"
          getItemProps={getItemProps}
          getPanelProps={getPanelProps}
        >
          <Frame override={{ gap: Space.n6 }}>
            <Field
              value="000000"
              icon={
                <Frame
                  override={{}}
                  rounded={Radius2.full}
                  style={{
                    width: "10px",
                    height: "10px",
                    border: "1px solid var(--text-primary)",
                  }}
                />
              }
              rightIcon={
                <Frame
                  override={{ gap: Space.n8 }}
                  layout={Layout.Row.Item.Default}
                >
                  <Text.Card.Note style={{ fontSize: "12px" }}>
                    100%
                  </Text.Card.Note>
                  <Action
                    icon={Eye}
                    iconSize={IconSize.n10}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <Action
                    icon={Minus}
                    iconSize={IconSize.n10}
                    style={{ width: "16px", height: "16px" }}
                  />
                </Frame>
              }
              style={{ flexShrink: 0 }}
            />
            <Frame
              layout={Layout.Row.Item.Default}
              override={{ gap: Space.n8, align: "center" }}
            >
              <Field value="1.5" w={Size.n48} />
              <Field
                value="Inside"
                rightIcon={<Icon src={ChevronDown} size={IconSize.n10} />}
                flex
              />
              <Action
                icon={Settings}
                iconSize={IconSize.n10}
                rounded={Radius2.md}
                style={{ height: "24px" }}
              />
            </Frame>
          </Frame>
        </PropertySection>

        <PropertySection
          id="EFFECTS"
          title="EFFECTS"
          getItemProps={getItemProps}
          getPanelProps={getPanelProps}
        >
          <Field
            value="Drop Shadow"
            icon={<Icon src={Sun} size={IconSize.n10} />}
            rightIcon={
              <Action
                icon={Settings}
                iconSize={IconSize.n10}
                style={{ width: "16px", height: "16px" }}
              />
            }
          />
        </PropertySection>

        <PropertySection
          id="EXPORT"
          title="EXPORT"
          getItemProps={getItemProps}
          getPanelProps={getPanelProps}
        >
          <Field
            value="PNG"
            rightIcon={
              <Action
                icon={Plus}
                iconSize={IconSize.n10}
                style={{ width: "16px", height: "16px" }}
              />
            }
          />
        </PropertySection>

        <Frame style={{ height: "100px" }} />
      </Frame>
    </Section>
  );
}
