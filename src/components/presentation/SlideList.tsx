import { Layer } from '@/components/ui/Layer';
import { IconButton } from '@/components/ui/IconButton';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <Layer
      level={2}
      rounded="md"
      className="flex w-48 flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-1">
        <IconButton size="sm" onClick={onSlideAdd} title="슬라이드 추가">
          <Plus size={16} />
        </IconButton>
      </div>

      {/* Slide Thumbnails */}
      <div className="flex-1 overflow-y-auto px-1.5 pb-1.5">
        <div className="flex flex-col gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => onSlideSelect(slide.id)}
              className={cn(
                'group relative flex flex-col rounded transition-all',
                'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
                activeSlideId === slide.id
                  ? 'ring-1 ring-accent'
                  : 'hover:ring-1 hover:ring-border/50'
              )}
            >
              {/* Slide Number */}
              <div className="absolute left-0.5 top-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-sm bg-layer-0/90 text-[9px] font-medium text-text-secondary">
                {index + 1}
              </div>

              {/* Thumbnail Preview */}
              <Layer
                level={1}
                className={cn(
                  'aspect-[16/9] w-full overflow-hidden p-2',
                  'flex flex-col gap-0.5'
                )}
                style={{ backgroundColor: slide.backgroundColor }}
              >
                {/* Title Preview */}
                <div className="h-1.5 w-3/4 rounded-sm bg-text-primary/20" />
                {/* Content Preview */}
                <div className="h-1 w-full rounded-sm bg-text-secondary/15" />
                <div className="h-1 w-5/6 rounded-sm bg-text-secondary/15" />
              </Layer>

              {/* Delete Button - Shows on hover */}
              <div
                className={cn(
                  'absolute right-0.5 top-0.5 z-10 opacity-0 transition-opacity',
                  'group-hover:opacity-100'
                )}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSlideDelete(slide.id);
                  }}
                  title="슬라이드 삭제"
                  className="flex h-5 w-5 items-center justify-center rounded-sm bg-layer-0/90 text-text-tertiary transition-colors hover:bg-semantic-error hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layer>
  );
};
