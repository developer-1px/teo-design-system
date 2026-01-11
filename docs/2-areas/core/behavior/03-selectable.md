# Selectable: 선택 Behavior

## 📋 요약

**Intent**: "사용자가 조작할 대상을 명시적으로 지정할 수 있어야 한다"

**Why**: 액션을 적용할 대상을 선택해야 함 (삭제, 복사, 이동 등)

**How**: Click, Space, Shift+범위, Ctrl+A (전체 선택)

---

## Why: 왜 선택이 필요한가?

### 1. 명시적 대상 지정

```
웹 (링크 클릭):
  클릭 → 즉시 이동 (선택 개념 없음)

앱 (파일 선택):
  선택 → 확인 → 삭제
  선택 상태를 유지한 채 다른 액션 가능
```

**차이점**:
- 웹: 클릭 = 액션 (즉시 실행)
- 앱: 선택 ≠ 액션 (대상 지정 후 별도 액션)

### 2. 일괄 처리 (Batch Operations)

```
시나리오: 슬라이드 10개 삭제

웹 방식:
  슬라이드 1 클릭 → 삭제 → 확인
  슬라이드 2 클릭 → 삭제 → 확인
  ...
  (10번 반복)

앱 방식:
  Shift+클릭으로 1-10 범위 선택 → Delete 키
  (1번에 끝)
```

**생산성 차이**: 10배 이상

### 3. 명확한 피드백

```
선택 상태 = 시각적 피드백

"지금 어떤 슬라이드가 선택되어 있지?"
→ 선택된 항목이 강조됨 (배경색, 체크마크, 외곽선)

"Delete 누르면 뭐가 삭제되지?"
→ 선택된 항목들만 삭제됨 (명확함)
```

---

## What: 선택 패턴의 종류

### 1. Single Selection (단일 선택)

**Use case**: 라디오 버튼, 드롭다운, 슬라이드 편집

```tsx
<Block role="List" behavior={{ selectable: 'single' }}>
  <Item>Option 1</Item>  {/* 선택됨 */}
  <Item>Option 2</Item>  {/* 선택 안됨 */}
  <Item>Option 3</Item>  {/* 선택 안됨 */}
</Block>
```

**특징**:
- 한 번에 하나만 선택 가능
- 새로운 항목 선택 → 기존 선택 해제
- 필수 선택 (항상 하나는 선택됨)

**예제**: PPT 편집 (현재 편집 중인 슬라이드 1개)

### 2. Multiple Selection (다중 선택)

**Use case**: 체크박스 목록, 파일 선택, 일괄 삭제

```tsx
<Block role="List" behavior={{ selectable: 'multiple' }}>
  <Item>File 1</Item>  {/* 선택됨 */}
  <Item>File 2</Item>  {/* 선택 안됨 */}
  <Item>File 3</Item>  {/* 선택됨 */}
</Block>
```

**특징**:
- 여러 개 동시 선택 가능
- Cmd/Ctrl+클릭으로 토글
- Shift+클릭으로 범위 선택
- 0개 이상 선택 가능

**예제**: PPT 슬라이드 삭제 (여러 슬라이드 선택 → Delete)

### 3. Range Selection (범위 선택)

**Use case**: 연속된 항목 선택

```
시작: Slide 2 선택
Shift+클릭: Slide 5
결과: Slide 2, 3, 4, 5 모두 선택
```

**키보드 조작**:
```
Shift+↓ → 아래 항목까지 범위 확장
Shift+↑ → 위 항목까지 범위 확장
Shift+Home → 첫 항목까지 범위 선택
Shift+End → 마지막 항목까지 범위 선택
```

### 4. Toggle Selection (토글 선택)

**Use case**: 개별 항목 추가/제거

```
Cmd/Ctrl+클릭:
  선택 안됨 → 선택됨 (기존 선택 유지)
  선택됨 → 선택 안됨 (기존 선택 유지)
```

**예제**:
```
Slide 1 선택됨
Cmd+클릭 Slide 3 → Slide 1, 3 선택됨
Cmd+클릭 Slide 1 → Slide 3만 선택됨
```

---

## How: 어떻게 동작하는가?

### Pattern 1: Single Selection

**시나리오**: 슬라이드 편집

