import type React from "react";
import { Text } from "../../design-system/text/Text.tsx";

interface TableCellProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  color?: string;
  weight?: "regular" | "medium" | "bold";
}

export function TableCell({
  children,
  align = "left",
  color = "var(--text-secondary)",
  weight = "regular",
}: TableCellProps) {
  return (
    <Text.Table.Cell
      weight={weight}
      style={{
        color,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        textAlign: align,
      }}
    >
      {children}
    </Text.Table.Cell>
  );
}
