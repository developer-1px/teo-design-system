/**
 * SlidePreview - Thumbnail preview of slide content
 *
 * DSL 기반 슬라이드 썸네일 렌더링
 * - DSLSlideCanvas와 동일한 렌더링 로직
 * - transform: scale()로 축소
 * - 인터랙션 요소 제거 (클릭, 줌, 키보드 힌트 등)
 */

import { slideContentToDSL } from '@/apps/PPT/lib/markdown-to-dsl';
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
    <div className="relative w-full h-full overflow-hidden">
      {/* Scale wrapper */}
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
          className="h-full w-full overflow-hidden p-8"
          style={{ backgroundColor: slide.backgroundColor }}
        >
          {/* Slide Content - DSL 기반 */}
          <div className="flex h-full flex-col gap-6">
            {/* Title Area */}
            {slide.title && (
              <div className="border-b border-text-primary/5 pb-4">
                <Text
                  role="Title"
                  prominence="Hero"
                  content={slide.title}
                  className="text-text-primary"
                />
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-hidden">
              {slide.content ? (
                slideContentToDSL(slide.content)
              ) : (
                <Text role="Body" content="내용을 입력하세요" className="text-text-tertiary" />
              )}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};
