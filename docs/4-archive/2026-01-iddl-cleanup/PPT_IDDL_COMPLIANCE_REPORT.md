# PPT 앱 IDDL 준수 보고서

**작성일**: 2026-01-11
**대상 앱**: `/src/apps/PPT/`
**리팩토링 단계**: 1차 리팩토링 완료 후 재검토
**IDDL 버전**: v5.0

---

## 📊 Executive Summary

### 현재 상태

| 지표 | 값 | 비고 |
|------|-----|------|
| **IDDL 채택률** | **~90%** | 1차 리팩토링 후 85% → 90% 향상 |
| **총 파일 수** | 8개 | pages(2) + widgets(5) + lib(1) |
| **IDDL 위반 건수** | **43건** | 중복도 높음, 패턴화 가능 |
| **우선순위 P0** | 2건 | ResizeHandle, alert() |
| **우선순위 P1** | 30건 | className 수동 사용 |
| **우선순위 P2** | 11건 | HTML 태그 사용 |

### 주요 발견 사항

1. ✅ **IDDL 구조는 잘 준수** - Page, Section, Block, Action, Text 모두 올바르게 사용
2. ⚠️ **className 남용** - IDDL 컴포넌트에 수동 className 과다 사용 (30건)
3. ⚠️ **디자인 토큰 미사용** - `text-white`, `bg-black/60` 같은 하드코딩
4. 🔴 **HTML 태그 혼재** - markdown-to-dsl.tsx에서 `<div>`, `<span>` 사용
5. 🔴 **커스텀 컴포넌트** - ResizeHandle은 IDDL 확장 개발 필요

---

## 📋 위반 사례 분류

### 🔴 Priority P0 (긴급 - 기능적 위반)

#### V1. ResizeHandle 커스텀 컴포넌트 사용

**파일**: `PPTPage.tsx:245-257, 270-282`
**위반 횟수**: 2건
**심각도**: High

**현재 코드**:
```tsx
// IDDL TODO: Replace with <Action role="ResizeHandle" ... /> (IDDL extension required)
import { ResizeHandle } from '@/shared/components/ResizeHandle';

<ResizeHandle
  direction="horizontal"
  isResizing={isSidebarResizing}
  {...sidebarSeparatorProps}
  style={{
    gridArea: 'primarysidebar',
    justifySelf: 'end',
    width: '4px',
    zIndex: 50,
    transform: 'translateX(50%)',
  }}
/>
```

**문제점**:
- IDDL 외부의 커스텀 컴포넌트 사용
- inline style 사용 (gridArea, justifySelf, transform 등)
- IDDL Action으로 대체 불가 (role="ResizeHandle" 미지원)

**해결 방안**:
```tsx
// 목표: Action role="ResizeHandle" (IDDL 확장 개발 필요)
<Action
  role="ResizeHandle"
  direction="horizontal"
  target="primarysidebar"
  alignment="end"
  offset="50%"
  isActive={isSidebarResizing}
  {...sidebarSeparatorProps}
/>
```

**구현 요구사항**:
- Action 컴포넌트에 `role="ResizeHandle"` 추가
- Props: `direction`, `target` (gridArea), `alignment`, `offset`, `isActive`
- 내부적으로 gridArea, justifySelf, transform 자동 계산

**참고**: `/docs/1-project/IDDL_COMPLIANCE_AUDIT_REPORT.md` (Type 7)

**예상 작업 시간**: 5시간

---

#### V2. alert() 사용

**파일**: `PPTPage.tsx:162`
**위반 횟수**: 1건
**심각도**: Medium

**현재 코드**:
```tsx
const handleSlidesDelete = (slidesToDelete: Slide[]) => {
  if (slides.length === slidesToDelete.length) {
    alert('마지막 슬라이드는 삭제할 수 없습니다.');
    return;
  }
  // ...
};
```

**문제점**:
- 브라우저 네이티브 alert() 사용 (UX 나쁨)
- IDDL Overlay 시스템 미사용

