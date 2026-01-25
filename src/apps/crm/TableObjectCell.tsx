import { useRef, useState } from "react";
import { Overlay } from "@/design-system/Overlay";
import { Text } from "@/design-system/text/Text";
import {
  Size,
  Space,
  ZIndex,
} from "@/design-system/token/token.const.1tier";
import { JsonSmartView } from "./drawer/JsonSmartView";
import { Radius2 } from "@/design-system/token/radius2";

export function TableObjectCell({ value }: { value: object | any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const isArray = Array.isArray(value);
  const keys = isArray ? value : Object.keys(value);
  const count = keys.length;
  const label = isArray ? `${count} Items` : `${count} Props`;

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent row selection
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Simple positioning: align left, below trigger
      setPosition({ x: rect.left, y: rect.bottom + 4 });
    }
    setIsOpen(true);
  };

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        onClick={handleClick}
        style={{
          display: "flex",
          cursor: "pointer",
          border: "none",
          background: "transparent",
          padding: 0,
          textAlign: "left",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClick(e);
          }
        }}
      >
        <Frame
          layout={Layout.Row.Middle.Center}
          spacing={Space.n4}
          surface="sunken"
          interactive
          rounded={Radius2.sm}
          override={{ px: Space.n8, minHeight: Size.n24 }}
        >
          <Text.Field.Value
            style={{
              fontSize: "11px",
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            {label}
          </Text.Field.Value>
        </Frame>
      </button>

      {isOpen && (
        <Overlay
          x={position.x}
          y={position.y}
          onDismiss={() => setIsOpen(false)}
          clickOutsideToDismiss
          portalTarget={document.body}
          zIndex={ZIndex.n200}
          style={{
            maxWidth: "400px",
            maxHeight: "300px",
          }}
        >
          <Frame
            surface="raised"
            rounded={Radius2.md}
            override={{
              p: Space.n16,
              // border is not a valid override, use style or specialized frame if needed.
              // actually Frame usually supports 'border' prop if it's the custom Frame, let's check FrameProps.
              border: true,
            }}
            style={
              {
                boxShadow: "var(--shadow-floating)", // React.CSSProperties allows string for boxShadow
                maxHeight: "300px",
                maxWidth: "400px",
                minWidth: "200px",
                overflow: "auto",
              } as React.CSSProperties
            }
          >
            {/* 
                          Use JsonSmartView but ensure it fits in the popover.
                        */}
            <JsonSmartView data={value} />
          </Frame>
        </Overlay>
      )}
    </>
  );
}
