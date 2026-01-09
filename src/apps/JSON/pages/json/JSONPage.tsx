/**
 * JSONPage - Notion Database 스타일 JSON Viewer
 *
 * test.json의 모든 배열을 탭으로 분리하여 표시
 */

import { useMemo, useState } from 'react';
import { Page } from '@/components/Page/Page';
import { Section } from '@/components/Section/Section';
import { Group } from '@/components/Group/Group';
import { Text } from '@/components/Text/Text';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Group/role/Tabs';
import { DatabaseViewer } from '@/components/widgets/database/DatabaseViewer';
import testData from '@/test.json';
import type { JsonObject, JsonArray } from '@/components/widgets/database/types';

export const JSONPage = () => {
  // test.json에서 모든 배열 키 찾기
  const arrayDatasets = useMemo(() => {
    const datasets: { key: string; data: JsonArray; displayName: string }[] = [];

    Object.keys(testData).forEach((key) => {
      const value = (testData as JsonObject)[key];
      if (Array.isArray(value)) {
        // 키 이름을 사람이 읽기 쉽게 변환
        const displayName = key
          .replace(/([A-Z])/g, ' $1') // camelCase를 공백으로
          .replace(/List$/, '') // 끝의 List 제거
          .trim()
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        datasets.push({ key, data: value, displayName });
      }
    });

    return datasets;
  }, []);

  const [activeTab, setActiveTab] = useState(arrayDatasets[0]?.key || '');

  if (arrayDatasets.length === 0) {
    return (
      <Page>
        <Section role="Container" className="flex items-center justify-center h-full">
          <Text
            role="Body"
            prominence="Primary"
            className="text-text-secondary"
            content="No array data found in test.json"
          />
        </Section>
      </Page>
    );
  }

  return (
    <Page>
      <Section role="Container" className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <Section prominence="Primary" className="border-b border-border bg-layer-2">
          <Group role="Container" className="px-6 py-4 gap-2">
            <Text role="Title" prominence="Hero" className="text-2xl font-bold" content="JSON Database Viewer" />
            <Text role="Body" prominence="Secondary" className="text-text-secondary" content={`${arrayDatasets.length}개의 데이터셋을 Notion 스타일로 표시`} />
          </Group>
        </Section>

        {/* Tabs for each array dataset */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <Section prominence="Primary" className="border-b border-border bg-layer-2">
            <TabsList className="px-6">
              {arrayDatasets.map((dataset) => (
                <TabsTrigger key={dataset.key} value={dataset.key}>
                  {dataset.displayName}
                </TabsTrigger>
              ))}
            </TabsList>
          </Section>

          {arrayDatasets.map((dataset) => (
            <TabsContent key={dataset.key} value={dataset.key} className="flex-1 min-h-0">
              <DatabaseViewer
                data={dataset.data}
                title={dataset.displayName}
                description={`${dataset.data.length}개의 항목`}
                views={[
                  { id: 'table', type: 'table', name: 'Table' },
                  {
                    id: 'board',
                    type: 'board',
                    name: 'Board',
                    group: { by: 'status' }, // status 필드로 그룹핑 (있으면)
                  },
                  {
                    id: 'gallery',
                    type: 'gallery',
                    name: 'Gallery',
                    cardSize: 'md',
                    showImage: false,
                  },
                  { id: 'list', type: 'list', name: 'List' },
                ]}
                defaultView="table"
                showStats={true}
              />
            </TabsContent>
          ))}
        </Tabs>
      </Section>
    </Page>
  );
};