```tsx
// 상태
const [selectedId, setSelectedId] = useState<string | null>(null);

// 선택 핸들러
const handleSelect = (id: string) => {
  setSelectedId(id);  // 이전 선택 해제, 새로운 항목 선택
};

// 렌더링
<div role="listbox" aria-multiselectable="false">
  {slides.map(slide => (
    <div
      key={slide.id}
      role="option"
      aria-selected={selectedId === slide.id}
      onClick={() => handleSelect(slide.id)}
    >
      {slide.title}
    </div>
  ))}
</div>
```

**키보드 조작**:
```
현재: Slide 2 선택됨
↓ 누름 → Slide 3로 포커스 이동 (Navigable)
Space/Enter → Slide 3 선택됨 (Slide 2 선택 해제)
```

### Pattern 2: Multiple Selection

**시나리오**: 파일 삭제

```tsx
// 상태
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

// 토글 핸들러
const handleToggle = (id: string) => {
  setSelectedIds(prev => {
    const next = new Set(prev);
    if (next.has(id)) {
      next.delete(id);  // 이미 선택됨 → 해제
    } else {
      next.add(id);     // 선택 안됨 → 추가
    }
    return next;
  });
};

// 범위 선택 핸들러
const handleRangeSelect = (fromId: string, toId: string) => {
  const startIndex = items.findIndex(item => item.id === fromId);
  const endIndex = items.findIndex(item => item.id === toId);
  const [start, end] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];

  setSelectedIds(new Set(
    items.slice(start, end + 1).map(item => item.id)
  ));
};
```

**키보드 조작**:
```
현재: File 2 포커스됨, File 1 선택됨

Space → File 2 선택 토글 (File 1 선택 유지)
Shift+↓ → File 3까지 범위 선택 (File 2, 3 선택됨)
Ctrl+A → 전체 선택
```

---

## IDDL API 설계

### Option 1: Behavior Prop (단순)

```tsx
<Block
  role="List"
  behavior={{
    selectable: 'single',  // 'single' | 'multiple' | false
  }}
>
  {items.map(item => <Item key={item.id}>{item.name}</Item>)}
</Block>
```

**장점**: 간단, 명확
**단점**: 세부 제어 어려움

### Option 2: Controlled State (상세)

```tsx
// 부모 컴포넌트에서 선택 상태 관리
const [selected, setSelected] = useState<Set<string>>(new Set());

<Block
  role="List"
  behavior={{
    selectable: {
      mode: 'multiple',
      selected: selected,
      onSelectionChange: setSelected,
      allowEmpty: true,        // 0개 선택 허용
      selectOnFocus: false,    // 포커스 시 자동 선택 안함
    },
  }}
>
  {items.map(item => <Item key={item.id}>{item.name}</Item>)}
</Block>
```

**장점**: 세밀한 제어, 외부 상태 연동 가능
**단점**: 복잡함

### Option 3: Hybrid (추천)

```tsx
// 간단한 경우: 내부 상태 관리
<Block
  role="List"
  behavior={{
    selectable: 'single',  // Block이 상태 관리
  }}
  onSelect={(item) => console.log('Selected:', item)}
>
  {items.map(item => <Item key={item.id}>{item.name}</Item>)}
</Block>

// 복잡한 경우: Controlled
<Block
  role="List"
  behavior={{
    selectable: {
      mode: 'multiple',
      selected: externalState,
      onSelectionChange: setExternalState,
    },
  }}
>
  {items.map(item => <Item key={item.id}>{item.name}</Item>)}
</Block>
```

**장점**: 간단한 케이스는 간단하게, 복잡한 케이스는 세밀하게
**단점**: API 복잡도 약간 증가

---

## Navigable + Selectable 통합

### 두 Behavior의 관계

```
Navigable: 어디로 갈까? (포커스 이동)
Selectable: 무엇을 선택할까? (선택 상태)

포커스 ≠ 선택

예시:
  File 1 (포커스됨, 선택 안됨)  ← 현재 키보드 커서 위치
  File 2 (포커스 안됨, 선택됨)  ← 이전에 선택한 파일
  File 3 (포커스 안됨, 선택됨)  ← 이전에 선택한 파일
```

### 통합 예제

```tsx
<Block
  role="List"
  behavior={{
    navigable: true,       // ↑↓로 포커스 이동
    selectable: 'multiple', // Space로 선택 토글
  }}
>
  <Item>Slide 1</Item>
  <Item>Slide 2</Item>
  <Item>Slide 3</Item>
</Block>
```