**해결 방안**:
```tsx
import { Overlay } from '@/components/types/Overlay/Overlay';

const [errorMessage, setErrorMessage] = useState<string | null>(null);

const handleSlidesDelete = (slidesToDelete: Slide[]) => {
  if (slides.length === slidesToDelete.length) {
    setErrorMessage('마지막 슬라이드는 삭제할 수 없습니다.');
    return;
  }
  // ...
};

// JSX
{errorMessage && (
  <Overlay role="Toast" intent="Critical" onClose={() => setErrorMessage(null)}>
    <Text role="Body" content={errorMessage} />
  </Overlay>
)}
```

**예상 작업 시간**: 30분

---

### ⚠️ Priority P1 (중요 - className 수동 사용)

#### V3. Section/Block에 수동 className 사용

**총 위반 횟수**: 30건

##### V3-1. PresentationToolbar.tsx (4건)

**Line 37**: `className="border-b border-border bg-layer-4 shadow-sm"`
**Line 38**: `className="h-12 items-center justify-between px-4"`
**Line 40**: `className="flex-1"`
**Line 49**: `className="gap-2"`
**Line 88**: `className="flex-1 justify-end gap-2"`

**문제점**:
- Section/Block에 레이아웃 유틸리티 직접 사용
- `bg-layer-4`, `shadow-sm` 같은 디자인 토큰 하드코딩
- prominence/density로 표현 가능한 속성을 className으로 우회

**해결 방안**:
```tsx
// ❌ Before
<Section role="Header" className="border-b border-border bg-layer-4 shadow-sm">
  <Block role="Toolbar" density="Compact" className="h-12 items-center justify-between px-4">
    <Block role="Inline" className="flex-1">
      <Text role="Title" className="text-text-primary font-medium truncate max-w-md" />
    </Block>
    <Block role="Toolbar" className="gap-2">
      ...
    </Block>
    <Block role="Toolbar" className="flex-1 justify-end gap-2">
      ...
    </Block>
  </Block>
</Section>

// ✅ After (Option 1: prominence/density 활용)
<Section role="Header" prominence="Standard">
  <Block role="Toolbar" density="Compact">
    <Block role="Inline">
      <Text role="Title" content={title} />
    </Block>
    <Block role="Toolbar" density="Compact">
      ...
    </Block>
    <Block role="Toolbar" density="Compact">
      ...
    </Block>
  </Block>
</Section>

// ✅ After (Option 2: Section의 border/shadow를 prominence로 표현)
// Section prominence="Elevated" → border-b + shadow-sm 자동 적용
// Block density="Compact" → gap 자동 적용
```

**개선 전략**:
1. Section에 `prominence="Elevated"` → `border-b`, `shadow-sm` 자동 적용
2. Block에 `density="Compact"` → `gap-2` 자동 적용
3. `flex-1`, `items-center`, `justify-between` → Block `layout` prop 확장 필요

**예상 작업 시간**: 2시간

---

##### V3-2. SlideList.tsx (4건)

**Line 113**: `className="flex-1 overflow-y-auto"`
**Line 126**: `className="cursor-move !bg-white border border-border hover:border-border-emphasis data-[selected=true]:border-accent data-[selected=true]:ring-1 data-[selected=true]:ring-accent/20 transition-all"`
**Line 146**: `className="flex-1 overflow-y-auto"`
**Line 157**: (동일 - Line 126과 중복)

**문제점**:
- `!bg-white` - important override (IDDL 우선순위 무시)
- `hover:`, `data-[selected=true]:` - 인터랙션 스타일 수동 정의
- `cursor-move` - DnD 특성이지만 Block role="SortableList"가 자동 처리해야 함

**해결 방안**:
```tsx
// ❌ Before
<Block
  role="SortableList"
  className="flex-1 overflow-y-auto"
  items={slides}
  value="id"
  onReorder={onReorder}
  renderItem={(slide: Slide, index: number) => (
    <Block
      role="Card"
      value={slide.id}
      selectionModel={selectionModel}
      className="cursor-move !bg-white border border-border hover:border-border-emphasis ..."
    >
      ...
    </Block>
  )}
/>

// ✅ After
<Block
  role="SortableList"
  items={slides}
  value="id"
  onReorder={onReorder}
  renderItem={(slide: Slide, index: number) => (
    <Block
      role="Card"
      prominence="Standard"
      value={slide.id}
      selectionModel={selectionModel}
    >
      ...
    </Block>
  )}
/>
```

