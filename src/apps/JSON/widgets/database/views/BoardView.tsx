/**
 * BoardView - Notion 스타일 Board (칸반) 뷰
 * 기본 버전: 드래그앤드롭 없이 그룹핑만 지원
 */

import { useMemo } from 'react';
import { Section } from '@/components/types/Section/Section.tsx';
import { Group } from '@/components/types/Group/Group.tsx';
import { Card } from '@/components/types/Group/role/Card.tsx';
import { Badge } from '@/components/types/Atom/Text/role/Badge.tsx';
import { Text } from '@/components/types/Atom/Text/Text.tsx';
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
    <Section role="Container" layout="scroll-horizontal" padding="md">
      <Group role="Board" direction="horizontal" gap="md">
        {groupedData.map(([groupName, items]) => (
          <Group key={groupName} role="Column" layout="flex" direction="column" width="320">
            {/* 컬럼 헤더 */}
            <Group role="Header" direction="horizontal" align="center" justify="between" padding="sm">
              <Group role="Container" direction="horizontal" align="center" gap="xs">
                <Text
                  role="Title"
                  prominence="Primary"
                  content={groupName}
                />
                <Badge variant="default" size="sm">
                  {items.length}
                </Badge>
              </Group>
            </Group>

            {/* 카드 리스트 */}
            <Group role="List" layout="scroll" flex="1" gap="sm">
              {items.map((item, index) => {
                const keys = Object.keys(item).slice(0, 5); // 처음 5개 필드만

                return (
                  <Card
                    key={index}
                    padding="sm"
                    interactive
                  >
                    <Group role="Container" gap="xs">
                      {keys.map((key) => {
                        const value = item[key];
                        if (value === null || value === undefined) return null;

                        return (
                          <Group key={key} role="Field" gap="xs">
                            <Text role="Label" prominence="Subtle" content={key} />
                            <Text
                              role="Body"
                              prominence="Primary"
                              content={
                                typeof value === 'object'
                                  ? JSON.stringify(value).substring(0, 30) + '...'
                                  : String(value)
                              }
                            />
                          </Group>
                        );
                      })}
                    </Group>
                  </Card>
                );
              })}
            </Group>
          </Group>
        ))}
      </Group>
    </Section>
  );
};
