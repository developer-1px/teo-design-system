import type React from "react";
import { Action } from "../../design-system/Action";
import { Text } from "../../design-system/text/Text.tsx";
import { Radius2 } from "../../design-system/token";

interface TableHeadProps {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: "asc" | "desc" | false;
  onSort?: () => void;
}

export function TableHead({
  children,
  sortable = false,
  sorted = false,
  onSort,
}: TableHeadProps) {
  if (sortable && onSort) {
    return (
      <Action
        variant="ghost"
        rounded={Radius2.none}
        onClick={onSort}
        w="100%"
        justify="start"
        style={{ cursor: "pointer" }}
      >
        <Text.Table.Head>
          {children}
          {sorted === "asc" && " ↑"}
          {sorted === "desc" && " ↓"}
        </Text.Table.Head>
      </Action>
    );
  }

  return (
    <Text.Table.Head>
      {children}
    </Text.Table.Head>
  );
}