**개선 전략**:
1. Block role="SortableList" → `overflow-y-auto`, `flex-1` 자동 적용
2. Block role="Card" + selectionModel → hover, selected 스타일 자동 적용
3. Block role="Card" + selectionModel → `cursor-move` 자동 적용 (SortableList 내부에서만)

**예상 작업 시간**: 2시간

---

##### V3-3. DSLSlideCanvas.tsx (6건)

**Line 36**: `className="items-center justify-center h-full"`
**Line 53**: `className="items-center justify-center h-full"`
**Line 59**: `className="relative w-full max-w-5xl aspect-[16/9]"`
**Line 78**: `className="overflow-y-auto"`
**Line 94**: `className="absolute left-3 top-3 bg-white/80 backdrop-blur-sm rounded"`
**Line 106**: `className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded"`

**문제점**:
- `absolute` positioning - Overlay 컴포넌트로 대체 가능
- `bg-white/80 backdrop-blur-sm` - 디자인 토큰 미사용
- `items-center justify-center` - Block layout prop으로 표현 가능

**해결 방안**:
```tsx
// ❌ Before
<Block role="Container" className="items-center justify-center h-full">
  <Block role="Container" className="relative w-full max-w-5xl aspect-[16/9]">
    ...
    <Block
      role="Toolbar"
      className="absolute left-3 top-3 bg-white/80 backdrop-blur-sm rounded"
    >
      <Text role="Caption" content={`${currentIndex + 1} / ${totalSlides}`} />
    </Block>
  </Block>
</Block>

// ✅ After (Option 1: layout prop 활용)
<Block role="Container" layout="centered">
  <Block role="Container" className="aspect-[16/9] max-w-5xl">
    ...
    <Overlay role="Floating" placement="top-left" offset={{ x: 12, y: 12 }}>
      <Text role="Caption" content={`${currentIndex + 1} / ${totalSlides}`} />
    </Overlay>
  </Block>
</Block>

// ✅ After (Option 2: Block layout="overlay" 확장)
// Block에 layout="overlay" + placement prop 추가
<Block
  layout="overlay"
  placement="top-left"
  offset={{ x: 12, y: 12 }}
  prominence="Subtle"
>
  <Text role="Caption" content={`${currentIndex + 1} / ${totalSlides}`} />
</Block>
```

**개선 전략**:
1. Block `layout="centered"` 추가 → `items-center justify-center` 자동
2. Overlay role="Floating" 활용 (absolute positioning 대체)
3. `bg-white/80 backdrop-blur-sm` → prominence="Overlay" 토큰 추가

**예상 작업 시간**: 3시간

---

##### V3-4. PresentationModePage.tsx (16건)

**Line 131**: `className="items-center justify-center h-full"`
**Line 149-152**: Template string으로 동적 className 생성
**Line 169**: `className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2"`
**Line 179, 187, 198, 210**: `className="text-white hover:text-white/80"` (Action 4개)
**Line 221**: `className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded px-3 py-2"`
**Line 224, 225, 226**: `className="text-white"` (Text 3개)

**문제점**:
- **Dark theme variant 미지원** - `text-white`, `bg-black/60` 하드코딩
- Template string으로 transition 구현 (IDDL 외부 방식)
- absolute positioning 남발

**현재 코드**:
```tsx
// Line 169: Bottom Navigation Overlay
<Block
  role="Toolbar"
  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2"
>
  <Action icon="ChevronLeft" className="text-white hover:text-white/80" />
  <Text role="Body" content="..." className="text-white" />
  <Action icon="ChevronRight" className="text-white hover:text-white/80" />
  <Action role="Button" className="text-white hover:text-white/80">나가기</Action>
</Block>

// Line 221: Keyboard Hints - Top Right
<Block
  role="Container"
  className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded px-3 py-2"
>
  <Block role="Inline">
    <Text role="Code" content="←" className="text-white" />
    <Text role="Code" content="→" className="text-white" />
    <Text role="Caption" content="탐색" className="text-white/70" />
  </Block>
</Block>
```

