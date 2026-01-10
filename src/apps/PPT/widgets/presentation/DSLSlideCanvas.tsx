/**
 * DSLSlideCanvas - 순수 IDDL 기반 슬라이드 캔버스 (v2.0)
 *
 * 모든 레이아웃과 스타일을 IDDL Group/Section role로 표현
 * - 수동 className 제거 (flex, p-6, gap-6 등)
 * - Group layout/density/prominence로 시각적 계층 표현
 * - 미니멀 디자인 유지
 */

import { slideContentToDSL } from '@/apps/PPT/lib/markdown-to-dsl';
import { Group } from '@/components/types/Group/Group.tsx';
import { Text } from '@/components/types/Atom/Text/Text';
import { Section } from '@/components/types/Section/Section.tsx';
import type { Slide } from './SlideList';

interface DSLSlideCanvasProps {
  slide: Slide | null;
  currentIndex?: number;
  totalSlides?: number;
  /** Fullscreen 모드 여부 (프레젠테이션 모드용) */
  fullscreen?: boolean;
}

export const DSLSlideCanvas = ({ slide, currentIndex, totalSlides, fullscreen = false }: DSLSlideCanvasProps) => {
  // Empty state
  if (!slide) {
    return (
      <Section role="Container">
        <Group layout="flex" direction="vertical" density="Comfortable">
          <Text role="Body" prominence="Subtle" content="슬라이드를 선택하세요" />
          <Text role="Caption" prominence="Subtle" content="왼쪽 목록에서 슬라이드를 선택하거나 새로 만드세요" />
        </Group>
      </Section>
    );
  }

  return (
    <Section role="Container">
      {/* Canvas Container - 중앙 정렬 */}
      <Group layout="flex" direction="vertical" density="Comfortable">
        {/* Slide Canvas - 16:9 aspect ratio container */}
        <Group
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

              {/* Content Area - Scrollable */}
              <Group layout="scroll" direction="vertical" density="Standard">
                {slide.content ? (
                  slideContentToDSL(slide.content)
                ) : (
                  <Text role="Body" prominence="Subtle" content="내용을 입력하세요" />
                )}
              </Group>
            </Group>
          </Section>

          {/* Slide Number - Top left overlay */}
          {!fullscreen && currentIndex !== undefined && totalSlides !== undefined && (
            <Group
              role="Toolbar"
              prominence="Subtle"
              density="Compact"
              className="absolute left-3 top-3 bg-white/80 backdrop-blur-sm rounded"
            >
              <Text role="Caption" content={`${currentIndex + 1} / ${totalSlides}`} />
            </Group>
          )}

          {/* Keyboard Shortcuts Hint - Bottom center overlay */}
          {!fullscreen && (
            <Group
              role="Toolbar"
              layout="inline"
              density="Compact"
              prominence="Subtle"
              className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded"
            >
              <Group layout="inline" density="Compact">
                <Text role="Kbd" content="←" />
                <Text role="Kbd" content="→" />
                <Text role="Caption" prominence="Subtle" content="이전/다음" />
              </Group>
              <Group layout="inline" density="Compact">
                <Text role="Kbd" content="Space" />
                <Text role="Caption" prominence="Subtle" content="다음" />
              </Group>
              <Group layout="inline" density="Compact">
                <Text role="Kbd" content="Home" />
                <Text role="Kbd" content="End" />
                <Text role="Caption" prominence="Subtle" content="처음/끝" />
              </Group>
            </Group>
          )}
        </Group>
      </Group>
    </Section>
  );
};
