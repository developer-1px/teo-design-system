import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useAtom, useAtomValue } from "jotai";
import { useMemo, useState } from "react";

// import { Table } from "../../ui/table/Table";
import { formatColumnLabel } from "./dataLoader";
import { formatForTable } from "./drawer/nestedValueFormatter";
import { currentDataAtom, selectedRowIdAtom } from "./store";
import { TableObjectCell } from "./TableObjectCell"; // Import new component
import type { DataRow } from "./types";

function formatCellValue(value: unknown): string {
  if (Array.isArray(value)) {
    return `${value.length} Items`;
  }
  if (typeof value === "object" && value !== null) {
    // Just return Object count/type for cleanliness in table
    return `${Object.keys(value).length} Props`;
  }

  return formatForTable(value, {
    maxDepth: 0,
    maxArrayItems: 0,
    maxStringLength: 40,
    arrayOfObjectsStrategy: "count",
  });
}

const Table = {
  Root: ({ children, ...props }: any) => <table className="mdk-table" style={{ width: '100%', borderCollapse: 'collapse' }} {...props}>{children}</table>,
  Header: ({ children, ...props }: any) => <thead {...props}>{children}</thead>,
  Head: ({ children, sortable, sorted, onSort, ...props }: any) => (
    <th
      style={{
        textAlign: 'left',
        padding: '12px',
        borderBottom: '1px solid var(--border-color)',
        cursor: sortable ? 'pointer' : 'default',
        userSelect: 'none'
      }}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {children}
        {sorted === 'asc' && <span>↑</span>}
        {sorted === 'desc' && <span>↓</span>}
      </div>
    </th>
  ),
  Row: ({ children, selected, ...props }: any) => (
    <tr
      style={{
        background: selected ? 'var(--surface-selected-bg)' : 'transparent',
        cursor: props.onClick ? 'pointer' : 'default'
      }}
      {...props}
    >
      {children}
    </tr>
  ),
  Cell: ({ children, ...props }: any) => (
    <td style={{ padding: '12px', borderBottom: '1px solid var(--border-color)' }} {...props}>
      {children}
    </td>
  ),
  Empty: ({ message }: { message: string }) => (
    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
      {message}
    </div>
  )
};

export function CRMTable() {
  const data = useAtomValue(currentDataAtom);
  const [selectedRowId, setSelectedRowId] = useAtom(selectedRowIdAtom);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Generate columns dynamically from data (exclude internal __rowId field)
  const columns = useMemo<ColumnDef<DataRow>[]>(() => {
    if (data.length === 0) return [];

    const firstRow = data[0];
    const keys = Object.keys(firstRow).filter((key) => key !== "__rowId");

    return keys.map((key) => ({
      accessorKey: key,
      header: formatColumnLabel(key),
      cell: (info) => {
        const value = info.getValue() as unknown; // Explicit type for info.getValue()
        if (typeof value === "object" && value !== null) {
          return <TableObjectCell value={value as object} />;
        }
        return formatCellValue(value);
      },
    }));
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (data.length === 0) {
    return <Table.Empty message="No data available" />;
  }

  return (
    <Table.Root>
      {/* Header */}
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Header key={headerGroup.id}>
          <tr>
            {headerGroup.headers.map((header) => {
              const sortState = header.column.getIsSorted();
              return (
                <Table.Head
                  key={header.id}
                  sortable={header.column.getCanSort()}
                  sorted={sortState || false}
                  onSort={() => header.column.toggleSorting()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </Table.Head>
              );
            })}
          </tr>
        </Table.Header>
      ))}

      {/* Rows */}
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const rowData = row.original as DataRow & { __rowId: string };
          const isSelected = selectedRowId === rowData.__rowId;

          return (
            <Table.Row
              key={row.id}
              selected={isSelected}
              onClick={() => setSelectedRowId(rowData.__rowId)}
            >
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          );
        })}
      </tbody>
    </Table.Root>
  );
}