**사용자 조작**:
```
초기 상태:
  Slide 1 (포커스, 선택 안됨)

↓ 누름:
  Slide 2 (포커스, 선택 안됨)  ← Navigable

Space 누름:
  Slide 2 (포커스, 선택됨)  ← Selectable

↓ 누름:
  Slide 3 (포커스, 선택 안됨)
  Slide 2 (포커스 안됨, 선택됨)  ← 선택 유지

Shift+Space:
  Slide 2, 3 (선택됨)  ← Range selection
```

---

## 실제 예제: PPT 썸네일

### 요구사항

```
시나리오 1: 슬라이드 편집
  ↑↓로 썸네일 탐색
  Enter로 선택 → 편집 모드
  (Single selection)

시나리오 2: 슬라이드 삭제
  Shift+클릭으로 범위 선택
  Delete 키로 일괄 삭제
  (Multiple selection)
```

### IDDL 코드

```tsx
// AppPPT.tsx
const [selectedSlides, setSelectedSlides] = useState<Set<string>>(new Set());
const [editingSlide, setEditingSlide] = useState<string | null>(null);

<Block
  role="List"
  behavior={{
    navigable: true,
    selectable: {
      mode: 'multiple',
      selected: selectedSlides,
      onSelectionChange: setSelectedSlides,
    },
  }}
  onActivate={(slideId) => setEditingSlide(slideId)}  // Enter 키
>
  {slides.map((slide) => (
    <Item
      key={slide.id}
      selected={selectedSlides.has(slide.id)}
      editing={editingSlide === slide.id}
    >
      <ThumbnailPreview slide={slide} />
      <Text role="Caption">{`Slide ${slide.index + 1}`}</Text>
    </Item>
  ))}
</Block>
```

### 생성될 HTML

```html
<div
  role="listbox"
  aria-multiselectable="true"
  aria-activedescendant="slide-2"
  tabindex="0"
>
  <!-- Slide 1: 선택 안됨 -->
  <div
    role="option"
    id="slide-0"
    aria-selected="false"
  >
    <img src="..." alt="Slide 1 thumbnail" />
    <span>Slide 1</span>
  </div>

  <!-- Slide 2: 선택됨 -->
  <div
    role="option"
    id="slide-1"
    aria-selected="true"
    data-selected="true"
  >
    <img src="..." alt="Slide 2 thumbnail" />
    <span>Slide 2</span>
    <CheckIcon />
  </div>

  <!-- Slide 3: 포커스됨, 선택됨 -->
  <div
    role="option"
    id="slide-2"
    aria-selected="true"
    data-selected="true"
    data-focused="true"
  >
    <img src="..." alt="Slide 3 thumbnail" />
    <span>Slide 3</span>
    <CheckIcon />
  </div>
</div>
```

### 시각적 피드백 (CSS)

```css
/* 포커스 (Navigable) */
[role="option"][data-focused="true"] {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* 선택 (Selectable) */
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

/* 체크마크 표시 */
[role="option"][data-selected="true"]::after {
  content: "✓";
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--accent);
  font-weight: 600;
}
```

---

## 키보드 단축키 매핑

| 키 | Single Selection | Multiple Selection | 설명 |
|----|------------------|-------------------|------|
| **Space** | 선택 토글 | 선택 토글 (기존 유지) | 현재 포커스 항목 |
| **Enter** | 선택 + 활성화 | 활성화 (선택 영향 없음) | 편집 모드 등 |
| **Shift+↓** | - | 범위 확장 (아래) | 범위 선택 |
| **Shift+↑** | - | 범위 확장 (위) | 범위 선택 |
| **Shift+Home** | - | 처음까지 범위 | 범위 선택 |
| **Shift+End** | - | 끝까지 범위 | 범위 선택 |
| **Ctrl+A** | - | 전체 선택 | 모든 항목 |
| **Escape** | 선택 해제 | 선택 해제 | 초기화 |

---

## 구현 패턴

### Hook: useSelection (신규)

