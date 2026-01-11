/**
 * SortableList - Sortable List role renderer (v4.0)
 *
 * **SortableList의 특징**:
 * - 드래그 앤 드롭으로 아이템 순서 변경
 * - @dnd-kit/sortable 사용
 * - 밀도에 따른 gap 조절
 * - 드래그 중 시각적 피드백
 *
 * **사용 예시 (v1.0.2 - value 사용)**:
 * ```tsx
 * <Block
 *   role="SortableList"
 *   items={slides}
 *   value="id"
 *   onReorder={(reorderedSlides) => setSlides(reorderedSlides)}
 *   renderItem={(slide, index) => (
 *     <SlideCard slide={slide} index={index} />
 *   )}
 * />
 * ```
 *
 * **v1.0.2 변경사항**: `itemKey` → `value` (backward compatible)
 */

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type ReactNode, useCallback } from 'react';
import { cn } from '@/shared/lib/utils';
import type { BlockRendererProps } from '../../Block.types';

export interface SortableListProps extends BlockRendererProps {
  role: 'SortableList';
  items: any[];
  onReorder: (items: any[]) => void;
  value?: string; // v1.0.2: 아이템의 고유 식별자 필드명 (e.g., "id")
  renderItem: (item: any, index: number) => ReactNode;
}

/**
 * SortableItem - 개별 정렬 가능한 아이템 wrapper
 */
interface SortableItemProps {
  id: string | number;
  children: ReactNode;
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export function SortableList({
  children,
  computedDensity,
  computedProminence,
  computedIntent,
  Element,
  items = [],
  onReorder,
  value = 'id', // v1.0.2: 아이템의 고유 식별자 필드명 (기본값: 'id')
  renderItem,
  ...rest
}: SortableListProps) {
  const valueKey = value;
  // Density에 따른 gap 조절
  const densityGap = {
    Compact: 'gap-1',
    Standard: 'gap-2',
    Comfortable: 'gap-3',
  }[computedDensity];

  // Drag & Drop 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이동 후 드래그 시작 (클릭과 구분)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // 드래그 종료 핸들러
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => item[valueKey] === active.id);
        const newIndex = items.findIndex((item) => item[valueKey] === over.id);

        const reorderedItems = arrayMove(items, oldIndex, newIndex);
        onReorder(reorderedItems);
      }
    },
    [items, valueKey, onReorder]
  );

  // 아이템 ID 배열 생성
  const itemIds = items.map((item) => item[valueKey]);

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
        <Element
          className={cn(
            // Base SortableList styles
            'flex flex-col',
            densityGap
            // Custom className
          )}
          aria-label="Sortable List"
          data-dsl-component="block"
          data-role="SortableList"
          data-density={computedDensity}
          {...rest}
        >
          {items.map((item, index) => (
            <SortableItem key={item[valueKey]} id={item[valueKey]}>
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </Element>
      </SortableContext>
    </DndContext>
  );
}
