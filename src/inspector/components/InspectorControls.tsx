import {
  AlignCenter,
  AlignHorizontalSpaceBetween,
  ArrowDown,
  ArrowRight,
  Box,
  CornerUpRight,
  Maximize,
  Minus,
  Move,
  Palette,
  Square,
  Type,
} from "lucide-react";
import type React from "react";
import {
  FontSize,
  Size,
  Space,
} from "@/legacy-design-system/token/token.const.1tier";
import { Radius2 } from "@/legacy-design-system/token/radius2";

// --- Visual Helpers ---

const ControlLabel = ({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: any;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: Space.n2,
      minHeight: Size.n32,
      minWidth: "60px",
      paddingLeft: Space.n8,
      paddingRight: Space.n8,
    }}
  >
    {Icon && <Icon size={10} style={{ color: "var(--text-tertiary)" }} />}
    <span style={{ fontSize: FontSize.n9, color: "var(--text-tertiary)" }}>
      {children}
    </span>
  </div>
);

const ValueBox = ({
  value,
  label,
  icon: Icon,
}: {
  value: any;
  label?: string;
  icon?: any;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: Space.n12,
      borderRadius: Radius2.sm,
      border: "1px solid var(--border-subtle)",
      paddingLeft: Space.n2,
      paddingRight: Space.n2,
      paddingTop: Space.n2,
      paddingBottom: Space.n2,
      flex: 1,
      minHeight: Size.n40,
      backgroundColor: "var(--surface-base)",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: Space.n2,
        minHeight: Size.n32,
      }}
    >
      {Icon && <Icon size={10} style={{ color: "var(--text-tertiary)" }} />}
      {label && (
        <span style={{ fontSize: FontSize.n9, color: "var(--text-tertiary)" }}>
          {label}
        </span>
      )}
    </div>
    <span
      style={{
        fontSize: FontSize.n9,
        fontFamily: "monospace",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {String(value)}
    </span>
  </div>
);

// --- Layout Control (Flex logic imitation) ---
export const LayoutControl = ({ props }: { props: Record<string, any> }) => {
  // Deduce direction
  const isRow =
    props.row === true || props.row === "true" || props.direction === "row";
  const isCol = !isRow;

  const gap = props.gap;
  const padding = props.p || props.padding;
  const px = props.px;
  const py = props.py;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: Space.n4,
        width: "100%",
      }}
    >
      {/* Direction & Flow */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: Space.n2,
          minHeight: Size.n40,
          width: "100%"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: Space.n1,
            minHeight: Size.n32,
          }}
        >
          <div
            style={{
              padding: Space.n1,
              borderRadius: Radius2.sm,
              border: "1px solid var(--border-subtle)",
              backgroundColor: isRow ? "var(--surface-sunken)" : "var(--surface-base)",
              display: "flex"
            }}
          >
            <ArrowRight
              size={12}
              style={{ color: isRow ? "var(--text-primary)" : "var(--text-tertiary)" }}
            />
          </div>
          <div
            style={{
              padding: Space.n1,
              borderRadius: Radius2.sm,
              border: "1px solid var(--border-subtle)",
              backgroundColor: isCol ? "var(--surface-sunken)" : "var(--surface-base)",
              display: "flex"
            }}
          >
            <ArrowDown
              size={12}
              style={{ color: isCol ? "var(--text-primary)" : "var(--text-tertiary)" }}
            />
          </div>
        </div>

        {/* Gap Display */}
        {gap && <ValueBox value={gap} icon={AlignHorizontalSpaceBetween} />}
      </div>

      {/* Alignment Matrix (Simplified to text/icon row) */}
      {(props.align || props.justify) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: Space.n2, width: "100%" }}>
          {props.align && (
            <ValueBox label="Align" value={props.align} icon={AlignCenter} />
          )}
          {props.justify && (
            <ValueBox
              label="Justify"
              value={props.justify}
              icon={AlignCenter}
            />
          )}
        </div>
      )}

      {/* Padding Box Model */}
      {(padding || px || py) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: Space.n1,
            padding: Space.n2,
            borderRadius: Radius2.sm,
            border: "1px solid var(--border-subtle)",
            backgroundColor: "var(--surface-sunken)",
            width: "100%"
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: Space.n12,
              minHeight: Size.n40,
              width: "100%"
            }}
          >
            <span style={{ fontSize: FontSize.n9, color: "var(--text-tertiary)" }}>
              {py || padding || "-"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: Space.n12,
              minHeight: Size.n40,
              width: "100%",
            }}
          >
            <span style={{ fontSize: FontSize.n9, color: "var(--text-tertiary)" }}>
              {px || padding || "-"}
            </span>
            <Box size={12} style={{ color: "var(--text-tertiary)" }} />
            <span style={{ fontSize: FontSize.n9, color: "var(--text-tertiary)" }}>
              {px || padding || "-"}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: Space.n12,
              minHeight: Size.n40,
              width: "100%"
            }}
          >
            <span style={{ fontSize: FontSize.n9, color: "var(--text-tertiary)" }}>
              {py || padding || "-"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sizing Control ---
export const SizingControl = ({ props }: { props: Record<string, any> }) => {
  const w = props.w || props.width;
  const h = props.h || props.height;
  const flex = props.flex;
  const fill = props.fill;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: Space.n4,
        width: "100%",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: Space.n2, width: "100%" }}>
        <ValueBox label="W" value={w || "Auto"} icon={Move} />
        <ValueBox label="H" value={h || "Auto"} icon={Move} />
      </div>

      {(flex || fill) && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: Space.n2,
            minHeight: Size.n40,
            width: "100%"
          }}
        >
          {fill && (
            <div
              style={{
                paddingLeft: Space.n2,
                paddingRight: Space.n2,
                paddingTop: Space.n1,
                paddingBottom: Space.n1,
                borderRadius: Radius2.sm,
                border: "1px solid var(--border-subtle)",
                backgroundColor: "var(--surface-sunken)",
              }}
            >
              <span style={{ fontSize: FontSize.n9 }}>Fill</span>
            </div>
          )}
          {flex && (
            <ValueBox
              label="Flex"
              value={flex === true ? "1" : flex}
              icon={Maximize}
            />
          )}
        </div>
      )}
    </div>
  );
};

