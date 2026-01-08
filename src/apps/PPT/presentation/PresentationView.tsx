import { useState } from 'react';
import { Layer } from '@/components/ui/Layer';
import { SlideList, type Slide } from './SlideList';
import { SlideCanvas } from './SlideCanvas';
import { PresentationToolbar } from './PresentationToolbar';
import { FormatSidebar } from './FormatSidebar';

// 초기 샘플 슬라이드 데이터
const initialSlides: Slide[] = [
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
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [activeSlideId, setActiveSlideId] = useState<string>('1');
  const [showFormatSidebar, setShowFormatSidebar] = useState(false);

  const activeSlide = slides.find((s) => s.id === activeSlideId) || null;

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
    <Layer level={0} className="flex h-full w-full flex-col">
      {/* Presentation Toolbar */}
      <PresentationToolbar
        onToggleFormatSidebar={() => setShowFormatSidebar(!showFormatSidebar)}
        showFormatSidebar={showFormatSidebar}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Slide List - Left Sidebar */}
        <SlideList
          slides={slides}
          activeSlideId={activeSlideId}
          onSlideSelect={setActiveSlideId}
          onSlideAdd={handleSlideAdd}
          onSlideDelete={handleSlideDelete}
        />

        {/* Slide Canvas - Center */}
        <SlideCanvas slide={activeSlide} />

        {/* Format Sidebar - Right */}
        <FormatSidebar isOpen={showFormatSidebar} />
      </div>
    </Layer>
  );
};
