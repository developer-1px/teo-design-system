/**
 * TableView - Notion 스타일 Table 뷰
 * 기존 DataTable 재사용
 */

import { useMemo } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/Group/role/DataTable.tsx';
import { Text } from '@/components/Text/Text';
import type { JsonObject, JsonValue, JsonArray, ViewConfig } from '../types';

interface TableViewProps {
  data: JsonArray;
  viewConfig: ViewConfig;
  density?: 'compact' | 'normal';
}

export const TableView = ({ data, viewConfig, density = 'compact' }: TableViewProps) => {
  const columns = useMemo<ColumnDef<JsonObject>[]>(() => {
    if (data.length === 0) return [];

    const firstItem = data[0] as JsonObject;
    const keys = viewConfig.properties
      ? viewConfig.properties.filter(p => p.visible !== false).map(p => p.key)
      : Object.keys(firstItem);

    return keys.map((key) => {
      const propConfig = viewConfig.properties?.find(p => p.key === key);

      return {
        accessorKey: key,
        header: propConfig?.name || key,
        size: propConfig?.width,
        cell: (info) => {
          const value = info.getValue() as JsonValue;

          // null/undefined
          if (value === null) {
            return (
              <Text role="Caption" prominence="Tertiary" className="italic">
                null
              </Text>
            );
          }
          if (value === undefined) {
            return (
              <Text role="Caption" prominence="Tertiary" className="italic">
                undefined
              </Text>
            );
          }

          // boolean
          if (typeof value === 'boolean') {
            return (
              <Text role="Body" prominence="Primary" className="text-accent font-medium">
                {String(value)}
              </Text>
            );
          }

          // number
          if (typeof value === 'number') {
            return (
              <Text role="Body" prominence="Primary" className="font-mono">
                {value.toLocaleString()}
              </Text>
            );
          }

          // array
          if (Array.isArray(value)) {
            return (
              <Text role="Caption" prominence="Tertiary" className="font-mono text-xs">
                [Array] x{value.length}
              </Text>
            );
          }

          // object
          if (typeof value === 'object') {
            const keys = Object.keys(value);
            return (
              <Text role="Caption" prominence="Tertiary" className="font-mono text-xs">
                {keys.length > 0 ? `{Object} ${keys.length} keys` : '{Object}'}
              </Text>
            );
          }

          // string (default)
          return (
            <Text role="Body" prominence="Primary">
              {String(value)}
            </Text>
          );
        },
      };
    });
  }, [data, viewConfig]);

  const typedData = useMemo(() => data as JsonObject[], [data]);

  return (
    <div className="h-full">
      <DataTable columns={columns} data={typedData} density={density} />
    </div>
  );
};
