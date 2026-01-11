# IDDL Behavior Primitives 구현 계획서

## 📋 프로젝트 개요

**목표**: IDDL Behavior Primitives (Navigable, Selectable, FocusScope) 구현

**기간**: 2026-01-11 ~ 2026-01-31 (예상 3주)

**참조 스펙**: `docs/2-areas/spec/interaction/interaction.spec.draft.md`

**1차 목표**: PPT 썸네일 리스트에 Navigable + Selectable 적용

---

## 🎯 핵심 목표

### Phase 1: Navigable + Selectable (PPT 썸네일) ⭐ 최우선
- [ ] PPT 썸네일에서 ↑↓ 키보드 탐색
- [ ] Shift+클릭으로 범위 선택
- [ ] Delete 키로 일괄 삭제
- [ ] 포커스와 선택 상태 시각적 구분

### Phase 2: FocusScope (모달/다이얼로그)
- [ ] 모달 열릴 때 포커스 트랩
- [ ] 모달 닫힐 때 포커스 복원
- [ ] Escape 키로 모달 닫기

### Phase 3: 고급 기능 (추후)
- [ ] Grid Navigation (2D)
- [ ] Tree Navigation (계층형)
- [ ] Reorderable (Drag & Drop)

---

## 📚 스펙 분석

### 아키텍처 (interaction.spec.draft.md 기반)

```
┌─────────────────────────────────────────────────────────┐
│                    IDDL Document                        │
│  (앱 개발자: Role 선언만)                                │
│                                                         │
│  <Block role="SlideList">                               │
│    <Action role="Slide" />                              │
│  </Block>                                               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    IDDL Renderer                        │
│  (렌더러 개발자: Role → Behavior 매핑)                   │
│                                                         │
│  SlideListRenderer:                                     │
│    <Selectable mode="extended">                         │
│      <Navigable orientation="vertical">                 │
│        {children}                                       │
│      </Navigable>                                       │
│    </Selectable>                                        │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌───────────┐ ┌─────────────────┐
│ Behavior        │ │  Headless │ │  Context        │
│ Wrappers        │ │  Hooks    │ │  Providers      │
└─────────────────┘ └───────────┘ └─────────────────┘
```

### 핵심 Primitives

| Primitive | Intent | Props | Use Case |
|-----------|--------|-------|----------|
| **Navigable** | 키보드로 탐색 | `orientation`, `loop`, `typeahead` | List, Grid, Tree |
| **Selectable** | 항목 선택 | `mode`, `followFocus`, `required` | File Explorer, Tabs |
| **FocusScope** | 포커스 범위 | `trap`, `restoreFocus`, `autoFocus` | Modal, Dialog |

---

## 🏗️ 아키텍처 설계

### 1. Context Flow

```tsx
<Selectable mode="extended">                    // SelectableContext
  <Navigable orientation="vertical">            // NavigableContext
    <Block role="SlideList">
      <Item>
        useNavigableContext() ← NavigableContext
        useSelectableContext() ← SelectableContext
      </Item>
    </Block>
  </Navigable>
</Selectable>
```

### 2. Two-Track System

**Track 1 (앱 개발자)**:
```tsx
// IDDL Role만 선언
<Block role="SlideList">
  <Action role="Slide" id="1">...</Action>
</Block>
```

**Track 2 (렌더러 개발자)**:
```tsx
// SlideListRenderer 내부
function SlideListRenderer({ children }) {
  return (
    <Selectable mode="extended">
      <Navigable orientation="vertical">
        {children}
      </Navigable>
    </Selectable>
  );
}
```

---

## 📂 파일 구조

### 신규 생성 파일

