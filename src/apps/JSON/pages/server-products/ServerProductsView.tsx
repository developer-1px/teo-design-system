import type { ColumnDef } from '@tanstack/react-table';
import { Maximize2, Minimize2, PanelLeft, PanelLeftClose } from 'lucide-react';
import { useMemo, useState } from 'react';
import { JsonSchemaSidebar } from '@/apps/JSON/widgets/json-viewer/JsonSchemaSidebar';
import { IconButton } from '@/components/Action/role/IconButton';
import { DataTable } from '@/components/Group/role/DataTable.tsx';
import { Section } from '@/components/Section/Section.tsx';
import { Content } from '@/components/Text/role/Content';
import testData from '@/test.json';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

export const ServerProductsView = () => {
  const [density, setDensity] = useState<'compact' | 'normal'>('compact');
  const [showSidebar, setShowSidebar] = useState(true);
  const [jsonData] = useState<JsonArray>(() => {
    // test.json에서 첫 번째 배열 찾기
    const firstArrayKey = Object.keys(testData).find((key) =>
      Array.isArray((testData as JsonObject)[key])
    );
    return firstArrayKey ? ((testData as JsonObject)[firstArrayKey] as JsonArray) : [];
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
          return (
            <Content prominence="tertiary">
              <span className="italic">null</span>
            </Content>
          );
        }
        if (value === undefined) {
          return (
            <Content prominence="tertiary">
              <span className="italic">undefined</span>
            </Content>
          );
        }
        if (typeof value === 'boolean') {
          return (
            <Content prominence="primary">
              <span className="text-accent">{String(value)}</span>
            </Content>
          );
        }
        if (typeof value === 'number') {
          return (
            <Content prominence="primary">
              <span>{value}</span>
            </Content>
          );
        }
        if (typeof value === 'object') {
          return (
            <Content prominence="tertiary">
              <span className="font-mono">{JSON.stringify(value)}</span>
            </Content>
          );
        }

        return (
          <Content prominence="primary">
            <span>{String(value)}</span>
          </Content>
        );
      },
    }));
  }, [data]);

  return (
    <div className="flex flex-1 h-full gap-0 overflow-hidden">
      {/* Left Sidebar - Schema */}
      {showSidebar && <JsonSchemaSidebar data={data} interfaceName="Item" />}

      {/* Main Content */}
      <Section
        role="Container"
        prominence="Secondary"
        className="flex flex-col flex-1 h-full bg-layer-2-cool boundary-shadow-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <IconButton
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              title={showSidebar ? 'Hide schema' : 'Show schema'}
              active={showSidebar}
            >
              {showSidebar ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
            </IconButton>
            <div className="h-4 w-px bg-border-primary" />
            <Content prominence="tertiary">
              <span>
                {data.length} {data.length === 1 ? 'row' : 'rows'} • {columns.length}{' '}
                {columns.length === 1 ? 'col' : 'cols'}
              </span>
            </Content>
          </div>
          <div className="flex items-center gap-1">
            <IconButton
              size="sm"
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
      </Section>
    </div>
  );
};
