import { useState } from "react";
import type { ResizeDirection } from "./useResizable";

export interface ResizeHandleProps {
  direction: ResizeDirection;
  onMouseDown: (e: React.MouseEvent) => void;
  onDoubleClick: () => void;
}

/**
 * Invisible resize handle that appears on hover
 * - 8px wide/tall interaction area
 * - 2px indicator line on hover
 * - Cursor changes based on direction
 */
export function ResizeHandle({
  direction,
  onMouseDown,
  onDoubleClick,
}: ResizeHandleProps) {
  const [isHover, setIsHover] = useState(false);

  // Determine positioning and sizing based on direction
  const isHorizontal = direction === "left" || direction === "right";
  const cursor = isHorizontal ? "col-resize" : "row-resize";

  // Position the handle at the correct edge
  const positionStyles: React.CSSProperties = {
    position: "absolute",
    zIndex: 10,
    ...(direction === "left" && { right: 0, top: 0, bottom: 0, width: "8px" }),
    ...(direction === "right" && { left: 0, top: 0, bottom: 0, width: "8px" }),
    ...(direction === "top" && { bottom: 0, left: 0, right: 0, height: "8px" }),
    ...(direction === "bottom" && {
      top: 0,
      left: 0,
      right: 0,
      height: "8px",
    }),
  };

  // Indicator line styles (2px colored line on hover)
  const indicatorStyles: React.CSSProperties = {
    position: "absolute",
    backgroundColor: "var(--primary-bg)",
    opacity: isHover ? 1 : 0,
    transition: "opacity 0.15s ease",
    pointerEvents: "none",
    ...(direction === "left" && {
      right: "3px",
      top: 0,
      bottom: 0,
      width: "2px",
    }),
    ...(direction === "right" && {
      left: "3px",
      top: 0,
      bottom: 0,
      width: "2px",
    }),
    ...(direction === "top" && {
      bottom: "3px",
      left: 0,
      right: 0,
      height: "2px",
    }),
    ...(direction === "bottom" && {
      top: "3px",
      left: 0,
      right: 0,
      height: "2px",
    }),
  };

  return (
    <div
      style={{
        ...positionStyles,
        cursor,
        backgroundColor: "transparent",
      }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      {/* Hover indicator line */}
      <div style={indicatorStyles} />
    </div>
  );
}
