/**
 * BoardView - Notion 스타일 Board (칸반) 뷰
 * 기본 버전: 드래그앤드롭 없이 그룹핑만 지원
 */

import { useMemo } from 'react';
import { Block } from '@/components/types/Block/Block.tsx';
import { Card } from '@/components/types/Block/role/Card.tsx';
import { Badge } from '@/components/types/Element/Text/role/Badge.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import type { JsonArray, JsonObject, ViewConfig } from '../types';

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
      <Block role="Board" direction="horizontal" gap="md">
        {groupedData.map(([groupName, items]) => (
          <Block key={groupName} role="Column" layout="flex" direction="column" width="320">
            {/* 컬럼 헤더 */}
            <Block
              role="Header"
              direction="horizontal"
              align="center"
              justify="between"
              padding="sm"
            >
              <Block role="Container" direction="horizontal" align="center" gap="xs">
                <Text role="Title" prominence="Strong" content={groupName} />
                <Badge variant="default" size="sm">
                  {items.length}
                </Badge>
              </Block>
            </Block>

            {/* 카드 리스트 */}
            <Block role="List" layout="scroll" flex="1" gap="sm">
              {items.map((item, index) => {
                const keys = Object.keys(item).slice(0, 5); // 처음 5개 필드만

                return (
                  <Card key={index} padding="sm" interactive>
                    <Block role="Container" gap="xs">
                      {keys.map((key) => {
                        const value = item[key];
                        if (value === null || value === undefined) return null;

                        return (
                          <Block key={key} role="Field" gap="xs">
                            <Text role="Label" prominence="Subtle" content={key} />
                            <Text
                              role="Body"
                              prominence="Strong"
                              content={
                                typeof value === 'object'
                                  ? `${JSON.stringify(value).substring(0, 30)}...`
                                  : String(value)
                              }
                            />
                          </Block>
                        );
                      })}
                    </Block>
                  </Card>
                );
              })}
            </Block>
          </Block>
        ))}
      </Block>
    </Section>
  );
};
