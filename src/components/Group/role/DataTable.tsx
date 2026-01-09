import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useState, useRef, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { useNavigableCursor } from '@/lib/keyboard';
import { SearchInput } from '@/components/Field/role/SearchInput';
import { Kbd } from '@/components/Text/role/Kbd';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  density?: 'compact' | 'normal';
}

export function DataTable<TData, TValue>({
  columns,
  data,
  density = 'compact',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { rows } = table.getRowModel();

  // 키보드 네비게이션 (행 선택)
  const { cursorIndex, getItemProps } = useNavigableCursor({
    type: 'list',
    items: rows,
    onSelect: (row) => {
      console.log('Selected row:', row);
    },
  });

  // Calculate optimal width for each column based on content
  const columnWidths = useMemo(() => {
    const widths: Record<string, number> = {};
    const baseCharWidth = density === 'compact' ? 7 : 8; // approximate px per character
    const padding = density === 'compact' ? 24 : 32; // px-3 = 12px * 2 or px-4 = 16px * 2

    columns.forEach((column) => {
      const accessorKey = String(column.accessorKey || column.id || '');

      // Header width
      let maxLength = accessorKey.length;

      // Sample first 100 rows for performance
      const sampleSize = Math.min(100, data.length);
      for (let i = 0; i < sampleSize; i++) {
        const row = data[i] as Record<string, unknown>;
        const value = row[accessorKey];
        const valueLength = value === null || value === undefined
          ? 1
          : String(value).length;
        maxLength = Math.max(maxLength, valueLength);
      }

      // Calculate width: content + padding, with min/max constraints
      const calculatedWidth = maxLength * baseCharWidth + padding;
      widths[accessorKey] = Math.min(Math.max(calculatedWidth, 80), 400);
    });

    return widths;
  }, [columns, data, density]);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => (density === 'compact' ? 24 : 36),
    overscan: 10,
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className="flex flex-col h-full">
      {/* Search Input */}
      <div className="px-3 py-2">
        <SearchInput
          placeholder="Search all columns..."
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          onClear={() => setGlobalFilter('')}
          variant="ghost"
        />
      </div>

      {/* Table Container with Virtual Scrolling */}
      <div
        ref={tableContainerRef}
        className="flex-1 overflow-auto"
        style={{ contain: 'strict' }}
      >
        <div className="text-sm" style={{ minWidth: 'max-content' }}>
          {/* Header */}
          <div className="sticky top-0 z-10 bg-surface">
            {table.getHeaderGroups().map((headerGroup) => (
              <div key={headerGroup.id} className="flex">
                {headerGroup.headers.map((header) => {
                  const accessorKey = String(header.column.columnDef.accessorKey || header.id);
                  const width = columnWidths[accessorKey] || 150;

                  return (
                    <div
                      key={header.id}
                      className={`text-left font-medium text-muted whitespace-nowrap ${
                        density === 'compact' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
                      }`}
                      style={{ width: `${width}px`, minWidth: `${width}px` }}
                    >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'flex items-center gap-1 cursor-pointer select-none hover:text-text transition-colors'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="flex-shrink-0">
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp size={12} className="text-accent" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown size={12} className="text-accent" />
                            ) : (
                              <ChevronsUpDown size={12} className="opacity-30" />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Virtual Rows */}
          {rows.length === 0 ? (
            <div className="px-4 py-8 text-center text-subtle">
              No results found.
            </div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
            >
              {virtualItems.map((virtualRow) => {
                const row = rows[virtualRow.index];
                const isEven = virtualRow.index % 2 === 0;
                const isCursor = virtualRow.index === cursorIndex;
                const itemProps = getItemProps(virtualRow.index);

                return (
                  <div
                    key={row.id}
                    {...itemProps}
                    className={`flex hover:bg-surface-raised absolute transition-colors ${
                      isCursor
                        ? 'bg-accent/10 ring-1 ring-accent/30'
                        : isEven ? 'bg-surface' : 'bg-surface-sunken'
                    }`}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      width: '100%',
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const accessorKey = String(cell.column.columnDef.accessorKey || cell.column.id);
                      const width = columnWidths[accessorKey] || 150;

                      return (
                        <div
                          key={cell.id}
                          className={`text-text whitespace-nowrap overflow-hidden text-ellipsis flex items-center ${
                            density === 'compact' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'
                          }`}
                          style={{ width: `${width}px`, minWidth: `${width}px` }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-surface-sunken border-t border-default">
        <div className="flex items-center gap-2 text-xs text-subtle">
          <span>
            Showing {virtualItems.length} of {rows.length} rows
          </span>
          {globalFilter && (
            <>
              <span>•</span>
              <span>
                Filtered from {data.length} total
              </span>
            </>
          )}
        </div>

        {/* Keyboard Navigation Hint */}
        <div className="flex items-center gap-2 text-xs text-subtle">
          <span>Navigate:</span>
          <Kbd size="sm">↑</Kbd>
          <Kbd size="sm">↓</Kbd>
          <span>•</span>
          <span>Select:</span>
          <Kbd size="sm">↵</Kbd>
        </div>
      </div>
    </div>
  );
}
