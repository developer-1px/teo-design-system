// ColumnDef import removed - unused
import { useMemo, useState } from 'react';
import { JsonSchemaSidebar } from '@/apps/JSON/widgets/json-viewer/JsonSchemaSidebar';
import { Block } from '@/components/types/Block/Block';
import { DataTable, type IDDLColumnDef } from '@/components/types/Block/role/DataTable.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section.tsx';
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
    return jsonData as JsonObject[];
  }, [jsonData]);

  const columns = useMemo<IDDLColumnDef<JsonObject>[]>(() => {
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
          return <Text role="Caption" prominence="Subtle" content="null" />;
        }
        if (value === undefined) {
          return <Text role="Caption" prominence="Subtle" content="undefined" />;
        }
        if (typeof value === 'boolean') {
          return <Text role="Body" content={String(value)} />;
        }
        if (typeof value === 'number') {
          return <Text role="Body" content={String(value)} />;
        }
        if (typeof value === 'object') {
          return (
            <Text
              role="Caption"
              prominence="Subtle"
              content={JSON.stringify(value)}
            />
          );
        }

        return <Text role="Body" content={String(value)} />;
      },
    }));
  }, [data]);

  return (
    <Block role="Container">
      {/* Left Sidebar - Schema */}
      {showSidebar && <JsonSchemaSidebar data={data} interfaceName="Item" />}

      {/* Main Content */}
      <Section
        role="Container"
      >
        {/* Header - IDDL Toolbar */}
        <Block role="Toolbar">
          <Block role="Toolbar">
            <Action
              role="IconButton"
              icon={showSidebar ? 'PanelLeftClose' : 'PanelLeft'}
              label={showSidebar ? 'Hide schema' : 'Show schema'}
              density="Compact"
              selected={showSidebar}
              onClick={() => setShowSidebar(!showSidebar)}
            />
            <Block role="DividerVertical" />
            <Text role="Caption" prominence="Subtle">
              {data.length} {data.length === 1 ? 'row' : 'rows'} • {columns.length}{' '}
              {columns.length === 1 ? 'col' : 'cols'}
            </Text>
          </Block>
          <Block role="Toolbar">
            <Action
              role="IconButton"
              icon={density === 'compact' ? 'Maximize2' : 'Minimize2'}
              label={density === 'compact' ? 'Normal view' : 'Compact view'}
              density="Compact"
              onClick={() => setDensity(density === 'compact' ? 'normal' : 'compact')}
            />
          </Block>
        </Block>

        {/* Data Table */}
        <Block role="Container">
          <DataTable columns={columns} data={data} density={density} />
        </Block>
      </Section>
    </Block>
  );
};
