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
import { Action } from "../../../design-system/Action";
import { Field } from "../../../design-system/Field";
import { Frame } from "../../../design-system/Frame/Frame.tsx";
import { useAccordion, useDropdown, useTabs } from "../../../design-system/hooks";
import { Icon } from "../../../design-system/Icon";
import { Overlay } from "../../../design-system/Overlay";
import { Section } from "../../../design-system/Section";
import { Separator } from "../../../design-system/Separator";
import { Text } from "../../../design-system/text/Text";
import {
  IconSize,
  Opacity,
  Size,
  Space,
} from "../../../design-system/token/token.const.1tier";

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
    <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
      {/* Collapsible Header */}
      <Frame
        {...itemProps}
        override={{ cursor: "pointer", w: "100%" }}
        layout={Layout.Row.Middle.Between}
        spacing={Space.n8}
        onClick={itemProps.onToggle}
      >
        <Frame
          override={{ gap: Space.n6, minHeight: Size.n40 }}
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
        >
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
          pl: Space.n8,
          pr: Space.n8,
          pb: Space.n8,
        }}
        layout={Layout.Col.Left.Start}
        spacing={Space.n4}
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
  <Frame override={{ flex: 1, minWidth: Size.n0 }}>
    <Field
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      override={{ py: Space.n4 }} // Compact padding
    />
  </Frame>
);