// --- Appearance Control ---
export const AppearanceControl = ({
  props,
}: {
  props: Record<string, any>;
}) => {
  const surface = props.surface;
  const r = props.r || props.rounded; // Legacy support
  const border = props.border;
  const shadow = props.shadow;
  const opacity = props.opacity;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: Space.n4,
        width: "100%",
      }}
    >
      {surface && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: Size.n40,
            width: "100%"
          }}
        >
          <ControlLabel icon={Square}>Surface</ControlLabel>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: Space.n2,
              minHeight: Size.n32
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background:
                  "var(--surface-base)",
              }}
            />
            <span style={{ fontSize: FontSize.n9 }}>{surface}</span>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: Space.n2, width: "100%" }}>
        {r && <ValueBox label="R" value={r} icon={CornerUpRight} />}
        {opacity && <ValueBox label="Op" value={opacity} icon={Minus} />}
      </div>

      {border && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: Space.n2,
            borderRadius: Radius2.sm,
            border: "1px solid var(--border-subtle)",
            minHeight: Size.n40,
            width: "100%"
          }}
        >
          <ControlLabel icon={Square}>Border</ControlLabel>
          <span style={{ fontSize: FontSize.n9 }}>{props.borderWidth || "1px"}</span>
        </div>
      )}
      {shadow && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: Space.n2,
            borderRadius: Radius2.sm,
            border: "1px solid var(--border-subtle)",
            backgroundColor: "var(--surface-base)",
            minHeight: Size.n40,
            width: "100%"
          }}
        >
          <ControlLabel icon={Box /* Shadow icon substitute */}>
            Shadow
          </ControlLabel>
          <span style={{ fontSize: FontSize.n9 }}>{shadow}</span>
        </div>
      )}
    </div>
  );
};

// --- Text Control (Typography) ---
export const TypographyControl = ({
  props,
}: {
  props: Record<string, any>;
}) => {
  // Only relevant if we detect text props
  const size = props.size;
  const weight = props.weight;
  const color = props.color;

  if (!size && !weight && !color) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: Space.n4,
        width: "100%",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: Space.n2, width: "100%" }}>
        {size && <ValueBox label="Size" value={size} icon={Type} />}
        {weight && <ValueBox label="Weight" value={weight} icon={Type} />}
      </div>
      {color && <ValueBox label="Color" value={color} icon={Palette} />}
    </div>
  );
};
