# Table Component

Reusable table component with namespace structure for building data tables in MDK.

## Component Structure

```
Table
├── Root       - Table container with scroll support
├── Header     - Table header row
├── Head       - Individual header cell (sortable)
├── Row        - Table row (clickable, selectable)
├── Cell       - Table cell
└── Empty      - Empty state placeholder
```

## Basic Usage

### Simple Table

```tsx
import { Table } from "@/ui/table";

function BasicTable() {
  return (
    <Table.Root>
      <Table.Header columns="1fr 2fr 1fr">
        <Table.Head>Name</Table.Head>
        <Table.Head>Company</Table.Head>
        <Table.Head>Status</Table.Head>
      </Table.Header>

      <Table.Row columns="1fr 2fr 1fr">
        <Table.Cell>John Doe</Table.Cell>
        <Table.Cell>Acme Corp</Table.Cell>
        <Table.Cell>Active</Table.Cell>
      </Table.Row>

      <Table.Row columns="1fr 2fr 1fr">
        <Table.Cell>Jane Smith</Table.Cell>
        <Table.Cell>Vercel</Table.Cell>
        <Table.Cell>Inactive</Table.Cell>
      </Table.Row>
    </Table.Root>
  );
}
```

### Sortable Table

```tsx
import { Table } from "@/ui/table";
import { useState } from "react";

function SortableTable() {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <Table.Root>
      <Table.Header columns="1fr 1fr 1fr">
        <Table.Head
          sortable
          sorted={sortBy === "name" ? sortOrder : false}
          onSort={() => handleSort("name")}
        >
          Name
        </Table.Head>
        <Table.Head
          sortable
          sorted={sortBy === "company" ? sortOrder : false}
          onSort={() => handleSort("company")}
        >
          Company
        </Table.Head>
        <Table.Head>Status</Table.Head>
      </Table.Header>

      {/* ... rows */}
    </Table.Root>
  );
}
```

### Clickable & Selectable Rows

```tsx
import { Table } from "@/ui/table";
import { useState } from "react";

function SelectableTable() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const data = [
    { id: "1", name: "John", company: "Acme" },
    { id: "2", name: "Jane", company: "Vercel" },
  ];

  return (
    <Table.Root>
      <Table.Header columns="1fr 2fr">
        <Table.Head>Name</Table.Head>
        <Table.Head>Company</Table.Head>
      </Table.Header>

      {data.map((row) => (
        <Table.Row
          key={row.id}
          columns="1fr 2fr"
          selected={selectedId === row.id}
          onClick={() => setSelectedId(row.id)}
        >
          <Table.Cell>{row.name}</Table.Cell>
          <Table.Cell>{row.company}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Root>
  );
}
```

### Empty State

```tsx
import { Table } from "@/ui/table";

function EmptyTable() {
  const data = [];

  if (data.length === 0) {
    return <Table.Empty message="No records found" />;
  }

  return <Table.Root>{/* ... */}</Table.Root>;
}
```

## With Tanstack Table

```tsx
import { Table } from "@/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

function TanstackTable({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const columnTemplate = `repeat(${columns.length}, minmax(120px, 1fr))`;

  return (
    <Table.Root>
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Header key={headerGroup.id} columns={columnTemplate}>
          {headerGroup.headers.map((header) => (
            <Table.Head
              key={header.id}
              sortable={header.column.getCanSort()}
              sorted={header.column.getIsSorted() || false}
              onSort={header.column.getToggleSortingHandler()}
            >
              {flexRender(
                header.column.columnDef.header,
                header.getContext()
              )}
            </Table.Head>
          ))}
        </Table.Header>
      ))}

      {table.getRowModel().rows.map((row) => (
        <Table.Row key={row.id} columns={columnTemplate}>
          {row.getVisibleCells().map((cell) => (
            <Table.Cell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </Table.Root>
  );
}
```

## Props API

### Table.Root

Container for the entire table with scroll support.

```tsx
interface TableRootProps {
  children: React.ReactNode;
}
```

### Table.Header

Table header row with grid layout.

```tsx
interface TableHeaderProps {
  children: React.ReactNode;
  columns?: string; // CSS grid template, e.g., "1fr 2fr 1fr"
}
```

### Table.Head

Header cell with optional sorting.

```tsx
interface TableHeadProps {
  children: React.ReactNode;
  sortable?: boolean;         // Enable sorting
  sorted?: "asc" | "desc" | false; // Current sort state
  onSort?: () => void;        // Sort handler
}
```

### Table.Row

Table row with optional click and selection.

```tsx
interface TableRowProps {
  children: React.ReactNode;
  selected?: boolean;         // Highlight row
  onClick?: () => void;       // Click handler
  columns?: string;           // CSS grid template
  height?: number;            // Row height (default: 48px)
}
```

### Table.Cell

Table cell with text styling.

```tsx
interface TableCellProps {
  children: React.ReactNode;
  align?: "left" | "center" | "right"; // Text alignment
  color?: string;                      // Text color
  weight?: "regular" | "medium" | "bold"; // Font weight
}
```

### Table.Empty

Empty state placeholder.

```tsx
interface TableEmptyProps {
  message?: string; // Empty message (default: "No data available")
}
```

## Grid Layout

The `columns` prop accepts CSS grid template strings:

```tsx
// Equal columns
columns="1fr 1fr 1fr"

// Mixed widths
columns="200px 1fr 2fr 150px"

// Auto-sized columns
columns="auto 1fr auto"

// Repeat
columns="repeat(5, 1fr)"

// Min/max
columns="repeat(3, minmax(120px, 1fr))"
```

## Design Tokens

All components use MDK design tokens:

- **Spacing**: `--space-n16` (padding, gaps)
- **Colors**: `--surface-sunken`, `--text-secondary`, `--border-color`
- **Typography**: `Text.Table.Head`, `Text.Table.Cell`
- **Surface**: `--surface-raised` (hover), `--surface-overlay` (active)

## MDK Philosophy

The Table component follows MDK's **3-Tier Intent System**:

### Tier 1: Primitive (Container)
- `Table.Root` - Container for all table content

### Tier 2: Intent (Purpose/Why)
- **Structure Intent**: `Table.Header`, `Table.Row` - Organize data
- **Content Intent**: `Table.Head`, `Table.Cell` - Display data
- **State Intent**: `selected`, `sortable` - Interaction feedback

### Tier 3: Component (Implementation/How)
- Each subcomponent handles specific rendering
- Composed together for complete table

## Examples in MDK

See `src/apps/crm/CRMTable.tsx` for a full implementation with:
- Dynamic column generation
- Tanstack Table integration
- Sorting
- Row selection
- Jotai state management
