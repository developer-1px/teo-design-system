# Headless Component Strategy - Complete를 Headless로

**작성일**: 2026-01-16
**목적**: Complete Component 중 Headless 패턴으로 분리 가능한 것들을 식별하고 전략 수립

---

## 핵심 개념: Headless 패턴

### Headless란?

**Headless = Logic(행동) + State(상태)만 제공, UI는 사용자가 결정**

```typescript
// ✅ Headless Hook (Logic만)
const { size, resizeHandleProps } = useResizable({
  direction: "right",
  defaultSize: 512,
  minSize: 320,
  maxSize: 800,
});

// UI는 사용자가 자유롭게 구성
<div style={{ width: `${size}px` }}>
  <div {...resizeHandleProps}>Resize Handle</div>
  <MyContent />
</div>
```

**vs Complete Component (Logic + UI 모두 제공)**

```typescript
// 🟢 Complete Component (Logic + UI)
<Drawer
  open={open}
  onClose={onClose}
  position="right"
  size={512}
  resizable={{ min: 320, max: 800 }}
>
  <Drawer.Content />
</Drawer>
```

---

## 현재 Headless 구현: useResizable

### 완벽한 Headless 예시

**파일**: `src/design-system/Resizable/useResizable.ts`

```typescript
export interface UseResizableOptions {
  direction: ResizeDirection;
  defaultSize: number;
  minSize?: number;
  maxSize?: number;
  storageKey?: string;
  onResize?: (size: number) => void;
}

export interface UseResizableReturn {
  size: number;
  isDragging: boolean;
  resizeHandleProps: {
    onMouseDown: (e: React.MouseEvent) => void;
    onDoubleClick: () => void;
  };
  reset: () => void;
}

export function useResizable(options: UseResizableOptions): UseResizableReturn {
  // Logic + State만 제공
  // UI는 전혀 관여하지 않음
}
```

**사용 예시**:

```typescript
// CRMDrawer.tsx에서 사용
const { size, resizeHandleProps } = useResizable({
  direction: "right",
  defaultSize: 512,
  minSize: 320,
  maxSize: 800,
  storageKey: "crm-drawer-width",
});

// 자유롭게 Frame으로 구성
<Frame w={`${size}px`} style={{ position: "absolute", ... }}>
  <ResizeHandle direction="right" {...resizeHandleProps} />
  {content}
</Frame>
```

**장점**:
- ✅ UI 완전히 자유
- ✅ Frame, div, 뭐든 사용 가능
- ✅ 스타일 완전 제어
- ✅ 테스트 쉬움 (Logic만 테스트)

---

## Headless로 만들 수 있는 Complete Components

### 분류 기준

**Headless 가능:**
- 복잡한 **상태 관리**가 있음
- 복잡한 **이벤트 처리**가 있음
- **UI가 다양**할 수 있음

**Headless 불필요:**
- 상태가 단순함
- UI가 고정적임
- Props로 충분함

---

## 1. Accordion - Headless 가능 ✅

### WHY Headless?

**복잡한 상태:**
- 열기/닫기 상태 (`expanded`)
- 여러 아이템 동시 열기 (`allowMultiple`)
- 애니메이션 상태
- 키보드 네비게이션 (↑↓ 키)

**다양한 UI:**
- PropertySection (현재 구현)
- FAQ 아코디언
- Sidebar 메뉴 접기/펼치기
- Settings 패널

### Headless API

```typescript
// useAccordion.ts
export interface UseAccordionOptions {
  items: string[]; // item IDs
  defaultExpanded?: string[];
  allowMultiple?: boolean;
  onChange?: (expandedIds: string[]) => void;
}

export interface UseAccordionReturn {
  expandedIds: Set<string>;
  getItemProps: (id: string) => {
    expanded: boolean;
    onToggle: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
  expandAll: () => void;
  collapseAll: () => void;
}
```

### 사용 예시

