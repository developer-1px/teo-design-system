# PPT 썸네일: Navigable + Selectable 통합 예제

## 📋 요약

**목표**: PPT 썸네일 리스트에 Navigable + Selectable behavior 적용

**핵심 시나리오**:
1. ↑↓로 슬라이드 탐색 → Enter로 편집 모드
2. Shift+클릭으로 범위 선택 → Delete로 일괄 삭제
3. 포커스와 선택 상태를 시각적으로 명확히 구분

---

## 사용자 시나리오

### 시나리오 1: 슬라이드 편집

```
사용자: "3번 슬라이드를 편집하고 싶어"

1. ↓↓ 누름 → Slide 3으로 포커스 이동 (Navigable)
2. Enter 누름 → Slide 3 편집 모드 진입
3. 편집 완료
4. Esc 누름 → 썸네일 목록으로 복귀 (포커스 유지)
```

**기대 동작**:
- 포커스가 Slide 3에 남아있음
- 다시 ↓를 누르면 Slide 4로 이동

### 시나리오 2: 슬라이드 삭제 (단일)

```
사용자: "5번 슬라이드를 삭제하고 싶어"

1. ↓↓↓↓ 누름 → Slide 5로 포커스 이동
2. Space 누름 → Slide 5 선택됨 (체크마크 표시)
3. Delete 누름 → 삭제 확인 다이얼로그
4. Enter 누름 → Slide 5 삭제됨
```

**기대 동작**:
- Slide 5 삭제 후 포커스는 Slide 6 (이전 인덱스 5)로 이동
- 선택 상태는 초기화

### 시나리오 3: 슬라이드 범위 삭제

```
사용자: "3~7번 슬라이드를 한꺼번에 삭제하고 싶어"

방법 1: Shift+클릭
  1. Slide 3 클릭 → Slide 3 선택됨
  2. Shift+클릭 Slide 7 → Slide 3~7 모두 선택됨
  3. Delete 누름 → 일괄 삭제

방법 2: 키보드
  1. ↓↓ 누름 → Slide 3으로 포커스 이동
  2. Space 누름 → Slide 3 선택됨
  3. Shift+↓↓↓↓ 누름 → Slide 3~7 범위 선택
  4. Delete 누름 → 일괄 삭제
```

**기대 동작**:
- 5개 슬라이드가 한 번에 삭제됨
- 포커스는 Slide 8 (이전 인덱스 3)로 이동

### 시나리오 4: 개별 슬라이드 선택

```
사용자: "2, 5, 8번 슬라이드만 선택하고 싶어"

1. Slide 2 클릭 → Slide 2 선택됨
2. Cmd+클릭 Slide 5 → Slide 2, 5 선택됨
3. Cmd+클릭 Slide 8 → Slide 2, 5, 8 선택됨
4. Delete 누름 → 3개 슬라이드 삭제
```

**기대 동작**:
- 연속되지 않은 슬라이드들 선택 가능
- 각 선택마다 체크마크 표시

---

## IDDL 코드

### 완전한 예제

