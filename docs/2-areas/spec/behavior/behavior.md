좋습니다. Behavior Primitives를 완전히 재편하여 체계적인 명세를 만들어보겠습니다.

---

# IDDL Part 2: App Behavior Specification

**Draft Community Group Report**  
**Version:** 0.2.0  
**Date:** 2026-01-11

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Architecture](#2-architecture)
3. [Tier 1: Core Interaction](#3-tier-1-core-interaction)
4. [Tier 2: Data Manipulation](#4-tier-2-data-manipulation)
5. [Tier 3: Command System](#5-tier-3-command-system)
6. [Tier 4: Structure Control](#6-tier-4-structure-control)
7. [Tier 5: Feedback](#7-tier-5-feedback)
8. [Tier 6: Search & View](#8-tier-6-search--view)
9. [Tier 7: Overlay](#9-tier-7-overlay)
10. [Composition Patterns](#10-composition-patterns)
11. [Type Definitions](#11-type-definitions)

---

## 1. Introduction

### 1.1 Problem Statement

웹은 **Document** 패러다임으로 설계되었습니다:

```
Document 패러다임:
- 탐색: 링크 클릭
- 선택: 텍스트 드래그
- 키보드: Tab으로 폼 요소 이동
- 복사: 텍스트 복사
- 실행취소: 브라우저 기본 (텍스트 입력만)
```

그러나 현대 웹 앱은 **Application** 패러다임을 요구합니다:

```
Application 패러다임:
- 탐색: 키보드로 모든 요소 접근
- 선택: 대상 지정 → 명령 실행
- 키보드: 모든 기능이 단축키로 가능
- 복사: 구조화된 데이터 복사
- 실행취소: 모든 변경 되돌리기
- 그 외: 우클릭 메뉴, 검색, 확대/축소...
```

### 1.2 The Gap

모든 성숙한 앱(Figma, Notion, VSCode, Linear...)이 동일한 기능을 구현합니다:

| 기능 | Figma | Notion | VSCode | Linear |
|------|-------|--------|--------|--------|
| Ctrl+C/V | ✓ | ✓ | ✓ | ✓ |
| Ctrl+Z/Y | ✓ | ✓ | ✓ | ✓ |
| Ctrl+K (Command) | ✓ | ✓ | ✓ | ✓ |
| 우클릭 메뉴 | ✓ | ✓ | ✓ | ✓ |
| Ctrl+F (검색) | ✓ | ✓ | ✓ | ✓ |
| 키보드 단축키 | ✓ | ✓ | ✓ | ✓ |
| Toast 알림 | ✓ | ✓ | ✓ | ✓ |

**모든 팀이 같은 코드를 반복해서 작성합니다.**

### 1.3 Solution: Declarative App Behavior

IDDL Behavior Primitives는 앱의 보편적 동작을 **선언적**으로 제공합니다:

```tsx
// ❌ 명령형: 수백 줄의 반복 코드
const [selected, setSelected] = useState(new Set());
const [clipboard, setClipboard] = useState(null);
const [history, setHistory] = useState({ past: [], future: [] });

const handleKeyDown = (e) => {
  if (e.ctrlKey && e.key === 'c') { /* 복사 로직 */ }
  if (e.ctrlKey && e.key === 'v') { /* 붙여넣기 로직 */ }
  if (e.ctrlKey && e.key === 'z') { /* 실행취소 로직 */ }
  if (e.key === 'ArrowDown') { /* 탐색 로직 */ }
  // ... 수백 줄
};

// ✅ 선언형: 의도만 선언
<History>
  <Clipboard serialize={...} deserialize={...}>
    <Shortcut bindings={shortcuts}>
      <Selectable mode="extended">
        <Navigable orientation="vertical">
          <List>...</List>
        </Navigable>
      </Selectable>
    </Shortcut>
  </Clipboard>
</History>
```

### 1.4 Design Principles

| 원칙 | 설명 |
|------|------|
| **Declarative** | 무엇을 원하는지 선언, 어떻게는 Primitive가 처리 |
| **Composable** | 작은 Primitive 조합으로 복잡한 동작 구성 |
| **Headless** | DOM/스타일 없음, Context만 제공 |
| **Accessible** | ARIA 패턴 자동 적용 |
| **Customizable** | Hooks로 완전 제어 가능 |

---

## 2. Architecture

### 2.1 Tier Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                    IDDL Behavior Primitives                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tier 1: Core Interaction ─────────────────────────── 필수      │
│  │  키보드 탐색, 선택, 포커스 관리                                │
│  │                                                              │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  │Navigable │  │Selectable│  │FocusScope│                   │
│  │  └──────────┘  └──────────┘  └──────────┘                   │
│  │                                                              │
│  ├─────────────────────────────────────────────────────────────│
│  │                                                              │
│  Tier 2: Data Manipulation ────────────────────────── 핵심      │
│  │  복사/붙여넣기, 실행취소, 드래그 앤 드롭                        │
│  │                                                              │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  │Clipboard │  │ History  │  │Draggable │                   │
│  │  └──────────┘  └──────────┘  └──────────┘                   │
│  │                                                              │
│  ├─────────────────────────────────────────────────────────────│
│  │                                                              │
│  Tier 3: Command System ───────────────────────────── 생산성    │
│  │  키보드 단축키, 우클릭 메뉴, 명령 팔레트                        │
│  │                                                              │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────────┐              │
│  │  │ Shortcut │  │ContextMenu│  │CommandPalette│              │
│  │  └──────────┘  └───────────┘  └──────────────┘              │
│  │                                                              │
│  ├─────────────────────────────────────────────────────────────│
│  │                                                              │
│  Tier 4: Structure Control ────────────────────────── 구조      │
│  │  펼침/접힘, 그룹핑, 정렬                                       │
│  │                                                              │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  │Expandable│  │ Groupable│  │ Sortable │                   │
│  │  └──────────┘  └──────────┘  └──────────┘                   │
│  │                                                              │
│  ├─────────────────────────────────────────────────────────────│
│  │                                                              │
│  Tier 5: Feedback ─────────────────────────────────── 피드백    │
│  │  토스트 알림, 확인 다이얼로그, 프로그레스                       │
│  │                                                              │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │  │  Toast   │  │ Confirm  │  │ Progress │                   │
│  │  └──────────┘  └──────────┘  └──────────┘                   │
│  │                                                              │
│  ├─────────────────────────────────────────────────────────────│
│  │                                                              │
│  Tier 6: Search & View ────────────────────────────── 탐색      │
│  │  검색/필터, 확대/축소                                         │
│  │                                                              │
│  │  ┌──────────┐  ┌──────────┐                                 │
│  │  │Searchable│  │ Zoomable │                                 │
│  │  └──────────┘  └──────────┘                                 │
│  │                                                              │
│  ├─────────────────────────────────────────────────────────────│
│  │                                                              │
│  Tier 7: Overlay ──────────────────────────────────── 오버레이  │
│  │  닫기 동작                                                   │
│  │                                                              │
│  │  ┌───────────┐                                              │
│  │  │Dismissable│                                              │
│  │  └───────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Dependency Graph

```
                    ┌─────────────┐
                    │ FocusScope  │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌───────────┐
        │Navigable │ │Selectable│ │Dismissable│
        └────┬─────┘ └────┬─────┘ └───────────┘
             │            │
             └─────┬──────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
     ▼             ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│Clipboard │ │ History  │ │Draggable │
└──────────┘ └──────────┘ └──────────┘
                   │
                   ▼
           ┌──────────────┐
           │   Shortcut   │
           │ ContextMenu  │
           │CommandPalette│
           └──────────────┘
```

### 2.3 Two-Track Architecture

| Track | 대상 | 사용 방식 | 복잡도 |
|-------|------|----------|--------|
| **Track 1** | 앱 개발자 | IDDL Role + spec 선언 | 낮음 |
| **Track 2** | 렌더러 개발자 | Wrapper + Hooks | 높음 |

**Track 1: 앱 개발자**
```tsx
// Role과 spec만 선언
<Block role="List" spec={{ 
  selection: 'extended',
  clipboard: true,
  history: true 
}}>
  <Action role="ListItem" id="1">항목 1</Action>
  <Action role="ListItem" id="2">항목 2</Action>
</Block>
```

**Track 2: 렌더러 개발자**
```tsx
// spec을 해석하여 Behavior Primitives 적용
registerRenderer('List', ({ children, spec }) => (
  <History enabled={spec?.history}>
    <Clipboard enabled={spec?.clipboard} serialize={...}>
      <Selectable mode={spec?.selection ?? 'none'}>
        <Navigable orientation="vertical">
          <ul role="listbox">{children}</ul>
        </Navigable>
      </Selectable>
    </Clipboard>
  </History>
));
```

### 2.4 Context Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ <AppScope>                                                      │
│   CommandRegistry, ShortcutRegistry, ToastQueue                 │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ <History>                                               │   │
│   │   HistoryContext (undo/redo stacks)                     │   │
│   │                                                         │   │
│   │   ┌─────────────────────────────────────────────────┐   │   │
│   │   │ <Clipboard>                                     │   │   │
│   │   │   ClipboardContext (copy/paste)                 │   │   │
│   │   │                                                 │   │   │
│   │   │   ┌─────────────────────────────────────────┐   │   │   │
│   │   │   │ <Selectable>                            │   │   │   │
│   │   │   │   SelectableContext (selectedIds)       │   │   │   │
│   │   │   │                                         │   │   │   │
│   │   │   │   ┌─────────────────────────────────┐   │   │   │   │
│   │   │   │   │ <Navigable>                     │   │   │   │   │
│   │   │   │   │   NavigableContext (focusedId)  │   │   │   │   │
│   │   │   │   │                                 │   │   │   │   │
│   │   │   │   │   ┌─────────────────────────┐   │   │   │   │   │
│   │   │   │   │   │ <Item>                  │   │   │   │   │   │
│   │   │   │   │   │   Consumes all contexts │   │   │   │   │   │
│   │   │   │   │   └─────────────────────────┘   │   │   │   │   │
│   │   │   │   └─────────────────────────────────┘   │   │   │   │
│   │   │   └─────────────────────────────────────────┘   │   │   │
│   │   └─────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Tier 1: Core Interaction

> **기본 전제: 키보드로 모든 요소에 접근하고 선택할 수 있어야 한다**

### 3.1 Navigable

#### 3.1.1 Intent

> "이 영역 안의 항목들을 키보드로 순차 탐색할 수 있다"

#### 3.1.2 Props

```ts
interface NavigableProps {
  /**
   * 탐색 방향
   */
  orientation: 'vertical' | 'horizontal' | 'both';

  /**
   * 끝에서 처음으로 순환
   * @default false
   */
  loop?: boolean;

  /**
   * 글자 입력으로 항목 점프 (typeahead)
   * @default true
   */
  typeahead?: boolean;

  /**
   * Typeahead 리셋 딜레이 (ms)
   * @default 500
   */
  typeaheadTimeout?: number;

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
   * 제어 모드용 포커스 상태
   */
  focusedId?: string;

  /**
   * 포커스 변경 콜백
   */
  onFocusChange?: (focusedId: string | null) => void;

  children: React.ReactNode;
}
```

#### 3.1.3 Keyboard Mapping

| Orientation | 이전 | 다음 | 처음 | 끝 |
|-------------|------|------|------|-----|
| `vertical` | ↑ | ↓ | Home | End |
| `horizontal` | ← | → | Home | End |
| `both` | ↑ / ← | ↓ / → | Home | End |

| Key | Action | Condition |
|-----|--------|-----------|
| `PageUp` | 10개 위로 | 항목 > 10 |
| `PageDown` | 10개 아래로 | 항목 > 10 |
| `[a-z0-9]` | typeahead 점프 | typeahead=true |
| `Tab` | 영역 탈출 | - |

#### 3.1.4 Context

```ts
interface NavigableContext {
  // State
  focusedId: string | null;
  orientation: 'vertical' | 'horizontal' | 'both';

  // Queries
  isFocused: (id: string) => boolean;
  getItemCount: () => number;
  getFocusedIndex: () => number;

  // Actions
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;
  focusById: (id: string) => void;
  focusByIndex: (index: number) => void;

  // Registration
  registerItem: (item: NavigableItem) => void;
  unregisterItem: (id: string) => void;

  // Props Getters
  getContainerProps: () => ContainerProps;
  getItemProps: (id: string) => ItemProps;
}
```

#### 3.1.5 Usage

```tsx
// 기본 사용
<Navigable orientation="vertical">
  <ul>
    <NavigableItem id="1">Item 1</NavigableItem>
    <NavigableItem id="2">Item 2</NavigableItem>
  </ul>
</Navigable>

// Hook 사용 (렌더러 개발자)
function ListItem({ id, children }) {
  const { isFocused, getItemProps } = useNavigableContext();
  
  return (
    <li {...getItemProps(id)} data-focused={isFocused(id)}>
      {children}
    </li>
  );
}
```

---

### 3.2 Selectable

#### 3.2.1 Intent

> "탐색한 항목 중 하나 또는 여러 개를 작업 대상으로 지정할 수 있다"

#### 3.2.2 Props

```ts
interface SelectableProps {
  /**
   * 선택 모드
   * - 'none': 선택 불가
   * - 'single': 하나만 선택
   * - 'multiple': Ctrl+클릭으로 토글
   * - 'extended': 범위 선택 (Shift), 전체 선택 (Ctrl+A)
   */
  mode: 'none' | 'single' | 'multiple' | 'extended';

  /**
   * 탐색 시 자동 선택
   * - true: 포커스 이동 = 즉시 선택 (Tabs, Radio)
   * - false: 포커스와 선택 분리 (File Explorer)
   * @default false
   */
  followFocus?: boolean;

  /**
   * 선택 필수 (최소 1개 유지)
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
   * 항목 활성화 콜백 (Enter, 더블클릭)
   */
  onActivate?: (id: string) => void;

  children: React.ReactNode;
}
```

#### 3.2.3 Selection Modes

| Mode | Click | Ctrl+Click | Shift+Click | Ctrl+A | Space |
|------|-------|------------|-------------|--------|-------|
| `none` | - | - | - | - | - |
| `single` | 교체 | 교체 | 교체 | - | 교체 |
| `multiple` | 교체 | 토글 | 토글 | - | 토글 |
| `extended` | 교체 | 토글 | 범위 | 전체 | 토글 |

#### 3.2.4 Extended Mode Behavior

```
Extended Selection Flow:

Initial:
[ ] Item 1
[ ] Item 2  ← Click (anchor 설정)
[ ] Item 3
[ ] Item 4
[ ] Item 5

Step 1: Click Item 2
[ ] Item 1
[✓] Item 2  ← selected, anchor
[ ] Item 3
[ ] Item 4
[ ] Item 5

Step 2: Shift+Click Item 4
[ ] Item 1
[✓] Item 2  ← anchor (유지)
[✓] Item 3  ← 범위 선택
[✓] Item 4  ← 범위 끝
[ ] Item 5

Step 3: Ctrl+Click Item 1
[✓] Item 1  ← 토글 추가
[✓] Item 2  ← anchor (유지)
[✓] Item 3
[✓] Item 4
[ ] Item 5

Step 4: Click Item 5 (modifier 없음)
[ ] Item 1  ← 전체 해제
[ ] Item 2
[ ] Item 3
[ ] Item 4
[✓] Item 5  ← 새로운 anchor
```

#### 3.2.5 Keyboard Mapping

| Key | Action | Mode |
|-----|--------|------|
| `Space` | 현재 포커스 토글 | all (except none) |
| `Enter` | 활성화 (onActivate) | all |
| `Ctrl+A` | 전체 선택 | extended |
| `Escape` | 선택 해제 | all (required=false) |
| `Shift+↑↓` | 범위 확장 | extended |
| `Ctrl+↑↓` | 포커스만 이동 | extended |

#### 3.2.6 Context

```ts
interface SelectableContext {
  // Config
  mode: SelectionMode;
  followFocus: boolean;

  // State
  selectedIds: ReadonlySet<string>;
  anchorId: string | null;

  // Queries
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
  getSelectedIds: () => string[];
  isAllSelected: () => boolean;

  // Actions
  select: (id: string) => void;
  toggle: (id: string) => void;
  selectRange: (toId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  setAnchor: (id: string) => void;

  // Activation
  activate: (id: string) => void;

  // Registration
  registerItem: (item: SelectableItem) => void;
  unregisterItem: (id: string) => void;

  // Props Getters
  getContainerProps: () => ContainerProps;
  getItemProps: (id: string) => ItemProps;
}
```

---

### 3.3 FocusScope

#### 3.3.1 Intent

> "특정 영역 안에서 포커스가 유지되고, 벗어나면 원래 맥락으로 돌아온다"

#### 3.3.2 Props

```ts
interface FocusScopeProps {
  /**
   * 포커스 트랩 (Tab 순환)
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
  containFallback?: boolean;

  children: React.ReactNode;
}
```

#### 3.3.3 Focus Trap Behavior

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
└─────────────────────────────────────────┘
```

#### 3.3.4 Focus Restoration Flow

```
┌─────────────────────────────────────────┐
│ 1. Initial State                        │
│    [Open Modal Button] ← Focus          │
└─────────────────────────────────────────┘
                    │
                    │ Click
                    ▼
┌─────────────────────────────────────────┐
│ 2. Modal Opens                          │
│    [Open Modal Button] (focus saved)    │
│                                         │
│    ┌───────────────────────────┐        │
│    │ Modal (FocusScope)        │        │
│    │   [Input] ← Auto Focus    │        │
│    │   [Cancel] [Confirm]      │        │
│    └───────────────────────────┘        │
└─────────────────────────────────────────┘
                    │
                    │ Escape / Confirm
                    ▼
┌─────────────────────────────────────────┐
│ 3. Modal Closes, Focus Restored         │
│    [Open Modal Button] ← Focus Restored │
└─────────────────────────────────────────┘
```

#### 3.3.5 Context

```ts
interface FocusScopeContext {
  // State
  isActive: boolean;
  containerRef: React.RefObject<HTMLElement>;

  // Queries
  getFocusableElements: () => HTMLElement[];
  containsFocus: () => boolean;
  contains: (element: Element | null) => boolean;

  // Actions
  focusFirst: () => boolean;
  focusLast: () => boolean;
  focusNext: () => boolean;
  focusPrev: () => boolean;
  focusContainer: () => void;

  // Props Getter
  getContainerProps: () => ContainerProps;
}
```

---

## 4. Tier 2: Data Manipulation

> **앱을 "도구"로 만드는 핵심 기능**

### 4.1 Clipboard

#### 4.1.1 Intent

> "선택한 것을 복사하고, 다른 곳에 붙여넣을 수 있다"

#### 4.1.2 Props

```ts
interface ClipboardScopeProps {
  /**
   * 활성화 여부
   * @default true
   */
  enabled?: boolean;

  /**
   * 선택된 항목을 클립보드 데이터로 직렬화
   */
  serialize: (selectedIds: string[]) => ClipboardPayload;

  /**
   * 클립보드 데이터를 항목으로 역직렬화
   */
  deserialize: (payload: ClipboardPayload) => DeserializedData;

  /**
   * 붙여넣기 가능 여부 판단
   */
  canPaste?: (payload: ClipboardPayload) => boolean;

  /**
   * 복사 후 콜백
   */
  onCopy?: (ids: string[]) => void;

  /**
   * 잘라내기 후 콜백
   */
  onCut?: (ids: string[]) => void;

  /**
   * 붙여넣기 후 콜백
   */
  onPaste?: (data: DeserializedData) => void;

  /**
   * 복제 후 콜백
   */
  onDuplicate?: (ids: string[]) => void;

  children: React.ReactNode;
}

interface ClipboardPayload {
  /** 앱 내부 데이터 */
  'application/x-iddl'?: any;
  /** 일반 텍스트 */
  'text/plain'?: string;
  /** HTML */
  'text/html'?: string;
  /** 파일 */
  'files'?: File[];
}

interface DeserializedData {
  items: any[];
  source: 'internal' | 'external';
}
```

#### 4.1.3 Keyboard Mapping

| Key | Action | Description |
|-----|--------|-------------|
| `Ctrl+C` / `Cmd+C` | Copy | 선택 항목 복사 |
| `Ctrl+X` / `Cmd+X` | Cut | 선택 항목 잘라내기 |
| `Ctrl+V` / `Cmd+V` | Paste | 붙여넣기 |
| `Ctrl+Shift+V` | Paste Plain | 서식 없이 붙여넣기 |
| `Ctrl+D` / `Cmd+D` | Duplicate | 복제 (Copy + Paste in place) |

#### 4.1.4 Context

```ts
interface ClipboardContext {
  // State
  hasClipboard: boolean;
  canPaste: boolean;
  isCutMode: boolean;  // 잘라내기 상태 (붙여넣기 시 원본 삭제)

  // Actions
  copy: () => Promise<void>;
  cut: () => Promise<void>;
  paste: () => Promise<void>;
  pastePlain: () => Promise<void>;
  duplicate: () => void;

  // External Clipboard Access
  readClipboard: () => Promise<ClipboardPayload>;
  writeClipboard: (payload: ClipboardPayload) => Promise<void>;
}
```

#### 4.1.5 Cross-App Clipboard

```tsx
<ClipboardScope
  serialize={(ids) => {
    const items = ids.map(id => getItem(id));
    return {
      // 앱 내부용 (구조 보존)
      'application/x-iddl': { items, schema: 'v1' },
      // 외부 앱용 (텍스트로 변환)
      'text/plain': items.map(i => i.name).join('\n'),
      // 서식 있는 텍스트용
      'text/html': `<ul>${items.map(i => `<li>${i.name}</li>`).join('')}</ul>`
    };
  }}
  deserialize={(payload) => {
    // 내부 데이터 우선
    if (payload['application/x-iddl']) {
      return {
        items: payload['application/x-iddl'].items,
        source: 'internal'
      };
    }
    // 외부 텍스트 파싱
    if (payload['text/plain']) {
      return {
        items: parseTextToItems(payload['text/plain']),
        source: 'external'
      };
    }
    return { items: [], source: 'external' };
  }}
>
  {children}
</ClipboardScope>
```

---

### 4.2 History

#### 4.2.1 Intent

> "모든 변경을 되돌리고 다시 실행할 수 있다"

#### 4.2.2 Props

```ts
interface HistoryScopeProps {
  /**
   * 활성화 여부
   * @default true
   */
  enabled?: boolean;

  /**
   * 최대 히스토리 스택 크기
   * @default 100
   */
  maxStack?: number;

  /**
   * 변경 그룹핑 딜레이 (연속 타이핑 등)
   * @default 300
   */
  debounce?: number;

  /**
   * 히스토리 변경 콜백
   */
  onChange?: (state: HistoryState) => void;

  /**
   * Undo 실행 콜백
   */
  onUndo?: (action: HistoryAction) => void;

  /**
   * Redo 실행 콜백
   */
  onRedo?: (action: HistoryAction) => void;

  children: React.ReactNode;
}

interface HistoryAction {
  /** 고유 ID */
  id: string;
  /** 액션 타입 */
  type: string;
  /** 타임스탬프 */
  timestamp: number;
  /** 표시용 라벨 */
  label?: string;
  /** 변경 전 상태 (undo용) */
  undo: () => void;
  /** 변경 후 상태 (redo용) */
  redo: () => void;
}

interface HistoryState {
  canUndo: boolean;
  canRedo: boolean;
  undoStack: HistoryAction[];
  redoStack: HistoryAction[];
}
```

#### 4.2.3 Keyboard Mapping

| Key | Action |
|-----|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Ctrl+Shift+Z` / `Cmd+Shift+Z` | Redo (alternative) |

#### 4.2.4 Context

```ts
interface HistoryContext {
  // State
  canUndo: boolean;
  canRedo: boolean;
  undoStack: ReadonlyArray<HistoryAction>;
  redoStack: ReadonlyArray<HistoryAction>;
  
  // 현재 진행 중인 배치
  isInBatch: boolean;

  // Actions
  undo: () => void;
  redo: () => void;

  /**
   * 히스토리에 액션 기록
   */
  record: (action: {
    type: string;
    label?: string;
    undo: () => void;
    redo: () => void;
  }) => void;

  /**
   * 여러 변경을 하나의 액션으로 그룹핑
   */
  batch: (fn: () => void, label?: string) => void;

  /**
   * 히스토리 초기화
   */
  clear: () => void;

  /**
   * 특정 지점으로 이동
   */
  goTo: (actionId: string) => void;
}
```

#### 4.2.5 Usage Patterns

**기본 사용**
```tsx
function ColorPicker() {
  const { record } = useHistoryContext();
  const [color, setColor] = useState('#000000');

  const changeColor = (newColor: string) => {
    const prevColor = color;
    
    record({
      type: 'changeColor',
      label: `색상 변경: ${newColor}`,
      undo: () => setColor(prevColor),
      redo: () => setColor(newColor),
    });
    
    setColor(newColor);
  };

  return <input type="color" value={color} onChange={e => changeColor(e.target.value)} />;
}
```

**배치 (여러 변경을 하나로)**
```tsx
function Editor() {
  const { batch } = useHistoryContext();

  const formatSelection = () => {
    batch(() => {
      applyBold();
      applyItalic();
      changeColor('red');
    }, '서식 일괄 적용');
    // 3개 변경이 하나의 Undo로 처리됨
  };
}
```

**Undo 가능한 삭제**
```tsx
function DeleteButton() {
  const { record } = useHistoryContext();
  const { selectedIds, clearSelection } = useSelectableContext();
  const { show: showToast } = useToastContext();

  const deleteSelected = () => {
    const items = selectedIds.map(id => getItem(id));
    const ids = [...selectedIds];

    record({
      type: 'delete',
      label: `${ids.length}개 항목 삭제`,
      undo: () => {
        items.forEach(item => restoreItem(item));
      },
      redo: () => {
        ids.forEach(id => deleteItem(id));
      },
    });

    ids.forEach(id => deleteItem(id));
    clearSelection();

    showToast({
      message: `${ids.length}개 항목이 삭제되었습니다`,
      undo: true,  // Toast에 실행 취소 버튼 표시
    });
  };
}
```

---

### 4.3 Draggable

#### 4.3.1 Intent

> "항목을 끌어서 다른 위치로 이동하거나 복사할 수 있다"

#### 4.3.2 Props

```ts
interface DraggableScopeProps {
  /**
   * 드래그 활성화
   * @default true
   */
  enabled?: boolean;

  /**
   * 드래그 축 제한
   */
  axis?: 'x' | 'y' | 'both';

  /**
   * 드래그 시작 거리 (px)
   * @default 5
   */
  threshold?: number;

  /**
   * 드래그 데이터 생성
   */
  getData: (draggedIds: string[]) => DragData;

  /**
   * 드롭 가능 여부 판단
   */
  canDrop?: (data: DragData, target: DropTarget) => boolean;

  /**
   * 드롭 핸들러
   */
  onDrop: (data: DragData, target: DropTarget) => void;

  /**
   * 드래그 시작 콜백
   */
  onDragStart?: (ids: string[]) => void;

  /**
   * 드래그 종료 콜백
   */
  onDragEnd?: (result: DragResult) => void;

  children: React.ReactNode;
}

interface DragData {
  type: string;
  items: any[];
  source: string;  // 원본 컨테이너 ID
}

interface DropTarget {
  containerId: string;
  index: number;
  position: 'before' | 'after' | 'inside';
}

interface DragResult {
  data: DragData;
  target: DropTarget | null;
  dropEffect: 'move' | 'copy' | 'none';
}
```

#### 4.3.3 Keyboard Support

| Key | Action |
|-----|--------|
| `Space` / `Enter` | 드래그 모드 시작 (선택 상태에서) |
| `↑↓←→` | 드래그 중 위치 이동 |
| `Space` / `Enter` | 드롭 |
| `Escape` | 드래그 취소 |
| `Ctrl` (hold) | 이동 → 복사 모드 전환 |

#### 4.3.4 Context

```ts
interface DraggableContext {
  // State
  isDragging: boolean;
  draggedIds: string[];
  dropTarget: DropTarget | null;
  dropEffect: 'move' | 'copy' | 'none';

  // Queries
  isDragSource: (id: string) => boolean;
  isDropTarget: (containerId: string) => boolean;
  getDropPosition: (containerId: string) => number | null;

  // Actions
  startDrag: (ids: string[]) => void;
  updateDropTarget: (target: DropTarget | null) => void;
  endDrag: () => void;
  cancelDrag: () => void;

  // Props Getters
  getDragHandleProps: (id: string) => DragHandleProps;
  getDropZoneProps: (containerId: string) => DropZoneProps;
}
```

---

## 5. Tier 3: Command System

> **파워 유저의 생산성을 위한 기능**

### 5.1 Shortcut

#### 5.1.1 Intent

> "키보드 단축키로 빠르게 명령을 실행할 수 있다"

#### 5.1.2 Props

```ts
interface ShortcutScopeProps {
  /**
   * 단축키 정의
   */
  shortcuts: ShortcutDefinition[];

  /**
   * 입력 필드 내에서도 동작
   * @default false
   */
  enableInInput?: boolean;

  /**
   * 충돌 시 동작
   * @default 'override'
   */
  conflict?: 'override' | 'skip' | 'both';

  children: React.ReactNode;
}

interface ShortcutDefinition {
  /**
   * 단축키 조합
   * - 'ctrl+s', 'cmd+shift+p', 'escape', 'f2'
   * - 'mod+s' = Cmd (Mac) / Ctrl (Others)
   */
  key: string;

  /**
   * 실행할 명령 ID
   */
  command: string;

  /**
   * 명령 파라미터
   */
  params?: Record<string, any>;

  /**
   * 활성화 조건
   */
  when?: string;

  /**
   * 표시 이름
   */
  label?: string;

  /**
   * 설명
   */
  description?: string;

  /**
   * 비활성화
   */
  disabled?: boolean;
}
```

#### 5.1.3 Key Syntax

```
Key Modifiers:
  ctrl   → Control key
  cmd    → Command key (Mac only)
  alt    → Alt / Option key
  shift  → Shift key
  mod    → Cmd (Mac) / Ctrl (Others)

Key Names:
  a-z, 0-9           → 알파벳, 숫자
  f1-f12             → Function keys
  escape, enter, tab → Special keys
  space, backspace, delete
  up, down, left, right
  home, end, pageup, pagedown
  
Examples:
  'mod+s'            → Save
  'mod+shift+p'      → Command Palette
  'ctrl+k ctrl+c'    → Chord (sequential)
  'escape'           → Cancel
  'f2'               → Rename
```

#### 5.1.4 Conditional Shortcuts

```tsx
<ShortcutScope
  shortcuts={[
    // 항상 활성
    { key: 'mod+s', command: 'save', label: '저장' },
    
    // 선택이 있을 때만
    { key: 'delete', command: 'delete', when: 'selection.count > 0' },
    { key: 'mod+c', command: 'copy', when: 'selection.count > 0' },
    
    // 특정 컨텍스트에서만
    { key: 'mod+b', command: 'bold', when: 'focus.within(editor)' },
    
    // 조건 조합
    { key: 'mod+d', command: 'duplicate', 
      when: 'selection.count > 0 && !isReadOnly' },
  ]}
>
```

#### 5.1.5 Context

```ts
interface ShortcutContext {
  // Queries
  getShortcutsForCommand: (commandId: string) => ShortcutDefinition[];
  getShortcutLabel: (commandId: string) => string | null;
  isShortcutActive: (key: string) => boolean;

  // Dynamic Registration
  registerShortcut: (shortcut: ShortcutDefinition) => () => void;
  unregisterShortcut: (key: string) => void;

  // Execution
  executeShortcut: (key: string) => boolean;
}
```

---

### 5.2 ContextMenu

#### 5.2.1 Intent

> "선택 대상에 맞는 명령 메뉴를 제공한다"

#### 5.2.2 Props

```ts
interface ContextMenuScopeProps {
  /**
   * 메뉴 아이템 생성 (동적)
   */
  items: (context: MenuContext) => MenuItem[];

  /**
   * 비활성화
   */
  disabled?: boolean;

  children: React.ReactNode;
}

interface MenuContext {
  /** 현재 선택된 ID들 */
  selectedIds: string[];
  /** 우클릭 대상 ID */
  targetId: string | null;
  /** 클릭 좌표 */
  position: { x: number; y: number };
  /** 추가 데이터 */
  data?: any;
}

interface MenuItem {
  id: string;
  type?: 'item' | 'separator' | 'submenu';
  label?: string;
  icon?: string;
  /** 표시용 단축키 (실제 동작은 Shortcut에서) */
  shortcut?: string;
  disabled?: boolean;
  /** 위험한 액션 표시 (빨간색) */
  danger?: boolean;
  /** 서브메뉴 */
  children?: MenuItem[];
  /** 실행할 명령 */
  command?: string;
  params?: Record<string, any>;
}
```

#### 5.2.3 Usage

```tsx
<ContextMenuScope
  items={(ctx) => {
    const count = ctx.selectedIds.length;
    const single = count === 1;
    
    return [
      { id: 'open', label: '열기', shortcut: 'Enter', 
        command: 'open', disabled: !single },
      { id: 'rename', label: '이름 변경', shortcut: 'F2', 
        command: 'rename', disabled: !single },
      { type: 'separator' },
      { id: 'cut', label: '잘라내기', shortcut: 'Ctrl+X', 
        command: 'cut', disabled: count === 0 },
      { id: 'copy', label: '복사', shortcut: 'Ctrl+C', 
        command: 'copy', disabled: count === 0 },
      { id: 'paste', label: '붙여넣기', shortcut: 'Ctrl+V', 
        command: 'paste' },
      { type: 'separator' },
      { id: 'share', label: '공유', icon: 'share',
        type: 'submenu',
        children: [
          { id: 'share-link', label: '링크 복사', command: 'copyLink' },
          { id: 'share-email', label: '이메일로 보내기', command: 'shareEmail' },
        ]
      },
      { type: 'separator' },
      { id: 'delete', label: `삭제${count > 1 ? ` (${count}개)` : ''}`, 
        shortcut: 'Delete', command: 'delete', danger: true },
    ];
  }}
>
  <List>...</List>
</ContextMenuScope>
```

#### 5.2.4 Context

```ts
interface ContextMenuContext {
  // State
  isOpen: boolean;
  position: { x: number; y: number } | null;
  items: MenuItem[];

  // Actions
  open: (position: { x: number; y: number }, context?: any) => void;
  close: () => void;
  
  // Props Getter
  getTriggerProps: () => TriggerProps;
}
```

---

### 5.3 CommandPalette

#### 5.3.1 Intent

> "모든 명령을 검색하고 실행할 수 있는 중앙 허브"

#### 5.3.2 Props

```ts
interface CommandPaletteScopeProps {
  /**
   * 열기 단축키
   * @default 'mod+k'
   */
  hotkey?: string;

  /**
   * 명령 목록
   */
  commands: CommandDefinition[];

  /**
   * 최근 사용 명령 개수
   * @default 5
   */
  recentCount?: number;

  /**
   * 검색 플레이스홀더
   * @default '명령 검색...'
   */
  placeholder?: string;

  children: React.ReactNode;
}

interface CommandDefinition {
  id: string;
  label: string;
  /** 검색용 키워드 */
  keywords?: string[];
  /** 카테고리/그룹 */
  category?: string;
  icon?: string;
  shortcut?: string;
  /** 실행 함수 또는 명령 ID */
  action: string | (() => void | Promise<void>);
  /** 표시 조건 */
  when?: string;
  /** 비활성화 조건 */
  disabled?: boolean | string;
}
```

#### 5.3.3 Context

```ts
interface CommandPaletteContext {
  // State
  isOpen: boolean;
  query: string;
  filteredCommands: CommandDefinition[];
  selectedIndex: number;

  // Actions
  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
  executeSelected: () => void;
  selectNext: () => void;
  selectPrev: () => void;

  // Command Registry
  registerCommand: (command: CommandDefinition) => () => void;
  executeCommand: (commandId: string, params?: any) => void;
}
```

#### 5.3.4 Usage

```tsx
<CommandPaletteScope
  commands={[
    // 파일
    { id: 'newFile', label: '새 파일', category: '파일', 
      shortcut: 'Ctrl+N', action: 'file.new' },
    { id: 'openFile', label: '파일 열기', category: '파일', 
      shortcut: 'Ctrl+O', action: 'file.open' },
    { id: 'save', label: '저장', category: '파일', 
      shortcut: 'Ctrl+S', action: 'file.save' },
    
    // 편집
    { id: 'undo', label: '실행 취소', category: '편집', 
      shortcut: 'Ctrl+Z', action: 'edit.undo' },
    { id: 'redo', label: '다시 실행', category: '편집', 
      shortcut: 'Ctrl+Y', action: 'edit.redo' },
    { id: 'find', label: '찾기', category: '편집', 
      shortcut: 'Ctrl+F', action: 'edit.find' },
    
    // 보기
    { id: 'zoomIn', label: '확대', category: '보기', 
      shortcut: 'Ctrl++', action: 'view.zoomIn' },
    { id: 'zoomOut', label: '축소', category: '보기', 
      shortcut: 'Ctrl+-', action: 'view.zoomOut' },
    { id: 'fullscreen', label: '전체 화면', category: '보기', 
      shortcut: 'F11', action: 'view.fullscreen' },
    
    // 동적 명령
    { id: 'deleteSelected', label: '선택 항목 삭제', category: '편집',
      shortcut: 'Delete', action: 'edit.delete',
      when: 'selection.count > 0' },
  ]}
>
  <App />
</CommandPaletteScope>
```

---

## 6. Tier 4: Structure Control

> **계층적 데이터와 정렬을 위한 기능**

### 6.1 Expandable

#### 6.1.1 Intent

> "계층 구조를 펼치고 접을 수 있다"

#### 6.1.2 Props

```ts
interface ExpandableScopeProps {
  /**
   * 다중 펼침 허용
   * @default true
   */
  multiple?: boolean;

  /**
   * 기본 펼침 항목
   */
  defaultExpanded?: string[];

  /**
   * 제어 모드용 펼침 상태
   */
  expanded?: string[];

  /**
   * 펼침 상태 변경 콜백
   */
  onExpandedChange?: (expandedIds: string[]) => void;

  children: React.ReactNode;
}
```

#### 6.1.3 Keyboard Mapping

| Key | Action |
|-----|--------|
| `→` | 펼치기 (접힌 상태) / 첫 자식으로 이동 (펼친 상태) |
| `←` | 접기 (펼친 상태) / 부모로 이동 (접힌 상태) |
| `Enter` / `Space` | 토글 |
| `*` | 모든 형제 펼치기 |

#### 6.1.4 Context

```ts
interface ExpandableContext {
  // State
  expandedIds: ReadonlySet<string>;

  // Queries
  isExpanded: (id: string) => boolean;
  hasChildren: (id: string) => boolean;

  // Actions
  expand: (id: string) => void;
  collapse: (id: string) => void;
  toggle: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;

  // Registration
  registerItem: (item: ExpandableItem) => void;
  unregisterItem: (id: string) => void;

  // Props Getter
  getItemProps: (id: string) => ExpandableItemProps;
  getTriggerProps: (id: string) => ExpandableTriggerProps;
}
```

---

### 6.2 Sortable

#### 6.2.1 Intent

> "목록의 정렬 순서를 변경할 수 있다"

#### 6.2.2 Props

```ts
interface SortableScopeProps {
  /**
   * 정렬 가능 컬럼
   */
  columns: SortableColumn[];

  /**
   * 기본 정렬
   */
  defaultSort?: SortState;

  /**
   * 제어 모드용 정렬 상태
   */
  sort?: SortState;

  /**
   * 다중 컬럼 정렬
   * @default false
   */
  multiSort?: boolean;

  /**
   * 정렬 변경 콜백
   */
  onSortChange?: (sort: SortState) => void;

  children: React.ReactNode;
}

interface SortableColumn {
  id: string;
  label: string;
  sortable?: boolean;
  defaultDirection?: 'asc' | 'desc';
}

type SortState = {
  column: string;
  direction: 'asc' | 'desc';
}[];
```

#### 6.2.3 Context

```ts
interface SortableContext {
  // State
  sort: SortState;

  // Queries
  getSortDirection: (columnId: string) => 'asc' | 'desc' | null;
  getSortIndex: (columnId: string) => number;  // 다중 정렬 시 순서

  // Actions
  toggleSort: (columnId: string) => void;
  setSort: (columnId: string, direction: 'asc' | 'desc') => void;
  clearSort: () => void;

  // Props Getter
  getHeaderProps: (columnId: string) => SortableHeaderProps;
}
```

---

### 6.3 Groupable

#### 6.3.1 Intent

> "항목들을 논리적 그룹으로 묶어서 표시한다"

#### 6.3.2 Props

```ts
interface GroupableScopeProps {
  /**
   * 그룹 키 필드
   */
  groupBy?: string;

  /**
   * 그룹 정렬
   */
  groupSort?: 'asc' | 'desc' | ((a: string, b: string) => number);

  /**
   * 그룹 라벨 탐색 포함
   * @default false
   */
  navigateLabels?: boolean;

  /**
   * 그룹 접기 가능
   * @default true
   */
  collapsible?: boolean;

  children: React.ReactNode;
}
```

#### 6.3.3 Context

```ts
interface GroupableContext {
  // State
  groups: Group[];
  collapsedGroups: ReadonlySet<string>;

  // Queries
  getGroup: (itemId: string) => string | null;
  isGroupCollapsed: (groupId: string) => boolean;

  // Actions
  collapseGroup: (groupId: string) => void;
  expandGroup: (groupId: string) => void;
  toggleGroup: (groupId: string) => void;
}

interface Group {
  id: string;
  label: string;
  items: string[];
  count: number;
}
```

---

## 7. Tier 5: Feedback

> **사용자에게 상태와 결과를 알려주는 기능**

### 7.1 Toast

#### 7.1.1 Intent

> "일시적인 피드백 메시지를 표시한다"

#### 7.1.2 Props

```ts
interface ToastScopeProps {
  /**
   * Toast 위치
   * @default 'bottom-right'
   */
  position?: 
    | 'top' | 'bottom' 
    | 'top-left' | 'top-right' 
    | 'bottom-left' | 'bottom-right';

  /**
   * 기본 지속 시간 (ms)
   * @default 3000
   */
  duration?: number;

  /**
   * 최대 동시 표시 개수
   * @default 5
   */
  maxVisible?: number;

  /**
   * 새 Toast 위치
   * @default 'end'
   */
  newestPosition?: 'start' | 'end';

  children: React.ReactNode;
}
```

#### 7.1.3 Toast Options

```ts
interface ToastOptions {
  /** 고유 ID (자동 생성) */
  id?: string;
  /** 타입 */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** 제목 */
  title?: string;
  /** 메시지 (필수) */
  message: string;
  /** 지속 시간 (0 = 수동 닫기) */
  duration?: number;
  /** 닫기 버튼 표시 */
  dismissible?: boolean;
  /** 액션 버튼 */
  action?: {
    label: string;
    onClick: () => void;
  };
  /** 실행 취소 버튼 */
  undo?: {
    label?: string;
    onUndo: () => void;
  };
  /** 닫힘 콜백 */
  onClose?: () => void;
}
```

#### 7.1.4 Context

```ts
interface ToastContext {
  // State
  toasts: Toast[];

  // Actions
  show: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;

  // Convenience Methods
  info: (message: string, options?: Partial<ToastOptions>) => string;
  success: (message: string, options?: Partial<ToastOptions>) => string;
  warning: (message: string, options?: Partial<ToastOptions>) => string;
  error: (message: string, options?: Partial<ToastOptions>) => string;
}
```

#### 7.1.5 Usage Patterns

```tsx
const toast = useToastContext();

// 기본 사용
toast.success('저장되었습니다');

// Undo 지원 삭제
const handleDelete = () => {
  const deleted = deleteItems(selectedIds);
  
  toast.show({
    message: `${deleted.length}개 항목이 삭제되었습니다`,
    undo: {
      onUndo: () => restoreItems(deleted),
    },
  });
};

// 액션 버튼
toast.show({
  type: 'info',
  message: '새 버전이 있습니다',
  duration: 0,  // 수동 닫기
  action: {
    label: '업데이트',
    onClick: () => window.location.reload(),
  },
});

// 에러 상세
toast.error('저장에 실패했습니다', {
  duration: 5000,
  action: {
    label: '다시 시도',
    onClick: () => retry(),
  },
});
```

---

### 7.2 Confirm

#### 7.2.1 Intent

> "중요한 작업 전에 사용자 확인을 받는다"

#### 7.2.2 Props

```ts
interface ConfirmScopeProps {
  children: React.ReactNode;
}

interface ConfirmOptions {
  /** 제목 */
  title: string;
  /** 메시지 */
  message: string;
  /** 확인 버튼 텍스트 */
  confirmLabel?: string;
  /** 취소 버튼 텍스트 */
  cancelLabel?: string;
  /** 위험한 액션 (빨간 확인 버튼) */
  danger?: boolean;
  /** 확인 입력 필요 (텍스트 입력) */
  confirmInput?: {
    label: string;
    match: string;  // 입력해야 하는 텍스트
  };
}
```

#### 7.2.3 Context

```ts
interface ConfirmContext {
  /**
   * 확인 다이얼로그 표시
   * @returns 확인 시 true, 취소 시 false
   */
  confirm: (options: ConfirmOptions) => Promise<boolean>;

  /**
   * 현재 열린 확인 상태
   */
  isOpen: boolean;
}
```

#### 7.2.4 Usage

```tsx
const { confirm } = useConfirmContext();

const handleDelete = async () => {
  const confirmed = await confirm({
    title: '삭제 확인',
    message: `${selectedIds.length}개 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
    confirmLabel: '삭제',
    danger: true,
  });

  if (confirmed) {
    deleteItems(selectedIds);
  }
};

// 확인 입력 필요
const handleDeleteAccount = async () => {
  const confirmed = await confirm({
    title: '계정 삭제',
    message: '계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.',
    confirmInput: {
      label: '확인을 위해 "DELETE"를 입력하세요',
      match: 'DELETE',
    },
    confirmLabel: '계정 삭제',
    danger: true,
  });

  if (confirmed) {
    await deleteAccount();
  }
};
```

---

### 7.3 Progress

#### 7.3.1 Intent

> "진행 중인 작업의 상태를 표시한다"

#### 7.3.2 Props

```ts
interface ProgressScopeProps {
  children: React.ReactNode;
}

interface ProgressOptions {
  /** 고유 ID */
  id?: string;
  /** 표시 메시지 */
  message: string;
  /** 진행률 (0-100, undefined = indeterminate) */
  progress?: number;
  /** 취소 가능 */
  cancellable?: boolean;
  /** 취소 콜백 */
  onCancel?: () => void;
}
```

#### 7.3.3 Context

```ts
interface ProgressContext {
  // State
  activeProgress: Progress[];

  // Actions
  start: (options: ProgressOptions) => string;
  update: (id: string, updates: Partial<ProgressOptions>) => void;
  complete: (id: string) => void;
  cancel: (id: string) => void;

  // Convenience
  withProgress: <T>(
    options: ProgressOptions,
    task: (update: (progress: number) => void) => Promise<T>
  ) => Promise<T>;
}
```

#### 7.3.4 Usage

```tsx
const progress = useProgressContext();

// 기본 사용 (indeterminate)
const uploadFile = async (file: File) => {
  const id = progress.start({
    message: `${file.name} 업로드 중...`,
    cancellable: true,
  });

  try {
    await upload(file, (percent) => {
      progress.update(id, { progress: percent });
    });
    progress.complete(id);
    toast.success('업로드 완료');
  } catch (e) {
    progress.complete(id);
    toast.error('업로드 실패');
  }
};

// withProgress 헬퍼
const processItems = async (items: Item[]) => {
  await progress.withProgress(
    { message: '처리 중...', cancellable: true },
    async (update) => {
      for (let i = 0; i < items.length; i++) {
        await processItem(items[i]);
        update((i + 1) / items.length * 100);
      }
    }
  );
};
```

---

## 8. Tier 6: Search & View

> **콘텐츠 탐색과 뷰 제어**

### 8.1 Searchable

#### 8.1.1 Intent

> "콘텐츠를 검색하고 결과를 탐색할 수 있다"

#### 8.1.2 Props

```ts
interface SearchableScopeProps {
  /**
   * 검색 대상 필드
   */
  fields: string[];

  /**
   * 검색 방식
   * @default 'contains'
   */
  matchMode?: 'contains' | 'startsWith' | 'exact' | 'fuzzy';

  /**
   * 대소문자 구분
   * @default false
   */
  caseSensitive?: boolean;

  /**
   * 디바운스 (ms)
   * @default 200
   */
  debounce?: number;

  /**
   * 결과 하이라이팅
   * @default true
   */
  highlight?: boolean;

  /**
   * 검색 변경 콜백
   */
  onSearch?: (query: string, resultCount: number) => void;

  children: React.ReactNode;
}
```

#### 8.1.3 Keyboard Mapping

| Key | Action |
|-----|--------|
| `Ctrl+F` / `Cmd+F` | 검색 열기 |
| `Enter` | 다음 결과 |
| `Shift+Enter` | 이전 결과 |
| `Escape` | 검색 닫기 |
| `F3` | 다음 결과 |
| `Shift+F3` | 이전 결과 |

#### 8.1.4 Context

```ts
interface SearchableContext {
  // State
  query: string;
  isSearching: boolean;
  isOpen: boolean;
  results: SearchResult[];
  currentIndex: number;

  // Queries
  isMatch: (id: string) => boolean;
  getMatchRanges: (id: string, field: string) => Range[];
  getTotalCount: () => number;

  // Actions
  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
  clear: () => void;
  focusNext: () => void;
  focusPrev: () => void;
  focusCurrent: () => void;
}

interface SearchResult {
  id: string;
  matches: { field: string; ranges: Range[] }[];
  score?: number;  // fuzzy search용
}

interface Range {
  start: number;
  end: number;
}
```

---

### 8.2 Zoomable

#### 8.2.1 Intent

> "캔버스를 확대/축소하고 패닝할 수 있다"

#### 8.2.2 Props

```ts
interface ZoomableScopeProps {
  /**
   * 최소 줌 레벨
   * @default 0.1
   */
  minZoom?: number;

  /**
   * 최대 줌 레벨
   * @default 10
   */
  maxZoom?: number;

  /**
   * 줌 단계
   * @default 0.1
   */
  zoomStep?: number;

  /**
   * 초기 줌
   * @default 1
   */
  defaultZoom?: number;

  /**
   * 패닝 활성화
   * @default true
   */
  pannable?: boolean;

  /**
   * 패닝 트리거
   * @default 'space'
   */
  panTrigger?: 'space' | 'middle' | 'alt';

  /**
   * 줌 변경 콜백
   */
  onZoomChange?: (zoom: number) => void;

  /**
   * 패닝 변경 콜백
   */
  onPanChange?: (pan: { x: number; y: number }) => void;

  children: React.ReactNode;
}
```

#### 8.2.3 Controls

| Input | Action |
|-------|--------|
| `Ctrl+휠` | 줌 인/아웃 |
| `Ctrl++` / `Ctrl+=` | 줌 인 |
| `Ctrl+-` | 줌 아웃 |
| `Ctrl+0` | 100% 리셋 |
| `Ctrl+1` | Fit to view |
| `Space+드래그` | 패닝 |
| 휠 | 수직 스크롤 |
| `Shift+휠` | 수평 스크롤 |
| 더블클릭 | 줌 인 (클릭 위치 중심) |

#### 8.2.4 Context

```ts
interface ZoomableContext {
  // State
  zoom: number;
  pan: { x: number; y: number };
  isPanning: boolean;

  // Actions
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo: (level: number, center?: { x: number; y: number }) => void;
  zoomToFit: () => void;
  zoomToSelection: () => void;
  resetZoom: () => void;
  panTo: (x: number, y: number) => void;
  panBy: (dx: number, dy: number) => void;
  centerOn: (elementId: string) => void;

  // Coordinate Transform
  screenToCanvas: (point: { x: number; y: number }) => { x: number; y: number };
  canvasToScreen: (point: { x: number; y: number }) => { x: number; y: number };

  // Props Getter
  getContainerProps: () => ZoomableContainerProps;
  getContentProps: () => ZoomableContentProps;
}
```

---

## 9. Tier 7: Overlay

> **오버레이 요소의 닫기 동작**

### 9.1 Dismissable

#### 9.1.1 Intent

> "오버레이를 다양한 방법으로 닫을 수 있다"

#### 9.1.2 Props

```ts
interface DismissableScopeProps {
  /**
   * Escape 키 동작
   * @default 'dismiss'
   */
  onEscape?: 'dismiss' | 'none' | (() => void);

  /**
   * 외부 클릭 동작
   * @default 'dismiss'
   */
  onClickOutside?: 'dismiss' | 'none' | (() => void);

  /**
   * 외부 클릭 무시 영역
   */
  outsideClickIgnore?: string[];

  /**
   * 닫힘 콜백
   */
  onDismiss?: () => void;

  /**
   * 닫기 전 확인 (false 반환 시 닫기 취소)
   */
  shouldDismiss?: () => boolean | Promise<boolean>;

  children: React.ReactNode;
}
```

#### 9.1.3 Context

```ts
interface DismissableContext {
  // Actions
  dismiss: () => void;

  // Props Getter
  getContainerProps: () => DismissableContainerProps;
}
```

---

## 10. Composition Patterns

### 10.1 File Explorer

```tsx
<AppScope>
  <History maxStack={50}>
    <Clipboard serialize={fileSerialize} deserialize={fileDeserialize}>
      <Shortcut shortcuts={explorerShortcuts}>
        <ContextMenuScope items={explorerContextMenu}>
          <FocusScope>
            <Selectable mode="extended" followFocus={false}>
              <Expandable multiple>
                <Navigable orientation="vertical">
                  <Draggable getData={getDragData} onDrop={handleDrop}>
                    <TreeView />
                  </Draggable>
                </Navigable>
              </Expandable>
            </Selectable>
          </FocusScope>
        </ContextMenuScope>
      </Shortcut>
    </Clipboard>
  </History>
</AppScope>
```

**제공되는 기능:**
- ↑↓ 키보드 탐색
- → 펼치기, ← 접기
- Click/Ctrl+Click/Shift+Click 선택
- Ctrl+C/X/V 복사/잘라내기/붙여넣기
- Ctrl+Z/Y 실행취소/다시실행
- Delete 삭제
- F2 이름 변경
- 우클릭 컨텍스트 메뉴
- 드래그 앤 드롭

---

### 10.2 Data Table

```tsx
<AppScope>
  <History>
    <Clipboard serialize={rowSerialize} deserialize={rowDeserialize}>
      <Shortcut shortcuts={tableShortcuts}>
        <ContextMenuScope items={tableContextMenu}>
          <FocusScope>
            <Searchable fields={['name', 'email', 'department']}>
              <Sortable columns={columns}>
                <Selectable mode="extended" followFocus={false}>
                  <Navigable orientation="both">
                    <DataTable />
                  </Navigable>
                </Selectable>
              </Sortable>
            </Searchable>
          </FocusScope>
        </ContextMenuScope>
      </Shortcut>
    </Clipboard>
  </History>
</AppScope>
```

**제공되는 기능:**
- ↑↓←→ 셀 탐색
- 행 선택 (extended mode)
- 컬럼 정렬
- Ctrl+F 검색
- 복사/붙여넣기
- 실행취소/다시실행
- 컨텍스트 메뉴

---

### 10.3 Modal Dialog

```tsx
<FocusScope trap restoreFocus autoFocus="first">
  <Dismissable onEscape="dismiss" onClickOutside="dismiss">
    <Shortcut shortcuts={[
      { key: 'enter', command: 'confirm', when: 'focus.within(confirmButton)' },
    ]}>
      <Dialog>
        <DialogHeader />
        <DialogContent />
        <DialogFooter>
          <Button id="cancelButton">취소</Button>
          <Button id="confirmButton" intent="Brand">확인</Button>
        </DialogFooter>
      </Dialog>
    </Shortcut>
  </Dismissable>
</FocusScope>
```

**제공되는 기능:**
- 자동 포커스
- Tab 트랩
- Escape로 닫기
- 외부 클릭으로 닫기
- 닫을 때 포커스 복원

---

### 10.4 Canvas Editor (Figma-style)

```tsx
<AppScope>
  <History maxStack={200}>
    <Clipboard serialize={elementSerialize} deserialize={elementDeserialize}>
      <CommandPaletteScope commands={editorCommands}>
        <Shortcut shortcuts={editorShortcuts}>
          <ContextMenuScope items={canvasContextMenu}>
            <Zoomable minZoom={0.1} maxZoom={50}>
              <Selectable mode="extended">
                <Draggable axis="both">
                  <Canvas />
                </Draggable>
              </Selectable>
            </Zoomable>
          </ContextMenuScope>
        </Shortcut>
      </CommandPaletteScope>
    </Clipboard>
  </History>
</AppScope>
```

**제공되는 기능:**
- Ctrl+휠 줌
- Space+드래그 패닝
- 다중 선택
- 드래그로 이동/복사
- 복사/붙여넣기
- 무제한 실행취소
- Ctrl+K 명령 팔레트
- 컨텍스트 메뉴

---

## 11. Type Definitions

```ts
/**
 * IDDL Behavior Primitives
 * Type Definitions
 * Version: 0.2.0
 */

// =============================================================================
// TIER 1: CORE INTERACTION
// =============================================================================

// Navigable
export interface NavigableProps { /* ... */ }
export interface NavigableContext { /* ... */ }
export function useNavigable(props: NavigableProps): NavigableContext;
export function useNavigableContext(): NavigableContext;
export function useNavigableItem(id: string): NavigableItemResult;
export const Navigable: React.FC<NavigableProps>;

// Selectable
export interface SelectableProps { /* ... */ }
export interface SelectableContext { /* ... */ }
export function useSelectable(props: SelectableProps): SelectableContext;
export function useSelectableContext(): SelectableContext;
export function useSelectableItem(id: string): SelectableItemResult;
export const Selectable: React.FC<SelectableProps>;

// FocusScope
export interface FocusScopeProps { /* ... */ }
export interface FocusScopeContext { /* ... */ }
export function useFocusScope(props: FocusScopeProps): FocusScopeContext;
export function useFocusScopeContext(): FocusScopeContext;
export const FocusScope: React.FC<FocusScopeProps>;

// =============================================================================
// TIER 2: DATA MANIPULATION
// =============================================================================

// Clipboard
export interface ClipboardScopeProps { /* ... */ }
export interface ClipboardContext { /* ... */ }
export function useClipboard(props: ClipboardScopeProps): ClipboardContext;
export function useClipboardContext(): ClipboardContext;
export const ClipboardScope: React.FC<ClipboardScopeProps>;

// History
export interface HistoryScopeProps { /* ... */ }
export interface HistoryContext { /* ... */ }
export function useHistory(props: HistoryScopeProps): HistoryContext;
export function useHistoryContext(): HistoryContext;
export const HistoryScope: React.FC<HistoryScopeProps>;

// Draggable
export interface DraggableScopeProps { /* ... */ }
export interface DraggableContext { /* ... */ }
export function useDraggable(props: DraggableScopeProps): DraggableContext;
export function useDraggableContext(): DraggableContext;
export const DraggableScope: React.FC<DraggableScopeProps>;

// =============================================================================
// TIER 3: COMMAND SYSTEM
// =============================================================================

// Shortcut
export interface ShortcutScopeProps { /* ... */ }
export interface ShortcutContext { /* ... */ }
export function useShortcut(props: ShortcutScopeProps): ShortcutContext;
export function useShortcutContext(): ShortcutContext;
export const ShortcutScope: React.FC<ShortcutScopeProps>;

// ContextMenu
export interface ContextMenuScopeProps { /* ... */ }
export interface ContextMenuContext { /* ... */ }
export function useContextMenu(props: ContextMenuScopeProps): ContextMenuContext;
export function useContextMenuContext(): ContextMenuContext;
export const ContextMenuScope: React.FC<ContextMenuScopeProps>;

// CommandPalette
export interface CommandPaletteScopeProps { /* ... */ }
export interface CommandPaletteContext { /* ... */ }
export function useCommandPalette(props: CommandPaletteScopeProps): CommandPaletteContext;
export function useCommandPaletteContext(): CommandPaletteContext;
export const CommandPaletteScope: React.FC<CommandPaletteScopeProps>;

// =============================================================================
// TIER 4: STRUCTURE CONTROL
// =============================================================================

// Expandable
export interface ExpandableScopeProps { /* ... */ }
export interface ExpandableContext { /* ... */ }
export function useExpandable(props: ExpandableScopeProps): ExpandableContext;
export function useExpandableContext(): ExpandableContext;
export const ExpandableScope: React.FC<ExpandableScopeProps>;

// Sortable
export interface SortableScopeProps { /* ... */ }
export interface SortableContext { /* ... */ }
export function useSortable(props: SortableScopeProps): SortableContext;
export function useSortableContext(): SortableContext;
export const SortableScope: React.FC<SortableScopeProps>;

// Groupable
export interface GroupableScopeProps { /* ... */ }
export interface GroupableContext { /* ... */ }
export function useGroupable(props: GroupableScopeProps): GroupableContext;
export function useGroupableContext(): GroupableContext;
export const GroupableScope: React.FC<GroupableScopeProps>;

// =============================================================================
// TIER 5: FEEDBACK
// =============================================================================

// Toast
export interface ToastScopeProps { /* ... */ }
export interface ToastContext { /* ... */ }
export function useToast(): ToastContext;
export const ToastScope: React.FC<ToastScopeProps>;

// Confirm
export interface ConfirmScopeProps { /* ... */ }
export interface ConfirmContext { /* ... */ }
export function useConfirm(): ConfirmContext;
export const ConfirmScope: React.FC<ConfirmScopeProps>;

// Progress
export interface ProgressScopeProps { /* ... */ }
export interface ProgressContext { /* ... */ }
export function useProgress(): ProgressContext;
export const ProgressScope: React.FC<ProgressScopeProps>;

// =============================================================================
// TIER 6: SEARCH & VIEW
// =============================================================================

// Searchable
export interface SearchableScopeProps { /* ... */ }
export interface SearchableContext { /* ... */ }
export function useSearchable(props: SearchableScopeProps): SearchableContext;
export function useSearchableContext(): SearchableContext;
export const SearchableScope: React.FC<SearchableScopeProps>;

// Zoomable
export interface ZoomableScopeProps { /* ... */ }
export interface ZoomableContext { /* ... */ }
export function useZoomable(props: ZoomableScopeProps): ZoomableContext;
export function useZoomableContext(): ZoomableContext;
export const ZoomableScope: React.FC<ZoomableScopeProps>;

// =============================================================================
// TIER 7: OVERLAY
// =============================================================================

// Dismissable
export interface DismissableScopeProps { /* ... */ }
export interface DismissableContext { /* ... */ }
export function useDismissable(props: DismissableScopeProps): DismissableContext;
export function useDismissableContext(): DismissableContext;
export const DismissableScope: React.FC<DismissableScopeProps>;

// =============================================================================
// APP SCOPE (Root)
// =============================================================================

export interface AppScopeProps {
  /** Command Registry */
  commands?: CommandDefinition[];
  /** Global Shortcuts */
  shortcuts?: ShortcutDefinition[];
  /** Toast 설정 */
  toast?: ToastScopeProps;
  children: React.ReactNode;
}

export const AppScope: React.FC<AppScopeProps>;

// =============================================================================
// COMBINED HOOKS
// =============================================================================

/** List Item 통합 Hook (Navigable + Selectable) */
export function useListItem(id: string): {
  isFocused: boolean;
  isSelected: boolean;
  itemProps: CombinedItemProps;
  itemRef: React.RefCallback<HTMLElement>;
};

/** Tree Item 통합 Hook (Navigable + Selectable + Expandable) */
export function useTreeItem(id: string): {
  isFocused: boolean;
  isSelected: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  itemProps: TreeItemProps;
  triggerProps: ExpandTriggerProps;
  itemRef: React.RefCallback<HTMLElement>;
};
```

---

## Summary

### Behavior Primitives Overview

| Tier | Primitive | Intent | Key Features |
|------|-----------|--------|--------------|
| **1** | Navigable | 키보드 탐색 | ↑↓←→, Home/End, Typeahead |
| **1** | Selectable | 선택/다중선택 | Click, Ctrl+Click, Shift+Click, Ctrl+A |
| **1** | FocusScope | 포커스 관리 | Trap, Restore, AutoFocus |
| **2** | Clipboard | 복사/붙여넣기 | Ctrl+C/X/V, Cross-app |
| **2** | History | Undo/Redo | Ctrl+Z/Y, Batching |
| **2** | Draggable | 드래그 앤 드롭 | Move, Copy, Keyboard DnD |
| **3** | Shortcut | 키보드 단축키 | Conditional, Chord |
| **3** | ContextMenu | 우클릭 메뉴 | Dynamic items |
| **3** | CommandPalette | 명령 팔레트 | Ctrl+K, Search |
| **4** | Expandable | 펼침/접힘 | →/← keys, Tree |
| **4** | Sortable | 정렬 | Multi-column |
| **4** | Groupable | 그룹핑 | Collapsible groups |
| **5** | Toast | 토스트 알림 | Undo, Actions |
| **5** | Confirm | 확인 다이얼로그 | Danger, Input confirm |
| **5** | Progress | 진행 표시 | Cancellable |
| **6** | Searchable | 검색/필터 | Ctrl+F, Highlight |
| **6** | Zoomable | 확대/축소 | Ctrl+휠, Pan |
| **7** | Dismissable | 닫기 | Escape, ClickOutside |

---

이 명세가 적절한 방향인가요? 추가하거나 수정할 부분이 있으면 말씀해주세요.