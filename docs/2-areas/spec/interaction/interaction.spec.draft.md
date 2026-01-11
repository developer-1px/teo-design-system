# IDDL Behavior Primitives Specification

**Draft Community Group Report, 11 January 2026**

---

## Abstract

이 문서는 IDDL(Intent-Driven Design Language)의 Behavior Primitives를 정의합니다. Behavior Primitives는 **키보드 탐색, 선택, 포커스 관리** 등 인터랙티브 UI의 핵심 동작을 선언적으로 제공하는 Wrapper 컴포넌트입니다.

IDDL의 기존 5축(Role, Intent, Prominence, Density, Spec)이 **Visual/Semantic** 영역을 담당한다면, Behavior Primitives는 **Interaction** 영역을 담당합니다.

---

## Status of This Document

This document is a **Working Draft**.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Architecture](#2-architecture)
3. [Navigable](#3-navigable)
4. [Selectable](#4-selectable)
5. [FocusScope](#5-focusscope)
6. [Composition Patterns](#6-composition-patterns)
7. [Renderer Implementation Guide](#7-renderer-implementation-guide)
8. [Accessibility](#8-accessibility)
9. [Examples](#9-examples)

---

## 1. Introduction

### 1.1 Problem Statement

웹 UI는 기본적으로 **Document** 패러다임입니다:
- 탐색: 링크 클릭
- 선택: 텍스트 드래그 정도
- 키보드: Tab으로 폼 요소 이동

그러나 **Application** 패러다임에서는:
- 탐색: 키보드로 빠르게 항목 간 이동
- 선택: 대상을 지정하고 명령 실행
- 키보드: 모든 조작이 키보드로 가능해야 함

이 간극을 메우기 위해 개발자는 복잡한 키보드 이벤트 핸들링, 포커스 관리, 선택 상태 관리를 직접 구현해야 합니다.

### 1.2 Solution: Declarative Behavior

IDDL Behavior Primitives는 이러한 복잡한 동작을 **선언적**으로 제공합니다:

```tsx
// ❌ 명령형: 개발자가 모든 것을 구현
const [focusedIndex, setFocusedIndex] = useState(0);
const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowDown') {
    setFocusedIndex(i => Math.min(i + 1, items.length - 1));
  }
  if (e.key === 'ArrowUp') {
    setFocusedIndex(i => Math.max(i - 1, 0));
  }
  if (e.key === ' ') {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(items[focusedIndex].id)) {
        next.delete(items[focusedIndex].id);
      } else {
        next.add(items[focusedIndex].id);
      }
      return next;
    });
  }
  // ... Shift+Arrow, Ctrl+A, Home, End, PageUp, PageDown...
};

// ✅ 선언형: Wrapper로 감싸기만 하면 됨
<Selectable mode="extended">
  <Navigable orientation="vertical">
    <List>
      {items.map(item => <ListItem key={item.id} />)}
    </List>
  </Navigable>
</Selectable>
```

### 1.3 Design Principles

1. **Declarative over Imperative**: Props로 동작 선언, 구현은 Primitive가 담당
2. **Composable**: 작은 Primitive 조합으로 복잡한 동작 구성
3. **Headless**: DOM 구조/스타일 없음, Context만 제공
4. **Accessible**: ARIA 패턴 자동 적용
5. **Customizable**: 테마 개발자가 Hooks로 직접 사용 가능

### 1.4 Two-Track Architecture

| Track | 대상 | 사용 방식 | 복잡도 |
|-------|------|----------|--------|
| **Track 1** | 앱 개발자 | IDDL Role 선언 | 낮음 |
| **Track 2** | 렌더러/테마 개발자 | Wrapper + Hooks | 높음 |

**앱 개발자**는 Role만 선언:
```tsx
<Block role="List" spec={{ selection: 'multiple' }}>
  <Action role="ListItem">Item 1</Action>
</Block>
```

**렌더러 개발자**가 Wrapper로 구현:
```tsx
// List 렌더러 내부
<Selectable mode={spec.selection}>
  <Navigable orientation="vertical">
    {children}
  </Navigable>
</Selectable>
```

---

## 2. Architecture

### 2.1 Layer Structure

```
┌─────────────────────────────────────────────────────────┐
│                    IDDL Document                        │
│  (Role 선언 - 앱 개발자)                                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    IDDL Renderer                        │
│  (Role → Behavior 매핑)                                 │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
┌─────────────────┐ ┌───────────┐ ┌─────────────────┐
│ Behavior        │ │  Theme    │ │  Component      │
│ Primitives      │ │  Tokens   │ │  Library        │
│                 │ │           │ │                 │
│ • Navigable     │ │ • Colors  │ │ • List          │
│ • Selectable    │ │ • Spacing │ │ • Tree          │
│ • FocusScope    │ │ • Fonts   │ │ • Table         │
└─────────────────┘ └───────────┘ └─────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────┐
│                   Headless Hooks                        │
│  (내부 구현)                                             │
│                                                         │
│  • useNavigable()                                       │
│  • useSelectable()                                      │
│  • useFocusScope()                                      │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Context Flow

```
┌─────────────────────────────────────────────────────────┐
│ <FocusScope>                                            │
│   FocusScopeContext ─────────────────────────────────┐  │
│                                                      │  │
│   ┌─────────────────────────────────────────────────┐│  │
│   │ <Selectable>                                    ││  │
│   │   SelectableContext ──────────────────────────┐ ││  │
│   │                                               │ ││  │
│   │   ┌─────────────────────────────────────────┐ │ ││  │
│   │   │ <Navigable>                             │ │ ││  │
│   │   │   NavigableContext ───────────────────┐ │ │ ││  │
│   │   │                                       │ │ │ ││  │
│   │   │   ┌─────────────────────────────────┐ │ │ │ ││  │
│   │   │   │ <Item>                          │ │ │ │ ││  │
│   │   │   │   • useNavigableContext() ◄─────┘ │ │ ││  │
│   │   │   │   • useSelectableContext() ◄──────┘ │ ││  │
│   │   │   │   • useFocusScopeContext() ◄────────┘ ││  │
│   │   │   └─────────────────────────────────┘     ││  │
│   │   └─────────────────────────────────────────┘ ││  │
│   └───────────────────────────────────────────────┘│  │
└────────────────────────────────────────────────────┘  │
```

### 2.3 Primitive Categories

| Category | Primitives | Purpose |
|----------|------------|---------|
| **Navigation** | Navigable | 항목 간 키보드 탐색 |
| **Selection** | Selectable | 항목 선택/해제 |
| **Focus** | FocusScope | 포커스 범위/트랩 관리 |
| **Structure** | Expandable, Groupable | 계층/그룹 구조 (Tier 2) |
| **Manipulation** | Reorderable, Editable | 순서/내용 변경 (Tier 3) |
| **Overlay** | Dismissable | 오버레이 닫기 (Tier 2) |

---

## 3. Navigable

### 3.1 Intent

> **"이 영역 안의 항목들을 키보드로 순차 탐색할 수 있다"**

마우스 없이 키보드만으로 원하는 항목에 도달할 수 있어야 합니다. 이는 접근성의 기본이자, 파워 유저의 생산성을 위한 필수 기능입니다.

### 3.2 Props

```ts
interface NavigableProps {
  /**
   * 탐색 방향
   * - 'vertical': ↑↓ 키로 탐색 (List, Menu)
   * - 'horizontal': ←→ 키로 탐색 (Tabs, Toolbar)
   * - 'both': ↑↓←→ 모두 사용 (Grid, Calendar)
   */
  orientation: 'vertical' | 'horizontal' | 'both';

  /**
   * 끝에서 처음으로 순환
   * @default false
   */
  loop?: boolean;

  /**
   * 글자 입력으로 항목 점프 (typeahead/autocomplete)
   * @default true
   */
  typeahead?: boolean;

  /**
   * 비활성화된 항목 건너뛰기
   * @default true
   */
  skipDisabled?: boolean;

  /**
   * 초기 포커스 항목 ID
   */
  defaultFocusedId?: string;

  /**
   * 포커스 변경 콜백
   */
  onFocusChange?: (focusedId: string | null) => void;

  /**
   * 자식 요소들
   */
  children: React.ReactNode;
}
```

### 3.3 Keyboard Mapping

#### 3.3.1 Basic Navigation

| Orientation | Previous | Next | First | Last |
|-------------|----------|------|-------|------|
| `vertical` | ↑ | ↓ | Home | End |
| `horizontal` | ← | → | Home | End |
| `both` | ↑ | ↓ | Home | End |
|  | ← | → | | |

#### 3.3.2 Extended Navigation

| Key | Action | Condition |
|-----|--------|-----------|
| `PageUp` | 10개 위로 (또는 viewport) | 항목이 많을 때 |
| `PageDown` | 10개 아래로 | 항목이 많을 때 |
| `[a-z0-9]` | 해당 글자로 시작하는 항목으로 | typeahead=true |
| `Tab` | 영역 탈출 | - |
| `Shift+Tab` | 영역 탈출 (역방향) | - |

#### 3.3.3 Typeahead Behavior

연속 입력 시 동작:
```
'a' 입력 → 'a'로 시작하는 첫 항목
'ap' 입력 (500ms 내) → 'ap'로 시작하는 첫 항목
500ms 경과 후 'p' 입력 → 'p'로 시작하는 첫 항목
```

### 3.4 State

```ts
interface NavigableState {
  /** 현재 포커스된 항목 ID */
  focusedId: string | null;

  /** 등록된 항목 목록 (순서 보장) */
  items: NavigableItem[];

  /** typeahead 버퍼 */
  typeaheadBuffer: string;

  /** typeahead 타이머 */
  typeaheadTimeout: number | null;
}

interface NavigableItem {
  id: string;
  ref: HTMLElement;
  disabled: boolean;
  textValue: string; // typeahead용
}
```

### 3.5 Context

```ts
interface NavigableContext {
  // === State ===
  focusedId: string | null;

  // === Queries ===
  isFocused: (id: string) => boolean;

  // === Actions ===
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;
  focusById: (id: string) => void;

  // === Registration ===
  registerItem: (item: NavigableItem) => void;
  unregisterItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<NavigableItem>) => void;

  // === Props Getter ===
  getContainerProps: () => {
    role: string;
    'aria-activedescendant': string | undefined;
    onKeyDown: (e: KeyboardEvent) => void;
  };

  getItemProps: (id: string) => {
    id: string;
    tabIndex: 0 | -1;
    'data-focused': boolean;
    onFocus: () => void;
    onMouseEnter: () => void;
  };
}
```

### 3.6 Hook API

```ts
// Wrapper 내부에서 사용
function useNavigable(props: NavigableProps): NavigableContext;

// Item에서 Context 소비
function useNavigableContext(): NavigableContext;

// Item용 편의 Hook
function useNavigableItem(id: string): {
  isFocused: boolean;
  itemProps: ReturnType<NavigableContext['getItemProps']>;
};
```

### 3.7 Usage Example

```tsx
// 렌더러 개발자가 작성하는 List 컴포넌트
function List({ children }: { children: React.ReactNode }) {
  return (
    <Navigable orientation="vertical" loop={false}>
      <NavigableContainer as="ul" className="list">
        {children}
      </NavigableContainer>
    </Navigable>
  );
}

function ListItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { isFocused, itemProps } = useNavigableItem(id);

  return (
    <li
      {...itemProps}
      className={cn('list-item', isFocused && 'focused')}
    >
      {children}
    </li>
  );
}

// 앱 개발자가 사용
<List>
  <ListItem id="1">Apple</ListItem>
  <ListItem id="2">Banana</ListItem>
  <ListItem id="3">Cherry</ListItem>
</List>
```

---

## 4. Selectable

### 4.1 Intent

> **"탐색한 항목 중 하나 또는 여러 개를 작업 대상으로 지정할 수 있다"**

선택은 동사의 목적어입니다:
- Delete → **무엇을?** → 선택된 것
- Copy → **무엇을?** → 선택된 것
- Move → **무엇을?** → 선택된 것

선택이 없으면 명령을 내릴 수 없습니다.

### 4.2 Props

```ts
interface SelectableProps {
  /**
   * 선택 모드
   * - 'none': 선택 불가 (탐색만)
   * - 'single': 하나만 선택
   * - 'multiple': Ctrl+클릭으로 토글
   * - 'extended': 범위 선택 (Shift), 전체 선택 (Ctrl+A)
   */
  mode: 'none' | 'single' | 'multiple' | 'extended';

  /**
   * 탐색 시 자동 선택
   * - true: 포커스 이동하면 바로 선택 (Tabs, Menu)
   * - false: 포커스와 선택 분리 (File Explorer)
   * @default false
   */
  followFocus?: boolean;

  /**
   * 선택 필수 (최소 1개)
   * @default false
   */
  required?: boolean;

  /**
   * 초기 선택 항목
   */
  defaultSelected?: string[];

  /**
   * 제어 모드용 선택 상태
   */
  selected?: string[];

  /**
   * 선택 변경 콜백
   */
  onSelectionChange?: (selectedIds: string[]) => void;

  /**
   * 자식 요소들
   */
  children: React.ReactNode;
}
```

### 4.3 Selection Modes

#### 4.3.1 Mode Comparison

| Mode | Click | Ctrl+Click | Shift+Click | Ctrl+A | Use Case |
|------|-------|------------|-------------|--------|----------|
| `none` | - | - | - | - | 읽기 전용 목록 |
| `single` | 선택 (교체) | 선택 (교체) | 선택 (교체) | - | 탭, 라디오 |
| `multiple` | 선택 (교체) | 토글 | 토글 | - | 태그 선택 |
| `extended` | 선택 (교체) | 토글 | 범위 선택 | 전체 선택 | 파일 탐색기 |

#### 4.3.2 Extended Mode Detail

```
Extended Selection 시나리오:

초기 상태:
[ ] Item 1
[ ] Item 2  ← 클릭 (anchor 설정)
[ ] Item 3
[ ] Item 4
[ ] Item 5

Step 1: Item 2 클릭
[ ] Item 1
[✓] Item 2  ← selected, anchor
[ ] Item 3
[ ] Item 4
[ ] Item 5

Step 2: Shift + Item 4 클릭
[ ] Item 1
[✓] Item 2  ← anchor (유지)
[✓] Item 3  ← 범위 선택
[✓] Item 4  ← 범위 선택
[ ] Item 5

Step 3: Ctrl + Item 1 클릭
[✓] Item 1  ← 토글 추가
[✓] Item 2  ← anchor (유지)
[✓] Item 3
[✓] Item 4
[ ] Item 5

Step 4: Item 5 클릭 (modifier 없음)
[ ] Item 1  ← 전체 해제
[ ] Item 2
[ ] Item 3
[ ] Item 4
[✓] Item 5  ← 새로운 anchor
```

### 4.4 Keyboard Mapping

| Key | Action | Mode | Condition |
|-----|--------|------|-----------|
| `Space` | 현재 포커스 토글 | all (except none) | - |
| `Enter` | 현재 포커스 활성화 | all | - |
| `Ctrl+A` | 전체 선택 | extended | - |
| `Escape` | 선택 해제 | all | required=false |
| `Shift+↑/↓` | 범위 확장 | extended | - |
| `Ctrl+↑/↓` | 포커스만 이동 (선택 유지) | extended | - |

### 4.5 State

```ts
interface SelectableState {
  /** 선택된 항목 ID들 */
  selectedIds: Set<string>;

  /** 범위 선택의 시작점 (anchor) */
  anchorId: string | null;

  /** 가장 최근 선택/해제된 항목 */
  lastActionId: string | null;

  /** 등록된 항목 목록 */
  items: SelectableItem[];
}

interface SelectableItem {
  id: string;
  disabled: boolean;
}
```

### 4.6 Context

```ts
interface SelectableContext {
  // === Config ===
  mode: SelectableProps['mode'];
  followFocus: boolean;

  // === State ===
  selectedIds: Set<string>;
  anchorId: string | null;

  // === Queries ===
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
  getSelectedIds: () => string[];

  // === Actions ===
  select: (id: string) => void;           // 단일 선택 (나머지 해제)
  toggle: (id: string) => void;           // 토글
  selectRange: (toId: string) => void;    // anchor → toId 범위
  selectAll: () => void;                  // 전체 선택
  clearSelection: () => void;             // 전체 해제
  setAnchor: (id: string) => void;        // anchor 설정

  // === Registration ===
  registerItem: (item: SelectableItem) => void;
  unregisterItem: (id: string) => void;

  // === Props Getter ===
  getItemProps: (id: string) => {
    'aria-selected': boolean;
    'data-selected': boolean;
    onClick: (e: MouseEvent) => void;
    onKeyDown: (e: KeyboardEvent) => void;
  };
}
```

### 4.7 Integration with Navigable

`Selectable`은 `Navigable`과 함께 사용될 때 시너지가 발생합니다:

```tsx
// followFocus=false (파일 탐색기 스타일)
// 포커스와 선택이 독립적
<Selectable mode="extended" followFocus={false}>
  <Navigable orientation="vertical">
    ...
  </Navigable>
</Selectable>

// 키보드 동작:
// ↑↓: 포커스만 이동 (선택 유지)
// Space: 포커스된 항목 토글
// Shift+↑↓: 포커스 이동 + 범위 확장


// followFocus=true (탭 스타일)
// 포커스 이동 = 선택
<Selectable mode="single" followFocus={true}>
  <Navigable orientation="horizontal">
    ...
  </Navigable>
</Selectable>

// 키보드 동작:
// ←→: 포커스 이동 = 즉시 선택
```

### 4.8 Hook API

```ts
// Wrapper 내부에서 사용
function useSelectable(props: SelectableProps): SelectableContext;

// Item에서 Context 소비
function useSelectableContext(): SelectableContext;

// Item용 편의 Hook
function useSelectableItem(id: string): {
  isSelected: boolean;
  itemProps: ReturnType<SelectableContext['getItemProps']>;
};
```

### 4.9 Usage Example

```tsx
// 렌더러 개발자가 작성
function FileList({ children }: { children: React.ReactNode }) {
  return (
    <Selectable mode="extended" followFocus={false}>
      <Navigable orientation="vertical">
        <ul className="file-list">
          {children}
        </ul>
      </Navigable>
    </Selectable>
  );
}

function FileItem({ id, children }: { id: string; children: React.ReactNode }) {
  const { isFocused, itemProps: navProps } = useNavigableItem(id);
  const { isSelected, itemProps: selectProps } = useSelectableItem(id);

  return (
    <li
      {...navProps}
      {...selectProps}
      className={cn(
        'file-item',
        isFocused && 'focused',
        isSelected && 'selected'
      )}
    >
      {children}
    </li>
  );
}
```

---

## 5. FocusScope

### 5.1 Intent

> **"특정 영역 안에서 포커스가 유지되고, 벗어나면 원래 맥락으로 돌아온다"**

모달이 열리면 그 안에서만 조작해야 하고, 모달이 닫히면 원래 위치로 돌아와야 합니다. 포커스가 엉뚱한 곳으로 튀면 사용자는 혼란에 빠집니다.

### 5.2 Props

```ts
interface FocusScopeProps {
  /**
   * 포커스 트랩 활성화
   * - true: Tab/Shift+Tab이 영역 내에서 순환
   * - false: Tab으로 영역 탈출 가능
   * @default false
   */
  trap?: boolean;

  /**
   * 언마운트 시 이전 포커스 복원
   * @default true
   */
  restoreFocus?: boolean;

  /**
   * 마운트 시 자동 포커스 대상
   * - 'first': 첫 번째 포커스 가능 요소
   * - 'last': 마지막 포커스 가능 요소
   * - 'none': 자동 포커스 없음
   * - string: 특정 요소 ID
   * @default 'first'
   */
  autoFocus?: 'first' | 'last' | 'none' | string;

  /**
   * 포커스 가능 요소가 없을 때 컨테이너에 포커스
   * @default true
   */
  focusContainerFallback?: boolean;

  /**
   * 자식 요소들
   */
  children: React.ReactNode;
}
```

### 5.3 Focus Trap Behavior

```
┌─────────────────────────────────────────┐
│ FocusScope (trap=true)                  │
│                                         │
│   [Button 1]  ←─┐                       │
│   [Input]       │                       │
│   [Button 2]    │  Tab cycles           │
│   [Button 3]  ──┘                       │
│                                         │
│   Tab on Button 3 → Button 1            │
│   Shift+Tab on Button 1 → Button 3      │
│                                         │
└─────────────────────────────────────────┘
```

### 5.4 Focus Restoration Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. 초기 상태                                             │
│    [Open Modal Button] ← 포커스                         │
└─────────────────────────────────────────────────────────┘
                    │
                    │ 클릭
                    ▼
┌─────────────────────────────────────────────────────────┐
│ 2. 모달 열림                                             │
│    [Open Modal Button]  (포커스 저장됨)                   │
│                                                         │
│    ┌─────────────────────────────────┐                  │
│    │ Modal (FocusScope)              │                  │
│    │                                 │                  │
│    │   [Title]                       │                  │
│    │   [Input] ← 자동 포커스          │                  │
│    │   [Cancel] [Confirm]            │                  │
│    │                                 │                  │
│    └─────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
                    │
                    │ Escape 또는 Confirm 클릭
                    ▼
┌─────────────────────────────────────────────────────────┐
│ 3. 모달 닫힘, 포커스 복원                                 │
│    [Open Modal Button] ← 포커스 복원                     │
└─────────────────────────────────────────────────────────┘
```

### 5.5 State

```ts
interface FocusScopeState {
  /** 이 scope가 활성화되었을 때 저장된 이전 포커스 */
  previouslyFocusedElement: HTMLElement | null;

  /** 현재 scope 내 포커스 가능 요소들 */
  focusableElements: HTMLElement[];

  /** scope 컨테이너 ref */
  containerRef: HTMLElement | null;
}
```

### 5.6 Context

```ts
interface FocusScopeContext {
  // === State ===
  isActive: boolean;

  // === Actions ===
  focusFirst: () => void;
  focusLast: () => void;
  focusNext: () => void;
  focusPrev: () => void;
  focusContainer: () => void;

  // === Queries ===
  getFocusableElements: () => HTMLElement[];
  contains: (element: Element) => boolean;

  // === Props Getter ===
  getContainerProps: () => {
    ref: React.RefObject<HTMLElement>;
    tabIndex: -1;
    onKeyDown: (e: KeyboardEvent) => void;
  };
}
```

### 5.7 Nested Focus Scopes

포커스 스코프는 중첩될 수 있습니다:

```tsx
<FocusScope trap>           {/* 모달 */}
  <Dialog>
    <FocusScope trap>       {/* 중첩 다이얼로그 */}
      <ConfirmDialog />
    </FocusScope>
  </Dialog>
</FocusScope>
```

가장 안쪽 `trap` scope가 활성화됩니다. 안쪽 scope가 언마운트되면 바깥 scope가 다시 활성화됩니다.

### 5.8 Hook API

```ts
// Wrapper 내부에서 사용
function useFocusScope(props: FocusScopeProps): FocusScopeContext;

// 자식에서 Context 소비
function useFocusScopeContext(): FocusScopeContext;
```

### 5.9 Usage Example

```tsx
// Modal 컴포넌트
function Modal({ children, onClose }: ModalProps) {
  return (
    <FocusScope trap restoreFocus autoFocus="first">
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </FocusScope>
  );
}

// CommandPalette 컴포넌트
function CommandPalette({ onClose }: CommandPaletteProps) {
  return (
    <FocusScope trap restoreFocus autoFocus="none">
      <div className="command-palette">
        <input
          className="command-input"
          autoFocus  {/* 직접 autoFocus 지정 */}
          placeholder="Type a command..."
        />
        <Selectable mode="single" followFocus>
          <Navigable orientation="vertical">
            <ul className="command-list">
              {/* ... */}
            </ul>
          </Navigable>
        </Selectable>
      </div>
    </FocusScope>
  );
}
```

---

## 6. Composition Patterns

### 6.1 Pattern: Simple List

탐색만 가능한 읽기 전용 목록

```tsx
<Navigable orientation="vertical">
  <List>
    <ListItem />
  </List>
</Navigable>
```

**제공되는 기능:**
- ↑↓ 키보드 탐색
- Home/End
- Typeahead

### 6.2 Pattern: Selectable List

다중 선택이 가능한 파일 목록 스타일

```tsx
<Selectable mode="extended" followFocus={false}>
  <Navigable orientation="vertical">
    <List>
      <ListItem />
    </List>
  </Navigable>
</Selectable>
```

**제공되는 기능:**
- ↑↓ 키보드 탐색
- 클릭 선택
- Ctrl+클릭 토글
- Shift+클릭 범위 선택
- Ctrl+A 전체 선택
- Space 토글
- Shift+↑↓ 범위 확장

### 6.3 Pattern: Tabs

자동 선택되는 탭

```tsx
<Selectable mode="single" followFocus={true}>
  <Navigable orientation="horizontal">
    <TabList>
      <Tab />
    </TabList>
  </Navigable>
</Selectable>
```

**제공되는 기능:**
- ←→ 키보드 탐색
- 탐색 = 즉시 선택
- Home/End

### 6.4 Pattern: Modal Dialog

포커스가 갇히는 모달

```tsx
<FocusScope trap restoreFocus autoFocus="first">
  <Dismissable onEscape="close" onClickOutside="close">
    <Dialog>
      <DialogContent />
    </Dialog>
  </Dismissable>
</FocusScope>
```

**제공되는 기능:**
- 자동 포커스
- Tab 순환
- 닫힐 때 포커스 복원
- Escape로 닫기
- 외부 클릭으로 닫기

### 6.5 Pattern: Command Palette

검색 가능한 명령 팔레트

```tsx
<FocusScope trap restoreFocus>
  <Dismissable onEscape="close">
    <Groupable navigateLabels={false}>
      <Selectable mode="single" followFocus>
        <Navigable orientation="vertical" typeahead={false}>
          <CommandPalette>
            <SearchInput autoFocus />
            <CommandGroup label="Recent">
              <CommandItem />
            </CommandGroup>
            <CommandGroup label="Commands">
              <CommandItem />
            </CommandGroup>
          </CommandPalette>
        </Navigable>
      </Selectable>
    </Groupable>
  </Dismissable>
</FocusScope>
```

**제공되는 기능:**
- 포커스 트랩
- 자동 포커스 (검색창)
- ↑↓ 탐색 (그룹 라벨 건너뜀)
- 탐색 = 즉시 하이라이트
- Enter 실행
- Escape 닫기

### 6.6 Pattern: Data Table (Row Mode)

행 선택 가능한 데이터 테이블

```tsx
<FocusScope>
  <Selectable mode="extended" followFocus={false}>
    <Navigable orientation="vertical">
      <Sortable>
        <Groupable>
          <DataTable>
            <DataRow />
          </DataTable>
        </Groupable>
      </Sortable>
    </Navigable>
  </Selectable>
</FocusScope>
```

### 6.7 Pattern: Tree View

계층 구조 트리

```tsx
<FocusScope>
  <Selectable mode="multiple" followFocus={false}>
    <Expandable multiple defaultExpanded={['root']}>
      <Navigable orientation="vertical">
        <Reorderable axis="vertical">
          <TreeView>
            <TreeItem />
          </TreeView>
        </Reorderable>
      </Navigable>
    </Expandable>
  </Selectable>
</FocusScope>
```

---

## 7. Renderer Implementation Guide

### 7.1 Registering a Custom Renderer

```ts
// 렌더러 등록 API
import { registerRenderer } from '@iddl/react';

// Role별 렌더러 등록
registerRenderer('SlideList', SlideListRenderer);
registerRenderer('Slide', SlideRenderer);

// 또는 테마 단위로 등록
registerTheme('my-brand', {
  renderers: {
    SlideList: SlideListRenderer,
    Slide: SlideRenderer,
    // 나머지는 default renderer 사용
  },
  tokens: {
    // 디자인 토큰
  }
});
```

### 7.2 Implementing a List Renderer

```tsx
import {
  Navigable,
  Selectable,
  useNavigableItem,
  useSelectableItem,
} from '@iddl/react';

// List 렌더러
export function ListRenderer({
  children,
  spec,
  ...props
}: BlockRendererProps) {
  const selectionMode = spec?.selection ?? 'none';

  return (
    <Selectable mode={selectionMode} followFocus={false}>
      <Navigable orientation="vertical" loop={false}>
        <ul role="listbox" className="iddl-list" {...props}>
          {children}
        </ul>
      </Navigable>
    </Selectable>
  );
}

// ListItem 렌더러
export function ListItemRenderer({
  id,
  children,
  disabled,
  ...props
}: ElementRendererProps) {
  const nav = useNavigableItem(id);
  const sel = useSelectableItem(id);

  return (
    <li
      {...nav.itemProps}
      {...sel.itemProps}
      role="option"
      aria-disabled={disabled}
      className={cn(
        'iddl-list-item',
        nav.isFocused && 'iddl-focused',
        sel.isSelected && 'iddl-selected',
        disabled && 'iddl-disabled'
      )}
      {...props}
    >
      {children}
    </li>
  );
}
```

### 7.3 Using Hooks Directly (Advanced)

테마 개발자가 완전 커스텀 UI를 만들 때:

```tsx
import { useNavigable, useSelectable } from '@iddl/react';

function CustomFileList({ items }: { items: Item[] }) {
  const navigable = useNavigable({
    orientation: 'vertical',
    loop: false,
  });

  const selectable = useSelectable({
    mode: 'extended',
    followFocus: false,
    onSelectionChange: (ids) => console.log('Selected:', ids),
  });

  return (
    <NavigableContext.Provider value={navigable}>
      <SelectableContext.Provider value={selectable}>
        <div
          {...navigable.getContainerProps()}
          className="custom-file-list"
        >
          {items.map(item => (
            <CustomFileItem key={item.id} item={item} />
          ))}
        </div>
      </SelectableContext.Provider>
    </NavigableContext.Provider>
  );
}

function CustomFileItem({ item }: { item: Item }) {
  const { isFocused, itemProps: navProps } = useNavigableItem(item.id);
  const { isSelected, itemProps: selProps } = useSelectableItem(item.id);

  return (
    <div
      {...navProps}
      {...selProps}
      className={cn(
        'custom-file-item',
        isFocused && 'my-focus-style',
        isSelected && 'my-selected-style'
      )}
    >
      <img src={item.thumbnail} alt="" />
      <span>{item.name}</span>
    </div>
  );
}
```

---

## 8. Accessibility

### 8.1 ARIA Mapping

#### 8.1.1 Navigable ARIA

| Component | ARIA Role | ARIA Properties |
|-----------|-----------|-----------------|
| Container | `listbox`, `menu`, `tablist`, etc. | `aria-activedescendant` |
| Item | `option`, `menuitem`, `tab`, etc. | - |

#### 8.1.2 Selectable ARIA

| State | ARIA Property |
|-------|---------------|
| Selected | `aria-selected="true"` |
| Not selected | `aria-selected="false"` |
| Multi-select container | `aria-multiselectable="true"` |

#### 8.1.3 FocusScope ARIA

| Feature | Implementation |
|---------|----------------|
| Modal | `aria-modal="true"` on dialog |
| Focus trap | Programmatic focus management |

### 8.2 Keyboard Accessibility Requirements

모든 Behavior Primitive는 다음을 준수해야 합니다:

1. **모든 기능이 키보드로 접근 가능**해야 함
2. **포커스 표시**가 명확해야 함
3. **Tab 순서**가 논리적이어야 함
4. **화면 낭독기**와 호환되어야 함

### 8.3 Focus Visible

포커스 스타일은 키보드 사용 시에만 표시하는 것을 권장:

```css
/* 키보드 포커스만 표시 */
[data-focused]:focus-visible {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}

/* 마우스 클릭 시 포커스 링 숨김 */
[data-focused]:focus:not(:focus-visible) {
  outline: none;
}
```

---

## 9. Examples

### 9.1 PPT Slide Thumbnail List

앱 개발자 코드:
```tsx
<Block role="SlideList">
  <Action role="Slide" id="slide-1">
    <Image src="thumb-1.png" alt="슬라이드 1" />
    <Text role="Label">1</Text>
  </Action>
  <Action role="Slide" id="slide-2">
    <Image src="thumb-2.png" alt="슬라이드 2" />
    <Text role="Label">2</Text>
  </Action>
  <Action role="Slide" id="slide-3">
    <Image src="thumb-3.png" alt="슬라이드 3" />
    <Text role="Label">3</Text>
  </Action>
</Block>
```

렌더러 구현:
```tsx
registerRenderer('SlideList', ({ children }) => (
  <FocusScope>
    <Selectable mode="extended">
      <Navigable orientation="vertical">
        <div className="slide-list" role="listbox">
          {children}
        </div>
      </Navigable>
    </Selectable>
  </FocusScope>
));

registerRenderer('Slide', ({ id, children }) => {
  const nav = useNavigableItem(id);
  const sel = useSelectableItem(id);

  return (
    <div
      {...nav.itemProps}
      {...sel.itemProps}
      className={cn(
        'slide-thumbnail',
        nav.isFocused && 'focused',
        sel.isSelected && 'selected'
      )}
      role="option"
    >
      {children}
    </div>
  );
});
```

### 9.2 Command Palette (IntelliJ Style)

앱 개발자 코드:
```tsx
<Block role="CommandPalette" spec={{ placeholder: "Search everywhere..." }}>
  <Block role="CommandGroup" spec={{ label: "Recent" }}>
    <Action role="Command" id="cmd-1">Open Settings</Action>
    <Action role="Command" id="cmd-2">New File</Action>
  </Block>
  <Block role="CommandGroup" spec={{ label: "Actions" }}>
    <Action role="Command" id="cmd-3">Format Document</Action>
    <Action role="Command" id="cmd-4">Toggle Terminal</Action>
  </Block>
</Block>
```

렌더러 구현:
```tsx
registerRenderer('CommandPalette', ({ children, spec }) => (
  <FocusScope trap restoreFocus>
    <Dismissable onEscape="close">
      <div className="command-palette">
        <input
          className="command-input"
          placeholder={spec?.placeholder}
          autoFocus
        />
        <Groupable navigateLabels={false}>
          <Selectable mode="single" followFocus>
            <Navigable orientation="vertical" typeahead={false}>
              <div className="command-list">
                {children}
              </div>
            </Navigable>
          </Selectable>
        </Groupable>
      </div>
    </Dismissable>
  </FocusScope>
));
```

### 9.3 Data Table with Row Selection

앱 개발자 코드:
```tsx
<Block role="DataTable" spec={{ selection: 'extended' }}>
  <Block role="DataHeader">
    <Text role="ColumnHeader">Name</Text>
    <Text role="ColumnHeader">Size</Text>
    <Text role="ColumnHeader">Modified</Text>
  </Block>
  <Block role="DataBody">
    <Action role="DataRow" id="row-1">
      <Text>document.pdf</Text>
      <Text>2.4 MB</Text>
      <Text>2026-01-10</Text>
    </Action>
    <Action role="DataRow" id="row-2">
      <Text>image.png</Text>
      <Text>540 KB</Text>
      <Text>2026-01-11</Text>
    </Action>
  </Block>
</Block>
```

---

## Appendix A: API Reference Summary

### Wrapper Components

| Component | Props | Purpose |
|-----------|-------|---------|
| `<Navigable>` | `orientation`, `loop`, `typeahead`, `skipDisabled` | 키보드 탐색 |
| `<Selectable>` | `mode`, `followFocus`, `required`, `defaultSelected` | 선택 관리 |
| `<FocusScope>` | `trap`, `restoreFocus`, `autoFocus` | 포커스 범위 |

### Hooks

| Hook | Purpose |
|------|---------|
| `useNavigable(props)` | Navigable 로직 (wrapper 내부용) |
| `useNavigableContext()` | Navigable context 소비 |
| `useNavigableItem(id)` | Item용 편의 hook |
| `useSelectable(props)` | Selectable 로직 (wrapper 내부용) |
| `useSelectableContext()` | Selectable context 소비 |
| `useSelectableItem(id)` | Item용 편의 hook |
| `useFocusScope(props)` | FocusScope 로직 (wrapper 내부용) |
| `useFocusScopeContext()` | FocusScope context 소비 |

### Context Values

| Context | Key Properties |
|---------|----------------|
| `NavigableContext` | `focusedId`, `focusNext()`, `getItemProps()` |
| `SelectableContext` | `selectedIds`, `isSelected()`, `select()`, `toggle()` |
| `FocusScopeContext` | `isActive`, `focusFirst()`, `getContainerProps()` |

---

## Appendix B: Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-11 | Draft 0.1 | Initial draft with Navigable, Selectable, FocusScope |

---

*End of Document*