import { useState } from "react";
import { Text } from "../../design-system/Text";
import { Frame } from "../../design-system/Frame";

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
      position="relative"
      style={{
        outline: isHovered
          ? "2px solid var(--color-primary)"
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
        <Frame
          position="absolute"
          top={-24}
          left={0}
          surface="primary"
          p="0 2"
          rounded="sm"
          zIndex={50}
          h={20}
          align="center"
        >
          <Text size={10} weight="bold" color="#fff">
            EDIT
          </Text>
        </Frame>
      )}
      {children}
    </Frame>
  );
}
