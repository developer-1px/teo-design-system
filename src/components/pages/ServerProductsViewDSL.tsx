/**
 * ServerProductsViewDSL - DSL로 재구성된 JSON 테이블 뷰
 *
 * Why-First 접근법:
 * - Page → Region → Section → Group → Item 구조
 * - purpose로 의도 명확화 (info, action, content)
 * - prominence로 중요도 자동 조절
 */

import { useMemo, useState } from 'react';
import { type ColumnDef } from '@tanstack/react-table';
import { Page, Region, Section, Group, Item } from '@/components/dsl';
import { DataTable } from '@/components/ui/DataTable';
import { IconButton } from '@/components/ui/IconButton';
import { JsonSchemaSidebarDSL } from '@/components/json-viewer/JsonSchemaSidebarDSL';
import testData from '@/test.json';
import { Maximize2, Minimize2, PanelLeftClose, PanelLeft } from 'lucide-react';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

export const ServerProductsViewDSL = () => {
  const [density, setDensity] = useState<'compact' | 'normal'>('compact');
  const [showSidebar, setShowSidebar] = useState(true);
  const [jsonData] = useState<JsonArray>(() => {
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

    const firstItem = data[0] as JsonObject;
    const keys = Object.keys(firstItem);

    return keys.map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info) => {
        const value = info.getValue() as JsonValue;

        // DSL Item으로 렌더링
        if (value === null) {
          return (
            <Item as="span" prominence={3} className="italic">
              null
            </Item>
          );
        }
        if (value === undefined) {
          return (
            <Item as="span" prominence={3} className="italic">
              undefined
            </Item>
          );
        }
        if (typeof value === 'boolean') {
          return (
            <Item as="span" prominence={1} className="text-accent">
              {String(value)}
            </Item>
          );
        }
        if (typeof value === 'number') {
          return (
            <Item as="span" prominence={1}>
              {value}
            </Item>
          );
        }
        if (typeof value === 'object') {
          return (
            <Item as="span" prominence={3} className="font-mono">
              {JSON.stringify(value)}
            </Item>
          );
        }

        return (
          <Item as="span" prominence={1}>
            {String(value)}
          </Item>
        );
      },
    }));
  }, [data]);

  return (
    <Page>
      <Region role="main" className="flex flex-1 h-full gap-0 overflow-hidden">
        {/* Sidebar - Schema */}
        {showSidebar && (
          <JsonSchemaSidebarDSL data={data} interfaceName="Item" />
        )}

        {/* Main Content Area */}
        <Section
          prominence={2}
          className="flex flex-col flex-1 h-full bg-layer-2-cool boundary-shadow-left rounded-md"
        >
          {/* Header - Controls & Stats */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <Group purpose="action" direction="horizontal">
              <IconButton
                size="sm"
                onClick={() => setShowSidebar(!showSidebar)}
                title={showSidebar ? 'Hide schema' : 'Show schema'}
                active={showSidebar}
              >
                {showSidebar ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
              </IconButton>

              <div className="h-4 w-px bg-border mx-2" />

              <Group purpose="info">
                <Item as="span" prominence={3}>
                  {data.length} {data.length === 1 ? 'row' : 'rows'} •{' '}
                  {columns.length} {columns.length === 1 ? 'col' : 'cols'}
                </Item>
              </Group>
            </Group>

            <Group purpose="action" direction="horizontal">
              <IconButton
                size="sm"
                onClick={() => setDensity(density === 'compact' ? 'normal' : 'compact')}
                title={density === 'compact' ? 'Normal view' : 'Compact view'}
              >
                {density === 'compact' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </IconButton>
            </Group>
          </div>

          {/* Data Table */}
          <div className="flex-1 min-h-0">
            <DataTable columns={columns} data={data} density={density} />
          </div>
        </Section>
      </Region>
    </Page>
  );
};
