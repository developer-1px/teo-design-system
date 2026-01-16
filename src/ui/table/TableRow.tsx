import type React from "react";

interface TableRowProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  columns?: string;
  height?: number;
}

export function TableRow({
  children,
  selected = false,
  onClick,
}: TableRowProps) {
  return (
    <tr
      className={selected ? "selected" : ""}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {children}
    </tr>
  );
}