**해결 방안**:
```tsx
// ✅ After (Option 1: Overlay + theme="dark" prop)
<Overlay
  role="Floating"
  placement="bottom-center"
  offset={{ y: 24 }}
  theme="dark"
  prominence="Overlay"
>
  <Block role="Toolbar" density="Compact">
    <Action icon="ChevronLeft" prominence="Secondary" />
    <Text role="Body" content="..." />
    <Action icon="ChevronRight" prominence="Secondary" />
    <Action role="Button" prominence="Tertiary">나가기</Action>
  </Block>
</Overlay>

<Overlay
  role="Floating"
  placement="top-right"
  offset={{ x: 16, y: 16 }}
  theme="dark"
  prominence="Subtle"
>
  <Block role="Inline" density="Compact">
    <Text role="Code" content="←" />
    <Text role="Code" content="→" />
    <Text role="Caption" prominence="Subtle" content="탐색" />
  </Block>
</Overlay>
```

**개선 전략**:
1. **Overlay role="Floating"** - absolute positioning 대체
2. **theme="dark" prop** 추가 - `text-white`, `bg-black` 자동 적용
3. **prominence="Overlay"** - `backdrop-blur-sm`, opacity 자동

**예상 작업 시간**: 4시간

---

### 🟡 Priority P2 (보통 - HTML 태그 사용)

#### V4. markdown-to-dsl.tsx에서 HTML 태그 사용

**파일**: `lib/markdown-to-dsl.tsx:113-116, 157, 159, 173, 191`
**위반 횟수**: 11건
**심각도**: Medium

**현재 코드**:
```tsx
// Line 113-116: List rendering
const flushList = () => {
  if (listItems.length > 0) {
    elements.push(
      <Block key={`list-${key++}`} role="List" layout="stack">
        {listItems.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-accent">•</span>
            <div className="flex-1">{item}</div>
          </div>
        ))}
      </Block>
    );
    listItems.length = 0;
  }
};

// Line 157: Blockquote
<Block
  role="Container"
  intent="Brand"
  className="border-l-4 border-accent bg-accent/5 pl-4 py-3 my-2"
>
  <Text role="Body" content={parsed.content} className="italic" />
</Block>

// Line 173: Paragraph
<Text key={`p-${key++}`} role="Body" content={content} className="leading-relaxed" />

// Line 191: Container
<Block role="Container" layout="stack" density="Comfortable" className="gap-4">
  {markdownToDSL(content)}
</Block>
```

**문제점**:
- `<div>`, `<span>` 직접 사용 (IDDL Block/Text로 대체 가능)
- className 수동 사용 (`flex gap-2`, `text-accent`, `flex-1`)
- Blockquote에 수동 스타일 적용

**해결 방안**:
```tsx
// ✅ After
const flushList = () => {
  if (listItems.length > 0) {
    elements.push(
      <Block key={`list-${key++}`} role="List" layout="stack" density="Compact">
        {listItems.map((item, i) => (
          <Block key={i} role="Inline" density="Compact" layout="inline">
            <Text role="Body" content="•" intent="Brand" />
            <Block role="Container">{item}</Block>
          </Block>
        ))}
      </Block>
    );
    listItems.length = 0;
  }
};

// Blockquote: Block role="Blockquote" 신규 추가
<Block key={`quote-${key++}`} role="Blockquote" intent="Brand">
  <Text role="Body" content={parsed.content} />
</Block>

// Paragraph: Text className 제거
<Text key={`p-${key++}`} role="Body" content={content} />

// Container: className 제거 (density가 gap 처리)
<Block role="Container" layout="stack" density="Comfortable">
  {markdownToDSL(content)}
</Block>
```

**개선 전략**:
1. `<div>` → `<Block role="Container">` 또는 `<Block role="Inline">`
2. `<span>` → `<Text>` (inline 텍스트)
3. Block `role="Blockquote"` 신규 추가 (border-l-4, bg 자동)
4. Text `className="italic"` → Text `style` prop 추가 또는 제거

**예상 작업 시간**: 2시간

