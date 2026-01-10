/**
 * ListView - Notion 스타일 List 뷰
 * 간단하고 컴팩트한 리스트
 */

import { Block } from '@/components/types/Block/Block.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import type { JsonArray, JsonObject } from '../types';

interface ListViewProps {
  data: JsonArray;
}

export const ListView = ({ data }: ListViewProps) => {
  return (
    <Section role="Container" layout="scroll">
      <Block role="List" divider="horizontal">
        {data.map((item, index) => {
          const obj = item as JsonObject;
          const keys = Object.keys(obj).slice(0, 4); // 최대 4개 필드

          return (
            <Block
              key={index}
              role="ListItem"
              direction="horizontal"
              padding="md"
              align="center"
              gap="md"
              interactive
            >
              {/* 첫 번째 필드 (제목) */}
              <Block role="Container" flex="1">
                <Text role="Body" prominence="Primary" content={String(obj[keys[0]])} />
              </Block>

              {/* 나머지 필드들 */}
              <Block role="Container" direction="horizontal" gap="lg">
                {keys.slice(1).map((key) => {
                  const value = obj[key];
                  if (value === null || value === undefined) return null;

                  return (
                    <Block key={key} role="Field" direction="horizontal" align="center" gap="xs">
                      <Text role="Label" prominence="Subtle" content={`${key}:`} />
                      <Text
                        role="Body"
                        content={
                          typeof value === 'object'
                            ? JSON.stringify(value).substring(0, 30)
                            : String(value)
                        }
                      />
                    </Block>
                  );
                })}
              </Block>
            </Block>
          );
        })}

        {data.length === 0 && (
          <Block role="Empty" align="center" justify="center" padding="xl">
            <Text role="Body" prominence="Subtle" content="데이터가 없습니다" />
          </Block>
        )}
      </Block>
    </Section>
  );
};
