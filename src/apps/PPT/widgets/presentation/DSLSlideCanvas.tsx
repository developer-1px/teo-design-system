/**
 * DSLSlideCanvas - 순수 IDDL 기반 슬라이드 캔버스 (v2.0)
 *
 * 모든 레이아웃과 스타일을 IDDL Block/Section role로 표현
 * - 수동 className 제거 (flex, p-6, gap-6 등)
 * - Block layout/density/prominence로 시각적 계층 표현
 * - 미니멀 디자인 유지
 */

import { slideContentToDSL } from '@/apps/PPT/lib/markdown-to-dsl';
import { Block } from '@/components/types/Block/Block.tsx';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section.tsx';
import type { Slide } from './SlideList';

interface DSLSlideCanvasProps {
  slide: Slide | null;
  currentIndex?: number;
  totalSlides?: number;
  /** Fullscreen 모드 여부 (프레젠테이션 모드용) */
  fullscreen?: boolean;
}

export const DSLSlideCanvas = ({
  slide,
  currentIndex,
  totalSlides,
  fullscreen = false,
}: DSLSlideCanvasProps) => {
  // Empty state
  if (!slide) {
    return (
      <Section role="Container">
        <Block role="Center">
          <Block role="Stack" density="Comfortable" className="text-center">
            <Text role="Body" prominence="Subtle" content="슬라이드를 선택하세요" />
            <Text
              role="Caption"
              prominence="Subtle"
              content="왼쪽 목록에서 슬라이드를 선택하거나 새로 만드세요"
            />
          </Block>
        </Block>
      </Section>
    );
  }

  return (
    <Section role="Container">
      {/* Canvas Container - 중앙 정렬 */}
      <Block role="Center" className="p-8">
        {/* Slide Canvas - 16:9 aspect ratio container */}
        <Block
          role="Container"
          prominence="Standard"
          density="Comfortable"
          className="relative w-full max-w-5xl aspect-[16/9]"
        >
          {/* Slide Content Container */}
          <Section
            role="Container"
            prominence="Standard"
            density="Comfortable"
            style={{ backgroundColor: slide.backgroundColor }}
          >
            {/* Slide Content Stack */}
            <Block role="Container" density="Comfortable">
              {/* Title Area */}
              {slide.title && (
                <Block role="Container" prominence="Primary" density="Compact">
                  <Text role="Title" prominence="Hero" content={slide.title} />
                </Block>
              )}

              {/* Content Area - Scrollable */}
              <Block role="Container" layout="stack" density="Standard">
                {slide.content ? (
                  slideContentToDSL(slide.content)
                ) : (
                  <Text role="Body" prominence="Subtle" content="내용을 입력하세요" />
                )}
              </Block>
            </Block>
          </Section>

          {/* Slide Number - Top left overlay */}
          {!fullscreen && currentIndex !== undefined && totalSlides !== undefined && (
            <Block
              role="Toolbar"
              prominence="Subtle"
              density="Compact"
              className="absolute left-3 top-3 bg-white/80 backdrop-blur-sm rounded"
            >
              <Text role="Caption" content={`${currentIndex + 1} / ${totalSlides}`} />
            </Block>
          )}

          {/* Keyboard Shortcuts Hint - Bottom center overlay */}
          {!fullscreen && (
            <Block
              role="Toolbar"
              density="Compact"
              prominence="Subtle"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded"
            >
              <Block role="Inline" density="Compact">
                <Text role="Code" content="←" />
                <Text role="Code" content="→" />
                <Text role="Caption" prominence="Subtle" content="이전/다음" />
              </Block>
              <Block role="Inline" density="Compact">
                <Text role="Code" content="Space" />
                <Text role="Caption" prominence="Subtle" content="다음" />
              </Block>
              <Block role="Inline" density="Compact">
                <Text role="Code" content="Home" />
                <Text role="Code" content="End" />
                <Text role="Caption" prominence="Subtle" content="처음/끝" />
              </Block>
            </Block>
          )}
        </Block>
      </Block>
    </Section>
  );
};