```
src/
├── shared/
│   └── lib/
│       └── behavior/                          # ⭐ NEW
│           ├── Navigable/
│           │   ├── Navigable.tsx              # Wrapper 컴포넌트
│           │   ├── NavigableContext.tsx       # Context + Provider
│           │   ├── useNavigable.ts            # 내부 로직 hook
│           │   ├── useNavigableContext.ts     # Context 소비 hook
│           │   ├── useNavigableItem.ts        # Item용 편의 hook
│           │   └── types.ts                   # 타입 정의
│           ├── Selectable/
│           │   ├── Selectable.tsx             # Wrapper 컴포넌트
│           │   ├── SelectableContext.tsx      # Context + Provider
│           │   ├── useSelectable.ts           # 내부 로직 hook
│           │   ├── useSelectableContext.ts    # Context 소비 hook
│           │   ├── useSelectableItem.ts       # Item용 편의 hook
│           │   └── types.ts                   # 타입 정의
│           ├── FocusScope/
│           │   ├── FocusScope.tsx             # Wrapper 컴포넌트
│           │   ├── FocusScopeContext.tsx      # Context + Provider
│           │   ├── useFocusScope.ts           # 내부 로직 hook (기존 활용)
│           │   ├── useFocusScopeContext.ts    # Context 소비 hook
│           │   └── types.ts                   # 타입 정의
│           └── index.ts                       # ⚠️ EXCEPTION: behavior 관련만 re-export
├── apps/
│   └── PPT/
│       ├── renderers/                         # ⭐ NEW
│       │   ├── SlideListRenderer.tsx          # SlideList 렌더러
│       │   └── SlideRenderer.tsx              # Slide 렌더러
│       └── widgets/
│           └── ThumbnailList.tsx              # (기존 위젯 리팩토링)
└── components/
    └── types/
        └── Block/
            └── renderers/                     # Block role별 렌더러
                └── ListRenderer.tsx           # ⭐ NEW
```

### 기존 활용 파일

```
src/
└── shared/
    └── lib/
        └── keyboard/                          # 기존 존재
            ├── useNavigableCursor.ts          # ✅ 재활용
            ├── useTreeNavigation.ts           # ✅ 재활용
            └── useFocusScope.ts               # ✅ 재활용
```

---

## 🔧 구현 단계

### Step 1: Navigable Primitive (Week 1)

#### 1.1 Core Hook (1일)

**파일**: `src/shared/lib/behavior/Navigable/useNavigable.ts`

```tsx
interface NavigableProps {
  orientation: 'vertical' | 'horizontal' | 'both';
  loop?: boolean;
  typeahead?: boolean;
  skipDisabled?: boolean;
  defaultFocusedId?: string;
  onFocusChange?: (focusedId: string | null) => void;
}

interface NavigableState {
  focusedId: string | null;
  items: NavigableItem[];
  typeaheadBuffer: string;
  typeaheadTimeout: number | null;
}

interface NavigableItem {
  id: string;
  ref: HTMLElement;
  disabled: boolean;
  textValue: string;
}

export function useNavigable(props: NavigableProps): NavigableContext {
  // 기존 useNavigableCursor 활용
  const { cursor, handleKeyDown: handleCursorKeyDown } = useNavigableCursor(items);

  // typeahead 로직
  // item registration
  // props getter
}
```

#### 1.2 Context & Provider (1일)

**파일**: `src/shared/lib/behavior/Navigable/NavigableContext.tsx`

```tsx
export const NavigableContext = createContext<NavigableContext | null>(null);

export function NavigableProvider({ children, value }: { children: ReactNode; value: NavigableContext }) {
  return <NavigableContext.Provider value={value}>{children}</NavigableContext.Provider>;
}

export function useNavigableContext(): NavigableContext {
  const context = useContext(NavigableContext);
  if (!context) {
    throw new Error('useNavigableContext must be used within <Navigable>');
  }
  return context;
}
```

#### 1.3 Wrapper Component (1일)

**파일**: `src/shared/lib/behavior/Navigable/Navigable.tsx`

```tsx
export function Navigable({
  orientation,
  loop = false,
  typeahead = true,
  skipDisabled = true,
  defaultFocusedId,
  onFocusChange,
  children,
}: NavigableProps & { children: ReactNode }) {
  const navigable = useNavigable({
    orientation,
    loop,
    typeahead,
    skipDisabled,
    defaultFocusedId,
    onFocusChange,
  });

  return (
    <NavigableProvider value={navigable}>
      {children}
    </NavigableProvider>
  );
}
```

#### 1.4 Item Hook (1일)

**파일**: `src/shared/lib/behavior/Navigable/useNavigableItem.ts`

```tsx
export function useNavigableItem(id: string) {
  const context = useNavigableContext();
  const ref = useRef<HTMLElement>(null);

  // 등록/해제
  useEffect(() => {
    if (ref.current) {
      context.registerItem({
        id,
        ref: ref.current,
        disabled: false,
        textValue: ref.current.textContent || '',
      });
    }
    return () => context.unregisterItem(id);
  }, [id]);

  return {
    isFocused: context.isFocused(id),
    itemProps: context.getItemProps(id),
  };
}
```

#### 1.5 Unit Tests (1일)

**파일**: `src/shared/lib/behavior/Navigable/__tests__/useNavigable.test.ts`

---

### Step 2: Selectable Primitive (Week 1-2)

#### 2.1 Core Hook (1일)

