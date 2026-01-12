import { Frame } from '@/components/dsl/shared/Frame';
import {
  type CellContext, // ✨ NEW
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ChevronDown, ChevronsUpDown, ChevronUp, Grid3x3, Rows3, Search, X } from 'lucide-react';
import { type ReactElement, useEffect, useMemo, useRef, useState } from 'react'; // ✨ NEW
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action.tsx';
import { Kbd } from '@/components/dsl/Element/Text/role/Kbd.tsx';
import { useNavigableCursor } from '@/shared/lib/keyboard';

type SelectionMode = 'row' | 'cell';

interface CellPosition {
  rowIndex: number;
  colIndex: number;
}

/**
 * IDDL Column Definition (v4.1)
 * cell renderer must return a ReactElement (IDDL Component preferred)
 */
export interface IDDLColumnDef<TData, TValue = unknown>
  extends Omit<ColumnDef<TData, TValue>, 'cell'> {
  cell?: (props: CellContext<TData, TValue>) => ReactElement;
}

interface DataTableProps<TData, TValue> {
  columns: IDDLColumnDef<TData, TValue>[]; // ✨ ENFORCED
  data: TData[];
  density?: 'compact' | 'normal';
  searchQuery?: string; // 검색어 (외부에서 주입 가능)
  onSearchChange?: (query: string) => void; // 검색어 변경 콜백
  onRowDoubleClick?: (row: TData) => void; // 행 더블클릭 콜백
  clearSelection?: boolean; // 선택 초기화 트리거
}