```typescript
// Headless 사용 (완전 자유)
const { expandedIds, getItemProps } = useAccordion({
  items: ["contact", "address", "metadata"],
  defaultExpanded: ["contact"],
  allowMultiple: true,
});

return (
  <Frame layout={Layout.Stack.Content.Default}>
    {items.map((item) => {
      const props = getItemProps(item.id);
      return (
        <Frame key={item.id}>
          <Frame {...props} onClick={props.onToggle}>
            <Icon src={props.expanded ? ChevronDown : ChevronRight} />
            <Text.Menu.Group>{item.title}</Text.Menu.Group>
          </Frame>
          {props.expanded && <Frame>{item.content}</Frame>}
        </Frame>
      );
    })}
  </Frame>
);
```

```typescript
// Complete Component 사용 (편리함)
<Accordion
  items={[
    { id: "contact", title: "Contact", content: <ContactForm /> },
    { id: "address", title: "Address", content: <AddressForm /> },
  ]}
  defaultExpanded={["contact"]}
  allowMultiple={true}
/>
```

**결론**: ✅ **둘 다 제공** (Headless Hook + Complete Component)

---

## 2. Tabs - Headless 가능 ✅

### WHY Headless?

**복잡한 상태:**
- 활성 탭 관리
- 키보드 네비게이션 (←→ 키)
- 포커스 관리
- URL과 동기화 (optional)

**다양한 UI:**
- 상단 탭 (Linear 스타일)
- 사이드 탭 (Settings 패널)
- Segmented Control (iOS 스타일)
- Pills (Chrome 탭 스타일)

### Headless API

```typescript
// useTabs.ts
export interface UseTabsOptions {
  tabs: string[]; // tab IDs
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  orientation?: "horizontal" | "vertical";
}

export interface UseTabsReturn {
  activeTab: string;
  getTabProps: (id: string) => {
    active: boolean;
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    role: "tab";
    "aria-selected": boolean;
    tabIndex: number;
  };
  getPanelProps: (id: string) => {
    hidden: boolean;
    role: "tabpanel";
    "aria-labelledby": string;
  };
}
```

### 사용 예시

```typescript
// Headless 사용
const { activeTab, getTabProps, getPanelProps } = useTabs({
  tabs: ["overview", "activity", "settings"],
  defaultTab: "overview",
});

return (
  <Frame>
    <Frame row gap={2}>
      {tabs.map((tab) => (
        <Action
          key={tab.id}
          {...getTabProps(tab.id)}
          variant={getTabProps(tab.id).active ? "primary" : "ghost"}
        >
          {tab.label}
        </Action>
      ))}
    </Frame>
    {tabs.map((tab) => (
      <Frame key={tab.id} {...getPanelProps(tab.id)}>
        {tab.content}
      </Frame>
    ))}
  </Frame>
);
```

**결론**: ✅ **둘 다 제공** (Headless Hook + Complete Component)

---

## 3. Dropdown/Select - Headless 가능 ✅

### WHY Headless?

**복잡한 상태:**
- 열기/닫기 상태
- 선택된 아이템 관리
- 포커스/호버 상태
- 키보드 네비게이션 (↑↓Enter Esc)
- 위치 계산 (포지셔닝)
- 검색 (Combobox)

**다양한 UI:**
- Dropdown 메뉴
- Select 폼
- Combobox (검색 + 선택)
- Multi-select
- Command Palette

### Headless API

```typescript
// useDropdown.ts
export interface UseDropdownOptions {
  items: DropdownItem[];
  selected?: string;
  onChange?: (id: string) => void;
  placement?: "top" | "bottom" | "left" | "right";
  closeOnSelect?: boolean;
}

export interface UseDropdownReturn {
  open: boolean;
  selectedId: string | null;
  highlightedIndex: number;

  getTriggerProps: () => {
    onClick: () => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    "aria-expanded": boolean;
    "aria-haspopup": "listbox";
  };

  getMenuProps: () => {
    role: "listbox";
    onKeyDown: (e: React.KeyboardEvent) => void;
  };

  getItemProps: (index: number) => {
    selected: boolean;
    highlighted: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    role: "option";
    "aria-selected": boolean;
  };

  setOpen: (open: boolean) => void;
}
```

**결론**: ✅ **둘 다 제공** (Headless Hook + Complete Component)