**파일**: `src/shared/lib/behavior/Selectable/useSelectable.ts`

```tsx
interface SelectableProps {
  mode: 'none' | 'single' | 'multiple' | 'extended';
  followFocus?: boolean;
  required?: boolean;
  defaultSelected?: string[];
  selected?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

interface SelectableState {
  selectedIds: Set<string>;
  anchorId: string | null;
  lastActionId: string | null;
  items: SelectableItem[];
}

export function useSelectable(props: SelectableProps): SelectableContext {
  // 선택 로직
  // 범위 선택 로직 (extended mode)
  // followFocus 처리
}
```

#### 2.2 Integration with Navigable (2일)

**핵심**: Navigable과 Selectable이 함께 동작할 때 처리

```tsx
// Selectable이 NavigableContext를 소비
export function useSelectable(props: SelectableProps): SelectableContext {
  const navigable = useNavigableContext(); // optional

  useEffect(() => {
    if (props.followFocus && navigable) {
      // 포커스 이동 → 자동 선택
      if (navigable.focusedId) {
        select(navigable.focusedId);
      }
    }
  }, [navigable?.focusedId, props.followFocus]);

  // ...
}
```

#### 2.3 Context & Provider (1일)

#### 2.4 Wrapper Component (1일)

#### 2.5 Item Hook (1일)

#### 2.6 Unit Tests (1일)

---

### Step 3: PPT 썸네일 통합 (Week 2)

#### 3.1 SlideListRenderer (1일)

**파일**: `src/apps/PPT/renderers/SlideListRenderer.tsx`

```tsx
export function SlideListRenderer({
  children,
  spec,
  ...props
}: BlockRendererProps) {
  return (
    <Selectable mode="extended" followFocus={false}>
      <Navigable orientation="vertical" loop={false}>
        <div role="listbox" className="slide-list" {...props}>
          {children}
        </div>
      </Navigable>
    </Selectable>
  );
}
```

#### 3.2 SlideRenderer (1일)

**파일**: `src/apps/PPT/renderers/SlideRenderer.tsx`

```tsx
export function SlideRenderer({
  id,
  children,
  ...props
}: ElementRendererProps) {
  const nav = useNavigableItem(id);
  const sel = useSelectableItem(id);

  return (
    <div
      {...nav.itemProps}
      {...sel.itemProps}
      role="option"
      className={cn(
        'slide-thumbnail',
        nav.isFocused && 'focused',
        sel.isSelected && 'selected'
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

#### 3.3 Renderer 등록 시스템 (2일)

**파일**: `src/shared/lib/renderer/registry.ts`

```tsx
type Renderer = (props: RendererProps) => JSX.Element;

const RENDERER_REGISTRY: Record<string, Renderer> = {};

export function registerRenderer(role: string, renderer: Renderer) {
  RENDERER_REGISTRY[role] = renderer;
}

export function getRenderer(role: string): Renderer | undefined {
  return RENDERER_REGISTRY[role];
}

