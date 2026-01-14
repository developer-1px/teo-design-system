import { useState } from "react";
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
      style={{
        position: 'relative',
        outline: isHovered
          ? "2px solid var(--primary-bg)"
          : "2px solid transparent",
        outlineOffset: "2px",
        ...style,
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
        <Overlay
          position="absolute"
          y={-10}
          x={-2}
          zIndex={50}
        >
          <Frame
            surface="primary"
            p="0 1.5"
            rounded="sm"
            h={4}
            pack
          >
            <Text.Card.Note style={{ fontSize: "10px", fontWeight: "bold", color: "inherit", lineHeight: 1 }}>
              EDIT
            </Text.Card.Note>
          </Frame>
        </Overlay>
      )}
      {children}
    </Frame>
  );
}
