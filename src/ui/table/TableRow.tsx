import type React from "react";
import { Action } from "../../design-system/Action";
import { Frame } from "../../design-system/Frame/Frame.tsx";
import { Size, Space } from "../../design-system/token/token.const.1tier";

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
  columns,
  height = 48,
}: TableRowProps) {
  if (onClick) {
    return (
      <Action
        variant={selected ? "surface" : "ghost"}
        rounded="none"
        onClick={onClick}
        w="100%"
      >
        <Frame
          style={{ height }}
          override={{
            w: Size.full,
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
      </Action>
    );
  }

  return (
    <Frame
      style={{ height }}
      override={{
        w: Size.full,
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
