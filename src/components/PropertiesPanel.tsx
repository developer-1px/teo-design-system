import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
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
import { Frame } from "../design-system/Frame";
import { Section } from "../design-system/Section";
import { Separator } from "../design-system/Separator";
import { Text } from "../design-system/text/Text";

// --- Data ---

const ALIGNMENT_TOOLS = [
  { icon: AlignLeft, label: "Left" },
  { icon: AlignCenter, label: "Center", surface: "selected" as const },
  { icon: AlignRight, label: "Right" },
  { separator: true },
  { icon: AlignJustify, label: "Justify" },
  { icon: AlignCenter, label: "Middle", rotation: 90 },
  { icon: CornerUpRight, label: "Distribute" },
];

// --- Helpers ---

const PropertySection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Frame override={{ gap: 2 }}>
    <Frame override={{ p: "0 2" }} row justify="between" align="center">
      <Text.Menu.Group style={{ padding: "8px 0 4px" }}>
        {title}
      </Text.Menu.Group>
      <Action
        icon={Plus}
        iconSize={12}
        style={{ width: "20px", height: "20px" }}
        opacity={0.4}
      />
    </Frame>
    <Frame override={{ gap: 1, p: "0 2 2 2" }}>{children}</Frame>
    <Separator />
  </Frame>
);

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

  return (
    <Section style={{ width: "260px" }} surface="base" rounded="lg" shadow="sm">
      {/* Tabs */}
      <Frame
        override={{
          p: 1,
          gap: 1,
          style: {
            flexShrink: 0,
            height: "40px",
            borderBottom: "1px solid var(--border-color)",
            borderColor: "var(--border-color)",
          },
        }}
        row
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
        override={{ p: 2, gap: 2, style: { minHeight: 0 } }}
        overflow="auto"
        flex
        fill
      >
        {/* Alignment */}
        <Frame
          override={{
            rounded: "md",
            style: { border: "1px solid var(--border-color)" },
            p: "1px",
            gap: "1px",
          }}
          row
          justify="between"
          surface="sunken"
        >
          {ALIGNMENT_TOOLS.map((tool, i) =>
            tool.separator ? (
              <Separator key={i} orientation="vertical" length="12px" />
            ) : (
              <Action
                key={i}
                icon={tool.icon}
                iconSize={12}
                surface={(tool as any).surface}
                rounded="round"
                size="24px"
                flex
                iconRotation={tool.rotation}
              />
            ),
          )}
        </Frame>
        <Separator />

        {/* Transform */}
        <Frame override={{ gap: 2 }}>
          <Frame override={{ gap: 2 }} row align="center">
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
            <Frame override={{ style: { width: "24px" } }} />
          </Frame>
          <Frame override={{ gap: 2 }} row align="center">
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
            <Frame override={{ style: { width: "24px" } }} pack>
              <Action
                icon={Lock}
                iconSize={10}
                style={{ width: "20px", height: "20px" }}
                opacity={0.3}
              />
            </Frame>
          </Frame>
          <Frame override={{ gap: 2 }} row align="center">
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
            <Frame override={{ style: { width: "24px" } }} />
          </Frame>
        </Frame>
        <Separator />

        {/* Properties */}
        <PropertySection title="LAYER">
          <Frame override={{ gap: 3 }} row justify="between">
            <Field value="Normal" rightIcon={<ChevronDown size={10} />} flex />
            <Field
              value="100%"
              icon={<Eye size={10} />}
              style={{ width: "70px" }}
            />
          </Frame>
        </PropertySection>

        <PropertySection title="TEXT">
          <Frame override={{ gap: "6px" }}>
            <Field value="Inter" rightIcon={<ChevronDown size={10} />} />
            <Frame override={{ gap: 2 }} row>
              <Field
                value="Regular"
                rightIcon={<ChevronDown size={10} />}
                flex
              />
              <Field value="42" style={{ width: "50px" }} />
            </Frame>
            <Frame override={{ gap: 2 }} row>
              <Field label="LH" value="Auto" flex />
              <Field label="LS" value="0%" flex />
            </Frame>
            <Frame
              override={{
                rounded: "md",
                style: { border: "1px solid var(--border-color)" },
                p: "1px",
                gap: "1px",
              }}
              row
              justify="between"
              align="center"
              surface="sunken"
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
                  iconSize={12}
                  surface={i === 0 ? "selected" : undefined}
                  rounded="round"
                  size="24px"
                  flex
                />
              ))}
            </Frame>
          </Frame>
        </PropertySection>

        <PropertySection title="FILL">
          <Field
            value="F4F4F5"
            icon={
              <Frame
                override={{
                  style: {
                    width: "10px",
                    height: "10px",
                    border: "1px solid var(--border-color)",
                  },
                  rounded: "round",
                }}
                surface="base"
              />
            }
            rightIcon={
              <Text.Card.Note style={{ fontSize: "12px" }}>100%</Text.Card.Note>
            }
          />
        </PropertySection>

        <PropertySection title="STROKE">
          <Frame override={{ gap: "6px" }}>
            <Field
              value="000000"
              icon={
                <Frame
                  override={{
                    style: {
                      width: "10px",
                      height: "10px",
                      border: "1px solid var(--text-primary)",
                    },
                    rounded: "round",
                  }}
                />
              }
              rightIcon={
                <Frame override={{ gap: 2 }} row>
                  <Text.Card.Note style={{ fontSize: "12px" }}>
                    100%
                  </Text.Card.Note>
                  <Action
                    icon={Eye}
                    iconSize={10}
                    style={{ width: "16px", height: "16px" }}
                  />
                  <Action
                    icon={Minus}
                    iconSize={10}
                    style={{ width: "16px", height: "16px" }}
                  />
                </Frame>
              }
              style={{ flexShrink: 0 }}
            />
            <Frame override={{ gap: 2 }} row align="center">
              <Field value="1.5" style={{ width: "50px" }} />
              <Field
                value="Inside"
                rightIcon={<ChevronDown size={10} />}
                flex
              />
              <Action
                icon={Settings}
                iconSize={10}
                rounded="round"
                style={{ height: "24px" }}
              />
            </Frame>
          </Frame>
        </PropertySection>

        <PropertySection title="EFFECTS">
          <Field
            value="Drop Shadow"
            icon={<Sun size={10} />}
            rightIcon={
              <Action
                icon={Settings}
                iconSize={10}
                style={{ width: "16px", height: "16px" }}
              />
            }
          />
        </PropertySection>

        <PropertySection title="EXPORT">
          <Field
            value="PNG"
            rightIcon={
              <Action
                icon={Plus}
                iconSize={10}
                style={{ width: "16px", height: "16px" }}
              />
            }
          />
        </PropertySection>

        <Frame override={{ style: { height: "100px" } }} />
      </Frame>
    </Section>
  );
}