---

## 📈 통계 요약

### 파일별 위반 현황

| 파일 | 위반 건수 | P0 | P1 | P2 | 상태 |
|------|-----------|----|----|----|----|
| **PPTPage.tsx** | 3 | 2 | 0 | 0 | 🔴 긴급 |
| **PresentationModePage.tsx** | 16 | 0 | 16 | 0 | ⚠️ 중요 |
| **PresentationToolbar.tsx** | 5 | 0 | 5 | 0 | ⚠️ 중요 |
| **SlideList.tsx** | 4 | 0 | 4 | 0 | ⚠️ 중요 |
| **DSLSlideCanvas.tsx** | 6 | 0 | 6 | 0 | ⚠️ 중요 |
| **FormatSidebar.tsx** | 0 | 0 | 0 | 0 | ✅ 완벽 |
| **SlidePreview.tsx** | 0 | 0 | 0 | 0 | ✅ 완벽 |
| **markdown-to-dsl.tsx** | 11 | 0 | 0 | 11 | 🟡 보통 |
| **합계** | **43** | **2** | **30** | **11** | **90%** |

### 위반 유형별 분류

| 유형 | 건수 | 비율 | 우선순위 |
|------|------|------|---------|
| **className 수동 사용** | 30 | 69.8% | P1 |
| **HTML 태그 사용** | 11 | 25.6% | P2 |
| **커스텀 컴포넌트** | 2 | 4.6% | P0 |
| **합계** | 43 | 100% | - |

---

## 🎯 수정 우선순위 로드맵

### Phase 1: 긴급 수정 (Week 1) - P0

**예상 시간**: 5.5시간

1. ✅ **V2: alert() → Overlay** (30분)
   - PPTPage.tsx Line 162
   - Toast 컴포넌트로 교체

2. 🔴 **V1: ResizeHandle → Action** (5시간) - **IDDL 확장 필요**
   - PPTPage.tsx Line 245-257, 270-282
   - Action role="ResizeHandle" 구현
   - Props: direction, target, alignment, offset

**Deliverable**: ResizeHandle을 완전히 IDDL Action으로 대체

---

### Phase 2: 중요 수정 (Week 2-3) - P1

**예상 시간**: 11시간

#### Week 2: Dark Theme + Overlay (7시간)

1. ⚠️ **V3-4: PresentationModePage** (4시간)
   - Overlay role="Floating" 도입
   - theme="dark" prop 추가
   - 16건 수정

2. ⚠️ **V3-3: DSLSlideCanvas** (3시간)
   - Block layout="centered" 추가
   - Overlay role="Floating" 적용
   - 6건 수정

#### Week 3: Toolbar + List (4시간)

3. ⚠️ **V3-1: PresentationToolbar** (2시간)
   - Section prominence 활용
   - Block density 활용
   - 5건 수정

4. ⚠️ **V3-2: SlideList** (2시간)
   - Block role="SortableList" 개선
   - Block role="Card" + selectionModel 스타일 자동화
   - 4건 수정

**Deliverable**: 수동 className 30건 → 0건

---

### Phase 3: 보통 수정 (Week 4) - P2

**예상 시간**: 2시간

1. 🟡 **V4: markdown-to-dsl.tsx** (2시간)
   - `<div>`, `<span>` → Block/Text
   - Block role="Blockquote" 추가
   - 11건 수정

**Deliverable**: HTML 태그 11건 → 0건

---

### Phase 4: 검증 및 문서화 (Week 4)

**예상 시간**: 2시간

1. **전체 앱 테스트** (1시간)
   - 슬라이드 편집 모드 동작 확인
   - 프레젠테이션 모드 동작 확인
   - 키보드 네비게이션 확인
   - 드래그 앤 드롭 확인

2. **문서 업데이트** (1시간)
   - IDDL 100% 준수 달성 기록
   - Before/After 스크린샷
   - 개선 효과 정량화

**Deliverable**: PPT 앱 IDDL 100% 준수 달성

---

## 📊 예상 효과

### Before (현재)

