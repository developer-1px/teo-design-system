/**
 * GalleryView - Notion 스타일 Gallery (카드 그리드) 뷰
 */

import { Section } from '@/components/types/Section/Section.tsx';
import { Group } from '@/components/types/Group/Group.tsx';
import { Card } from '@/components/types/Group/role/Card.tsx';
import { Text } from '@/components/types/Atom/Text/Text.tsx';
import type { JsonArray, JsonObject, ViewConfig } from '../types.ts';

interface GalleryViewProps {
  data: JsonArray;
  viewConfig: ViewConfig;
}

export const GalleryView = ({ data, viewConfig }: GalleryViewProps) => {
  const cardSize = viewConfig.cardSize || 'md';

  // 카드 사이즈별 그리드 컬럼 수
  const gridCols = {
    sm: 6,
    md: 4,
    lg: 3,
  };

  return (
    <Section role="Container" layout="scroll" padding="md">
      <Group role="Grid" template="gallery" gridCols={gridCols[cardSize]} gap="md">
        {data.map((item, index) => {
          const obj = item as JsonObject;
          const keys = Object.keys(obj).slice(0, 6); // 최대 6개 필드

          return (
            <Card
              key={index}
              padding="md"
              interactive
            >
              <Group role="Container" gap="sm">
                {/* 이미지 (있으면) */}
                {viewConfig.showImage && viewConfig.imageKey && obj[viewConfig.imageKey] && (
                  <Group role="Media" aspectRatio="video">
                    <img
                      src={String(obj[viewConfig.imageKey])}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </Group>
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
                        prominence="Primary"
                        content={String(value)}
                      />
                    );
                  }

                  return (
                    <Group key={key} role="Field" gap="xs">
                      <Text role="Label" prominence="Subtle" content={key} />
                      <Text
                        role="Body"
                        content={
                          typeof value === 'object'
                            ? JSON.stringify(value).substring(0, 50) + '...'
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
    </Section>
  );
};
