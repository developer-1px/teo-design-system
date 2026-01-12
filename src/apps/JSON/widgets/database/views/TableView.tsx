/**
 * TableView - Notion 스타일 Table 뷰
 * 기존 DataTable 재사용
 */

// ColumnDef import removed - unused
import { useMemo, useState } from 'react';
import { DataTable, type IDDLColumnDef } from '@/components/dsl/Block/role/DataTable.tsx';
import { Text } from '@/components/dsl/Element/Text/Text.tsx';
import type { JsonArray, JsonObject, JsonValue, ViewConfig } from '../types';

interface TableViewProps {
  data: JsonArray;
  viewConfig: ViewConfig;
  density?: 'compact' | 'normal';
  onRowDoubleClick?: (row: JsonObject) => void;
  clearSelection?: boolean;
}

export const TableView = ({
  data,
  viewConfig,
  density = 'compact',
  onRowDoubleClick,
  clearSelection,
}: TableViewProps) => {
  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('');

  const columns = useMemo<IDDLColumnDef<JsonObject>[]>(() => {
    if (data.length === 0) {
      return [];
    }

    const firstItem = data[0] as JsonObject;

    const keys = viewConfig.properties
      ? viewConfig.properties.filter((p) => p.visible !== false).map((p) => p.key)
      : Object.keys(firstItem);

    return keys.map((key) => {
      const propConfig = viewConfig.properties?.find((p) => p.key === key);

      return {
        accessorKey: key,
        header: propConfig?.name || key,
        size: propConfig?.width,
        cell: (info) => {
          const value = info.getValue() as JsonValue;

          // null/undefined
          if (value === null) {
            return <Text role="Caption" prominence="Subtle" content="null" />;
          }
          if (value === undefined) {
            return (
              <Text role="Caption" prominence="Subtle" content="undefined" />
            );
          }

          // boolean
          if (typeof value === 'boolean') {
            return (
              <Text
                role="Body"
                content={String(value)}
                highlight={searchQuery}
              />
            );
          }

          // number
          if (typeof value === 'number') {
            return (
              <Text
                role="Body"
                content={value.toLocaleString()}
                highlight={searchQuery}
              />
            );
          }

          // array
          if (Array.isArray(value)) {
            return (
              <Text
                role="Caption"
                prominence="Subtle"
                content={`[Array] x${value.length}`}
              />
            );
          }

          // object
          if (typeof value === 'object') {
            const keys = Object.keys(value);
            return (
              <Text
                role="Caption"
                prominence="Subtle"
                content={keys.length > 0 ? `{Object} ${keys.length} keys` : '{Object}'}
              />
            );
          }

          // string (default)
          return <Text role="Body" content={String(value)} highlight={searchQuery} />;
        },
      };
    });
  }, [data, viewConfig, searchQuery]);

  const typedData = useMemo(() => data as JsonObject[], [data]);

  return (
    <div className="h-full">
      <DataTable
        columns={columns}
        data={typedData}
        density={density}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRowDoubleClick={onRowDoubleClick}
        clearSelection={clearSelection}
      />
    </div>
  );
};
