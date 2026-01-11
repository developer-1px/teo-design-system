/**
 * SlideList - IDDL 기반 슬라이드 리스트 (Pure IDDL v4.0 with Selection)
 *
 * IDDL Block을 사용한 구조:
 * - Block[Container]: 전체 컨테이너
 *   - Block[Toolbar]: 상단 액션 버튼
 *   - Block[SortableList]: 정렬 가능한 슬라이드 썸네일 리스트 (Drag & Drop)
 *
 * v3.1: 모든 수동 className 제거, role 기반 minimal 디자인
 * v4.0: Block role="SortableList" 적용 (드래그 앤 드롭)
 * v4.1: useSelection hook 적용 (상용 앱 수준 선택 관리)
 *       - 단일/멀티 선택, Shift 범위 선택
 *       - Cmd+C/X/V (복사/잘라내기/붙여넣기)
 *       - Delete (삭제)
 *       - Cmd+A (전체 선택)
 * v1.0.3: 키보드 네비게이션 통합 (ArrowUp/Down/Left/Right, Home, End)
 * v1.0.4: Focus management 통합 (브라우저 포커스 자동 이동)
 */

import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { useSelection } from '@/shared/lib/selection/useSelection';
import { SlidePreview } from './SlidePreview';

export interface Slide {
  id: string;
  title: string;
  content: string;
  backgroundColor: string;
  // Format properties
  fontFamily?: string;
  fontSize?: number;
  textColor?: string;
}

interface SlideListProps {
  slides: Slide[];
  activeSlideId: string;
  onSlideSelect: (id: string) => void;
  onSlideAdd: () => void;
  onSlideDelete: (id: string) => void;
  onReorder?: (slides: Slide[]) => void; // v4.0: 드래그 앤 드롭으로 순서 변경
  // v4.1: Selection management (optional)
  onSlidesDelete?: (slides: Slide[]) => void; // 멀티 삭제
  onSlidesCopy?: (slides: Slide[]) => void; // 복사
  onSlidesCut?: (slides: Slide[]) => void; // 잘라내기
  onSlidesPaste?: (slides: Slide[]) => void; // 붙여넣기
}

export const SlideList = ({
  slides,
  activeSlideId,
  onSlideSelect,
  onSlideAdd,
  onSlideDelete,
  onReorder,
  onSlidesDelete,
  onSlidesCopy,
  onSlidesCut,
  onSlidesPaste,
}: SlideListProps) => {
  // Selection management (v4.1 → v1.0.3: keyboard navigation 통합)
  const selection = useSelection({
    items: slides,
    getId: (slide) => slide.id,
    initialSelectedIds: [activeSlideId],
    onCopy: onSlidesCopy,
    onCut: onSlidesCut,
    onPaste: onSlidesPaste,
    onDelete: onSlidesDelete,
    onSelectionChange: (selectedSlides) => {
      // 단일 선택 시 activeSlideId 업데이트
      if (selectedSlides.length === 1) {
        onSlideSelect(selectedSlides[0].id);
      }
    },
    // v1.0.3: 키보드 네비게이션 (ArrowUp/Down/Left/Right, Home, End)
    keyboardNavigation: true,
    onNavigate: (slide) => {
      onSlideSelect(slide.id);
    },
  });

  // v1.0.2: SelectionModel 객체 생성 (Block value prop과 함께 사용)
  // v1.0.4: Focus management 추가
  const selectionModel = {
    selectedValues: selection.selectedIds,
    isSelected: selection.isSelected,
    handleItemClick: selection.handleItemClick,
    registerItemRef: selection.registerItemRef,
  };

  const { role: ariaRole, ...containerProps } = selection.getContainerProps();

  return (
    <Block role="Container" density="Comfortable" {...containerProps} className="p-3">
      {/* Toolbar: Add Button */}
      <Block role="Toolbar" density="Comfortable" className="mb-3">
        <Action icon="Plus" onClick={onSlideAdd} />
        {selection.selectedItems.length > 0 && (
          <Text role="Caption" prominence="Subtle">
            {selection.selectedItems.length} selected
          </Text>
        )}
      </Block>

      {/* Sortable Slide List (v4.0) with Selection (v4.1 → v1.0.2 simplified) */}
      <Block
        role="SortableList"
        density="Comfortable"
        items={slides}
        value="id"
        onReorder={onReorder}
        className="gap-3"
        renderItem={(slide: Slide, index: number) => {
          return (
            <Block
              role="Card"
              density="Compact"
              prominence="Standard"
              intent="Neutral"
              value={slide.id}
              selectionModel={selectionModel}
              className="group relative bg-white border-2 border-border rounded-md shadow-sm hover:border-border-emphasis hover:shadow-md data-[selected=true]:border-accent data-[selected=true]:shadow-lg data-[selected=true]:ring-2 data-[selected=true]:ring-accent/20 transition-all duration-200 cursor-move overflow-hidden"
            >
              {/* Slide Number Badge - Absolute positioned */}
              <Block
                role="Container"
                className="absolute top-1.5 left-1.5 z-10 bg-layer-1/90 backdrop-blur-sm rounded px-1.5 py-0.5 shadow-sm"
              >
                <Text role="Caption" prominence="Strong" className="font-semibold text-[10px] leading-none">
                  {index + 1}
                </Text>
              </Block>

              {/* Thumbnail Container */}
              <Block role="Container" className="aspect-[16/9] overflow-hidden bg-layer-0">
                <SlidePreview slide={slide} scale={0.15} />
              </Block>

              {/* Slide Title - Bottom overlay */}
              <Block
                role="Container"
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Text role="Caption" className="text-white text-[10px] font-medium truncate leading-tight">
                  {slide.title || '제목 없음'}
                </Text>
              </Block>
            </Block>
          );
        }}
      />
    </Block>
  );
};
