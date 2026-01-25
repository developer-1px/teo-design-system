import { useState } from "react";
import "./CMSApp.legacy.css";

export interface EditableWrapperProps {
  children: React.ReactNode;
  onEdit?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function EditableWrapper({
  children,
  onEdit,
  style,
  className,
}: EditableWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={className}
      style={{
        position: "relative",
        cursor: "text",
        outline: isHovered
          ? "2px solid var(--primary-bg)"
          : "2px solid transparent",
        outlineOffset: "2px",
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
        <div style={{
          position: 'absolute',
          top: -20,
          left: 0,
          zIndex: 50,
          backgroundColor: 'var(--primary-bg)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: 4,
          fontSize: 10,
          fontWeight: 'bold',
          lineHeight: 1
        }}>
          EDIT
        </div>
      )}
      {children}
    </div>
  );
}