---

## 4. Modal/Dialog - Headless 가능 ✅

### WHY Headless?

**복잡한 상태:**
- 열기/닫기 상태
- 포커스 트랩 (모달 내부에만 포커스)
- Esc 키로 닫기
- Backdrop 클릭으로 닫기
- 스크롤 락 (body scroll 방지)
- 애니메이션 (fade in/out)

**다양한 UI:**
- 중앙 모달
- 사이드 모달 (Drawer와 유사)
- 전체화면 모달
- 알림 다이얼로그
- Confirm 다이얼로그

### Headless API

```typescript
// useModal.ts
export interface UseModalOptions {
  open: boolean;
  onClose?: () => void;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  lockScroll?: boolean;
  preventClose?: boolean; // 닫기 방지 (form 작성 중)
}

export interface UseModalReturn {
  open: boolean;

  getBackdropProps: () => {
    onClick: () => void;
    "aria-hidden": true;
  };

  getDialogProps: () => {
    role: "dialog";
    "aria-modal": true;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };

  getCloseButtonProps: () => {
    onClick: () => void;
    "aria-label": "Close";
  };

  close: () => void;
}
```

**결론**: ✅ **둘 다 제공** (Headless Hook + Complete Component)

---

## 5. Tooltip/Popover - Headless 가능 ✅

### WHY Headless?

**복잡한 상태:**
- 열기/닫기 상태
- 위치 계산 (auto-positioning)
- 지연 표시/숨김 (delay)
- 호버/포커스 상태
- Arrow 위치 계산

**다양한 UI:**
- Tooltip (작은 텍스트)
- Popover (큰 콘텐츠)
- Context Menu
- Hover Card

### Headless API

```typescript
// useTooltip.ts
export interface UseTooltipOptions {
  placement?: "top" | "bottom" | "left" | "right";
  delay?: number;
  offset?: number;
  arrow?: boolean;
}

export interface UseTooltipReturn {
  open: boolean;
  position: { x: number; y: number };
  arrowPosition: { x: number; y: number };

  getTriggerProps: () => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    "aria-describedby": string;
  };

  getTooltipProps: () => {
    id: string;
    role: "tooltip";
    style: React.CSSProperties;
  };
}
```

**결론**: ✅ **둘 다 제공** (Headless Hook + Complete Component)

---

## 6. Table/DataTable - Headless 불필요 ❌

### WHY NOT Headless?

**이유:**
- Tanstack Table이 이미 Headless임
- 우리가 만들 건 Tanstack Table의 **래퍼 (Wrapper)**
- Headless Hook을 만들면 Tanstack Table 재구현이 됨

**올바른 접근:**
```typescript
// ✅ Complete Component (Tanstack Table 래퍼)
<DataTable
  columns={columns}
  data={data}
  sorting={true}
  onRowClick={handleRowClick}
/>
```

**결론**: ❌ **Complete Component만** (Tanstack Table 래퍼)

---

## 7. Drawer - Headless 불필요 (useResizable로 충분) ⚠️

### 분석

**Drawer의 로직:**
1. **Resizable** → `useResizable` 이미 있음
2. **열기/닫기** → `open` prop으로 단순 처리
3. **위치 계산** → CSS로 충분 (`position: absolute`)
4. **Backdrop** → Complete Component에서 처리

**결론**: ⚠️ **Complete Component만** (useResizable 활용)

```typescript
// Drawer.tsx
export function Drawer({ open, position, size, resizable, children }) {
  const { size: currentSize, resizeHandleProps } = useResizable({
    direction: position,
    defaultSize: size,
    ...resizable,
  });

  if (!open) return null;

  return (
    <>
      <Backdrop onClick={onClose} />
      <Frame
        w={`${currentSize}px`}
        style={{ position: "absolute", [position]: 0, ... }}
      >
        <ResizeHandle direction={position} {...resizeHandleProps} />
        {children}
      </Frame>
    </>
  );
}
```

---

## 8. Toast - Headless 가능 ✅

### WHY Headless?

