import { ChevronDown, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { Icon } from "@/ui/primitives/Icon";
import {
  FontSize,
  IconSize,
  Size,
  Space,
} from "@/legacy-design-system/token/token.const.1tier";
import { Radius2 } from "@/legacy-design-system/token/radius2";

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

  const baseStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Space.n2,
    paddingBottom: Space.n2,
    paddingLeft: Space.n6,
    paddingRight: Space.n6,
    borderBottom: "1px solid var(--border-subtle)",
    backgroundColor: background === "sunken" ? "var(--surface-sunken)" : "var(--surface-base)",
    gap: Space.n8,
  };

  // Primitive Render
  if (!isObject) {
    return (
      <div
        style={{
          ...baseStyle,
          paddingLeft: `${depth * 12 + 8}px`,
        }}
      >
        <span style={{ fontSize: FontSize.n9, color: "var(--text-secondary)" }}>
          {label}
        </span>
        <span
          style={{
            fontSize: FontSize.n9,
            fontFamily: "monospace",
            maxWidth: "140px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            textAlign: "right",
            color: "var(--text-tertiary)",
            marginLeft: "auto"
          }}
          title={String(value)}
        >
          {String(value)}
        </span>
      </div>
    );
  }

  // Nested Render
  return (
    <>
      <div
        style={{
          ...baseStyle,
          paddingLeft: `${depth * 12 + 8}px`,
          cursor: isEmpty ? "default" : "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isEmpty) setIsOpen(!isOpen);
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: Space.n12,
            paddingLeft: Space.n16,
            minHeight: Size.n40,
            flex: 1
          }}
        >
          {!isEmpty && (
            <Icon
              src={isOpen ? ChevronDown : ChevronRight}
              size={IconSize.n10}
              style={{ color: "var(--text-tertiary)" }}
            />
          )}
          {isEmpty && <div style={{ width: Size.n12, height: Size.n12 }} />}{" "}
          {/* Spacer */}
          <span style={{ fontSize: FontSize.n9, color: "var(--text-secondary)" }}>
            {label}
          </span>
        </div>
        <span style={{ fontSize: FontSize.n9, color: "var(--text-tertiary)", fontFamily: "monospace" }}>
          {isArray ? `Array(${value.length})` : "{...}"}
        </span>
      </div>

      {isOpen && !isEmpty && (
        <div>
          {Object.entries(value).map(([k, v]) => (
            <PropertyTree
              key={k}
              label={k}
              value={v}
              depth={depth + 1}
              background={background} // Inherit bg or toggle? Keep simple for now
            />
          ))}
        </div>
      )}
    </>
  );
}