```tsx
// src/shared/lib/keyboard/useSelection.ts (새로 만들어야 함)

interface UseSelectionOptions<T> {
  mode: 'single' | 'multiple';
  items: T[];
  getId: (item: T) => string;
  onSelectionChange?: (selected: Set<string>) => void;
}

export function useSelection<T>({
  mode,
  items,
  getId,
  onSelectionChange,
}: UseSelectionOptions<T>) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastSelected, setLastSelected] = useState<string | null>(null);

  // 단일 선택
  const selectSingle = (id: string) => {
    const next = new Set([id]);
    setSelected(next);
    setLastSelected(id);
    onSelectionChange?.(next);
  };

  // 토글 선택 (Ctrl+클릭)
  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
    setLastSelected(id);
    onSelectionChange?.(next);
  };

  // 범위 선택 (Shift+클릭)
  const selectRange = (id: string) => {
    if (!lastSelected) {
      selectSingle(id);
      return;
    }

    const startIndex = items.findIndex(item => getId(item) === lastSelected);
    const endIndex = items.findIndex(item => getId(item) === id);
    const [start, end] = [Math.min(startIndex, endIndex), Math.max(startIndex, endIndex)];

    const next = new Set(
      items.slice(start, end + 1).map(item => getId(item))
    );
    setSelected(next);
    onSelectionChange?.(next);
  };

  // 전체 선택 (Ctrl+A)
  const selectAll = () => {
    const next = new Set(items.map(item => getId(item)));
    setSelected(next);
    onSelectionChange?.(next);
  };

  // 선택 해제 (Escape)
  const clearSelection = () => {
    setSelected(new Set());
    setLastSelected(null);
    onSelectionChange?.(new Set());
  };

  // 키보드 핸들러
  const handleKeyDown = (e: KeyboardEvent, focusedId: string) => {
    if (e.key === ' ') {
      e.preventDefault();
      if (mode === 'single') {
        selectSingle(focusedId);
      } else {
        toggleSelect(focusedId);
      }
    } else if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (mode === 'multiple') {
        selectAll();
      }
    } else if (e.key === 'Escape') {
      clearSelection();
    }
  };

  return {
    selected,
    selectSingle,
    toggleSelect,
    selectRange,
    selectAll,
    clearSelection,
    handleKeyDown,
    isSelected: (id: string) => selected.has(id),
  };
}
```

---

## 접근성 체크리스트

### ARIA 속성

- [x] `aria-multiselectable="true"` (multiple selection)
- [x] `aria-selected="true/false"` (각 항목)
- [x] `aria-activedescendant` (포커스 관리)
- [x] Selection 상태 스크린리더로 읽힘

### 키보드 지원

- [x] Space로 선택 토글
- [x] Shift+화살표로 범위 선택
- [x] Ctrl+A로 전체 선택
- [x] Escape로 선택 해제

### 시각적 피드백

- [x] 선택된 항목 명확한 배경색
- [x] 체크마크 또는 선택 표시
- [x] 포커스와 선택 구분 (outline vs background)

---

## 구현 우선순위

### Phase 1: Single Selection (PPT 슬라이드 편집)
- [ ] `useSelection` hook (single mode)
- [ ] SelectableList 컴포넌트
- [ ] Space/Enter 키 처리
- [ ] 시각적 피드백 (CSS)

### Phase 2: Multiple Selection (PPT 슬라이드 삭제)
- [ ] `useSelection` hook (multiple mode)
- [ ] Shift+클릭 범위 선택
- [ ] Ctrl+클릭 토글 선택
- [ ] Ctrl+A 전체 선택

### Phase 3: Navigable + Selectable 통합
- [ ] 포커스와 선택 분리
- [ ] Shift+화살표 키보드 범위 선택
- [ ] 통합 예제 (PPT 썸네일 완성)

---

## 다음 단계

1. **PPT 썸네일 통합 예제** (`04-ppt-thumbnail-example.md`)
   - Navigable + Selectable 완전 통합
   - 실제 동작 코드
   - 테스트 시나리오

2. **useSelection Hook 구현** (`src/shared/lib/keyboard/useSelection.ts`)
   - Single/Multiple mode
   - Range selection
   - Keyboard shortcuts

3. **SelectableList 컴포넌트** (`src/components/types/Block/behaviors/SelectableList.tsx`)
   - useSelection + useNavigableCursor 통합
   - ARIA 접근성
   - 시각적 피드백

---

**작성일**: 2026-01-11
**상태**: ✅ 스펙 완료
**다음**: PPT 썸네일 통합 예제 작성 (`04-ppt-thumbnail-example.md`)
