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
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { DSLSlideCanvas } from '@/apps/PPT/widgets/presentation/DSLSlideCanvas';
import type { Slide } from '@/apps/PPT/widgets/presentation/SlideList';

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
  }, [currentIndex, slides.length, onExit]);

  // Empty state
  if (slides.length === 0) {
    return (
      <Page role="Fullscreen">
        <Section role="Container">
          <Block role="Container" layout="stack" className="items-center justify-center h-full" density="Comfortable">
            <Text role="Body" prominence="Subtle" content="슬라이드가 없습니다" />
            <Action prominence="Secondary" onClick={onExit}>
              나가기 (Esc)
            </Action>
          </Block>
        </Section>
      </Page>
    );
  }

  return (
    <Page role="Fullscreen">
      {/* Slide Container with Transition */}
      <Section
        role="Container"
        className={`
          transition-opacity duration-300
          ${isTransitioning ? 'opacity-0' : 'opacity-100'}
        `}
      >
        <DSLSlideCanvas
          slide={currentSlide}
          currentIndex={currentIndex}
          totalSlides={slides.length}
          fullscreen={true}
        />
      </Section>

      {/* Bottom Navigation Overlay */}
      <Block
        role="Toolbar"
        layout="inline"
        density="Compact"
        prominence="Subtle"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2"
      >
        {/* Previous Button */}
        <Action
          role="IconButton"
          icon="ChevronLeft"
          prominence="Secondary"
          intent="Neutral"
          disabled={currentIndex === 0}
          onClick={goToPrevSlide}
          className="text-white hover:text-white/80"
        />

        {/* Slide Counter */}
        <Text
          role="Body"
          prominence="Standard"
          content={`${currentIndex + 1} / ${slides.length}`}
          className="text-white min-w-[60px] text-center"
        />

        {/* Next Button */}
        <Action
          role="IconButton"
          icon="ChevronRight"
          prominence="Secondary"
          intent="Neutral"
          disabled={currentIndex === slides.length - 1}
          onClick={goToNextSlide}
          className="text-white hover:text-white/80"
        />

        {/* Divider */}
        <div className="w-px h-6 bg-white/20" />

        {/* Exit Button */}
        <Action
          role="Button"
          prominence="Tertiary"
          intent="Neutral"
          onClick={onExit}
          className="text-white hover:text-white/80"
        >
          나가기 (Esc)
        </Action>
      </Block>

      {/* Keyboard Hints - Top Right */}
      <Block
        role="Container"
        prominence="Subtle"
        density="Compact"
        className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded px-3 py-2"
      >
        <Block role="Inline" layout="inline" density="Compact">
          <Text role="Code" content="←" className="text-white" />
          <Text role="Code" content="→" className="text-white" />
          <Text role="Caption" prominence="Subtle" content="탐색" className="text-white/70" />
        </Block>
      </Block>
    </Page>
  );
};
