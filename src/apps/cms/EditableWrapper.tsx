import { useState } from "react";
import { Space, Size } from "../../design-system/token/token.const.1tier";
import { Text } from "../../design-system/text/Text";
import { Frame } from "../../design-system/Frame";
import { Overlay } from "../../design-system/Overlay";

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
      override={{
        style: {
          position: "relative",
          outline: isHovered
            ? "2px solid var(--primary-bg)"
            : "2px solid transparent",
          outlineOffset: "2px",
          ...style,
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cursor="text"
      onClick={(e) => {
        e.stopPropagation();
        onEdit?.();
      }}
    >
      {isHovered && (
        <Overlay position="absolute" y={-10} x={-2} zIndex={50}>
          <Frame
            override={{ py: Space.n0, px: Space.n6, rounded: "sm", h: Size.n4 }}
            surface="primary"
            pack
          >
            <Text.Card.Note
              style={{
                fontSize: "10px",
                fontWeight: "bold",
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