// 앱 초기화 시
registerRenderer('SlideList', SlideListRenderer);
registerRenderer('Slide', SlideRenderer);
```

#### 3.4 Block 컴포넌트 통합 (2일)

**파일**: `src/components/types/Block/Block.tsx`

```tsx
export function Block({ role, children, ...props }: BlockProps) {
  const renderer = getRenderer(role);

  if (renderer) {
    return renderer({ role, children, ...props });
  }

  // Fallback: default rendering
  return <div {...props}>{children}</div>;
}
```

#### 3.5 시각적 피드백 (1일)

**파일**: `src/apps/PPT/styles/slide-thumbnail.css`

```css
/* 포커스 (Navigable) */
.slide-thumbnail[data-focused="true"] {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* 선택 (Selectable) */
.slide-thumbnail[data-selected="true"] {
  background: var(--accent-muted);
  border: 2px solid var(--accent);
}

/* 포커스 + 선택 */
.slide-thumbnail[data-focused="true"][data-selected="true"] {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

/* 체크마크 */
.slide-thumbnail[data-selected="true"]::after {
  content: "✓";
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--accent);
}
```

#### 3.6 통합 테스트 (1일)

---

### Step 4: FocusScope Primitive (Week 3)

#### 4.1 Core Hook (1일)

**파일**: `src/shared/lib/behavior/FocusScope/useFocusScope.ts`

```tsx
// 기존 src/shared/lib/keyboard/useFocusScope.ts 활용
interface FocusScopeProps {
  trap?: boolean;
  restoreFocus?: boolean;
  autoFocus?: 'first' | 'last' | 'none' | string;
  focusContainerFallback?: boolean;
}

export function useFocusScope(props: FocusScopeProps): FocusScopeContext {
  // 기존 useFocusScope 로직 재활용
  // + trap, restoreFocus 추가
}
```

#### 4.2 Context & Wrapper (1일)

#### 4.3 Modal/Dialog 통합 (2일)

**파일**: `src/components/types/Overlay/renderers/DialogRenderer.tsx`

```tsx
export function DialogRenderer({ children, ...props }: OverlayProps) {
  return (
    <FocusScope trap restoreFocus autoFocus="first">
      <div className="dialog-overlay">
        <div className="dialog-content">
          {children}
        </div>
      </div>
    </FocusScope>
  );
}
```

#### 4.4 CommandPalette 통합 (1일)

#### 4.5 Tests (1일)

---

## 📊 우선순위

| Priority | Item | Reason | Deadline |
|----------|------|--------|----------|
| **P0** | Navigable Hook | 모든 것의 기반 | Week 1 |
| **P0** | Selectable Hook | PPT 핵심 기능 | Week 1-2 |
| **P0** | PPT 썸네일 통합 | 1차 목표 | Week 2 |
| **P1** | FocusScope | 모달 접근성 필수 | Week 3 |
| **P2** | Grid Navigation | 추후 (이모지 디자이너) | TBD |
| **P2** | Tree Navigation | 추후 (파일 트리) | TBD |
| **P3** | Reorderable | 추후 (슬라이드 순서 변경) | TBD |

---

## 🧪 테스트 계획

### Unit Tests

**파일**: `src/shared/lib/behavior/**/__tests__/*.test.ts`

```tsx
// useNavigable.test.ts
describe('useNavigable', () => {
  test('↓ 키로 다음 항목으로 포커스 이동', () => {
    // ...
  });

  test('Home 키로 첫 항목으로 점프', () => {
    // ...
  });

  test('typeahead: "a" 입력 시 a로 시작하는 항목으로 이동', () => {
    // ...
  });
});

// useSelectable.test.ts
describe('useSelectable - extended mode', () => {
  test('Shift+클릭으로 범위 선택', () => {
    // ...
  });

  test('Ctrl+A로 전체 선택', () => {
    // ...
  });
});
```

### Integration Tests

**파일**: `src/apps/PPT/__tests__/SlideList.integration.test.tsx`

```tsx
describe('PPT Slide List', () => {
  test('사용자 시나리오: 슬라이드 3~5 삭제', async () => {
    // 1. Slide 3 클릭
    // 2. Shift+클릭 Slide 5
    // 3. Delete 키
    // 4. 3개 슬라이드 삭제 확인
  });
});
```

### Accessibility Tests

```tsx
describe('Accessibility', () => {
  test('ARIA roles 올바르게 설정됨', () => {
    // role="listbox", role="option"
  });

  test('aria-selected 상태 업데이트', () => {
    // aria-selected="true/false"
  });

  test('키보드만으로 모든 조작 가능', () => {
    // Tab, ↑↓, Space, Enter
  });
});
```

### Screen Reader Tests (수동)

- **NVDA** (Windows): "Slide 3, selected, 3 of 10"
- **VoiceOver** (macOS): "Slide 3, listbox option, 3 of 10"

---

## 📦 의존성

### 신규 패키지 (없음)

모든 기능을 React 내장 API로 구현:
- `useContext`, `useRef`, `useEffect` 등
- DOM API (focus, addEventListener)

### 기존 활용

- `src/shared/lib/keyboard/useNavigableCursor.ts` ✅
- `src/shared/lib/keyboard/useFocusScope.ts` ✅
- `src/shared/lib/utils.ts` (cn 함수) ✅

---

## ⚠️ 리스크 및 대응

### Risk 1: Navigable + Selectable 통합 복잡도

**문제**: 두 Context가 서로 의존할 때 순환 참조 가능

**대응**:
- Selectable이 Navigable을 optional하게 소비
- `useNavigableContext()` 호출 시 존재하지 않으면 null 반환

```tsx
export function useNavigableContext(): NavigableContext | null {
  return useContext(NavigableContext); // throw 안함
}
```

### Risk 2: 렌더러 등록 시스템 미흡

**문제**: 현재 렌더러 등록 시스템 없음

**대응**:
- Step 3.3에서 간단한 registry 구현
- `registerRenderer()` 전역 함수

### Risk 3: ARIA 접근성 완성도

**문제**: ARIA 패턴 복잡함 (listbox, grid, tree 각각 다름)

**대응**:
- 1차: listbox만 완벽하게 구현
- 2차: grid, tree 추가

### Risk 4: 성능 (100+ 슬라이드)

**문제**: 많은 항목 등록 시 성능 저하 가능

**대응**:
- Virtual scrolling 적용 (react-window)
- Item registration을 throttle

---

## 📅 일정

### Week 1 (2026-01-13 ~ 2026-01-17)

| 날짜 | 작업 | 산출물 |
|------|------|--------|
| 월 | Navigable Hook 구현 | `useNavigable.ts` |
| 화 | Navigable Context & Wrapper | `Navigable.tsx` |
| 수 | Navigable Item Hook & Tests | `useNavigableItem.ts` |
| 목 | Selectable Hook 구현 | `useSelectable.ts` |
| 금 | Selectable Context & Wrapper | `Selectable.tsx` |

### Week 2 (2026-01-20 ~ 2026-01-24)

| 날짜 | 작업 | 산출물 |
|------|------|--------|
| 월 | Selectable Item Hook & Tests | `useSelectableItem.ts` |
| 화 | Renderer Registry 구현 | `registry.ts` |
| 수 | SlideListRenderer 구현 | `SlideListRenderer.tsx` |
| 목 | SlideRenderer 구현 | `SlideRenderer.tsx` |
| 금 | PPT 앱 통합 & 시각적 피드백 | 완성된 썸네일 리스트 |

### Week 3 (2026-01-27 ~ 2026-01-31)

| 날짜 | 작업 | 산출물 |
|------|------|--------|
| 월 | FocusScope Hook 구현 | `useFocusScope.ts` |
| 화 | FocusScope Context & Wrapper | `FocusScope.tsx` |
| 수 | Modal/Dialog 통합 | `DialogRenderer.tsx` |
| 목 | CommandPalette 통합 | `CommandPaletteRenderer.tsx` |
| 금 | 최종 테스트 & 문서화 | README, 예제 |

---

## ✅ 완료 조건 (Definition of Done)

### Phase 1: Navigable + Selectable

- [ ] PPT 썸네일에서 ↑↓ 키보드 탐색 동작
- [ ] Space 키로 선택 토글
- [ ] Shift+클릭으로 범위 선택 (3~5번 슬라이드)
- [ ] Ctrl+A로 전체 선택
- [ ] Delete 키로 선택된 슬라이드 삭제
- [ ] 포커스와 선택 상태가 시각적으로 명확히 구분됨
- [ ] Screen reader로 "Slide 3, selected, 3 of 10" 읽힘
- [ ] Unit tests 80% 이상 커버리지
- [ ] Integration tests 통과

### Phase 2: FocusScope

- [ ] 모달 열릴 때 첫 번째 요소에 자동 포커스
- [ ] Tab 키로 모달 내에서만 순환
- [ ] Escape 키로 모달 닫기
- [ ] 모달 닫힐 때 이전 포커스 위치로 복원
- [ ] 중첩 모달에서도 동작

---

## 📝 문서화

### 개발 문서

- [x] 구현 계획서 (본 문서)
- [ ] API 레퍼런스 (`docs/2-areas/behavior/api-reference.md`)
- [ ] 렌더러 개발 가이드 (`docs/2-areas/behavior/renderer-guide.md`)
- [ ] 마이그레이션 가이드 (`docs/2-areas/behavior/migration.md`)

### 사용자 문서

- [ ] Navigable 사용 예제
- [ ] Selectable 사용 예제
- [ ] FocusScope 사용 예제
- [ ] Composition Patterns (조합 패턴)

---

## 🔗 참고 자료

**스펙**:
- `docs/2-areas/spec/interaction/interaction.spec.draft.md` - IDDL Behavior Primitives 공식 스펙
- `docs/2-areas/core/behavior/` - Behavior Intent 개념 문서

**기존 구현**:
- `src/shared/lib/keyboard/useNavigableCursor.ts` - 커서 이동 로직
- `src/shared/lib/keyboard/useFocusScope.ts` - 포커스 스코프 로직
- `src/shared/lib/keyboard/useTreeNavigation.ts` - 트리 네비게이션

**외부 레퍼런스**:
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) - Listbox, Grid, Tree 패턴
- [React Aria](https://react-spectrum.adobe.com/react-aria/) - Adobe의 headless UI hooks
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components

---

**작성일**: 2026-01-11
**작성자**: Claude Code
**상태**: ✅ 계획 완료, 구현 대기
**다음**: Week 1 Day 1 - Navigable Hook 구현 시작
