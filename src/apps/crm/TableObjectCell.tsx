import { useState, useRef } from "react";
import { Frame } from "../../design-system/Frame/Frame";
import { Layout } from "../../design-system/Frame/Layout/Layout";
import { Text } from "../../design-system/text/Text";
import { Space, ZIndex } from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";
import { Overlay } from "../../design-system/Overlay";
import { JsonSmartView } from "./drawer/JsonSmartView";

export function TableObjectCell({ value }: { value: object | any[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const isArray = Array.isArray(value);
    const keys = isArray ? value : Object.keys(value);
    const count = keys.length;
    const label = isArray ? `${count} Items` : `${count} Props`;

    const handleClick = (e: React.MouseEvent) => {
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
            <div ref={triggerRef} onClick={handleClick} style={{ display: "flex" }}>
                <Frame
                    layout={Layout.Row.Item.Default}
                    surface="sunken"
                    rounded={Radius2.sm}
                    override={{
                        px: Space.n8,
                        py: Space.n2,
                        cursor: "pointer",
                    }}
                >
                    <Text.Field.Value style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>
                        {label}
                    </Text.Field.Value>
                </Frame>
            </div>

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
                            // FrameProps.ts says border: boolean | BorderToken.
                            // But lint said "border does not exist in type FrameOverrides". 
                            // Ah, it's a direct prop, not in 'override'.
                        }}
                        border={true}
                        style={{
                            boxShadow: "var(--shadow-floating)", // React.CSSProperties allows string for boxShadow
                            maxHeight: "300px",
                            maxWidth: "400px",
                            minWidth: "200px",
                            overflow: "auto",
                        } as React.CSSProperties}
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