export function PropertiesPanel() {
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

  // Tabs for DESIGN/ANIMATE
  const tabs = ["DESIGN", "ANIMATE"];
  const { selectedTab, getTabListProps, getTabProps } = useTabs({
    tabs,
    defaultTab: "DESIGN",
  });

  // Dropdowns for font selection
  const fontFamilies = ["Inter", "SF Pro", "Roboto", "Helvetica", "Arial"];
  const fontFamily = useDropdown({
    items: fontFamilies,
    defaultSelectedItem: "Inter",
  });

  const fontWeights = ["Thin", "Light", "Regular", "Medium", "Bold", "Black"];
  const fontWeight = useDropdown({
    items: fontWeights,
    defaultSelectedItem: "Regular",
  });

  // Accordion for collapsible sections
  const sections = ["LAYER", "TEXT", "FILL", "STROKE", "EFFECTS", "EXPORT"];
  const { getItemProps, getPanelProps } = useAccordion({
    items: sections,
    defaultExpanded: ["LAYER", "TEXT", "FILL"], // Default open sections
    allowMultiple: true,
  });

  return (
    <Section
      w={Size.n256}
      surface="base"
      rounded={Radius2.lg}
      style={{ boxShadow: "var(--elevation-n1)" }}
    >
      {/* Tabs */}
      <Frame
        {...getTabListProps()}
        override={{
          p: Space.n4,
          gap: Space.n4,
          h: Size.n40,
          border: true,
        }}
        w={Size.fill} // Ensure tabs expanded to full width
        style={{
          borderColor: "var(--border-color)",
        }}
        layout={Layout.Row.Middle.Center}
        spacing={Space.n8}
        h={Size.n36}
      >
        {tabs.map((tab) => {
          const tabProps = getTabProps(tab);
          const isSelected = selectedTab === tab;

          return (
            <Action
              key={tab}
              {...tabProps}
              flex
              w="auto"
              variant="ghost"
              style={{
                backgroundColor: isSelected
                  ? "var(--tab-bg-active)"
                  : undefined,
              }}
            >
              <Text.Menu.Item
                style={{
                  fontWeight: isSelected ? "bold" : "medium",
                  fontSize: "12px",
                  color: isSelected
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                }}
              >
                {tab}
              </Text.Menu.Item>
            </Action>
          );
        })}
      </Frame>

      <Frame
        override={{
          p: Space.n8,
          minHeight: Size.n0,
          flex: 1,
          gap: Space.n8, // Override Gap12 to Gap8
        }}
        layout={Layout.Col.Left.Start}
        spacing={Space.n12}
        scroll
      >
        {/* Alignment */}
        <Frame
          // Toolbar alignment row
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
          h={Size.n40}
          surface="sunken"
          rounded={Radius2.md}
          override={{
            border: true,
            p: Space.n4, // Reduce padding
            gap: Space.n1,
          }}
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
        <Frame layout={Layout.Col.Left.Start} spacing={Space.n8}>
          <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n8}
            override={{ gap: Space.n8, minHeight: Size.n32 }}
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
            layout={Layout.Row.Middle.Center}
            spacing={Space.n8}
            override={{ gap: Space.n8, minHeight: Size.n32 }}
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
            <Frame
              override={{ w: Size.n24, align: "center", justify: "center" }}
            >
              <Action
                icon={Lock}
                iconSize={IconSize.n10}
                style={{ width: "20px", height: "20px" }}
                opacity={Opacity.n30}
              />
            </Frame>
          </Frame>
          <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n8}
            override={{ gap: Space.n8, minHeight: Size.n32 }}
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
          <Frame layout={Layout.Row.Middle.Start} spacing={Space.n8}>
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
            {/* Font Family Dropdown */}
            <Frame style={{ position: "relative" }}>
              <Field
                {...fontFamily.getToggleButtonProps()}
                value={fontFamily.selectedItem ?? "Inter"}
                rightIcon={<Icon src={ChevronDown} size={IconSize.n10} />}
              />
              {fontFamily.isOpen && (
                <Overlay
                  position="absolute"
                  top={Size.n32}
                  left={Space.n0}
                  right={Space.n0}
                  zIndex={100}
                  onDismiss={fontFamily.closeMenu}
                  clickOutsideToDismiss={true}
                >
                  <Frame
                    {...fontFamily.getMenuProps()}
                    override={{ gap: Space.n1, border: true }}
                    style={{ boxShadow: "var(--elevation-n2)" }}
                    surface="overlay"
                    rounded={Radius2.md}
                  >
                    {fontFamilies.map((item, index) => (
                      <Frame
                        key={index}
                        {...fontFamily.getItemProps({ item, index })}
                        override={{
                          px: Space.n8,
                          py: Space.n4,
                          cursor: "pointer",
                        }}
                        surface={
                          fontFamily.selectedItem === item
                            ? "raised"
                            : undefined
                        }
                        style={{
                          backgroundColor:
                            fontFamily.highlightedIndex === index
                              ? "var(--surface-raised)"
                              : undefined,
                        }}
                      >
                        <Text.Menu.Item>{item}</Text.Menu.Item>
                      </Frame>
                    ))}
                  </Frame>
                </Overlay>
              )}
            </Frame>

            <Frame
              override={{ gap: Space.n8, minHeight: Size.n32 }}
              layout={Layout.Row.Middle.Center}
              spacing={Space.n8}
            >
              {/* Font Weight Dropdown */}
              <Field
                {...fontWeight.getToggleButtonProps()}
                value={fontWeight.selectedItem ?? "Regular"}
                rightIcon={<Icon src={ChevronDown} size={IconSize.n10} />}
                flex
                override={{ flex: 1 }} // Explicit flex to match previous behavior
                style={{ position: "relative" }}
              >
                {fontWeight.isOpen && (
                  <Overlay
                    position="absolute"
                    top={Size.n32}
                    left={Space.n0}
                    right={Space.n0}
                    zIndex={100}
                    onDismiss={fontWeight.closeMenu}
                    clickOutsideToDismiss={true}
                  >
                    <Frame
                      {...fontWeight.getMenuProps()}
                      override={{ gap: Space.n1, border: true }}
                      style={{ boxShadow: "var(--elevation-n2)" }}
                      surface="overlay"
                      rounded={Radius2.md}
                    >
                      {fontWeights.map((item, index) => (
                        <Frame
                          key={index}
                          {...fontWeight.getItemProps({ item, index })}
                          override={{
                            px: Space.n8,
                            py: Space.n4,
                            cursor: "pointer",
                          }}
                          surface={
                            fontWeight.selectedItem === item
                              ? "raised"
                              : undefined
                          }
                          style={{
                            backgroundColor:
                              fontWeight.highlightedIndex === index
                                ? "var(--surface-raised)"
                                : undefined,
                          }}
                        >
                          <Text.Menu.Item>{item}</Text.Menu.Item>
                        </Frame>
                      ))}
                    </Frame>
                  </Overlay>
                )}
              </Field>
              <Field value="42" w={Size.n48} />
            </Frame>
            <Frame
              override={{ gap: Space.n8, minHeight: Size.n32 }}
              layout={Layout.Row.Middle.Center}
              spacing={Space.n8}
            >
              <Field label="LH" value="Auto" flex />
              <Field label="LS" value="0%" flex />
            </Frame>
            <Frame
              // Inner toolbar for alignment
              layout={Layout.Row.Middle.Center}
              spacing={Space.n8}
              h={Size.n36}
              surface="sunken"
              rounded={Radius2.md}
              override={{
                border: true,
                p: Space.n4,
                gap: Space.n1,
              }}
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
                  surface={i === 0 ? "raised" : undefined}
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
                override={{ border: true }}
                rounded={Radius2.full}
                style={{
                  width: "10px",
                  height: "10px",
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
                  override={{ gap: Space.n8, minHeight: Size.n32 }}
                  layout={Layout.Row.Middle.Center}
                  spacing={Space.n8}
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
            />
            <Frame
              layout={Layout.Row.Middle.Center}
              spacing={Space.n8}
              override={{ gap: Space.n8, minHeight: Size.n32 }}
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
