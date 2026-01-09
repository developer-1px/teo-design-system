/**
 * GalleryView - Notion 스타일 Gallery (카드 그리드) 뷰
 */

import { Card } from '@/components/Group/role/Card';
import { Group } from '@/components/Group/Group';
import { Text } from '@/components/Text/Text';
import type { JsonObject, JsonArray, ViewConfig } from '../types';
import { cn } from '@/lib/utils';

interface GalleryViewProps {
  data: JsonArray;
  viewConfig: ViewConfig;
}

export const GalleryView = ({ data, viewConfig }: GalleryViewProps) => {
  const cardSize = viewConfig.cardSize || 'md';

  // 카드 사이즈별 그리드 컬럼 수
  const gridCols = {
    sm: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6',
    md: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    lg: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3',
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className={cn('grid gap-4', gridCols[cardSize])}>
        {data.map((item, index) => {
          const obj = item as JsonObject;
          const keys = Object.keys(obj).slice(0, 6); // 최대 6개 필드

          return (
            <Card
              key={index}
              padding="md"
              className="cursor-pointer hover:shadow-lg transition-all"
            >
              <Group role="Container" className="gap-3">
                {/* 이미지 (있으면) */}
                {viewConfig.showImage && viewConfig.imageKey && obj[viewConfig.imageKey] && (
                  <div className="w-full aspect-video bg-surface-sunken rounded overflow-hidden mb-2">
                    <img
                      src={String(obj[viewConfig.imageKey])}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* 필드들 */}
                {keys.map((key, i) => {
                  const value = obj[key];
                  if (value === null || value === undefined) return null;

                  // 첫 번째 필드는 제목처럼 크게
                  if (i === 0) {
                    return (
                      <Text
                        key={key}
                        role="Title"
                        prominence="Hero"
                        className="font-semibold text-lg line-clamp-2"
                        content={String(value)}
                      />
                    );
                  }

                  return (
                    <div key={key} className="flex flex-col gap-0.5">
                      <Text role="Label" prominence="Tertiary" className="text-xs text-subtle" content={key} />
                      <Text
                        role="Body"
                        prominence="Primary"
                        className="text-sm line-clamp-1"
                        content={typeof value === 'object'
                          ? JSON.stringify(value).substring(0, 50) + '...'
                          : String(value)}
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
  );
};
