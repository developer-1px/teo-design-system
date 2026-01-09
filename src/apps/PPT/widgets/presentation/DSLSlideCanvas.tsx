/**
 * DSLSlideCanvas - DSL 기반 슬라이드 캔버스
 *
 * IDDL DSL 컴포넌트를 사용하여 슬라이드를 렌더링합니다.
 * 마크다운 콘텐츠를 DSL 컴포넌트로 변환하여 일관성 있는 디자인을 제공합니다.
 */

import { Section } from '@/components/Section/Section.tsx';
import { Text } from '@/components/Text/Text';
import { slideContentToDSL } from '@/apps/PPT/lib/markdown-to-dsl';
import type { Slide } from './SlideList';

interface DSLSlideCanvasProps {
  slide: Slide | null;
  currentIndex?: number;
  totalSlides?: number;
}

export const DSLSlideCanvas = ({ slide, currentIndex, totalSlides }: DSLSlideCanvasProps) => {
  if (!slide) {
    return (
      <Section
        role="Container"
        prominence="Primary"
        className="flex flex-1 items-center justify-center"
      >
        <div className="text-center text-text-tertiary">
          <p className="text-sm">슬라이드를 선택하세요</p>
          <p className="mt-1 text-xs">왼쪽 목록에서 슬라이드를 선택하거나 새로 만드세요</p>
        </div>
      </Section>
    );
  }

  return (
    <Section
      role="Container"
      prominence="Primary"
      className="relative flex flex-1 flex-col overflow-hidden"
    >
      {/* Canvas Container - Maintains aspect ratio */}
      <div className="flex flex-1 items-center justify-center p-6">
        {/* Slide Canvas - 16:9 aspect ratio */}
        <div className="relative w-full max-w-5xl">
          <div className="aspect-[16/9]">
            <Section
              role="Container"
              prominence="Tertiary"
              className="h-full w-full overflow-hidden p-8"
              style={{ backgroundColor: slide.backgroundColor }}
            >
              {/* Slide Content - DSL 기반 */}
              <div className="flex h-full flex-col gap-6">
                {/* Title Area - DSL Text 컴포넌트 사용 */}
                {slide.title && (
                  <div className="border-b border-text-primary/10 pb-4">
                    <Text
                      role="Title"
                      prominence="Hero"
                      content={slide.title}
                      className="text-text-primary"
                    />
                  </div>
                )}

                {/* Content Area - DSL 변환 렌더링 */}
                <div className="flex-1 overflow-y-auto">
                  {slide.content ? (
                    slideContentToDSL(slide.content)
                  ) : (
                    <Text
                      role="Body"
                      prominence="Tertiary"
                      content="내용을 입력하세요"
                      className="text-text-tertiary"
                    />
                  )}
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* Slide Number - Top left */}
      {currentIndex !== undefined && totalSlides !== undefined && (
        <div className="absolute left-3 top-3">
          <div className="rounded bg-layer-0/90 px-3 py-1.5 text-xs font-medium text-text-secondary backdrop-blur-sm">
            {currentIndex + 1} / {totalSlides}
          </div>
        </div>
      )}

      {/* Zoom Controls - Minimal, top-right */}
      <div className="absolute right-3 top-3">
        <select
          className="rounded bg-layer-0/80 px-2 py-0.5 text-xs text-text-secondary backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-accent"
          defaultValue="100"
        >
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="100">100%</option>
          <option value="125">125%</option>
          <option value="150">150%</option>
        </select>
      </div>

      {/* Keyboard Shortcuts Hint - Bottom center */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
        <div className="rounded bg-layer-0/90 px-3 py-1.5 text-xs text-text-tertiary backdrop-blur-sm">
          <span className="inline-flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-layer-2 px-1.5 py-0.5 font-mono text-xs">←</kbd>
              <kbd className="rounded bg-layer-2 px-1.5 py-0.5 font-mono text-xs">→</kbd>
              이전/다음
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-layer-2 px-1.5 py-0.5 font-mono text-xs">Space</kbd>
              다음
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded bg-layer-2 px-1.5 py-0.5 font-mono text-xs">Home</kbd>
              <kbd className="rounded bg-layer-2 px-1.5 py-0.5 font-mono text-xs">End</kbd>
              처음/끝
            </span>
          </span>
        </div>
      </div>
    </Section>
  );
};