```tsx
// src/apps/PPT/pages/ppt/PPTPage.tsx

import { useState } from 'react';
import { Block } from '@/components/types/Block/Block';
import { Item } from '@/components/types/Element/Item'; // 가정
import { Text } from '@/components/types/Element/Text/Text.v2';
import { ThumbnailPreview } from '../../widgets/ThumbnailPreview';

export function PPTPage() {
  const [slides, setSlides] = useState([
    { id: '1', title: 'Introduction', content: '...' },
    { id: '2', title: 'Agenda', content: '...' },
    { id: '3', title: 'Background', content: '...' },
    // ... more slides
  ]);

  const [selectedSlides, setSelectedSlides] = useState<Set<string>>(new Set());
  const [editingSlide, setEditingSlide] = useState<string | null>(null);

  // 삭제 핸들러
  const handleDelete = () => {
    setSlides(prev => prev.filter(slide => !selectedSlides.has(slide.id)));
    setSelectedSlides(new Set());
  };

  // 편집 모드 진입 (Enter 키)
  const handleActivate = (slideId: string) => {
    setEditingSlide(slideId);
  };

  return (
    <div className="flex h-screen">
      {/* Thumbnail List (Left sidebar) */}
      <aside className="w-64 bg-surface border-r border-border">
        <Block
          role="List"
          behavior={{
            navigable: true,           // ↑↓로 포커스 이동
            selectable: {              // Space로 선택
              mode: 'multiple',
              selected: selectedSlides,
              onSelectionChange: setSelectedSlides,
            },
          }}
          onActivate={handleActivate}  // Enter 키
          onDelete={handleDelete}       // Delete 키
        >
          {slides.map((slide, index) => (
            <Item
              key={slide.id}
              selected={selectedSlides.has(slide.id)}
              editing={editingSlide === slide.id}
              className="p-2 cursor-pointer"
            >
              <ThumbnailPreview slide={slide} />
              <Text role="Caption" content={`Slide ${index + 1}`} />
              <Text role="Caption" content={slide.title} prominence="Subtle" />
            </Item>
          ))}
        </Block>
      </aside>

      {/* Editor (Main area) */}
      <main className="flex-1 bg-surface-base">
        {editingSlide ? (
          <SlideEditor slideId={editingSlide} onClose={() => setEditingSlide(null)} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Text role="Body" content="Select a slide to edit" prominence="Subtle" />
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## 생성될 HTML

```html
<aside class="w-64 bg-surface border-r border-border">
  <div
    role="listbox"
    aria-multiselectable="true"
    aria-activedescendant="slide-2"
    aria-label="Slide thumbnails"
    tabindex="0"
    data-navigable="true"
    data-selectable="multiple"
  >
    <!-- Slide 1: 선택 안됨, 포커스 안됨 -->
    <div
      role="option"
      id="slide-0"
      aria-selected="false"
      class="p-2 cursor-pointer"
    >
      <img src="..." alt="Slide 1 thumbnail" class="w-full h-32 object-cover rounded" />
      <span class="text-sm text-text-muted">Slide 1</span>
      <span class="text-xs text-text-subtle">Introduction</span>
    </div>

    <!-- Slide 2: 선택됨, 포커스 안됨 -->
    <div
      role="option"
      id="slide-1"
      aria-selected="true"
      data-selected="true"
      class="p-2 cursor-pointer"
    >
      <img src="..." alt="Slide 2 thumbnail" class="w-full h-32 object-cover rounded" />
      <span class="text-sm text-text-muted">Slide 2</span>
      <span class="text-xs text-text-subtle">Agenda</span>
      <!-- 체크마크 표시 -->
      <div class="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
        <svg>...</svg> <!-- CheckIcon -->
      </div>
    </div>

    <!-- Slide 3: 포커스됨, 선택됨 -->
    <div
      role="option"
      id="slide-2"
      aria-selected="true"
      data-selected="true"
      data-focused="true"
      class="p-2 cursor-pointer"
    >
      <img src="..." alt="Slide 3 thumbnail" class="w-full h-32 object-cover rounded" />
      <span class="text-sm text-text-muted">Slide 3</span>
      <span class="text-xs text-text-subtle">Background</span>
      <!-- 체크마크 표시 -->
      <div class="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
        <svg>...</svg> <!-- CheckIcon -->
      </div>
    </div>

    <!-- ... more slides -->
  </div>
