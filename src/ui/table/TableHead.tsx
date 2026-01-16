import type React from "react"
import {Text} from "../../design-system/text/Text.tsx"

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
  return (
    <th
      onClick={sortable ? onSort : undefined}
      style={{ cursor: sortable ? "pointer" : "default" }}
    >
      <Text.Table.Head>
        {children}
        {sorted === "asc" && " ↑"}
        {sorted === "desc" && " ↓"}
      </Text.Table.Head>
    </th>
  );
}