**복잡한 상태:**
- Toast 큐 관리 (여러 개 표시)
- 자동 사라짐 (timeout)
- 스택 위치 계산
- 애니메이션 (slide in/out)
- 우선순위 관리

**다양한 UI:**
- 우상단 Toast (일반)
- 하단 Toast (모바일)
- 중앙 Toast
- 좌측 Toast

### Headless API

```typescript
// useToast.ts
export interface UseToastOptions {
  duration?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  max?: number; // 최대 Toast 개수
}

export interface UseToastReturn {
  toasts: Toast[];

  show: (message: string, options?: ToastOptions) => string;
  success: (message: string) => string;
  error: (message: string) => string;
  warning: (message: string) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;

  getToastProps: (id: string) => {
    onDismiss: () => void;
    progress: number; // 0-100
    position: { x: number; y: number };
  };
}
```

**결론**: ✅ **둘 다 제공** (Headless Hook + Complete Component)

---

## 9. Carousel - Headless 가능 ✅

### WHY Headless?

**복잡한 상태:**
- 현재 슬라이드 인덱스
- 자동 재생
- 드래그 제스처
- 무한 루프
- 페이지네이션

**다양한 UI:**
- 이미지 캐러셀
- 카드 캐러셀
- 풀스크린 갤러리
- Testimonial 슬라이더

### Headless API

```typescript
// useCarousel.ts
export interface UseCarouselOptions {
  items: string[]; // item IDs
  defaultIndex?: number;
  autoplay?: boolean;
  interval?: number;
  loop?: boolean;
}

export interface UseCarouselReturn {
  currentIndex: number;

  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;

  getContainerProps: () => {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };

  getSlideProps: (index: number) => {
    active: boolean;
    style: React.CSSProperties;
  };

  getPaginationProps: (index: number) => {
    active: boolean;
    onClick: () => void;
  };
}
```

**결론**: ✅ **둘 다 제공** (Headless Hook + Complete Component)

---

## 최종 분류

### ✅ Headless + Complete 둘 다 제공 (9개)

| Component | Headless Hook | Complete Component |
|-----------|--------------|-------------------|
| **Resizable** | `useResizable` ✅ (이미 구현) | `ResizablePanel` ✅ (이미 구현) |
| **Accordion** | `useAccordion` | `<Accordion />` |
| **Tabs** | `useTabs` | `<Tabs />` |
| **Dropdown** | `useDropdown` | `<Dropdown />` |
| **Select** | `useSelect` | `<Select />` |
| **Modal** | `useModal` | `<Modal />` |
| **Tooltip** | `useTooltip` | `<Tooltip />` |
| **Toast** | `useToast` | `<Toast />` + `<ToastProvider />` |
| **Carousel** | `useCarousel` | `<Carousel />` |

### 🟢 Complete만 제공 (나머지 25개)

| Component | 이유 |
|-----------|------|
| **DataTable** | Tanstack Table이 이미 Headless |
| **Drawer** | useResizable로 충분 |
| **Calendar** | 복잡한 날짜 계산 (라이브러리 래퍼) |
| **DatePicker** | Calendar + Input (복합 컴포넌트) |
| **Combobox** | useDropdown + useSelect 조합 |
| **Dialog** | Modal의 변형 (확인/취소 버튼) |
| **Popover** | Tooltip과 유사하지만 더 복잡 |
| **CodeBlock** | 문법 강조 (라이브러리 래퍼) |
| **Progress** | 단순 상태 (value prop) |
| **Skeleton** | 단순 UI (상태 없음) |
| **Avatar** | 단순 UI (이미지 + Fallback) |
| **Badge** | 단순 UI (텍스트 + 색상) |
| ... | ... |

---

## 구현 전략

### Phase 1: Headless Hooks 우선 구현

**WHY?**
- Complete Component는 Headless Hook 위에 만들면 됨
- Headless Hook은 테스트하기 쉬움
- 재사용성 극대화

**우선순위:**
1. ✅ `useResizable` (이미 구현)
2. `useAccordion` (PropertySection 표준화)
3. `useTabs` (여러 앱에서 필요)
4. `useDropdown` (폼 필수)
5. `useModal` (다이얼로그 필수)

