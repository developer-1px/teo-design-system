import { Layer } from '@/components/ui/Layer';
import { IconButton } from '@/components/ui/IconButton';
import { Button } from '@/components/ui/Button';
import {
  Type,
  Image,
  Square,
  Circle,
  Table,
  ChartBar,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Play,
  Undo,
  Redo,
} from 'lucide-react';

interface PresentationToolbarProps {
  onToggleFormatSidebar?: () => void;
  showFormatSidebar?: boolean;
}

export const PresentationToolbar = ({
  onToggleFormatSidebar,
  showFormatSidebar,
}: PresentationToolbarProps) => {
  return (
    <Layer level={4} className="flex items-center gap-3 border-b border-border px-2 py-0.5">
      {/* Insert Tools */}
      <div className="flex items-center gap-0.5">
        <IconButton size="sm" title="텍스트 상자">
          <Type size={18} />
        </IconButton>
        <IconButton size="sm" title="이미지">
          <Image size={18} />
        </IconButton>
        <IconButton size="sm" title="사각형">
          <Square size={18} />
        </IconButton>
        <IconButton size="sm" title="원">
          <Circle size={18} />
        </IconButton>
        <IconButton size="sm" title="표">
          <Table size={18} />
        </IconButton>
        <IconButton size="sm" title="차트">
          <ChartBar size={18} />
        </IconButton>
      </div>

      {/* Text Formatting */}
      <div className="flex items-center gap-0.5">
        <IconButton size="sm" title="굵게">
          <Bold size={18} />
        </IconButton>
        <IconButton size="sm" title="기울임">
          <Italic size={18} />
        </IconButton>
        <IconButton size="sm" title="밑줄">
          <Underline size={18} />
        </IconButton>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-0.5">
        <IconButton size="sm" title="왼쪽 정렬">
          <AlignLeft size={18} />
        </IconButton>
        <IconButton size="sm" title="가운데 정렬">
          <AlignCenter size={18} />
        </IconButton>
        <IconButton size="sm" title="오른쪽 정렬">
          <AlignRight size={18} />
        </IconButton>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5">
        <IconButton size="sm" title="실행 취소">
          <Undo size={18} />
        </IconButton>
        <IconButton size="sm" title="다시 실행">
          <Redo size={18} />
        </IconButton>
      </div>

      {/* Format Sidebar Toggle */}
      <IconButton
        size="sm"
        active={showFormatSidebar}
        onClick={onToggleFormatSidebar}
        title="포맷"
      >
        <Palette size={18} />
      </IconButton>

      {/* Play Presentation */}
      <IconButton size="sm" title="재생" className="text-accent">
        <Play size={18} />
      </IconButton>
    </Layer>
  );
};
