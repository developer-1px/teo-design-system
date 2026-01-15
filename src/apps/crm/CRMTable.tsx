import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import { Table } from "../../ui/table/Table";
import { formatColumnLabel } from "./dataLoader";
import { currentDataAtom, selectedRowIdAtom } from "./store";
import type { DataRow } from "./types";

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    // Format currency if the value is large
    if (value > 1000) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(value);
    }
    return value.toString();
  }
  return String(value);
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

    return keys.map((key) => ({
      accessorKey: key,
      header: formatColumnLabel(key),
      cell: (info) => formatCellValue(info.getValue()),
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

  const columnTemplate = `repeat(${columns.length}, minmax(120px, 1fr))`;

  return (
    <Table.Root>
      {/* Header */}
      {table.getHeaderGroups().map((headerGroup) => (
        <Table.Header key={headerGroup.id} columns={columnTemplate}>
          {headerGroup.headers.map((header) => {
            const sortState = header.column.getIsSorted();
            return (
              <Table.Head
                key={header.id}
                sortable={header.column.getCanSort()}
                sorted={sortState || false}
                onSort={header.column.getToggleSortingHandler()}
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext()
                )}
              </Table.Head>
            );
          })}
        </Table.Header>
      ))}

      {/* Rows */}
      {table.getRowModel().rows.map((row) => {
        const rowData = row.original as DataRow & { __rowId: string };
        const isSelected = selectedRowId === rowData.__rowId;

        return (
          <Table.Row
            key={row.id}
            columns={columnTemplate}
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
    </Table.Root>
  );
}
