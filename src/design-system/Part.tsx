import { Frame, type FrameProps } from "./Frame";

export interface PartProps extends FrameProps {
  area?: string; // Grid area name
  resize?: "left" | "right" | "top" | "bottom" | "none";
  minSize?: string | number;
  maxSize?: string | number;
}

export function Part({
  children,
  area,
  resize,
  minSize,
  maxSize,
  style,
  surface = "base", // Parts usually have a base surface
  className = "",
  ...props
}: PartProps) {
  // Note: Real resizing requires event listeners (mousedown/mousemove).
  // For this iteration, we focus on the static structure.
  // Future: integrate a useResizable hook here.

  return (
    <Frame
      className={`part ${className}`}
      surface={surface}
      style={{
        gridArea: area,
        overflow: "auto", // Isolate scroll
        position: "relative",
        minWidth: resize === "left" || resize === "right" ? minSize : undefined,
        maxWidth: resize === "left" || resize === "right" ? maxSize : undefined,
        minHeight:
          resize === "top" || resize === "bottom" ? minSize : undefined,
        maxHeight:
          resize === "top" || resize === "bottom" ? maxSize : undefined,
        // Border Logic (Simplified for now - can be enhanced)
        borderRight:
          resize === "right" ? "1px solid var(--border-color)" : undefined,
        borderLeft:
          resize === "left" ? "1px solid var(--border-color)" : undefined,
        borderTop:
          resize === "top" ? "1px solid var(--border-color)" : undefined,
        borderBottom:
          resize === "bottom" ? "1px solid var(--border-color)" : undefined,
        ...style,
      }}
      {...props}
    >
      {children}

      {/* Visual Resizer Handle (Placeholder) */}
      {resize && resize !== "none" && (
        <div
          className={`resizer-handle-${resize}`}
          style={{
            position: "absolute",
            zIndex: 10,
            [resize === "right"
              ? "right"
              : resize === "left"
                ? "left"
                : "auto"]: 0,
            [resize === "bottom"
              ? "bottom"
              : resize === "top"
                ? "top"
                : "auto"]: 0,
            top: resize === "right" || resize === "left" ? 0 : undefined,
            bottom: resize === "right" || resize === "left" ? 0 : undefined,
            left: resize === "top" || resize === "bottom" ? 0 : undefined,
            right: resize === "top" || resize === "bottom" ? 0 : undefined,
            width: resize === "right" || resize === "left" ? "4px" : "100%",
            height: resize === "top" || resize === "bottom" ? "4px" : "100%",
            cursor:
              resize === "right" || resize === "left"
                ? "col-resize"
                : "row-resize",
            // Transparent hover target
            backgroundColor: "transparent",
          }}
          title="Resizer"
        />
      )}
    </Frame>
  );
}
