/**
 * ServerProductsViewDSL - Notion 스타일 Database Table (v3.0)
 *
 * IDDL 전체 스택 사용:
 * - Section[Header]: Notion 스타일 컨트롤 바
 *   - Block[Toolbar]: 검색/필터 (좌측)
 *     - Field[text]: 전체 검색 (clearable)
 *     - Field[select]: 필터 기준 컬럼
 *   - Block[Toolbar]: 뷰 타입 (중앙)
 *     - Field[radio]: Table/JSON/Tree
 *   - Block[Toolbar]: 정렬/컬럼/액션 (우측)
 *     - Field[select]: 정렬 기준
 *     - Field[radio]: 정렬 방향
 *     - Action: 추가/내보내기
 * - Section[Main]: 데이터 테이블
 */

import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { JsonSchemaSidebarDSL } from '@/apps/JSON/widgets/json-viewer/JsonSchemaSidebarDSL';
import { Block } from '@/components/types/Block/Block';
import { DataTable, type IDDLColumnDef } from '@/components/types/Block/role/DataTable.tsx';
import { Action } from '@/components/types/Element/Action/Action';
import { Field } from '@/components/types/Element/Field/Field';
import { Badge } from '@/components/types/Element/Text/role/Badge';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import testData from '@/test.json';

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = { [key: string]: JsonValue };
type JsonArray = JsonValue[];