### Phase 2: Complete Component 구현

Headless Hook 위에 MDK 디자인 시스템 적용

```typescript
// ✅ 전략: Headless Hook + MDK Frame/Action/Text
export function Accordion({ items, defaultExpanded, allowMultiple }: AccordionProps) {
  const { expandedIds, getItemProps } = useAccordion({
    items: items.map(i => i.id),
    defaultExpanded,
    allowMultiple,
  });

  return (
    <Frame layout={Layout.Stack.Content.Default}>
      {items.map((item) => {
        const props = getItemProps(item.id);
        return (
          <Frame key={item.id}>
            <Action
              {...props}
              onClick={props.onToggle}
              variant="ghost"
              w="100%"
              justify="start"
            >
              <Icon src={props.expanded ? ChevronDown : ChevronRight} />
              <Text.Menu.Group>{item.title}</Text.Menu.Group>
            </Action>
            {props.expanded && (
              <Frame layout={Layout.Stack.List.Default}>
                {item.content}
              </Frame>
            )}
          </Frame>
        );
      })}
    </Frame>
  );
}
```

---

## 파일 구조

```
src/design-system/
├── hooks/                      # ✅ Headless Hooks
│   ├── useResizable.ts         # ✅ 이미 구현
│   ├── useAccordion.ts
│   ├── useTabs.ts
│   ├── useDropdown.ts
│   ├── useModal.ts
│   ├── useTooltip.ts
│   ├── useToast.ts
│   └── useCarousel.ts
│
├── Complete/                   # 🟢 Complete Components
│   ├── Accordion/
│   │   ├── Accordion.tsx       # useAccordion 사용
│   │   └── Accordion.types.ts
│   ├── Tabs/
│   │   ├── Tabs.tsx            # useTabs 사용
│   │   └── Tabs.types.ts
│   ├── Dropdown/
│   │   ├── Dropdown.tsx        # useDropdown 사용
│   │   └── Dropdown.types.ts
│   ├── Modal/
│   │   ├── Modal.tsx           # useModal 사용
│   │   └── Modal.types.ts
│   ├── Drawer/
│   │   ├── Drawer.tsx          # useResizable 사용
│   │   └── Drawer.types.ts
│   ├── DataTable/
│   │   ├── DataTable.tsx       # Tanstack Table 래퍼
│   │   └── DataTable.types.ts
│   └── ...
│
└── Resizable/                  # ✅ 이미 구현
    ├── useResizable.ts         # Headless Hook
    ├── ResizeHandle.tsx        # UI Component
    └── ResizablePanel.tsx      # Complete Component
```

---

## 다음 단계

### 즉시 실행

1. ✅ `useAccordion` 구현
2. ✅ `Accordion` Complete Component 구현 (useAccordion 사용)
3. ✅ PropertySection을 Accordion으로 교체

### 이후 작업

4. ✅ `useTabs` 구현
5. ✅ `Tabs` Complete Component 구현
6. ✅ `useDropdown` 구현
7. ✅ `Dropdown` Complete Component 구현

---

## 결론

### Headless 패턴의 장점

**✅ 장점:**
1. **최대 유연성** - UI 완전 제어
2. **재사용성** - Logic만 재사용
3. **테스트 용이** - Logic만 테스트
4. **번들 사이즈** - UI 없으면 작음
5. **타입 안정성** - Props 타입 명확

**⚠️ 단점:**
1. **사용 난이도** - 직접 UI 구성 필요
2. **보일러플레이트** - 매번 UI 작성

### 해결책: 둘 다 제공

**Headless Hook** - 고급 사용자/커스텀 UI
```typescript
const { expandedIds, getItemProps } = useAccordion({ ... });
```

**Complete Component** - 일반 사용자/빠른 개발
```typescript
<Accordion items={items} />
```

**이게 바로 최고의 전략!** 🎉

- Headless Hook: 완전한 자유
- Complete Component: 편리한 기본값
- 사용자가 선택

이제 구현 시작할 준비 완료! 🚀
