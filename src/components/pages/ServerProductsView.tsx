import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Layer } from '@/components/ui/Layer';
import { DataTable } from '@/components/ui/DataTable';
import { IconButton } from '@/components/ui/IconButton';
import { JsonSchemaSidebar } from '@/components/json-viewer/JsonSchemaSidebar';
import testData from '@/test.json';
import { Maximize2, Minimize2, PanelLeftClose, PanelLeft } from 'lucide-react';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

export const ServerProductsView = () => {
  const [density, setDensity] = useState<'compact' | 'normal'>('compact');
  const [showSidebar, setShowSidebar] = useState(true);
  const [jsonData, setJsonData] = useState<JsonArray>(() => {
    // test.json에서 첫 번째 배열 찾기
    const firstArrayKey = Object.keys(testData).find(key =>
      Array.isArray((testData as JsonObject)[key])
    );
    return firstArrayKey ? (testData as JsonObject)[firstArrayKey] as JsonArray : [];
  });

  const data = useMemo(() => {
    if (!Array.isArray(jsonData)) return [];
    return jsonData;
  }, [jsonData]);

  const columns = useMemo<ColumnDef<JsonObject>[]>(() => {
    if (data.length === 0) return [];

    // JSON key 순서대로 컬럼 생성
    const firstItem = data[0] as JsonObject;
    const keys = Object.keys(firstItem);

    return keys.map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => {
        const value = info.getValue() as JsonValue;

        // Render raw value
        if (value === null) {
          return <span className="text-text-tertiary italic">null</span>;
        }
        if (value === undefined) {
          return <span className="text-text-tertiary italic">undefined</span>;
        }
        if (typeof value === 'boolean') {
          return <span className="text-accent-primary">{String(value)}</span>;
        }
        if (typeof value === 'number') {
          return <span className="text-text-primary">{value}</span>;
        }
        if (typeof value === 'object') {
          return (
            <span className="text-text-tertiary font-mono text-xs">
              {JSON.stringify(value)}
            </span>
          );
        }

        return <span className="text-text-primary">{String(value)}</span>;
      },
    }));
  }, [data]);

  return (
    <div className="flex flex-1 h-full gap-0 overflow-hidden">
      {/* Left Sidebar - Schema */}
      {showSidebar && (
        <JsonSchemaSidebar data={data} interfaceName="Item" />
      )}

      {/* Main Content */}
      <Layer
        level={2}
        rounded="md"
        className="flex flex-col flex-1 h-full bg-layer-2-cool boundary-shadow-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <IconButton
              size="sm"
              layer={2}
              onClick={() => setShowSidebar(!showSidebar)}
              title={showSidebar ? 'Hide schema' : 'Show schema'}
              active={showSidebar}
            >
              {showSidebar ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
            </IconButton>
            <div className="h-4 w-px bg-border-primary" />
            <span className="text-xs text-text-tertiary">
              {data.length} {data.length === 1 ? 'row' : 'rows'} • {columns.length} {columns.length === 1 ? 'col' : 'cols'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              size="sm"
              layer={2}
              onClick={() => setDensity(density === 'compact' ? 'normal' : 'compact')}
              title={density === 'compact' ? 'Normal view' : 'Compact view'}
            >
              {density === 'compact' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
            </IconButton>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 min-h-0">
          <DataTable columns={columns} data={data} density={density} />
        </div>
      </Layer>
    </div>
  );
};
