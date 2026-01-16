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

import { Table } from "../../ui/table/Table";
import { formatColumnLabel } from "./dataLoader";
import { formatForTable } from "./drawer/nestedValueFormatter";
import { TableObjectCell } from "./TableObjectCell"; // Import new component
import { currentDataAtom, selectedRowIdAtom } from "./store";
import type { DataRow } from "./types";

function formatCellValue(value: unknown): string {
  if (Array.isArray(value)) {
    return `${value.length} Items`;
  }
  if (typeof value === "object" && value !== null) {
    // Just return Object count/type for cleanliness in table
    return Object.keys(value).length + " Props";
  }

  return formatForTable(value, {
    maxDepth: 0,
    maxArrayItems: 0,
    maxStringLength: 40,
    arrayOfObjectsStrategy: "count",
  });
}

export function CRMTable() {
  const data = useAtomValue(currentDataAtom);
  const [selectedRowId, setSelectedRowId] = useAtom(selectedRowIdAtom);
  const [sorting, setSorting] = useState<SortingState>([]);

  // Generate columns dynamically from data (exclude internal __rowId field)
  const columns = useMemo<ColumnDef<DataRow>[]>(() => {
    if (data.length === 0) return [];

    const firstRow = data[0];
    const keys = Object.keys(firstRow).filter((key) => key !== "__rowId");

    // accessorKey and header are already defined above implicitly by the map structure 
    // but wait, I see I pasted the key/header TWICE in the previous edit.
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
