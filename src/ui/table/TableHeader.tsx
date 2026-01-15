import type React from "react";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Space } from "../../design-system/token/token.const.1tier";

interface TableHeaderProps {
  children: React.ReactNode;
  columns?: string;
}

export function TableHeader({ children, columns }: TableHeaderProps) {
  return (
    <Frame
      style={{
        height: 40,
        backgroundColor: "var(--surface-sunken)",
      }}
      override={{
        px: Space.n16,
        gap: Space.n16,
      }}
      grid
      columns={columns}
      align="center"
      borderBottom
    >
      {children}
    </Frame>
  );
}
