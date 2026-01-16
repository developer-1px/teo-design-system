import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";
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

export function PropertyTree({
  label,
  value,
  depth = 0,
  background = "base",
}: {
  label: string;
  value: any;
  depth?: number;
  background?: "base" | "sunken";
}) {
  const [isOpen, setIsOpen] = useState(true);
  const isObject =
    value !== null && typeof value === "object" && !React.isValidElement(value);
  const isEmpty = isObject && Object.keys(value).length === 0;
  const isArray = Array.isArray(value);

  // Primitive Render
  if (!isObject) {
    return (
      <Frame
        override={{
          py: Space.n2,
          px: Space.n6,
        }}
        style={{
          paddingLeft: `${depth * 12 + 8}px`,
        }}
        layout={Layout.Row.LabelValue.Default}
        surface={background} border="bottom"
      >
        <Text size={FontSize.n9} color="secondary">
          {label}
        </Text>
        <Text
          size={FontSize.n9}
          mono
          style={{
            maxWidth: "140px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "right",
          }}
          title={String(value)}
        >
          {String(value)}
        </Text>
      </Frame>
    );
  }

  // Nested Render
  return (
    <>
      <Frame
        override={{
          py: Space.n2,
          px: Space.n6,
        }}
        style={{
          paddingLeft: `${depth * 12 + 8}px`,
          cursor: isEmpty ? "default" : "pointer",
        }}
        layout={Layout.Row.LabelValue.Default}
        surface={background}
        onClick={(e) => {
          e.stopPropagation();
          if (!isEmpty) setIsOpen(!isOpen);
        }} border="bottom"
      >
        <Frame layout={Layout.Row.Item.Default}>
          {!isEmpty && (
            <Icon
              src={isOpen ? ChevronDown : ChevronRight}
              size={IconSize.n10}
              style={{ color: "var(--text-tertiary)" }}
            />
          )}
          {isEmpty && <Frame override={{ w: Size.n12, h: Size.n12 }} />}{" "}
          {/* Spacer */}
          <Text size={FontSize.n9} color="secondary">
            {label}
          </Text>
        </Frame>
        <Text size={FontSize.n9} color="tertiary" mono>
          {isArray ? `Array(${value.length})` : "{...}"}
        </Text>
      </Frame>

      {isOpen && !isEmpty && (
        <Frame>
          {Object.entries(value).map(([k, v]) => (
            <PropertyTree
              key={k}
              label={k}
              value={v}
              depth={depth + 1}
              background={background} // Inherit bg or toggle? Keep simple for now
            />
          ))}
        </Frame>
      )}
    </>
  );
}
