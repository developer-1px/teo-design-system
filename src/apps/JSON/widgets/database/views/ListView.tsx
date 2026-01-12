import { Frame } from '@/components/dsl/shared/Frame';
/**
 * ListView - Notion 스타일 List 뷰
 * 간단하고 컴팩트한 리스트
 */

import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action.tsx';
import { Text } from '@/components/dsl/Element/Text/Text.tsx';
import { Section } from '@/components/dsl/Section/Section.tsx';
import type { JsonArray, JsonObject } from '../types';

interface ListViewProps {
  data: JsonArray;
}

export const ListView = ({ data }: ListViewProps) => {
  return (
    <Section role="Container">
      <Block role="List">
        {data.map((item, index) => {
          const obj = item as JsonObject;
          const keys = Object.keys(obj).slice(0, 4); // 최대 4개 필드

          return (
            <Action key={index} role="ListItem">
              {/* 첫 번째 필드 (제목) */}
              <Frame.Column>
                <Text role="Body" prominence="Strong" content={String(obj[keys[0]])} />
              </Frame.Column>

              {/* 나머지 필드들 */}
              <Frame.Column>
                {keys.slice(1).map((key) => {
                  const value = obj[key];
                  if (value === null || value === undefined) return null;

                  return (
                    <Frame.Inline key={key}>
                      <Text role="Label" prominence="Subtle" content={`${key}:`} />
                      <Text
                        role="Body"
                        content={
                          typeof value === 'object'
                            ? JSON.stringify(value).substring(0, 30)
                            : String(value)
                        }
                      />
                    </Frame.Inline>
                  );
                })}
              </Frame.Column>
            </Action>
          );
        })}

        {data.length === 0 && (
          <Block role="EmptyState">
            <Text role="Body" prominence="Subtle" content="데이터가 없습니다" />
          </Block>
        )}
      </Block>
    </Section>
  );
};