</aside>
```

---

## 시각적 피드백 (CSS)

```css
/* Base thumbnail styles */
[role="option"] {
  position: relative;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

/* Hover state */
[role="option"]:hover {
  background: var(--surface-hover);
}

/* 포커스 상태 (Navigable) */
[role="option"][data-focused="true"] {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  background: var(--surface-sunken);
}

/* 선택 상태 (Selectable) */
[role="option"][data-selected="true"] {
  background: var(--accent-muted);
  border: 2px solid var(--accent);
}

/* 포커스 + 선택 (둘 다) */
[role="option"][data-focused="true"][data-selected="true"] {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
  background: var(--accent-muted);
  border: 2px solid var(--accent);
}

/* 편집 중 상태 */
[role="option"][data-editing="true"] {
  background: var(--accent-strong);
  border: 2px solid var(--accent);
}

/* 체크마크 (선택됨 표시) */
[role="option"][data-selected="true"]::before {
  content: "";
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  background: var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

[role="option"][data-selected="true"]::after {
  content: "✓";
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
```

---

## 키보드 조작 흐름

### 초기 상태
```
Slide 1 (포커스, 선택 안됨)
Slide 2 (포커스 안됨, 선택 안됨)
Slide 3 (포커스 안됨, 선택 안됨)
```

### 조작 1: 포커스 이동 (Navigable)
```
↓ 누름:
  Slide 1 (포커스 안됨, 선택 안됨)
  Slide 2 (포커스, 선택 안됨)  ← 포커스 이동
  Slide 3 (포커스 안됨, 선택 안됨)
```

### 조작 2: 선택 (Selectable)
```
Space 누름:
  Slide 1 (포커스 안됨, 선택 안됨)
  Slide 2 (포커스, 선택됨)  ← 선택 토글
  Slide 3 (포커스 안됨, 선택 안됨)
```

### 조작 3: 포커스 이동 (선택 유지)
```
↓ 누름:
  Slide 1 (포커스 안됨, 선택 안됨)
  Slide 2 (포커스 안됨, 선택됨)  ← 선택 상태 유지
  Slide 3 (포커스, 선택 안됨)     ← 포커스 이동
```

### 조작 4: 범위 선택
```
Shift+↓ 누름:
  Slide 1 (포커스 안됨, 선택 안됨)
  Slide 2 (포커스 안됨, 선택됨)
  Slide 3 (포커스 안됨, 선택됨)  ← 기존 선택 유지
  Slide 4 (포커스, 선택됨)        ← 범위 확장
```

### 조작 5: 전체 선택
```
Ctrl+A 누름:
  Slide 1 (포커스 안됨, 선택됨)
  Slide 2 (포커스 안됨, 선택됨)
  Slide 3 (포커스 안됨, 선택됨)
  Slide 4 (포커스, 선택됨)
```

### 조작 6: 선택 해제
```
Escape 누름:
  Slide 1 (포커스 안됨, 선택 안됨)
  Slide 2 (포커스 안됨, 선택 안됨)
  Slide 3 (포커스 안됨, 선택 안됨)
  Slide 4 (포커스, 선택 안됨)     ← 포커스는 유지
```

---

## 구현 코드

### Hook: useNavigableSelection (통합)

```tsx
// src/shared/lib/keyboard/useNavigableSelection.ts (새로 작성)

import { useState, useCallback } from 'react';
import { useNavigableCursor } from './useNavigableCursor';
import { useSelection } from './useSelection';

interface UseNavigableSelectionOptions<T> {
  items: T[];
  getId: (item: T) => string;
  mode: 'single' | 'multiple';
  onActivate?: (id: string) => void;  // Enter 키
  onDelete?: () => void;               // Delete 키
}

export function useNavigableSelection<T>({
  items,
  getId,
  mode,
  onActivate,
  onDelete,
}: UseNavigableSelectionOptions<T>) {
  // Navigable: 포커스 관리
  const { cursor, handleKeyDown: handleNavigableKeyDown } = useNavigableCursor(items);

  // Selectable: 선택 관리
  const {
    selected,
    selectSingle,
    toggleSelect,
    selectRange,
    selectAll,
    clearSelection,
    isSelected,
  } = useSelection({ mode, items, getId });

  // 통합 키보드 핸들러
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const focusedId = getId(items[cursor]);

      // Navigable: ↑↓ 이동
      if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
        handleNavigableKeyDown(e);
        return;
      }

      // Selectable: Space (선택 토글)
      if (e.key === ' ') {
        e.preventDefault();
        if (mode === 'single') {
          selectSingle(focusedId);
        } else {
          toggleSelect(focusedId);
        }
        return;
      }

      // Selectable: Shift+화살표 (범위 선택)
      if (e.shiftKey && ['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        // TODO: 범위 선택 로직
        return;
      }

      // Selectable: Ctrl+A (전체 선택)
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        if (mode === 'multiple') {
          selectAll();
        }
        return;
      }

      // Selectable: Escape (선택 해제)
      if (e.key === 'Escape') {
        clearSelection();
        return;
      }

      // Activate: Enter (편집 모드 등)
      if (e.key === 'Enter') {
        e.preventDefault();
        onActivate?.(focusedId);
        return;
      }

      // Delete: Delete 키 (삭제)
      if (e.key === 'Delete') {
        e.preventDefault();
        if (selected.size > 0) {
          onDelete?.();
        }
        return;
      }
    },
    [cursor, items, mode, selected, getId, handleNavigableKeyDown, selectSingle, toggleSelect, selectAll, clearSelection, onActivate, onDelete]
  );

  return {
    cursor,
    selected,
    handleKeyDown,
    isSelected,
    isFocused: (id: string) => getId(items[cursor]) === id,
  };
}
```

### Component: ThumbnailList

```tsx
// src/apps/PPT/widgets/ThumbnailList.tsx (새로 작성)

import { useNavigableSelection } from '@/shared/lib/keyboard/useNavigableSelection';
import { Text } from '@/components/types/Element/Text/Text.v2';
import { Check } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  content: string;
}

interface ThumbnailListProps {
  slides: Slide[];
  selectedSlides: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onActivate: (slideId: string) => void;
  onDelete: () => void;
  editingSlide: string | null;
}

