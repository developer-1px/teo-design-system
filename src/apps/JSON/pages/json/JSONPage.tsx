/**
 * JSONPage - Minimal JSON DataTable Viewer with TypeScript Interface Generator
 *
 * JSON에서 첫 번째 배열을 찾아 DataTable로 표시
 * 왼쪽 패널에 TypeScript interface 생성
 */

import { useMemo, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import type { JsonArray, JsonObject } from '@/apps/JSON/widgets/database/types';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { TableView } from '@/apps/JSON/widgets/database/views/TableView';
import { jsonToTypeScript } from '@/apps/JSON/lib/json-to-typescript';
import { Overlay } from '@/components/types/Overlay/Overlay';
import { FormView } from '@/apps/JSON/widgets/json-viewer/FormView';
import testData from '@/apps/JSON/config/test.json';

export const JSONPage = () => {
  const [copied, setCopied] = useState(false);
  const [selectedRow, setSelectedRow] = useState<JsonObject | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // JSON에서 첫 번째 배열 데이터 찾기
  const { data, arrayKey } = useMemo(() => {

    const firstArrayKey = Object.keys(testData).find((key) => {
      const value = (testData as JsonObject)[key];
      const isArray = Array.isArray(value);
      return isArray;
    });


    if (firstArrayKey) {
      const arrayData = (testData as JsonObject)[firstArrayKey] as JsonArray;
      return { data: arrayData, arrayKey: firstArrayKey };
    }

    return { data: [], arrayKey: null };
  }, []);

  // TypeScript interface 생성
  const tsInterface = useMemo(() => {
    if (data.length === 0) return '// No data';
    const interfaceName = arrayKey
      ? arrayKey.charAt(0).toUpperCase() + arrayKey.slice(1).replace(/s$/, '')
      : 'Item';
    return jsonToTypeScript(data, interfaceName);
  }, [data, arrayKey]);


  // 기본 viewConfig (모든 컬럼 표시)
  const viewConfig = useMemo(
    () => ({
      id: 'table',
      type: 'table' as const,
      name: 'Table',
    }),
    []
  );

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(tsInterface);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Handle row double-click
  const handleRowDoubleClick = (row: JsonObject) => {
    setSelectedRow(row);
    setIsPanelOpen(true);
  };

  // Handle panel close
  const handlePanelClose = () => {
    setIsPanelOpen(false);
    setSelectedRow(null);
  };

  // Handle field change in FormView
  const handleFieldChange = (key: string, value: unknown) => {
    // TODO: Implement actual data update logic
  };

  return (
    <Page role="Application" layout="Sidebar" className="h-screen overflow-hidden">
      {/* Left Panel: TypeScript Interface */}
      <Section role="Navigator">
        <div className="h-full flex flex-col bg-surface-sunken border-r border-border-default">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-surface">
            <h2 className="text-sm font-semibold text-text-primary">TypeScript Interface</h2>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-surface-elevated transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check size={16} className="text-green-600" />
              ) : (
                <Copy size={16} className="text-text-secondary" />
              )}
            </button>
          </div>

          {/* Interface Code */}
          <div className="flex-1 overflow-auto p-4">
            <pre className="text-xs font-mono text-text-primary whitespace-pre">
              {tsInterface}
            </pre>
          </div>
        </div>
      </Section>

      {/* Main: Table View */}
      <Section role="Main">
        <TableView
          data={data}
          viewConfig={viewConfig}
          density="compact"
          onRowDoubleClick={handleRowDoubleClick}
          clearSelection={!isPanelOpen}
        />
      </Section>

      {/* Overlay Panel: Detail Form View */}
      <Overlay
        id="detail-view-drawer"
        role="Drawer"
        placement="right"
        className="w-[800px]"
        isOpen={isPanelOpen}
        onClose={handlePanelClose}
        dismissable={true}
      >
        {selectedRow && (
          <FormView
            data={selectedRow}
            onChange={handleFieldChange}
            onClose={handlePanelClose}
            readOnly={false}
          />
        )}
      </Overlay>
    </Page>
  );
};
