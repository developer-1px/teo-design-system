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
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";

// --- Visual Helpers ---

const ControlLabel = ({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: any;
}) => (
  <Frame
    layout={Layout.Row.Middle.Center}
    spacing={Space.n8}
    override={{ minHeight: Size.n32, gap: Space.n2 }}
    style={{ minWidth: "60px" } as any}
  >
    {Icon && <Icon size={10} className="text-tertiary" />}
    <Text size={FontSize.n9} color="tertiary">
      {children}
    </Text>
  </Frame>
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
  <Frame
    override={{
      r: Radius2.sm,
      border: true,
      px: Space.n2,
      py: Space.n2,
      flex: true,
      justify: "between",
      gap: Space.n2,
      minHeight: Size.n40,
    }}
    surface="base"
    layout={Layout.Row.Middle.Center}
    spacing={Space.n12}
  >
    <Frame
      layout={Layout.Row.Middle.Center}
      spacing={Space.n8}
      override={{ minHeight: Size.n32, gap: Space.n2 }}
    >
      {Icon && <Icon size={10} className="text-tertiary" />}
      {label && (
        <Text size={FontSize.n9} color="tertiary">
          {label}
        </Text>
      )}
    </Frame>
    <Text
      size={FontSize.n9}
      mono
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}
    >
      {String(value)}
    </Text>
  </Frame>
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
    <Frame
      style={{ width: "100%" } as any}
      layout={Layout.Col.Left.Start}
      spacing={Space.n4}
    >
      {/* Direction & Flow */}
      <Frame
        layout={Layout.Row.Middle.Center}
        spacing={Space.n12}
        override={{ minHeight: Size.n40, justify: "between", gap: Space.n2 }}
      >
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n8}
          override={{ gap: Space.n1, minHeight: Size.n32 }}
        >
          <Frame
            override={{ p: Space.n1, r: Radius2.sm, border: true }}
            surface={isRow ? "sunken" : "base"}
          >
            <ArrowRight
              size={12}
              className={isRow ? "text-primary" : "text-tertiary"}
            />
          </Frame>
          <Frame
            override={{ p: Space.n1, r: Radius2.sm, border: true }}
            surface={isCol ? "sunken" : "base"}
          >
            <ArrowDown
              size={12}
              className={isCol ? "text-primary" : "text-tertiary"}
            />
          </Frame>
        </Frame>

        {/* Gap Display */}
        {gap && <ValueBox value={gap} icon={AlignHorizontalSpaceBetween} />}
      </Frame>

      {/* Alignment Matrix (Simplified to text/icon row) */}
      {(props.align || props.justify) && (
        <Frame override={{ grid: true, columns: "1fr 1fr", gap: Space.n2 }}>
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
        </Frame>
      )}

      {/* Padding Box Model */}
      {(padding || px || py) && (
        <Frame
          layout={Layout.Col.Left.Start}
          spacing={Space.n0}
          override={{
            p: Space.n2,
            r: Radius2.sm,
            border: true,
            gap: Space.n1,
            align: "center",
          }}
          surface="sunken"
        >
          <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n12}
            override={{ minHeight: Size.n40, justify: "center" }}
          >
            <Text size={FontSize.n9} color="tertiary">
              {py || padding || "-"}
            </Text>
          </Frame>
          <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n12}
            override={
              {
                minHeight: Size.n40,
                justify: "between",
                align: "center",
                width: "100%",
              } as any
            }
          >
            <Text size={FontSize.n9} color="tertiary">
              {px || padding || "-"}
            </Text>
            <Box size={12} className="text-tertiary" />
            <Text size={FontSize.n9} color="tertiary">
              {px || padding || "-"}
            </Text>
          </Frame>
          <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n12}
            override={{ minHeight: Size.n40, justify: "center" }}
          >
            <Text size={FontSize.n9} color="tertiary">
              {py || padding || "-"}
            </Text>
          </Frame>
        </Frame>
      )}
    </Frame>
  );
};

// --- Sizing Control ---
export const SizingControl = ({ props }: { props: Record<string, any> }) => {
  const w = props.w || props.width;
  const h = props.h || props.height;
  const flex = props.flex;
  const fill = props.fill;

  return (
    <Frame
      style={{ width: "100%" } as any}
      layout={Layout.Col.Left.Start}
      spacing={Space.n4}
    >
      <Frame override={{ grid: true, columns: "1fr 1fr", gap: Space.n2 }}>
        <ValueBox label="W" value={w || "Auto"} icon={Move} />
        <ValueBox label="H" value={h || "Auto"} icon={Move} />
      </Frame>

      {(flex || fill) && (
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
          override={{ minHeight: Size.n40, gap: Space.n2 }}
        >
          {fill && (
            <Frame
              override={{
                px: Space.n2,
                py: Space.n1,
                r: Radius2.sm,
                border: true,
              }}
              surface="sunken"
            >
              <Text size={FontSize.n9}>Fill</Text>
            </Frame>
          )}
          {flex && (
            <ValueBox
              label="Flex"
              value={flex === true ? "1" : flex}
              icon={Maximize}
            />
          )}
        </Frame>
      )}
    </Frame>
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
    <Frame
      style={{ width: "100%" } as any}
      layout={Layout.Col.Left.Start}
      spacing={Space.n4}
    >
      {surface && (
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
          override={{ minHeight: Size.n40, justify: "between" }}
        >
          <ControlLabel icon={Square}>Surface</ControlLabel>
          <Frame
            layout={Layout.Row.Middle.Center}
            spacing={Space.n8}
            override={{ minHeight: Size.n32, gap: Space.n2 }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 2,
                background:
                  "var(--surface-base)" /* Approximation for visual or use token */,
              }}
            />
            <Text size={FontSize.n9}>{surface}</Text>
          </Frame>
        </Frame>
      )}

      <Frame override={{ grid: true, columns: "1fr 1fr", gap: Space.n2 }}>
        {r && <ValueBox label="R" value={r} icon={CornerUpRight} />}
        {opacity && <ValueBox label="Op" value={opacity} icon={Minus} />}
      </Frame>

      {border && (
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
          override={{
            minHeight: Size.n40,
            justify: "between",
            p: Space.n2,
            r: Radius2.sm,
            border: true,
          }}
        >
          <ControlLabel icon={Square}>Border</ControlLabel>
          <Text size={FontSize.n9}>{props.borderWidth || "1px"}</Text>
        </Frame>
      )}
      {shadow && (
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n12}
          override={{
            minHeight: Size.n40,
            justify: "between",
            p: Space.n2,
            r: Radius2.sm,
            border: true,
          }}
        >
          <ControlLabel icon={Box /* Shadow icon substitute */}>
            Shadow
          </ControlLabel>
          <Text size={FontSize.n9}>{shadow}</Text>
        </Frame>
      )}
    </Frame>
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
    <Frame
      style={{ width: "100%" } as any}
      layout={Layout.Col.Left.Start}
      spacing={Space.n4}
    >
      <Frame override={{ grid: true, columns: "1fr 1fr", gap: Space.n2 }}>
        {size && <ValueBox label="Size" value={size} icon={Type} />}
        {weight && <ValueBox label="Weight" value={weight} icon={Type} />}
      </Frame>
      {color && <ValueBox label="Color" value={color} icon={Palette} />}
    </Frame>
  );
};
