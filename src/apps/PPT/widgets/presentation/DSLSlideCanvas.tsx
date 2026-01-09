/**
 * DSLSlideCanvas - DSL 기반 슬라이드 캔버스
 *
 * IDDL DSL 컴포넌트를 사용하여 슬라이드를 렌더링합니다.
 * 마크다운 콘텐츠를 DSL 컴포넌트로 변환하여 일관성 있는 디자인을 제공합니다.
 */

import { slideContentToDSL } from '@/apps/PPT/lib/markdown-to-dsl';
import { Group } from '@/components/types/Group/Group.tsx';
import { Field } from '@/components/types/Atom/Field/Field';
import { Text } from '@/components/types/Atom/Text/Text';
import { Section } from '@/components/types/Section/Section.tsx';
import type { Slide } from './SlideList';

interface DSLSlideCanvasProps {
  slide: Slide | null;
  currentIndex?: number;
  totalSlides?: number;
}

export const DSLSlideCanvas = ({ slide, currentIndex, totalSlides }: DSLSlideCanvasProps) => {
  if (!slide) {
    return (
      <Section role="Container" className="flex flex-1 items-center justify-center">
        <div className="text-center text-text-tertiary">
          <p className="text-sm">슬라이드를 선택하세요</p>
          <p className="mt-1 text-xs">왼쪽 목록에서 슬라이드를 선택하거나 새로 만드세요</p>
        </div>
      </Section>
    );
  }

  return (
    <Section role="Container" className="relative flex flex-1 flex-col overflow-hidden">
      {/* Canvas Container - Maintains aspect ratio */}
      <div className="flex flex-1 items-center justify-center p-6">
        {/* Slide Canvas - 16:9 aspect ratio */}
        <div className="relative w-full max-w-5xl">
          <div className="aspect-[16/9]">
            <Section
              role="Container"
              className="h-full w-full overflow-hidden p-8"
              style={{ backgroundColor: slide.backgroundColor }}
            >
              {/* Slide Content - DSL 기반 */}
              <div className="flex h-full flex-col gap-6">
                {/* Title Area - DSL Text 컴포넌트 사용 */}
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

                {/* Content Area - DSL 변환 렌더링 */}
                <div className="flex-1 overflow-y-auto">
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
      </div>

      {/* Slide Number - Top left - IDDL */}
      {currentIndex !== undefined && totalSlides !== undefined && (
        <Group role="Container" className="absolute left-3 top-3 bg-white/80">
          <Text role="Caption" content={`${currentIndex + 1} / ${totalSlides}`} />
        </Group>
      )}

      {/* Zoom Controls - Top right - IDDL */}
      <div className="absolute right-3 top-3">
        <Field
          label=""
          model="zoom"
          dataType="select"
          options={[
            { label: '50%', value: '50' },
            { label: '75%', value: '75' },
            { label: '100%', value: '100' },
            { label: '125%', value: '125' },
            { label: '150%', value: '150' },
          ]}
          className="bg-white/80"
        />
      </div>

      {/* Keyboard Shortcuts Hint - Bottom center - IDDL */}
      <Group
        role="Container"
        layout="inline"
        density="Compact"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80"
      >
        <Group role="Inline" layout="inline" density="Compact">
          <Text role="Kbd" content="←" />
          <Text role="Kbd" content="→" />
          <Text role="Caption" prominence="Subtle" content="이전/다음" />
        </Group>
        <Group role="Inline" layout="inline" density="Compact">
          <Text role="Kbd" content="Space" />
          <Text role="Caption" prominence="Subtle" content="다음" />
        </Group>
        <Group role="Inline" layout="inline" density="Compact">
          <Text role="Kbd" content="Home" />
          <Text role="Kbd" content="End" />
          <Text role="Caption" prominence="Subtle" content="처음/끝" />
        </Group>
      </Group>
    </Section>
  );
};