export function ThumbnailList({
  slides,
  selectedSlides,
  onSelectionChange,
  onActivate,
  onDelete,
  editingSlide,
}: ThumbnailListProps) {
  const { cursor, selected, handleKeyDown, isSelected, isFocused } = useNavigableSelection({
    items: slides,
    getId: (slide) => slide.id,
    mode: 'multiple',
    onActivate,
    onDelete,
  });

  return (
    <div
      role="listbox"
      aria-multiselectable="true"
      aria-activedescendant={`slide-${cursor}`}
      aria-label="Slide thumbnails"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-64 bg-surface border-r border-border overflow-y-auto"
    >
      {slides.map((slide, index) => {
        const selected = isSelected(slide.id);
        const focused = isFocused(slide.id);
        const editing = editingSlide === slide.id;

        return (
          <div
            key={slide.id}
            id={`slide-${index}`}
            role="option"
            aria-selected={selected}
            data-selected={selected}
            data-focused={focused}
            data-editing={editing}
            className="relative p-2 cursor-pointer rounded-lg transition-all"
          >
            {/* Thumbnail Preview */}
            <div className="w-full h-32 bg-surface-sunken rounded overflow-hidden mb-2">
              <img
                src={slide.thumbnail || '/placeholder-slide.png'}
                alt={`Slide ${index + 1} thumbnail`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Slide Info */}
            <Text role="Caption" content={`Slide ${index + 1}`} />
            <Text role="Caption" content={slide.title} prominence="Subtle" />

            {/* 체크마크 (선택됨) */}
            {selected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                <Check size={16} className="text-white" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

---

## 테스트 시나리오

### Test 1: 기본 네비게이션
```
Given: 10개 슬라이드가 있음
When: ↓ 키를 3번 누름
Then: Slide 4에 포커스됨 (outline 표시)
```

### Test 2: 단일 선택
```
Given: Slide 4에 포커스됨
When: Space 키를 누름
Then: Slide 4가 선택됨 (체크마크 표시)
```

### Test 3: 포커스 이동 (선택 유지)
```
Given: Slide 4 선택됨, 포커스됨
When: ↓ 키를 누름
Then: Slide 5에 포커스 이동, Slide 4는 여전히 선택됨
```

### Test 4: 범위 선택
```
Given: Slide 2 선택됨
When: Shift+클릭 Slide 5
Then: Slide 2, 3, 4, 5 모두 선택됨
```

### Test 5: 전체 선택
```
Given: 10개 슬라이드
When: Ctrl+A 누름
Then: 모든 슬라이드 선택됨
```

### Test 6: 삭제
```
Given: Slide 3, 4, 5 선택됨
When: Delete 키 누름
Then: 3개 슬라이드 삭제됨, 포커스는 Slide 6 (이전 인덱스 3)으로 이동
```

---

## 접근성 검증

### Screen Reader 테스트

**NVDA (Windows)**:
```
포커스 이동: "Slide 3, option, 3 of 10"
선택: "Slide 3, selected"
포커스 + 선택: "Slide 3, selected, 3 of 10"
```

**VoiceOver (macOS)**:
```
포커스 이동: "Slide 3, listbox option, 3 of 10"
선택: "Slide 3, selected"
다중 선택: "3 items selected"
```

### 키보드 전용 테스트

```
✅ Tab으로 썸네일 리스트 포커스
✅ ↑↓로 슬라이드 탐색
✅ Space로 선택
✅ Enter로 편집 모드
✅ Delete로 삭제
✅ Escape로 선택 해제
✅ 마우스 없이 모든 작업 가능
```

---

## 다음 단계

### Phase 1: 기본 구현
- [ ] `useNavigableSelection` hook 작성
- [ ] `ThumbnailList` 컴포넌트 작성
- [ ] ARIA 접근성 완전 구현
- [ ] 시각적 피드백 CSS

### Phase 2: 고급 기능
- [ ] Shift+화살표 범위 선택
- [ ] Drag & Drop 순서 변경 (Reorderable)
- [ ] Context menu (우클릭)
- [ ] 썸네일 미리보기 확대

### Phase 3: 통합 테스트
- [ ] Screen reader 테스트
- [ ] 키보드 전용 테스트
- [ ] 성능 테스트 (100+ 슬라이드)
- [ ] 실제 사용자 테스트

---

**작성일**: 2026-01-11
**상태**: ✅ 스펙 완료
**다음**: useNavigableSelection hook 구현
