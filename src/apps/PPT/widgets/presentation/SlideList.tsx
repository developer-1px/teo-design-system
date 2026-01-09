/**
 * SlideList - IDDL 기반 슬라이드 리스트
 *
 * IDDL Group을 사용한 구조:
 * - Group[Container]: 전체 컨테이너
 *   - Group[Toolbar]: 상단 액션 버튼
 *   - Group[List]: 슬라이드 썸네일 리스트
 */

import { Group } from '@/components/Group/Group.tsx';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils.ts';
import { SlidePreview } from './SlidePreview';

export interface Slide {
  id: string;
  title: string;
  content: string;
  backgroundColor: string;
}

interface SlideListProps {
  slides: Slide[];
  activeSlideId: string;
  onSlideSelect: (id: string) => void;
  onSlideAdd: () => void;
  onSlideDelete: (id: string) => void;
}

export const SlideList = ({
  slides,
  activeSlideId,
  onSlideSelect,
  onSlideAdd,
  onSlideDelete,
}: SlideListProps) => {
  return (
    <Group
      role="Container"
      layout="stack"
      density="Compact"
      className="h-full w-full overflow-hidden bg-layer-2"
    >
      {/* Group[Toolbar]: Header with Add Button */}
      <Group
        role="Toolbar"
        layout="inline"
        density="Compact"
        className="justify-start px-2 py-1.5 border-b border-border"
      >
        <button
          onClick={onSlideAdd}
          className="flex h-7 w-7 items-center justify-center rounded hover:bg-layer-3 transition-colors text-text-secondary hover:text-accent"
          title="슬라이드 추가"
        >
          <Plus size={16} />
        </button>
      </Group>

      {/* Group[List]: Slide Thumbnails */}
      <Group
        role="List"
        layout="stack"
        density="Compact"
        className="flex-1 overflow-y-auto px-2 py-2 gap-2"
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            role="button"
            tabIndex={0}
            onClick={() => onSlideSelect(slide.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSlideSelect(slide.id);
              }
            }}
            className={cn(
              'group relative flex flex-col rounded transition-all cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
              activeSlideId === slide.id
                ? 'ring-2 ring-accent shadow-sm'
                : 'ring-1 ring-border/30 hover:ring-accent/50 hover:shadow-sm'
            )}
          >
            {/* Slide Number Badge */}
            <div className="absolute left-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded bg-layer-0/95 text-[10px] font-semibold text-text-secondary shadow-sm">
              {index + 1}
            </div>

            {/* Thumbnail Preview - Real slide content scaled down */}
            <div
              className={cn(
                'aspect-[16/9] w-full overflow-hidden rounded',
                'bg-layer-1'
              )}
            >
              <SlidePreview slide={slide} scale={0.15} />
            </div>

            {/* Delete Button - Shows on hover */}
            <div
              className={cn(
                'absolute right-1 top-1 z-10 opacity-0 transition-opacity',
                'group-hover:opacity-100'
              )}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSlideDelete(slide.id);
                }}
                title="슬라이드 삭제"
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded',
                  'bg-layer-0/95 text-text-tertiary shadow-sm',
                  'hover:bg-red-500 hover:text-white',
                  'transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
                )}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </Group>
    </Group>
  );
};
