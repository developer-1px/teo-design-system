/**
 * PresentationModePage - 전체화면 프레젠테이션 모드 (v1.0)
 *
 * IDDL v5.0 Page role="Fullscreen" 사용
 * - 전체 화면 고정 (w-screen h-screen overflow-hidden)
 * - DSLSlideCanvas fullscreen 모드 사용
 * - 키보드 네비게이션 (ArrowLeft/Right, Space, Home, End, Esc)
 * - 하단 오버레이 네비게이션 (이전/다음 버튼, 슬라이드 번호)
 * - CSS transition으로 부드러운 슬라이드 전환
 *
 * IDDL 구조:
 * - Page role="Fullscreen": 전체화면 컨테이너
 *   - Section role="Container": 슬라이드 컨테이너
 *     - DSLSlideCanvas: 현재 슬라이드
 *   - Block role="Toolbar": 하단 네비게이션 오버레이
 */

import { useEffect, useState } from 'react';
import { DSLSlideCanvas } from '@/apps/PPT/widgets/presentation/DSLSlideCanvas';
import type { Slide } from '@/apps/PPT/widgets/presentation/SlideList';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Separator } from '@/components/types/Element/Separator/Separator';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';

interface PresentationModePageProps {
  /** 슬라이드 목록 */
  slides: Slide[];
  /** 초기 슬라이드 ID */
  initialSlideId?: string;
  /** 종료 핸들러 */
  onExit: () => void;
  /** 슬라이드 변경 핸들러 (optional) */
  onSlideChange?: (slideId: string) => void;
}

export const PresentationModePage = ({
  slides,
  initialSlideId,
  onExit,
  onSlideChange,
}: PresentationModePageProps) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialSlideId) {
      const index = slides.findIndex((s) => s.id === initialSlideId);
      return index >= 0 ? index : 0;
    }
    return 0;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentSlide = slides[currentIndex] || null;

  // 슬라이드 변경 핸들러
  const goToSlide = (index: number) => {
    if (index < 0 || index >= slides.length || index === currentIndex) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      onSlideChange?.(slides[index].id);
      setIsTransitioning(false);
    }, 150); // Half of transition duration
  };

  const goToPrevSlide = () => {
    if (currentIndex > 0) {
      goToSlide(currentIndex - 1);
    }
  };

  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      goToSlide(currentIndex + 1);
    }
  };

  const goToFirstSlide = () => {
    goToSlide(0);
  };

  const goToLastSlide = () => {
    goToSlide(slides.length - 1);
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goToPrevSlide();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Space
          e.preventDefault();
          goToNextSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToFirstSlide();
          break;
        case 'End':
          e.preventDefault();
          goToLastSlide();
          break;
        case 'Escape':
          e.preventDefault();
          onExit();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit, goToFirstSlide, goToLastSlide, goToNextSlide, goToPrevSlide]);

  // Empty state
  if (slides.length === 0) {
    return (
      <Page title="Showcase" role="Fullscreen">
        <Section role="Container">
          <Block
            role="Container"
            density="Comfortable"
          >
            <Text role="Body" prominence="Subtle" content="슬라이드가 없습니다" />
            <Action role="Button" onClick={onExit}>
              나가기 (Esc)
            </Action>
          </Block>
        </Section>
      </Page>
    );
  }

  return (
    <Page title="Showcase" role="Fullscreen">
      {/* Slide Container with Transition */}
      <Section
        role="Container"
      >
        <DSLSlideCanvas
          slide={currentSlide}
          currentIndex={currentIndex}
          totalSlides={slides.length}
          fullscreen={true}
        />
      </Section>

      {/* Bottom Navigation Overlay */}
      {/* IDDL Exception: absolute positioning + bg-black for overlay - Overlay component로 대체 가능 */}
      <Block
        role="Toolbar"
        density="Compact"
        prominence="Subtle"
      >
        {/* Previous Button */}
        <Action
          role="IconButton"
          icon="ChevronLeft"
          prominence="Secondary"
          intent="Neutral"
          disabled={currentIndex === 0}
          onClick={goToPrevSlide}
        />

        {/* Slide Counter */}
        <Text
          role="Body"
          prominence="Standard"
          content={`${currentIndex + 1} / ${slides.length}`}
        />

        {/* Next Button */}
        <Action
          role="IconButton"
          icon="ChevronRight"
          prominence="Secondary"
          intent="Neutral"
          disabled={currentIndex === slides.length - 1}
          onClick={goToNextSlide}
        />

        {/* Divider */}
        <Block role="DividerVertical" />

        {/* Exit Button */}
        <Action
          role="Button"
          prominence="Tertiary"
          intent="Neutral"
          onClick={onExit}
        >
          나가기 (Esc)
        </Action>
      </Block>

      {/* Keyboard Hints - Top Right */}
      <Block
        role="Container"
        prominence="Subtle"
        density="Compact"
      >
        <Block role="Toolbar" density="Compact">
          <Text role="Code" content="←" />
          <Text role="Code" content="→" />
          <Text role="Caption" prominence="Subtle" content="탐색" />
        </Block>
      </Block>
    </Page>
  );
};
