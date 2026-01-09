/**
 * BoardView - Notion 스타일 Board (칸반) 뷰
 * 기본 버전: 드래그앤드롭 없이 그룹핑만 지원
 */

import { useMemo } from 'react';
import { Group } from '@/components/Group/Group.tsx';
import { Card } from '@/components/Group/role/Card.tsx';
import { Badge } from '@/components/Item/Text/role/Badge.tsx';
import { Text } from '@/components/Item/Text/Text.tsx';
import type { JsonArray, JsonObject, ViewConfig } from '../types.ts';

interface BoardViewProps {
  data: JsonArray;
  viewConfig: ViewConfig;
}

export const BoardView = ({ data, viewConfig }: BoardViewProps) => {
  // 그룹핑 키로 데이터 그룹화
  const groupedData = useMemo(() => {
    const groupKey = viewConfig.group?.by || 'status';
    const groups = new Map<string, JsonObject[]>();

    data.forEach((item) => {
      const obj = item as JsonObject;
      const groupValue = String(obj[groupKey] || 'Uncategorized');

      if (!groups.has(groupValue)) {
        groups.set(groupValue, []);
      }
      groups.get(groupValue)!.push(obj);
    });

    return Array.from(groups.entries());
  }, [data, viewConfig.group]);

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 p-4 h-full">
        {groupedData.map(([groupName, items]) => (
          <div key={groupName} className="flex-shrink-0 w-80 flex flex-col">
            {/* 컬럼 헤더 */}
            <div className="flex items-center justify-between mb-3 px-2">
              <Group role="Container" direction="horizontal" className="items-center gap-2">
                <Text
                  role="Title"
                  prominence="Hero"
                  className="font-semibold"
                  content={groupName}
                />
                <Badge variant="default" size="sm">
                  {items.length}
                </Badge>
              </Group>
            </div>

            {/* 카드 리스트 */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {items.map((item, index) => {
                const keys = Object.keys(item).slice(0, 5); // 처음 5개 필드만

                return (
                  <Card
                    key={index}
                    padding="sm"
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <Group role="Container" className="gap-2">
                      {keys.map((key) => {
                        const value = item[key];
                        if (value === null || value === undefined) return null;

                        return (
                          <div key={key} className="flex flex-col gap-1">
                            <Text
                              role="Label"
                              prominence="Tertiary"
                              className="text-xs text-subtle"
                              content={key}
                            />
                            <Text
                              role="Body"
                              prominence="Hero"
                              className="text-sm"
                              content={
                                typeof value === 'object'
                                  ? JSON.stringify(value).substring(0, 30) + '...'
                                  : String(value)
                              }
                            />
                          </div>
                        );
                      })}
                    </Group>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