- IDDL 채택률: **90%**
- className 수동 사용: 30건
- HTML 태그 사용: 11건
- 커스텀 컴포넌트: 2건
- 유지보수성: 중간
- 디자인 일관성: 높음

### After (목표)

- IDDL 채택률: **100%**
- className 수동 사용: **0건**
- HTML 태그 사용: **0건**
- 커스텀 컴포넌트: **0건**
- 유지보수성: **매우 높음**
- 디자인 일관성: **매우 높음**

### 정량적 효과

| 지표 | Before | After | 개선 |
|------|--------|-------|------|
| IDDL 채택률 | 90% | 100% | +10% |
| 위반 건수 | 43건 | 0건 | -100% |
| className 라인 수 | ~100 lines | 0 lines | -100% |
| 코드 가독성 | 8/10 | 10/10 | +25% |
| 유지보수 시간 | 기준 | -30% | -30% |

---

## 💡 개선 권고사항

### 1. IDDL 확장 개발 (긴급)

다음 IDDL 컴포넌트/prop을 개발하여 PPT 앱의 모든 위반 사례를 해결할 수 있습니다:

#### 1.1. Action role="ResizeHandle" (P0)

**Props**:
```typescript
interface ResizeHandleProps extends ActionProps {
  role: 'ResizeHandle';
  direction: 'horizontal' | 'vertical';
  target: string;  // gridArea name
  alignment: 'start' | 'end' | 'center';
  offset?: string;  // transform offset (e.g., "50%", "-50%")
  isActive?: boolean;
}
```

**사용 예**:
```tsx
<Action
  role="ResizeHandle"
  direction="horizontal"
  target="primarysidebar"
  alignment="end"
  offset="50%"
  isActive={isResizing}
/>
```

**구현 난이도**: Medium (5시간)

---

#### 1.2. Block layout="centered" (P1)

**Props**:
```typescript
interface BlockProps {
  layout?: 'stack' | 'inline' | 'grid' | 'centered' | 'overlay';  // 추가
}
```

**동작**:
- `layout="centered"` → `items-center justify-center h-full` 자동 적용

**사용 예**:
```tsx
<Block role="Container" layout="centered">
  <Text role="Body" content="중앙 정렬된 콘텐츠" />
</Block>
```

**구현 난이도**: Easy (1시간)

---

#### 1.3. Overlay role="Floating" + theme="dark" (P1)

**Props**:
```typescript
interface OverlayProps {
  role: 'Floating';  // 추가
  placement: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  offset?: { x?: number; y?: number };
  theme?: 'light' | 'dark';  // 추가
  prominence?: 'Subtle' | 'Standard' | 'Overlay';  // 추가
}
```

**동작**:
- `role="Floating"` → absolute positioning 자동
- `theme="dark"` → `text-white`, `bg-black/60` 자동
- `prominence="Overlay"` → `backdrop-blur-sm`, `rounded` 자동

**사용 예**:
```tsx
<Overlay
  role="Floating"
  placement="bottom-center"
  offset={{ y: 24 }}
  theme="dark"
  prominence="Overlay"
>
  <Block role="Toolbar">
    <Action icon="ChevronLeft" />
    <Text role="Body" content="1 / 10" />
    <Action icon="ChevronRight" />
  </Block>
</Overlay>
```

**구현 난이도**: Medium (4시간)

---

#### 1.4. Block role="Blockquote" (P2)

**Props**:
```typescript
interface BlockProps {
  role: 'Blockquote';  // 추가
  intent?: 'Brand' | 'Neutral' | 'Positive' | 'Caution' | 'Critical';
}
```

**동작**:
- `role="Blockquote"` → `border-l-4`, `bg-{intent}/5`, `pl-4`, `py-3` 자동

**사용 예**:
```tsx
<Block role="Blockquote" intent="Brand">
  <Text role="Body" content="인용문 내용" />
</Block>
```

**구현 난이도**: Easy (1시간)

---

#### 1.5. Block role="Card" 인터랙션 스타일 자동화 (P1)

**개선 사항**:
- `selectionModel` prop 존재 시 `hover`, `selected`, `focus` 스타일 자동 적용
- `cursor-move` (SortableList 내부에서만)

