import type { ReactNode } from "react";
import { Frame } from "../Frame/Frame";
import { ResizeHandle } from "./ResizeHandle";
import { type UseResizableOptions, useResizable } from "./useResizable";

export interface ResizablePanelProps extends UseResizableOptions {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wrapper component that makes any panel resizable
 * Automatically applies correct sizing and positioning
 *
 * @example
 * <ResizablePanel
 *   direction="right"
 *   defaultSize={512}
 *   minSize={320}
 *   maxSize={800}
 *   storageKey="my-drawer-width"
 * >
 *   <MyDrawerContent />
 * </ResizablePanel>
 */
export function ResizablePanel({
  children,
  direction,
  defaultSize,
  minSize,
  maxSize,
  storageKey,
  onResize,
  className,
  style,
}: ResizablePanelProps) {
  const { size, resizeHandleProps } = useResizable({
    direction,
    defaultSize,
    minSize,
    maxSize,
    storageKey,
    onResize,
  });

  // Determine which dimension to set (width or height)
  const isHorizontal = direction === "left" || direction === "right";
  const sizeStyle = isHorizontal
    ? { width: `${size}px` }
    : { height: `${size}px` };

  return (
    <Frame
      className={className}
      style={{
        position: "relative",
        ...sizeStyle,
        ...style,
      }}
    >
      <ResizeHandle direction={direction} {...resizeHandleProps} />
      {children}
    </Frame>
  );
}
