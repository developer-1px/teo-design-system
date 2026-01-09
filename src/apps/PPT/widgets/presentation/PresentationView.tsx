/**
 * PresentationView - IDDL 기반 프레젠테이션 뷰
 *
 * IDDL Section을 사용한 구조적 레이아웃:
 * - Section[Header]: 상단 툴바
 * - Section[Container]: 메인 영역
 *   - Section[Navigator]: 왼쪽 슬라이드 리스트
 *   - Section[Container]: 중앙 캔버스
 *   - Section[Aside]: 오른쪽 포맷 사이드바
 */

import { useState, useEffect } from 'react';
import { Section } from '@/components/Section/Section.tsx';
import { SlideList, type Slide } from './SlideList.tsx';
import { DSLSlideCanvas } from './DSLSlideCanvas.tsx';
import { PresentationToolbar } from './PresentationToolbar.tsx';
import { FormatSidebar } from './FormatSidebar.tsx';
import { parseMarkdownSlides } from '@/utils/markdown-parser.tsx';

// ai-era-slides.md 파일 import
import aiEraSlides from '@/../apps/ppt/ai-era-slides.md?raw';

// 초기 샘플 슬라이드 데이터 (fallback)
const fallbackSlides: Slide[] = [
  {
    id: '1',
    title: '프레젠테이션 제목',
    content: '부제목 또는 소개 내용',
    backgroundColor: '#ffffff',
  },
  {
    id: '2',
    title: '디자인 시스템',
    content: '레이어 기반 UI 구성',
    backgroundColor: '#e3f2fd',
  },
  {
    id: '3',
    title: '주요 기능',
    content: '컴포넌트 기반 아키텍처',
    backgroundColor: '#fff3e0',
  },
];

export const PresentationView = () => {
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [activeSlideId, setActiveSlideId] = useState<string>('1');

  // ai-era-slides.md 파일 로드 및 파싱
  useEffect(() => {
    try {
      const parsedSlides = parseMarkdownSlides(aiEraSlides);
      if (parsedSlides.length > 0) {
        setSlides(parsedSlides);
        setActiveSlideId(parsedSlides[0].id);
      }
    } catch (error) {
      console.error('Failed to parse markdown slides:', error);
      // fallback 슬라이드 사용
    }
  }, []);

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = slides.findIndex((s) => s.id === activeSlideId);

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Space
          e.preventDefault();
          // 다음 슬라이드
          if (currentIndex < slides.length - 1) {
            setActiveSlideId(slides[currentIndex + 1].id);
          }
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          // 이전 슬라이드
          if (currentIndex > 0) {
            setActiveSlideId(slides[currentIndex - 1].id);
          }
          break;

        case 'Home':
          e.preventDefault();
          // 첫 슬라이드
          if (slides.length > 0) {
            setActiveSlideId(slides[0].id);
          }
          break;

        case 'End':
          e.preventDefault();
          // 마지막 슬라이드
          if (slides.length > 0) {
            setActiveSlideId(slides[slides.length - 1].id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides, activeSlideId]);

  const activeSlide = slides.find((s) => s.id === activeSlideId) || null;
  const currentIndex = slides.findIndex((s) => s.id === activeSlideId);

  // 네비게이션 핸들러
  const handlePrevSlide = () => {
    if (currentIndex > 0) {
      setActiveSlideId(slides[currentIndex - 1].id);
    }
  };

  const handleNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      setActiveSlideId(slides[currentIndex + 1].id);
    }
  };

  const handlePlay = () => {
    // TODO: 전체화면 프레젠테이션 모드
    alert('전체화면 프레젠테이션 모드는 준비 중입니다!');
  };

  const handleSlideAdd = () => {
    const newId = (slides.length + 1).toString();
    const newSlide: Slide = {
      id: newId,
      title: `새 슬라이드 ${newId}`,
      content: '내용을 입력하세요',
      backgroundColor: '#ffffff',
    };
    setSlides([...slides, newSlide]);
    setActiveSlideId(newId);
  };

  const handleSlideDelete = (id: string) => {
    if (slides.length === 1) {
      // 마지막 슬라이드는 삭제 불가
      return;
    }

    const newSlides = slides.filter((s) => s.id !== id);
    setSlides(newSlides);

    // 삭제된 슬라이드가 활성화된 슬라이드였다면 첫 번째 슬라이드로 이동
    if (activeSlideId === id) {
      setActiveSlideId(newSlides[0].id);
    }
  };

  return (
    <>
      {/* Section[Header]: Presentation Toolbar */}
      <PresentationToolbar
        title={slides.length > 0 ? slides[0].title : undefined}
        onPrevSlide={handlePrevSlide}
        onNextSlide={handleNextSlide}
        onPlay={handlePlay}
        canGoPrev={currentIndex > 0}
        canGoNext={currentIndex < slides.length - 1}
      />

      {/* Section[Container]: Main Content Area */}
      <Section
        role="Container"
        prominence="Tertiary"
        className="flex flex-1 overflow-hidden"
      >
        {/* Section[Navigator]: Left Slide List */}
        <Section
          role="Navigator"
          prominence="Tertiary"
          className="w-64 border-r border-border bg-layer-2"
        >
          <SlideList
            slides={slides}
            activeSlideId={activeSlideId}
            onSlideSelect={setActiveSlideId}
            onSlideAdd={handleSlideAdd}
            onSlideDelete={handleSlideDelete}
          />
        </Section>

        {/* Section[Container]: Center Canvas */}
        <Section
          role="Container"
          prominence="Tertiary"
          className="flex-1"
        >
          <DSLSlideCanvas
            slide={activeSlide}
            currentIndex={currentIndex}
            totalSlides={slides.length}
          />
        </Section>

        {/* Section[Aside]: Right Format Sidebar - Always visible */}
        <Section
          role="Aside"
          prominence="Tertiary"
          className="w-80 border-l border-border bg-layer-2"
        >
          <FormatSidebar isOpen={true} />
        </Section>
      </Section>
    </>
  );
};
