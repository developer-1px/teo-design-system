import { Frame } from '@/components/dsl/shared/Frame';
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
}: DSLSlideCanvasProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  // Empty state
  if (!slide) {
    return (
      <Section role="Container">
        <Frame.Column>
          <Frame.Stack density="Comfortable">
            <Text role="Body" prominence="Subtle" content="슬라이드를 선택하세요" />
            <Text
              role="Caption"
              prominence="Subtle"
              content="왼쪽 목록에서 슬라이드를 선택하거나 새로 만드세요"
            />
          </Frame.Stack>
        </Frame.Column>
      </Section>
    );
  }

  return (
    <Section role="Container" className="flex flex-col items-center justify-center w-full h-full p-4 group">
      {/* 16:9 Slide Wrapper */}
      <div
        className="relative bg-surface-base shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_1px_rgba(0,0,0,0.1)] rounded-lg overflow-hidden border border-border"
        style={{
          aspectRatio: '16/9',
          width: '100%',
          maxWidth: fullscreen ? '100%' : '1100px',
          backgroundColor: slide.backgroundColor
        }}
      >
        {/* Slide Interior */}
        <Section
          role="Main"
          prominence="Standard"
          density="Comfortable"
          className="w-full h-full flex flex-col p-[8%]" // Percentage padding for responsive feel
        >
          <Frame.Column gap={12} className="h-full">
            {/* Title Area */}
            {slide.title && (
              <Frame.Stack gap={4}>
                <Text role="Title" prominence="Hero" content={slide.title} className="leading-tight tracking-tight" />
                <Block role="Divider" className="w-20 border-primary" />
              </Frame.Stack>
            )}

            {/* Content Area */}
            <Frame.Column className="flex-1 overflow-auto pr-4 scrollbar-hide">
              {slide.content ? (
                <div className="text-xl leading-relaxed opacity-80">
                  {slideContentToDSL(slide.content)}
                </div>
              ) : (
                <Text role="Body" prominence="Subtle" content="Click to add content..." />
              )}
            </Frame.Column>
          </Frame.Column>
        </Section>

        {/* Floating Tool Overlay (Slide specific) */}
        {!fullscreen && editable && (
          <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Block role="Toolbar" prominence="Elevated" density="Compact" className="shadow-lg backdrop-blur-md">
              <Action icon="Type" intent="Neutral" size="sm" />
              <Action icon="Image" intent="Neutral" size="sm" />
              <Action icon="Shapes" intent="Neutral" size="sm" />
            </Block>
          </div>
        )}
      </div>

      {/* Navigation & Info Bar (Below Canvas) */}
      {!fullscreen && (
        <Frame.Row align="center" justify="between" width="fill" className="mt-8 max-w-[1100px] opacity-60 px-2 text-text-subtle">
          <Frame.Row gap={4} align="center">
            <Text role="Caption" prominence="Strong" content={`SLIDE ${currentIndex !== undefined ? currentIndex + 1 : '-'}`} />
            <Block role="DividerVertical" className="h-4" />
            <Text role="Caption" content={`${totalSlides || '-'} TOTAL`} />
          </Frame.Row>

          <Frame.Row gap={3} align="center">
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-surface-sunken border border-border">
              <Text role="Code" content="←" className="text-[10px]" />
              <Text role="Code" content="→" className="text-[10px]" />
              <Text role="Caption" content="Navigate" className="ml-1 text-[10px]" />
            </div>
          </Frame.Row>
        </Frame.Row>
      )}
    </Section>
  );
};
