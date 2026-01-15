import { useState } from "react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Overlay } from "../../design-system/Overlay";
import { Text } from "../../design-system/text/Text";
import {
  FontSize,
  Size,
  Space,
} from "../../design-system/token/token.const.1tier";
import { Radius2 } from "../../design-system/token/token.const.2tier";

export interface EditableWrapperProps {
  children: React.ReactNode;
  onEdit?: () => void;
  style?: React.CSSProperties;
}

export function EditableWrapper({
  children,
  onEdit,
  style,
}: EditableWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Frame
      override={{ cursor: "text" }}
      style={{
        position: "relative",
        outline: isHovered
          ? "var(--space-n2) solid var(--primary-bg)"
          : "var(--space-n2) solid transparent",
        outlineOffset: "var(--space-n2)",
        ...style,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        onEdit?.();
      }}
    >
      {isHovered && (
        <Overlay position="absolute" y={-10} x={-2} zIndex={50}>
          <Frame
            override={{ py: Space.n0, px: Space.n6, h: Size.n4 }}
            rounded={Radius2.sm}
            surface="primary"
            pack
          >
            <Text.Card.Note
              size={FontSize.n10}
              weight="bold"
              style={{
                color: "inherit",
                lineHeight: 1,
              }}
            >
              EDIT
            </Text.Card.Note>
          </Frame>
        </Overlay>
      )}
      {children}
    </Frame>
  );
}
