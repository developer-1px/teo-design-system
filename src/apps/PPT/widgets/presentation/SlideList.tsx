/**
 * SlideList - IDDL 기반 슬라이드 리스트 (Pure IDDL v4.0 with Selection)
 *
 * IDDL Group을 사용한 구조:
 * - Group[Container]: 전체 컨테이너
 *   - Group[Toolbar]: 상단 액션 버튼
 *   - Group[SortableList]: 정렬 가능한 슬라이드 썸네일 리스트 (Drag & Drop)
 *
 * v3.1: 모든 수동 className 제거, role 기반 minimal 디자인
 * v4.0: Group role="SortableList" 적용 (드래그 앤 드롭)
 * v4.1: useSelection hook 적용 (상용 앱 수준 선택 관리)
 *       - 단일/멀티 선택, Shift 범위 선택
 *       - Cmd+C/X/V (복사/잘라내기/붙여넣기)
 *       - Delete (삭제)
 *       - Cmd+A (전체 선택)
 * v1.0.3: 키보드 네비게이션 통합 (ArrowUp/Down/Left/Right, Home, End)
 * v1.0.4: Focus management 통합 (브라우저 포커스 자동 이동)
 */

import { Group } from '@/components/types/Group/Group.tsx';
import { Action } from '@/components/types/Atom/Action/Action';
import { Text } from '@/components/types/Atom/Text/Text';
import { SlidePreview } from './SlidePreview';
import { useSelection } from '@/shared/lib/selection/useSelection';

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

  // v1.0.2: SelectionModel 객체 생성 (Group value prop과 함께 사용)
  // v1.0.4: Focus management 추가
  const selectionModel = {
    selectedValues: selection.selectedIds,
    isSelected: selection.isSelected,
    handleItemClick: selection.handleItemClick,
    registerItemRef: selection.registerItemRef,
  };

  return (
    <Group
      role="Container"
      layout="stack"
      density="Compact"
      {...selection.getContainerProps()}
    >
      {/* Toolbar: Add Button */}
      <Group role="Toolbar" layout="inline" density="Compact">
        <Action icon="Plus" onClick={onSlideAdd} />
        {selection.selectedItems.length > 0 && (
          <Text role="Caption" prominence="Subtle">
            {selection.selectedItems.length} selected
          </Text>
        )}
      </Group>

      {/* Sortable Slide List (v4.0) with Selection (v4.1 → v1.0.2 simplified) */}
      {onReorder ? (
        <Group
          role="SortableList"
          density="Compact"
          className="flex-1 overflow-y-auto"
          items={slides}
          value="id"
          onReorder={onReorder}
          renderItem={(slide: Slide, index: number) => {
            return (
              <Group
                role="Card"
                density="Compact"
                prominence="Standard"
                intent="Neutral"
                value={slide.id}
                selectionModel={selectionModel}
                className="cursor-move !bg-white border border-border hover:border-border-emphasis data-[selected=true]:border-accent data-[selected=true]:ring-1 data-[selected=true]:ring-accent/20 transition-all"
              >
                {/* Slide Number + Thumbnail as one group */}
                <div className="flex flex-col gap-1">
                  {/* Slide Number */}
                  <Text role="Caption" prominence="Subtle" className="px-1">
                    {index + 1}
                  </Text>

                  {/* Thumbnail */}
                  <div className="aspect-[16/9] w-full overflow-hidden rounded">
                    <SlidePreview slide={slide} scale={0.15} />
                  </div>
                </div>
              </Group>
            );
          }}
        />
      ) : (
        // Fallback: Non-sortable list (if onReorder is not provided) with Selection (v1.0.2 simplified)
        <Group role="List" layout="stack" density="Compact" className="flex-1 overflow-y-auto">
          {slides.map((slide, index) => {
            return (
              <Group
                key={slide.id}
                role="Card"
                density="Compact"
                prominence="Standard"
                intent="Neutral"
                value={slide.id}
                selectionModel={selectionModel}
                className="!bg-white border border-border hover:border-border-emphasis data-[selected=true]:border-accent data-[selected=true]:ring-1 data-[selected=true]:ring-accent/20 transition-all"
              >
                {/* Slide Number + Thumbnail as one group */}
                <div className="flex flex-col gap-1">
                  {/* Slide Number */}
                  <Text role="Caption" prominence="Subtle" className="px-1">
                    {index + 1}
                  </Text>

                  {/* Thumbnail */}
                  <div className="aspect-[16/9] w-full overflow-hidden rounded">
                    <SlidePreview slide={slide} scale={0.15} />
                  </div>
                </div>
              </Group>
            );
          })}
        </Group>
      )}
    </Group>
  );
};
