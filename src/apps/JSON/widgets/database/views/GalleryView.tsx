/**
 * GalleryView - Notion 스타일 Gallery (카드 그리드) 뷰
 */

import { Block } from '@/components/types/Block/Block.tsx';
import { Card } from '@/components/types/Block/role/Card.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import type { JsonArray, JsonObject, ViewConfig } from '../types';

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
    <Section role="Container" padding="md">
      <Block role="Grid" spec={{ columns: gridCols[cardSize] }} gap="md">
        {data.map((item, index) => {
          const obj = item as JsonObject;
          const keys = Object.keys(obj).slice(0, 6); // 최대 6개 필드

          return (
            <Card key={index} padding="md" interactive>
              <Block role="Container" gap="sm">
                {/* 이미지 (있으면) */}
                {viewConfig.showImage && viewConfig.imageKey && obj[viewConfig.imageKey] && (
                  <Block role="Media" aspectRatio="video">
                    <img
                      src={String(obj[viewConfig.imageKey])}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </Block>
                )}

                {/* 필드들 */}
                {keys.map((key, i) => {
                  const value = obj[key];
                  if (value === null || value === undefined) return null;

                  // 첫 번째 필드는 제목처럼 크게
                  if (i === 0) {
                    return (
                      <Text key={key} role="Title" prominence="Strong" content={String(value)} />
                    );
                  }

                  return (
                    <Block key={key} role="Field" gap="xs">
                      <Text role="Label" prominence="Subtle" content={key} />
                      <Text
                        role="Body"
                        content={
                          typeof value === 'object'
                            ? JSON.stringify(value).substring(0, 50) + '...'
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
    </Section>
  );
};