export function DataTable<TData, TValue>({
  columns,
  data,
  density = 'compact',
  searchQuery: externalSearchQuery,
  onSearchChange,
  onRowDoubleClick,
  clearSelection,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [internalGlobalFilter, setInternalGlobalFilter] = useState('');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  // Selection mode state
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('row');
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);

  // 외부에서 제어되는 경우 externalSearchQuery 사용, 아니면 내부 상태 사용
  const globalFilter = externalSearchQuery ?? internalGlobalFilter;
  const setGlobalFilter = (value: string) => {
    setInternalGlobalFilter(value);
    onSearchChange?.(value);
  };

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

  // 검색/정렬이 변경되면 선택 초기화
  useEffect(() => {
    setSelectedRowIndex(null);
    setSelectedCell(null);
  }, []);

  // 외부에서 선택 초기화 요청시
  useEffect(() => {
    if (clearSelection) {
      setSelectedRowIndex(null);
      setSelectedCell(null);
    }
  }, [clearSelection]);

  // 선택 모드 변경시 선택 초기화
  useEffect(() => {
    setSelectedRowIndex(null);
    setSelectedCell(null);
  }, []);

  // 키보드 네비게이션 (행 선택)
  const { cursorIndex, getItemProps } = useNavigableCursor({
    type: 'list',
    items: rows,
    onSelect: (_row) => {},
  });

  // Cell 선택 모드 키보드 네비게이션
  useEffect(() => {
    if (selectionMode !== 'cell') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) {
        // 선택된 셀이 없으면 첫 셀 선택
        if (rows.length > 0 && columns.length > 0) {
          setSelectedCell({ rowIndex: 0, colIndex: 0 });
        }
        return;
      }

      const { rowIndex, colIndex } = selectedCell;
      const maxRowIndex = rows.length - 1;
      const maxColIndex = columns.length - 1;

      let newRowIndex = rowIndex;
      let newColIndex = colIndex;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newRowIndex = Math.max(0, rowIndex - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newRowIndex = Math.min(maxRowIndex, rowIndex + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newColIndex = Math.max(0, colIndex - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newColIndex = Math.min(maxColIndex, colIndex + 1);
          break;
        case 'Home':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            // Ctrl/Cmd+Home: 첫 셀
            newRowIndex = 0;
            newColIndex = 0;
          } else {
            // Home: 행의 첫 열
            newColIndex = 0;
          }
          break;
        case 'End':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            // Ctrl/Cmd+End: 마지막 셀
            newRowIndex = maxRowIndex;
            newColIndex = maxColIndex;
          } else {
            // End: 행의 마지막 열
            newColIndex = maxColIndex;
          }
          break;
        default:
          return;
      }

      if (newRowIndex !== rowIndex || newColIndex !== colIndex) {
        setSelectedCell({ rowIndex: newRowIndex, colIndex: newColIndex });

        // Scroll into view
        const cellElement = document.querySelector(
          `[data-cell-row="${newRowIndex}"][data-cell-col="${newColIndex}"]`
        );
        if (cellElement) {
          cellElement.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectionMode, selectedCell, rows.length, columns.length]);

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
        const valueLength = value === null || value === undefined ? 1 : String(value).length;
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
      {/* Toolbar: Search Input + Selection Mode */}
      <Block role="Toolbar" layout="inline" density="Compact" className="px-3 py-2 gap-2">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative flex items-center w-full">
            <Search size={14} className="absolute left-2 text-muted" />
            <input
              type="text"
              placeholder="Search all columns..."
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-8 pl-8 pr-8 w-full bg-layer-2 rounded border border-border text-sm focus:outline-none focus:border-accent transition-colors"
            />
            {(globalFilter ?? '') && (
              <button
                onClick={() => setGlobalFilter('')}
                className="absolute right-2 p-0.5 text-muted hover:text-text rounded-full hover:bg-layer-3"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Selection Mode Toggle */}
        <Frame.Inline layout="inline" density="Compact" className="gap-1">
          <Action
            icon={Rows3}
            prominence={selectionMode === 'row' ? 'Strong' : 'Standard'}
            intent={selectionMode === 'row' ? 'Brand' : 'Neutral'}
            onClick={() => setSelectionMode('row')}
            title="Row selection mode"
          />
          <Action
            icon={Grid3x3}
            prominence={selectionMode === 'cell' ? 'Strong' : 'Standard'}
            intent={selectionMode === 'cell' ? 'Brand' : 'Neutral'}
            onClick={() => setSelectionMode('cell')}
            title="Cell selection mode"
          />
        </Frame.Inline>
      </Block>

      {/* Table Container with Virtual Scrolling */}
      <div ref={tableContainerRef} className="flex-1 overflow-auto" style={{ contain: 'strict' }}>
        <div className="text-sm" style={{ minWidth: 'max-content' }}>
          {/* Header */}
          <div
            className={`sticky top-0 z-10 bg-surface/95 backdrop-blur-sm transition-colors ${
              hoveredRowIndex !== null ? 'bg-accent/5' : ''
            }`}
          >
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
                          {flexRender(header.column.columnDef.header, header.getContext())}
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
            <div className="px-4 py-8 text-center text-subtle">No results found.</div>
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
                const isSelected = virtualRow.index === selectedRowIndex;
                const itemProps = getItemProps(virtualRow.index);

                const isHovered = virtualRow.index === hoveredRowIndex;

                return (
                  <div
                    key={row.id}
                    {...(selectionMode === 'row' ? itemProps : {})}
                    onMouseEnter={() => setHoveredRowIndex(virtualRow.index)}
                    onMouseLeave={() => setHoveredRowIndex(null)}
                    onDoubleClick={() => {
                      if (selectionMode === 'row') {
                        setSelectedRowIndex(virtualRow.index);
                        if (onRowDoubleClick) {
                          onRowDoubleClick(row.original);
                        }
                      }
                    }}
                    className={`flex absolute transition-colors ${
                      selectionMode === 'row' ? 'cursor-pointer' : ''
                    } ${
                      // Row 선택 모드
                      selectionMode === 'row'
                        ? // 선택된 행: 고정 스타일 (hover 없음)
                          isSelected
                          ? 'bg-accent/10 ring-2 ring-accent ring-inset'
                          : // Hover된 행: 얇은 반투명 배경
                            isHovered
                            ? 'bg-black/[0.02]'
                            : // 키보드 커서: focus outline만
                              isCursor
                              ? 'ring-2 ring-accent ring-inset'
                              : // 일반 행: zebra striping만
                                isEven
                                ? 'bg-surface'
                                : 'bg-surface-sunken'
                        : // Cell 선택 모드: zebra striping만
                          isEven
                          ? 'bg-surface'
                          : 'bg-surface-sunken'
                    }`}
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      width: '100%',
                    }}
                  >
                    {row.getVisibleCells().map((cell, colIndex) => {
                      const accessorKey = String(
                        cell.column.columnDef.accessorKey || cell.column.id
                      );
                      const width = columnWidths[accessorKey] || 150;
                      const isCellSelected =
                        selectionMode === 'cell' &&
                        selectedCell?.rowIndex === virtualRow.index &&
                        selectedCell?.colIndex === colIndex;

                      return (
                        <div
                          key={cell.id}
                          data-cell-row={virtualRow.index}
                          data-cell-col={colIndex}
                          onClick={() => {
                            if (selectionMode === 'cell') {
                              setSelectedCell({ rowIndex: virtualRow.index, colIndex });
                            }
                          }}
                          className={`text-text whitespace-nowrap overflow-hidden text-ellipsis flex items-center transition-colors ${
                            density === 'compact' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-sm'
                          } ${
                            selectionMode === 'cell' ? 'cursor-pointer hover:bg-black/[0.02]' : ''
                          } ${
                            isCellSelected
                              ? 'bg-accent/10 ring-2 ring-accent ring-inset !font-medium'
                              : ''
                          }`}
                          style={{ width: `${width}px`, minWidth: `${width}px` }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
              <span>Filtered from {data.length} total</span>
            </>
          )}
          {selectionMode === 'cell' && selectedCell && (
            <>
              <span>•</span>
              <span>
                Cell: R{selectedCell.rowIndex + 1}, C{selectedCell.colIndex + 1}
              </span>
            </>
          )}
        </div>

        {/* Keyboard Navigation Hint */}
        <div className="flex items-center gap-2 text-xs text-subtle">
          {selectionMode === 'row' ? (
            <>
              <span>Navigate:</span>
              <Kbd size="sm">↑</Kbd>
              <Kbd size="sm">↓</Kbd>
              <span>•</span>
              <span>Select:</span>
              <Kbd size="sm">↵</Kbd>
            </>
          ) : (
            <>
              <span>Navigate:</span>
              <Kbd size="sm">↑</Kbd>
              <Kbd size="sm">↓</Kbd>
              <Kbd size="sm">←</Kbd>
              <Kbd size="sm">→</Kbd>
              <span>•</span>
              <span>Jump:</span>
              <Kbd size="sm">Home</Kbd>
              <Kbd size="sm">End</Kbd>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
