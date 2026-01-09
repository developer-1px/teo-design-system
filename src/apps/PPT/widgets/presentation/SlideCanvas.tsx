import { Section } from '@/components/Section/Section.tsx';
import { renderMarkdownContent } from '@/utils/markdown-parser.tsx';
import type { Slide } from './SlideList.tsx';

interface SlideCanvasProps {
  slide: Slide | null;
  onContentChange?: (content: string) => void;
}

export const SlideCanvas = ({ slide }: SlideCanvasProps) => {
  if (!slide) {
    return (
      <Section
        role="Container"
        prominence="Primary"
       
        className="flex flex-1 items-center justify-center"
      >
        <div className="text-center text-text-tertiary">
          <p className="text-sm">슬라이드를 선택하세요</p>
          <p className="mt-1 text-xs">
            왼쪽 목록에서 슬라이드를 선택하거나 새로 만드세요
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section role="Container" prominence="Primary" className="relative flex flex-1 flex-col overflow-hidden">
      {/* Canvas Container - Maintains aspect ratio */}
      <div className="flex flex-1 items-center justify-center p-6">
        {/* Slide Canvas - 16:9 aspect ratio */}
        <div className="relative w-full max-w-5xl">
          <div className="aspect-[16/9]">
            <Section
              role="Container"
              prominence="Tertiary"
              className="h-full w-full overflow-hidden p-8"
              style={{ backgroundColor: slide.backgroundColor }}
            >
              {/* Slide Content */}
              <div className="flex h-full flex-col gap-6">
                {/* Title Area */}
                <div className="border-b border-text-primary/10 pb-3">
                  <h1 className="text-3xl font-semibold text-text-primary">
                    {slide.title || '제목을 입력하세요'}
                  </h1>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-2 text-base">
                    {slide.content ? (
                      renderMarkdownContent(slide.content)
                    ) : (
                      <p className="text-text-tertiary">내용을 입력하세요</p>
                    )}
                  </div>
                </div>
              </div>
            </Section>
          </div>
        </div>
      </div>

      {/* Zoom Controls - Minimal, top-right */}
      <div className="absolute right-3 top-3">
        <select
          className="rounded bg-layer-0/80 px-2 py-0.5 text-xs text-text-secondary backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-accent"
          defaultValue="100"
        >
          <option value="50">50%</option>
          <option value="75">75%</option>
          <option value="100">100%</option>
          <option value="125">125%</option>
          <option value="150">150%</option>
        </select>
      </div>
    </Section>
  );
};
