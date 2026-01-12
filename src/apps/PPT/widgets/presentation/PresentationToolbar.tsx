/**
 * PresentationToolbar - 순수 IDDL 기반 상단 툴바 (v2.0)
 *
 * IDDL 전체 스택 사용:
 * - Section[Header]: 전체 툴바
 *   - Block[Toolbar]: 좌측 제목
 *   - Block[Toolbar]: 중앙 네비게이션 + CTA
 *     - Action[Tertiary]: 이전 버튼
 *     - Action[Primary+Brand]: 재생 버튼 (Primary CTA)
 *     - Action[Tertiary]: 다음 버튼
 *   - Block[Toolbar]: 우측 여백
 */

import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section.tsx';

interface PresentationToolbarProps {
  title?: string;
  onPrevSlide?: () => void;
  onNextSlide?: () => void;
  onPlay?: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  onSave?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const PresentationToolbar = ({
  title = 'AI 시대: 결정, 책임, 경험, 소통',
  onPrevSlide,
  onNextSlide,
  onPlay,
  canGoPrev = true,
  canGoNext = true,
  onSave,
  onExport,
  onSettings,
  onUndo,
  onRedo,
}: PresentationToolbarProps) => {
  return (
    <Section role="Header" prominence="Elevated">
      <Block role="Toolbar" density="Compact">
        {/* 좌측: 제목 */}
        <Block role="Inline">
          <Text role="Title" content={title} />
        </Block>

        {/* 중앙: 재생 버튼 + 네비게이션 - IDDL Action 사용 */}
        <Block role="Toolbar" density="Compact">
          {/* 이전 슬라이드 - IDDL Action[Tertiary] */}
          <Action
            icon="ChevronLeft"
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
            intent="Neutral"
            disabled={!canGoNext}
            behavior={{ action: 'command', command: 'presentation.nextSlide' }}
            onClick={(e) => {
              e.preventDefault();
              onNextSlide?.();
            }}
          />
        </Block>

        {/* 우측: 편집 & 파일 액션 */}
        <Block role="Toolbar" density="Compact">
          {/* Undo/Redo */}
          <Action
            icon="Undo"
            intent="Neutral"
            behavior={{ action: 'command', command: 'edit.undo' }}
            onClick={(e) => {
              e.preventDefault();
              onUndo?.();
            }}
          />
          <Action
            icon="Redo"
            intent="Neutral"
            behavior={{ action: 'command', command: 'edit.redo' }}
            onClick={(e) => {
              e.preventDefault();
              onRedo?.();
            }}
          />

          {/* Separator */}
          <Block role="DividerVertical" />

          {/* File Actions */}
          <Action
            icon="Save"
            intent="Neutral"
            behavior={{ action: 'command', command: 'file.save' }}
            onClick={(e) => {
              e.preventDefault();
              onSave?.();
            }}
          />
          <Action
            icon="Download"
            intent="Neutral"
            behavior={{ action: 'command', command: 'file.export' }}
            onClick={(e) => {
              e.preventDefault();
              onExport?.();
            }}
          />
          <Action
            icon="Settings"
            intent="Neutral"
            behavior={{ action: 'command', command: 'app.settings' }}
            onClick={(e) => {
              e.preventDefault();
              onSettings?.();
            }}
          />
        </Block>
      </Block>
    </Section>
  );
};
