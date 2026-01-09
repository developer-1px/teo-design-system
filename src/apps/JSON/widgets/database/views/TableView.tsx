/**
 * TableView - Notion 스타일 Table 뷰
 * 기존 DataTable 재사용
 */

import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { DataTable } from '@/components/types/Group/role/DataTable.tsx';
import { Text } from '@/components/types/Atom/Text/Text.tsx';
import type { JsonArray, JsonObject, JsonValue, ViewConfig } from '../types.ts';

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
  console.log('📋 [TableView] Received data:', { length: data.length, viewConfig, density });

  // 검색어 상태
  const [searchQuery, setSearchQuery] = useState('');

  const columns = useMemo<ColumnDef<JsonObject>[]>(() => {
    console.log('🔨 [TableView] Building columns...');

    if (data.length === 0) {
      console.log('❌ [TableView] No data - returning empty columns');
      return [];
    }

    const firstItem = data[0] as JsonObject;
    console.log('🔍 [TableView] First item:', firstItem);
    console.log('🔍 [TableView] First item keys:', Object.keys(firstItem));

    const keys = viewConfig.properties
      ? viewConfig.properties.filter((p) => p.visible !== false).map((p) => p.key)
      : Object.keys(firstItem);

    console.log('✅ [TableView] Column keys:', keys);

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
            return <Text role="Caption" prominence="Subtle" className="italic" content="null" />;
          }
          if (value === undefined) {
            return (
              <Text role="Caption" prominence="Subtle" className="italic" content="undefined" />
            );
          }

          // boolean
          if (typeof value === 'boolean') {
            return (
              <Text
                role="Body"
                className="text-accent font-medium"
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
                className="font-mono"
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
                className="font-mono text-xs"
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
                className="font-mono text-xs"
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
