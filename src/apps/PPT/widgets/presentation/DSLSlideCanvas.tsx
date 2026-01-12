/**
 * DSLSlideCanvas - 순수 IDDL 기반 슬라이드 캔버스 (v2.0)
 *
 * 모든 레이아웃과 스타일을 IDDL Block/Section role로 표현
 * - 수동 className 제거 (flex, p-6, gap-6 등)
 * - Block layout/density/prominence로 시각적 계층 표현
 * - 미니멀 디자인 유지
 */

import { useState } from 'react';
import { slideContentToDSL } from '@/apps/PPT/lib/markdown-to-dsl';
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section.tsx';
import type { Slide } from './SlideList';

interface DSLSlideCanvasProps {
  slide: Slide | null;
  currentIndex?: number;
  totalSlides?: number;
  /** Fullscreen 모드 여부 (프레젠테이션 모드용) */
  fullscreen?: boolean;
  /** 편집 모드 여부 */
  editable?: boolean;
  /** 슬라이드 업데이트 핸들러 */
  onSlideUpdate?: (updates: Partial<Slide>) => void;
}

export const DSLSlideCanvas = ({
  slide,
  currentIndex,
  totalSlides,
  fullscreen = false,
  editable = true,
  onSlideUpdate,
}: DSLSlideCanvasProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [showEditTools, setShowEditTools] = useState(false);
  // Empty state
  if (!slide) {
    return (
      <Section role="Container">
        <Block role="Container">
          <Block role="Stack" density="Comfortable">
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
      <Block role="Container">
        {/* Slide Canvas - 16:9 aspect ratio container */}
        <Block
          role="Container"
          prominence="Standard"
          density="Comfortable"
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
                <Block role="Container" prominence="Strong" density="Compact">
                  <Text role="Title" prominence="Hero" content={slide.title} />
                </Block>
              )}

              {/* Content Area - Scrollable */}
              <Block role="Container" density="Standard">
                {slide.content ? (
                  slideContentToDSL(slide.content)
                ) : (
                  <Text role="Body" prominence="Subtle" content="내용을 입력하세요" />
                )}
              </Block>
            </Block>
          </Section>

          {/* Edit Tools - Top right overlay */}
          {!fullscreen && editable && (
            <Block
              role="Toolbar"
              prominence="Standard"
              density="Compact"
              onMouseEnter={() => setShowEditTools(true)}
              onMouseLeave={() => setShowEditTools(false)}
            >
              <Action
                icon="Type"
                intent="Neutral"
                onClick={() => setIsEditingTitle(!isEditingTitle)}
                prominence={isEditingTitle ? 'Hero' : 'Standard'}
              />
              <Action
                icon="FileText"
                intent="Neutral"
                onClick={() => setIsEditingContent(!isEditingContent)}
                prominence={isEditingContent ? 'Hero' : 'Standard'}
              />
              <Action icon="Image" intent="Neutral" onClick={() => console.log('Add image')} />
              <Action icon="Shapes" intent="Neutral" onClick={() => console.log('Add shape')} />
            </Block>
          )}

          {/* Slide Number - Top left overlay */}
          {!fullscreen && currentIndex !== undefined && totalSlides !== undefined && (
            <Block
              role="Toolbar"
              prominence="Subtle"
              density="Compact"
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
            >
              <Block role="Toolbar" density="Compact">
                <Text role="Code" content="←" />
                <Text role="Code" content="→" />
                <Text role="Caption" prominence="Subtle" content="이전/다음" />
              </Block>
              <Block role="Container" />
              <Block role="Toolbar" density="Compact">
                <Text role="Code" content="Space" />
                <Text role="Caption" prominence="Subtle" content="다음" />
              </Block>
              <Block role="Container" />
              <Block role="Toolbar" density="Compact">
                <Text role="Code" content="Home" />
                <Text role="Code" content="End" />
                <Text role="Caption" prominence="Subtle" content="처음/끝" />
              </Block>
              {editable && (
                <>
                  <Block role="Container" />
                  <Block role="Toolbar" density="Compact">
                    <Text role="Caption" prominence="Subtle" content="우측 상단에서 편집" />
                  </Block>
                </>
              )}
            </Block>
          )}
        </Block>
      </Block>
    </Section>
  );
};