export const ServerProductsViewDSL = () => {
  // View State
  const [density, setDensity] = useState<'compact' | 'normal'>('compact');
  const [showSidebar, setShowSidebar] = useState(true);
  const [viewType, setViewType] = useState<'table' | 'json' | 'tree'>('table');

  // Data Control State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterColumn, setFilterColumn] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  const [jsonData] = useState<JsonArray>(() => {
    const firstArrayKey = Object.keys(testData).find((key) =>
      Array.isArray((testData as JsonObject)[key])
    );
    return firstArrayKey ? ((testData as JsonObject)[firstArrayKey] as JsonArray) : [];
  });

  // Column Keys (available columns from data)
  const allColumnKeys = useMemo(() => {
    if (!Array.isArray(jsonData) || jsonData.length === 0) return [];
    const firstItem = jsonData[0] as JsonObject;
    return Object.keys(firstItem);
  }, [jsonData]);

  // Initialize visible columns
  useMemo(() => {
    if (visibleColumns.length === 0 && allColumnKeys.length > 0) {
      setVisibleColumns(allColumnKeys);
    }
  }, [allColumnKeys, visibleColumns.length]);

  // Processed Data: search → filter → sort
  const data = useMemo(() => {
    if (!Array.isArray(jsonData)) return [];

    let processed = [...jsonData];

    // 1. Search across all columns
    if (searchQuery.trim()) {
      processed = processed.filter((item) => {
        const obj = item as JsonObject;
        return Object.values(obj).some((val) =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
    }

    // 2. Filter by column (if filterColumn is set)
    if (filterColumn) {
      // For demo: just ensure column exists
      processed = processed.filter((item) => {
        const obj = item as JsonObject;
        return obj[filterColumn] !== undefined && obj[filterColumn] !== null;
      });
    }

    // 3. Sort
    if (sortColumn) {
      processed.sort((a, b) => {
        const aVal = (a as JsonObject)[sortColumn];
        const bVal = (b as JsonObject)[sortColumn];

        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        const comparison = aVal < bVal ? -1 : 1;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return processed as JsonObject[];
  }, [jsonData, searchQuery, filterColumn, sortColumn, sortDirection]);

  // Column Options for Fields
  const columnOptions = useMemo(() => {
    return allColumnKeys.map((key) => ({
      label: key,
      value: key,
    }));
  }, [allColumnKeys]);

  const columns = useMemo<IDDLColumnDef<JsonObject>[]>(() => {
    if (data.length === 0) return [];

    const firstItem = data[0] as JsonObject;
    const keys = Object.keys(firstItem);

    // Filter by visible columns
    const filteredKeys = keys.filter((key) => visibleColumns.includes(key));

    return filteredKeys.map((key) => ({
      accessorKey: key,
      header: key,
      cell: (info: any) => {
        const value = info.getValue() as JsonValue;

        // IDDL Text로 렌더링
        if (value === null) {
          return <Text role="Caption" prominence="Subtle" className="italic" content="null" />;
        }
        if (value === undefined) {
          return <Text role="Caption" prominence="Subtle" className="italic" content="undefined" />;
        }
        if (typeof value === 'boolean') {
          return <Text role="Body" className="text-accent" content={String(value)} />;
        }
        if (typeof value === 'number') {
          return <Text role="Body" content={String(value)} />;
        }
        if (typeof value === 'object') {
          return <Text role="Caption" className="font-mono" content={JSON.stringify(value)} />;
        }

        return <Text role="Body" content={String(value)} />;
      },
    }));
  }, [data, visibleColumns]);

  return (
    <Page role="Application">
      <Section role="Container" className="flex flex-1 h-full gap-0 overflow-hidden">
        {/* Sidebar - Schema */}
        {showSidebar && <JsonSchemaSidebarDSL data={data} interfaceName="Item" />}

        {/* Main Content Area */}
        <Section
          role="Main"
          className="flex flex-col flex-1 h-full bg-layer-2-cool boundary-shadow-left rounded-md"
        >
          {/* Notion-style Control Bar */}
          <Section role="Header" className="border-b border-border bg-layer-3">
            <Block
              role="Toolbar"
              layout="inline"
              density="Compact"
              className="h-12 items-center justify-between px-3"
            >
              {/* Left: Sidebar Toggle + Search + Filter */}
              <Block role="Toolbar" layout="inline" density="Compact" className="gap-2 flex-1">
                <Action
                  icon={showSidebar ? 'PanelLeftClose' : 'PanelLeft'}
                  intent="Neutral"
                  onClick={() => setShowSidebar(!showSidebar)}
                  behavior={{ action: 'command', command: 'json.toggleSidebar' }}
                />

                <Field
                  model="search"
                  type="text"
                  placeholder="Search all fields..."
                  clearable
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                  className="w-64"
                />

                <Field
                  label="Filter by"
                  model="filterColumn"
                  type="select"
                  options={[{ label: 'All columns', value: '' }, ...columnOptions]}
                  value={filterColumn}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setFilterColumn(e.target.value)
                  }
                  className="w-40"
                />
              </Block>

              {/* Center: View Type */}
              <Block role="Toolbar" layout="inline" density="Compact" className="gap-2">
                <Field
                  model="viewType"
                  type="radio"
                  options={[
                    { label: 'Table', value: 'table' },
                    { label: 'JSON', value: 'json' },
                    { label: 'Tree', value: 'tree' },
                  ]}
                  value={viewType}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setViewType(e.target.value as 'table' | 'json' | 'tree')
                  }
                />
              </Block>

              {/* Right: Sort + Density */}
              <Block
                role="Toolbar"
                layout="inline"
                density="Compact"
                className="gap-2 flex-1 justify-end"
              >
                <Field
                  label="Sort by"
                  model="sortColumn"
                  type="select"
                  options={[{ label: 'None', value: '' }, ...columnOptions]}
                  value={sortColumn}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSortColumn(e.target.value)
                  }
                  className="w-36"
                />

                <Field
                  model="sortDirection"
                  type="radio"
                  options={[
                    { label: '↑', value: 'asc' },
                    { label: '↓', value: 'desc' },
                  ]}
                  value={sortDirection}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSortDirection(e.target.value as 'asc' | 'desc')
                  }
                />

                <Action
                  icon={density === 'compact' ? 'Maximize2' : 'Minimize2'}
                  intent="Neutral"
                  onClick={() => setDensity(density === 'compact' ? 'normal' : 'compact')}
                  behavior={{ action: 'command', command: 'json.toggleDensity' }}
                />
              </Block>
            </Block>
          </Section>

          {/* Stats Bar */}
          <Block
            role="Container"
            layout="inline"
            density="Compact"
            className="gap-2 px-3 py-2 bg-layer-2 border-b border-border"
          >
            <Badge variant="default" size="sm">
              {data.length} rows
            </Badge>
            <Badge variant="info" size="sm">
              {columns.length} cols
            </Badge>
            <Badge variant="default" size="sm">
              {visibleColumns.length}/{allColumnKeys.length} visible
            </Badge>
          </Block>

          {/* Data Table */}
          <div className="flex-1 min-h-0">
            <DataTable columns={columns} data={data} density={density} />
          </div>
        </Section>
      </Section>
    </Page>
  );
};
