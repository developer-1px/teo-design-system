/**
 * ListView - Notion 스타일 List 뷰
 * 간단하고 컴팩트한 리스트
 */

import { Group } from '@/components/Group/Group';
import { Text } from '@/components/Text/Text';
import type { JsonObject, JsonArray } from '../types';
import { cn } from '@/lib/utils';

interface ListViewProps {
  data: JsonArray;
}

export const ListView = ({ data }: ListViewProps) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="divide-y divide-border">
        {data.map((item, index) => {
          const obj = item as JsonObject;
          const keys = Object.keys(obj).slice(0, 4); // 최대 4개 필드

          return (
            <div
              key={index}
              className={cn(
                'px-4 py-3 hover:bg-surface-sunken cursor-pointer transition-colors',
                'flex items-center gap-4'
              )}
            >
              {/* 첫 번째 필드 (제목) */}
              <div className="flex-1 min-w-0">
                <Text
                  role="Body"
                  prominence="Hero"
                  className="font-medium truncate block"
                  content={String(obj[keys[0]])}
                />
              </div>

              {/* 나머지 필드들 */}
              <Group role="Container" direction="horizontal" className="gap-6 flex-shrink-0">
                {keys.slice(1).map((key) => {
                  const value = obj[key];
                  if (value === null || value === undefined) return null;

                  return (
                    <div key={key} className="flex items-center gap-2 min-w-0">
                      <Text
                        role="Label"
                        prominence="Tertiary"
                        className="text-xs text-subtle whitespace-nowrap"
                        content={`${key}:`}
                      />
                      <Text
                        role="Body"
                        prominence="Primary"
                        className="text-sm truncate"
                        content={typeof value === 'object'
                          ? JSON.stringify(value).substring(0, 30)
                          : String(value)}
                      />
                    </div>
                  );
                })}
              </Group>
            </div>
          );
        })}

        {data.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <Text role="Body" prominence="Tertiary" className="text-subtle" content="데이터가 없습니다" />
          </div>
        )}
      </div>
    </div>
  );
};