**현재 문제**:
```tsx
<Block
  role="Card"
  selectionModel={selectionModel}
  className="!bg-white border border-border hover:border-border-emphasis data-[selected=true]:border-accent ..."
/>
```

**개선 후**:
```tsx
<Block
  role="Card"
  prominence="Standard"
  selectionModel={selectionModel}
/>
// hover, selected 스타일 자동 적용
```

**구현 난이도**: Medium (2시간)

---

### 2. 디자인 토큰 확장

#### 2.1. prominence="Overlay" 토큰 추가

**CSS Variables**:
```css
--prominence-overlay-bg: rgba(0, 0, 0, 0.6);
--prominence-overlay-backdrop: blur(8px);
--prominence-overlay-text: rgba(255, 255, 255, 1);
--prominence-overlay-text-subtle: rgba(255, 255, 255, 0.7);
```

#### 2.2. theme="dark" 토큰 추가

**CSS Variables**:
```css
[data-theme="dark"] {
  --text-primary: rgba(255, 255, 255, 1);
  --text-secondary: rgba(255, 255, 255, 0.8);
  --text-subtle: rgba(255, 255, 255, 0.6);
  --bg-surface: rgba(0, 0, 0, 0.6);
  --bg-overlay: rgba(0, 0, 0, 0.8);
}
```

---

### 3. Code Review Checklist (PPT 앱용)

개발 중 다음 항목을 체크하여 IDDL 위반을 사전에 방지하세요:

#### ✅ 구조

- [ ] Page, Section, Block, Action, Text만 사용 (div/span 금지)
- [ ] 모든 레이아웃은 Block role로 표현
- [ ] 절대 위치는 Overlay role="Floating" 사용

#### ✅ 스타일

- [ ] className에 레이아웃 유틸리티 사용 금지 (flex, grid, gap 등)
- [ ] className에 색상 하드코딩 금지 (text-white, bg-black 등)
- [ ] !important override 금지 (!bg-white 같은 패턴)

#### ✅ 인터랙션

- [ ] hover, focus, selected 스타일은 prominence/intent로 표현
- [ ] alert(), confirm() 대신 Overlay role="Toast"/"Dialog" 사용
- [ ] 커스텀 컴포넌트 대신 IDDL Action 확장

#### ✅ 토큰

- [ ] 색상은 디자인 토큰 사용 (intent, prominence)
- [ ] 간격은 density prop 사용 (Compact, Standard, Comfortable)
- [ ] 폰트 크기는 role 자동 적용 (Title, Body, Caption 등)

---

## 📁 관련 문서

- **IDDL 스펙**: `/docs/2-areas/spec/`
- **전체 앱 감사 보고서**: `/docs/1-project/IDDL_COMPLIANCE_AUDIT_REPORT.md`
- **Registry Pattern**: `/docs/architecture/registry-pattern.md`
- **IDDL v5.0 변경사항**: `/CLAUDE.md` (Page role 개선)

---

## 📝 결론

PPT 앱은 **90% IDDL 준수 상태**로, 전반적으로 매우 잘 구축되어 있습니다.

**주요 장점**:
- ✅ IDDL 구조(Page, Section, Block, Action, Text)는 완벽하게 준수
- ✅ 컴포넌트 계층 구조가 명확하고 일관적
- ✅ FormatSidebar, SlidePreview는 100% IDDL 준수

**개선 필요 영역**:
- ⚠️ className 수동 사용 (30건) → prominence/density로 대체
- ⚠️ Dark theme variant 미지원 → theme prop + 토큰 추가
- 🔴 ResizeHandle 커스텀 컴포넌트 → Action role 확장

**권고사항**:
1. **Phase 1-2를 우선 진행** (16.5시간, 2-3주)
   - ResizeHandle 확장 (긴급)
   - Dark theme + Overlay 도입 (중요)
2. **Phase 3-4는 선택적** (4시간, 1주)
   - markdown-to-dsl 개선
   - 100% 달성 기념 문서화

총 예상 시간: **20.5시간 (2.5주)**

---

**최종 업데이트**: 2026-01-11
**작성자**: IDDL Architecture Team
**Status**: ✅ Ready for Review
