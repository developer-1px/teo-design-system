/**
 * PresentationToolbar - 순수 IDDL 기반 상단 툴바 (v2.0)
 *
 * IDDL 전체 스택 사용:
 * - Section[Header]: 전체 툴바
 *   - Group[Toolbar]: 좌측 제목
 *   - Group[Toolbar]: 중앙 네비게이션 + CTA
 *     - Action[Tertiary]: 이전 버튼
 *     - Action[Primary+Brand]: 재생 버튼 (Primary CTA)
 *     - Action[Tertiary]: 다음 버튼
 *   - Group[Toolbar]: 우측 여백
 */

import { Action } from '@/components/Action/Action';
import { Group } from '@/components/Group/Group.tsx';
import { Section } from '@/components/Section/Section.tsx';
import { Text } from '@/components/Text/Text';

interface PresentationToolbarProps {
  title?: string;
  onPrevSlide?: () => void;
  onNextSlide?: () => void;
  onPlay?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
}

export const PresentationToolbar = ({
  title = 'AI 시대: 결정, 책임, 경험, 소통',
  onPrevSlide,
  onNextSlide,
  onPlay,
  canGoPrev = true,
  canGoNext = true,
}: PresentationToolbarProps) => {
  return (
    <Section role="Header" className="border-b border-border bg-layer-4 shadow-sm">
      <Group
        role="Toolbar"
        layout="inline"
        density="Compact"
        className="h-12 items-center justify-between px-4"
      >
        {/* 좌측: 제목 */}
        <Group role="Inline" layout="inline" className="flex-1">
          <Text
            role="Title"
            prominence="Secondary"
            content={title}
            className="text-text-primary font-medium truncate max-w-md"
          />
        </Group>

        {/* 중앙: 재생 버튼 + 네비게이션 - IDDL Action 사용 */}
        <Group role="Toolbar" layout="inline" className="gap-2">
          {/* 이전 슬라이드 - IDDL Action[Tertiary] */}
          <Action
            icon="ChevronLeft"
            prominence="Tertiary"
            intent="Neutral"
            disabled={!canGoPrev}
            behavior={{ action: 'command', command: 'presentation.prevSlide' }}
            onClick={(e) => {
              e.preventDefault();
              onPrevSlide?.();
            }}
          />

          {/* 재생 버튼 (Primary CTA) - IDDL Action[Primary+Brand] */}
          <Action
            label="재생"
            icon="Play"
            prominence="Primary"
            intent="Brand"
            behavior={{ action: 'command', command: 'presentation.play' }}
            onClick={(e) => {
              e.preventDefault();
              onPlay?.();
            }}
          />

          {/* 다음 슬라이드 - IDDL Action[Tertiary] */}
          <Action
            icon="ChevronRight"
            prominence="Tertiary"
            intent="Neutral"
            disabled={!canGoNext}
            behavior={{ action: 'command', command: 'presentation.nextSlide' }}
            onClick={(e) => {
              e.preventDefault();
              onNextSlide?.();
            }}
          />
        </Group>

        {/* 우측: 여백 (향후 확장 가능) */}
        <Group role="Toolbar" layout="inline" className="flex-1 justify-end gap-2">
          {/* Placeholder for future actions */}
        </Group>
      </Group>
    </Section>
  );
};
