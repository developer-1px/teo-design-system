/**
 * SlidePreview - 순수 IDDL 기반 슬라이드 썸네일 (v2.0)
 *
 * 모든 레이아웃을 IDDL Group/Section role로 표현
 * - 수동 className 제거 (flex, h-full, flex-col, gap-6, border-b 등)
 * - Group layout/density/prominence로 시각적 계층 표현
 * - transform: scale()로 축소 (presentational 속성이므로 유지)
 * - 인터랙션 요소 제거 (클릭, 줌, 키보드 힌트 등)
 */

import { slideContentToDSL } from '@/apps/PPT/lib/markdown-to-dsl';
import { Group } from '@/components/types/Group/Group.tsx';
import { Text } from '@/components/types/Atom/Text/Text';
import { Section } from '@/components/types/Section/Section.tsx';
import type { Slide } from './SlideList';

interface SlidePreviewProps {
  slide: Slide;
  /** Scale factor (0.1 to 1.0). Default: 0.15 */
  scale?: number;
}

export const SlidePreview = ({ slide, scale = 0.15 }: SlidePreviewProps) => {
  // 16:9 기준 크기 (1920x1080)
  const baseWidth = 1920;
  const baseHeight = 1080;

  return (
    <Group role="Container" prominence="Subtle">
      {/* Scale wrapper - transform은 presentational 속성 */}
      <div
        className="origin-top-left pointer-events-none"
        style={{
          transform: `scale(${scale})`,
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
        }}
      >
        <Section
          role="Container"
          prominence="Standard"
          density="Comfortable"
          style={{ backgroundColor: slide.backgroundColor }}
        >
          {/* Slide Content Stack */}
          <Group layout="stack" direction="vertical" density="Comfortable">
            {/* Title Area */}
            {slide.title && (
              <Group role="Container" prominence="Primary" density="Compact">
                <Text
                  role="Title"
                  prominence="Hero"
                  content={slide.title}
                />
              </Group>
            )}

            {/* Content Area - overflow hidden for thumbnail */}
            <Group role="Container" prominence="Standard" density="Standard">
              {slide.content ? (
                slideContentToDSL(slide.content)
              ) : (
                <Text role="Body" prominence="Subtle" content="내용을 입력하세요" />
              )}
            </Group>
          </Group>
        </Section>
      </div>
    </Group>
  );
};
