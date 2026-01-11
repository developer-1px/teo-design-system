/**
 * PPTPage - Presentation View with IDDL v4.1
 *
 * IDDL Structure:
 * - Page role="App" template="3-col": 3열 레이아웃
 *   - Section role="Header": 상단 프레젠테이션 툴바
 *   - Section role="Navigator": 좌측 슬라이드 썸네일 리스트 (resizable)
 *   - Section role="Main": 중앙 슬라이드 캔버스
 *   - Section role="Aside": 우측 포맷 설정 사이드바 (resizable, collapsible)
 *
 * v2.0: 전체화면 프레젠테이션 모드 추가
 */

import { useEffect, useState } from 'react';
// ai-era-slides.md 파일 import
import aiEraSlides from '@/../apps/ppt/ai-era-slides.md?raw';
import { parseMarkdownSlides } from '@/apps/PPT/lib/markdown-parser';
import { DSLSlideCanvas } from '@/apps/PPT/widgets/presentation/DSLSlideCanvas.tsx';
import { FormatSidebar } from '@/apps/PPT/widgets/presentation/FormatSidebar.tsx';
import { PresentationToolbar } from '@/apps/PPT/widgets/presentation/PresentationToolbar.tsx';
import { type Slide, SlideList } from '@/apps/PPT/widgets/presentation/SlideList.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Overlay } from '@/components/types/Overlay/Overlay.tsx';
import { Page } from '@/components/types/Page/Page.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { PresentationModePage } from './PresentationModePage';

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

export const PPTPage = () => {
  const [title] = useState('AI 시대: 결정, 책임, 경험, 소통');
  const [slides, setSlides] = useState<Slide[]>(fallbackSlides);
  const [activeSlideId, setActiveSlideId] = useState<string>('1');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; intent: 'Critical' | 'Positive' | 'Info' } | null>(null);

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

  // v1.0.3: 키보드 네비게이션은 SlideList의 useSelection hook에서 처리
  // (ArrowUp/Down/Left/Right, Home, End 모두 통합)

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
    setIsPresentationMode(true);
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

  const handleSlideUpdate = (updates: Partial<Slide>) => {
    setSlides((prevSlides) =>
      prevSlides.map((slide) => (slide.id === activeSlideId ? { ...slide, ...updates } : slide))
    );
  };

  const handleSlideReorder = (reorderedSlides: Slide[]) => {
    setSlides(reorderedSlides);
  };

  // Selection handlers (v4.1)
  const handleSlidesDelete = (slidesToDelete: Slide[]) => {
    if (slides.length === slidesToDelete.length) {
      // 모든 슬라이드 삭제는 불가
      setToastMessage({ text: '마지막 슬라이드는 삭제할 수 없습니다.', intent: 'Critical' });
      return;
    }

    const deleteIds = new Set(slidesToDelete.map((s) => s.id));
    const newSlides = slides.filter((s) => !deleteIds.has(s.id));
    setSlides(newSlides);

    // 삭제된 슬라이드 중 활성화된 슬라이드가 있다면 첫 번째 슬라이드로 이동
    if (deleteIds.has(activeSlideId)) {
      setActiveSlideId(newSlides[0].id);
    }
  };

  const [clipboard, setClipboard] = useState<Slide[]>([]);

  const handleSlidesCopy = (slidesToCopy: Slide[]) => {
    setClipboard([...slidesToCopy]);
  };

  const handleSlidesCut = (slidesToCut: Slide[]) => {
    setClipboard([...slidesToCut]);
    handleSlidesDelete(slidesToCut);
  };

  const handleSlidesPaste = () => {
    if (clipboard.length === 0) return;

    // 새로운 ID 생성
    const maxId = Math.max(...slides.map((s) => parseInt(s.id, 10)));
    const newSlides = clipboard.map((slide, index) => ({
      ...slide,
      id: (maxId + index + 1).toString(),
    }));

    setSlides([...slides, ...newSlides]);
  };

  // Toolbar handlers
  const handleSave = () => {
    console.log('Saving presentation...', slides);
    setToastMessage({ text: '프레젠테이션이 저장되었습니다.', intent: 'Positive' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExport = () => {
    console.log('Exporting presentation...', slides);
    setToastMessage({ text: '프레젠테이션을 내보내는 중...', intent: 'Info' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSettings = () => {
    console.log('Opening settings...');
    setToastMessage({ text: '설정 기능은 준비 중입니다.', intent: 'Info' });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUndo = () => {
    console.log('Undo');
    setToastMessage({ text: '실행 취소', intent: 'Info' });
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleRedo = () => {
    console.log('Redo');
    setToastMessage({ text: '다시 실행', intent: 'Info' });
    setTimeout(() => setToastMessage(null), 2000);
  };

  // 프레젠테이션 모드 (전체화면)
  if (isPresentationMode) {
    return (
      <PresentationModePage
        slides={slides}
        initialSlideId={activeSlideId}
        onExit={() => setIsPresentationMode(false)}
        onSlideChange={setActiveSlideId}
      />
    );
  }

  // 편집 모드 (기본) - Refactored to Studio Layout (IDDL v5.0)
  return (
    <Page title="Presentation" role="Application" layout="Studio" density="Compact">
      {/* Header: Global Toolbar */}
      <Section role="Header">
        <PresentationToolbar
          title={title}
          onPrevSlide={handlePrevSlide}
          onNextSlide={handleNextSlide}
          onPlay={handlePlay}
          canGoPrev={currentIndex > 0}
          canGoNext={currentIndex < slides.length - 1}
          onSave={handleSave}
          onExport={handleExport}
          onSettings={handleSettings}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      </Section>

      {/* Primary Sidebar: Slide List */}
      <Section
        role="PrimarySidebar"
        resizable={{
          direction: 'horizontal',
          minSize: 150,
          maxSize: 300,
        }}
      >
        <SlideList
          slides={slides}
          activeSlideId={activeSlideId}
          onSlideSelect={setActiveSlideId}
          onSlideAdd={handleSlideAdd}
          onSlideDelete={handleSlideDelete}
          onReorder={handleSlideReorder}
          onSlidesDelete={handleSlidesDelete}
          onSlidesCopy={handleSlidesCopy}
          onSlidesCut={handleSlidesCut}
          onSlidesPaste={handleSlidesPaste}
        />
      </Section>

      {/* Editor: Slide Canvas */}
      <Section role="Editor">
        <DSLSlideCanvas
          slide={activeSlide}
          currentIndex={currentIndex}
          totalSlides={slides.length}
          editable={true}
          onSlideUpdate={handleSlideUpdate}
        />
      </Section>

      {/* Secondary Sidebar: Format Settings */}
      <Section
        role="SecondarySidebar"
        resizable={{
          direction: 'horizontal',
          minSize: 200,
          maxSize: 400,
        }}
      >
        <FormatSidebar
          isOpen={true}
          activeSlide={activeSlide || undefined}
          onSlideUpdate={handleSlideUpdate}
        />
      </Section>

      {/* Toast Messages */}
      {toastMessage && (
        <Overlay role="Toast" isOpen={true} intent={toastMessage.intent} onClose={() => setToastMessage(null)}>
          <Text role="Body" content={toastMessage.text} />
        </Overlay>
      )}
    </Page>
  );
};
