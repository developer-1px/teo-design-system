# IDDL Behavior Primitives Specification v3

**Draft Community Group Report, 11 January 2026**

---

## Abstract

이 문서는 IDDL(Intent-Driven Design Language)의 Behavior Primitives를 정의합니다. 

v3에서는 **평탄한 선언(Flat Declaration)** 방식을 도입하여, 중첩 없이 여러 Behavior를 조합할 수 있습니다.

---

## Status of This Document

This document is a **Working Draft**.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Flat Declaration Syntax](#2-flat-declaration-syntax)
3. [Behavior Container](#3-behavior-container)
4. [Edit Behaviors](#4-edit-behaviors)
5. [Navigation Behaviors](#5-navigation-behaviors)
6. [View Behaviors](#6-view-behaviors)
7. [Command Behaviors](#7-command-behaviors)
8. [Feedback Behaviors](#8-feedback-behaviors)
9. [Window Behaviors](#9-window-behaviors)
10. [Composition Patterns](#10-composition-patterns)
11. [Role → Behavior Mapping](#11-role--behavior-mapping)
12. [TypeScript Interfaces](#12-typescript-interfaces)

---

## 1. Introduction

### 1.1 Problem: Deep Nesting

v2에서는 Behavior를 중첩하여 조합했습니다:

```tsx
// ❌ v2: 깊은 중첩
<History>
  <Clipboard>
    <Draggable>
      <Selectable mode="extended">
        <Navigable orientation="vertical">
          <Searchable>
            <List>
              {children}
            </List>
          </Searchable>
        </Navigable>
      </Selectable>
    </Draggable>
  </Clipboard>
</History>
```

문제점:
- 읽기 어려움
- 순서 의존성이 암묵적
- 조합 변경 시 구조 변경 필요
- 닫는 태그 지옥

### 1.2 Solution: Flat Declaration

v3에서는 `<Behavior>` 컨테이너 안에 평탄하게 선언합니다:

```tsx
// ✅ v3: 평탄한 선언
<Behavior>
  <History />
  <Clipboard />
  <Draggable />
  <Selectable mode="extended" />
  <Navigable orientation="vertical" />
  <Searchable />
  
  <List>
    {children}
  </List>
</Behavior>
```

장점:
- 한눈에 파악 가능
- 순서 독립적 (내부에서 올바른 순서로 처리)
- 조합 변경이 간단 (줄 추가/삭제)
- 닫는 태그 최소화

### 1.3 Design Principles

1. **Flat over Nested**: 중첩 대신 평탄한 선언
2. **Order Independent**: 선언 순서와 무관하게 동작
3. **Explicit Composition**: 필요한 Behavior만 명시적으로 선언
4. **Single Container**: 하나의 `<Behavior>` 컨테이너가 모든 것을 관리

---

## 2. Flat Declaration Syntax

### 2.1 Basic Structure

```tsx
<Behavior>
  {/* Behavior 선언들 (순서 무관) */}
  <Selectable mode="extended" />
  <Navigable orientation="vertical" />
  <History />
  
  {/* 실제 UI 컨텐츠 (마지막에 위치) */}
  <List>
    {children}
  </List>
</Behavior>
```

### 2.2 Rules

1. **Behavior 선언**: self-closing 태그 (`<Selectable />`)
2. **Props 전달**: 각 Behavior 태그에 직접 전달
3. **컨텐츠**: 마지막에 하나의 자식 요소로 전달
4. **순서**: Behavior 선언 순서는 동작에 영향 없음

### 2.3 Internal Processing Order

`<Behavior>`는 내부적으로 올바른 순서로 Context를 구성합니다:

```
선언 순서 (무관)          내부 처리 순서 (고정)
─────────────────        ─────────────────────
<Navigable />            1. Window (FocusScope, Dismissable)
<History />              2. Command (Shortcut, ContextMenu, CommandPalette)
<Selectable />    →      3. Edit (History → Clipboard → Selectable → Draggable)
<Clipboard />            4. Navigation (Navigable → Expandable → Searchable)
<FocusScope />           5. View (Zoomable, Sortable, Groupable)
                         6. Feedback (Toast, Confirm, Progress)
```

### 2.4 Shorthand: `behaviors` Prop

JSX 대신 prop으로도 선언 가능:

```tsx
// JSX 방식
<Behavior>
  <Selectable mode="extended" />
  <Navigable orientation="vertical" />
  <List>{children}</List>
</Behavior>

// Prop 방식 (동일한 결과)
<Behavior
  behaviors={[
    { type: 'Selectable', mode: 'extended' },
    { type: 'Navigable', orientation: 'vertical' },
  ]}
>
  <List>{children}</List>
</Behavior>
```

---

## 3. Behavior Container

### 3.1 Props

```ts
interface BehaviorProps {
  /**
   * Behavior 선언 (prop 방식)
   * JSX 자식으로 선언하는 것과 동일
   */
  behaviors?: BehaviorDeclaration[];

  /**
   * 컨텍스트 공유 범위 ID
   * 같은 scope를 가진 Behavior들은 상태를 공유
   */
  scope?: string;

  /**
   * 비활성화 (모든 Behavior 일시 중지)
   */
  disabled?: boolean;

  /**
   * 자식 요소 (Behavior 선언 + UI 컨텐츠)
   */
  children: React.ReactNode;
}

type BehaviorDeclaration =
  | { type: 'Selectable'; mode?: SelectionMode; followFocus?: boolean; /* ... */ }
  | { type: 'Navigable'; orientation?: Orientation; loop?: boolean; /* ... */ }
  | { type: 'History'; maxSize?: number; /* ... */ }
  | { type: 'Clipboard'; /* ... */ }
  | { type: 'Draggable'; axis?: Axis; /* ... */ }
  | { type: 'Expandable'; multiple?: boolean; /* ... */ }
  | { type: 'Searchable'; matchStrategy?: MatchStrategy; /* ... */ }
  | { type: 'Zoomable'; minZoom?: number; maxZoom?: number; /* ... */ }
  | { type: 'Sortable'; sortableFields?: string[]; /* ... */ }
  | { type: 'Groupable'; groupBy?: string; /* ... */ }
  | { type: 'Shortcut'; shortcuts?: ShortcutDef[]; /* ... */ }
  | { type: 'ContextMenu'; buildMenu?: MenuBuilder; /* ... */ }
  | { type: 'CommandPalette'; commands?: Command[]; /* ... */ }
  | { type: 'FocusScope'; trap?: boolean; restoreFocus?: boolean; /* ... */ }
  | { type: 'Dismissable'; onEscape?: DismissAction; /* ... */ };
```

### 3.2 Context Access

`<Behavior>` 내부에서 모든 활성화된 Behavior의 Context에 접근:

```tsx
function ListItem({ id }: { id: string }) {
  // 통합 hook - 활성화된 모든 Behavior 상태 반환
  const {
    isFocused,      // from Navigable
    isSelected,     // from Selectable
    isExpanded,     // from Expandable (있으면)
    isDragging,     // from Draggable (있으면)
  } = useBehaviorItem(id);

  // 또는 개별 Context 접근
  const navigable = useNavigableContext();   // null if not declared
  const selectable = useSelectableContext(); // null if not declared

  return (
    <li data-focused={isFocused} data-selected={isSelected}>
      ...
    </li>
  );
}
```

### 3.3 Conditional Behaviors

조건부로 Behavior 활성화:

```tsx
<Behavior>
  <Selectable mode={canSelect ? 'extended' : 'none'} />
  <Navigable orientation="vertical" />
  {canDrag && <Draggable />}
  {showHistory && <History />}
  
  <List>{children}</List>
</Behavior>
```

---

## 4. Edit Behaviors

> **"대상을 선택하고 조작한다"**

### 4.1 Selectable

```tsx
<Selectable
  mode="extended"           // 'none' | 'single' | 'multiple' | 'extended'
  followFocus={false}       // 포커스 시 자동 선택
  required={false}          // 최소 1개 선택 필수
  defaultSelected={[]}      // 초기 선택
  onSelectionChange={...}   // 선택 변경 콜백
/>
```

**Selection Modes:**

| Mode | Click | Ctrl+Click | Shift+Click | Ctrl+A |
|------|-------|------------|-------------|--------|
| `none` | - | - | - | - |
| `single` | 선택 | 선택 | 선택 | - |
| `multiple` | 선택 | 토글 | 토글 | - |
| `extended` | 선택 | 토글 | 범위 | 전체 |

**Keyboard:**

| Key | Action |
|-----|--------|
| `Space` | 토글 |
| `Ctrl+A` | 전체 선택 (extended) |
| `Escape` | 선택 해제 |
| `Shift+↑↓` | 범위 확장 (extended) |

**Context:**

```ts
interface SelectableContext {
  selectedIds: ReadonlySet<string>;
  anchorId: string | null;
  
  isSelected: (id: string) => boolean;
  getSelectedIds: () => string[];
  
  select: (id: string) => void;
  toggle: (id: string) => void;
  selectRange: (toId: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
}
```

---

### 4.2 Clipboard

```tsx
<Clipboard
  onCopy={(ids) => ({ ... })}     // 복사 데이터 생성
  onCut={(ids) => ({ ... })}      // 잘라내기 데이터 생성
  onPaste={(data, target) => {}}  // 붙여넣기 처리
  onDuplicate={(ids) => {}}       // 복제 처리
/>
```

**Keyboard:**

| Key | Action |
|-----|--------|
| `Ctrl+C` | 복사 |
| `Ctrl+X` | 잘라내기 |
| `Ctrl+V` | 붙여넣기 |
| `Ctrl+D` | 복제 |

**Context:**

```ts
interface ClipboardContext {
  hasData: boolean;
  
  copy: () => Promise<void>;
  cut: () => Promise<void>;
  paste: (targetId?: string) => Promise<void>;
  duplicate: () => void;
}
```

---

### 4.3 History

```tsx
<History
  maxSize={100}              // 최대 히스토리 크기
  batchTime={300}            // 연속 액션 묶음 시간 (ms)
  onHistoryChange={...}      // 히스토리 변경 콜백
/>
```

**Keyboard:**

| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo |

**Context:**

```ts
interface HistoryContext {
  canUndo: boolean;
  canRedo: boolean;
  undoLabel?: string;
  redoLabel?: string;
  
  undo: () => void;
  redo: () => void;
  record: (action: () => void, inverse: () => void, label?: string) => void;
  batch: (label: string, fn: () => void) => void;
}
```

---

### 4.4 Draggable

```tsx
<Draggable
  axis="both"                // 'both' | 'x' | 'y'
  onDragStart={...}          // 드래그 시작
  onDrop={...}               // 드롭 완료
  canDrop={...}              // 드롭 가능 여부 판단
  renderPreview={...}        // 드래그 프리뷰 커스텀
/>
```

**Keyboard:**

| Key | Action |
|-----|--------|
| `Alt+↑↓←→` | 키보드로 이동 |
| `Escape` | 드래그 취소 |

**Context:**

```ts
interface DraggableContext {
  isDragging: boolean;
  draggedIds: string[];
  dropTarget: DropTarget | null;
  
  startDrag: (ids: string[]) => void;
  drop: () => void;
  cancel: () => void;
}
```

---

## 5. Navigation Behaviors

> **"항목들 사이를 이동한다"**

### 5.1 Navigable

```tsx
<Navigable
  orientation="vertical"     // 'vertical' | 'horizontal' | 'both'
  loop={false}               // 끝에서 처음으로 순환
  typeahead={true}           // 글자 입력으로 점프
  skipDisabled={true}        // 비활성 항목 건너뛰기
  defaultFocusedId="..."     // 초기 포커스
  onFocusChange={...}        // 포커스 변경 콜백
/>
```

**Keyboard:**

| Orientation | Prev | Next | First | Last |
|-------------|------|------|-------|------|
| `vertical` | ↑ | ↓ | Home | End |
| `horizontal` | ← | → | Home | End |
| `both` | ↑← | ↓→ | Home | End |

| Key | Action |
|-----|--------|
| `PageUp/Down` | 10개 점프 |
| `[a-z0-9]` | Typeahead |

**Context:**

```ts
interface NavigableContext {
  focusedId: string | null;
  
  isFocused: (id: string) => boolean;
  
  focusNext: () => void;
  focusPrev: () => void;
  focusFirst: () => void;
  focusLast: () => void;
  focusById: (id: string) => void;
}
```

---

### 5.2 Expandable

```tsx
<Expandable
  multiple={true}            // 여러 개 동시 펼침 (false면 아코디언)
  defaultExpanded={[]}       // 초기 펼침 상태
  onExpandChange={...}       // 펼침 상태 변경 콜백
/>
```

**Keyboard:**

| Key | Action |
|-----|--------|
| `→` | 펼치기 / 첫 자식으로 |
| `←` | 접기 / 부모로 |
| `Enter` / `Space` | 토글 |
| `*` | 모든 형제 펼치기 |

**Context:**

```ts
interface ExpandableContext {
  expandedIds: ReadonlySet<string>;
  
  isExpanded: (id: string) => boolean;
  
  expand: (id: string) => void;
  collapse: (id: string) => void;
  toggle: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
}
```

---

### 5.3 Searchable

```tsx
<Searchable
  searchKeys={['name', 'description']}  // 검색 대상 필드
  matchStrategy="includes"              // 'includes' | 'startsWith' | 'fuzzy'
  caseSensitive={false}                 // 대소문자 구분
  debounce={150}                        // 디바운스 (ms)
  onQueryChange={...}                   // 검색어 변경 콜백
  onFilterChange={...}                  // 필터 결과 콜백
/>
```

**Keyboard:**

| Key | Action |
|-----|--------|
| `Ctrl+F` | 검색창 포커스 |
| `Escape` | 검색 취소 |
| `Enter` | 다음 결과 |
| `Shift+Enter` | 이전 결과 |
| `F3` / `Shift+F3` | 다음/이전 결과 |

**Context:**

```ts
interface SearchableContext {
  query: string;
  filteredIds: string[];
  matchCount: number;
  currentMatchIndex: number;
  
  setQuery: (query: string) => void;
  clearQuery: () => void;
  goToNextMatch: () => void;
  goToPrevMatch: () => void;
}
```

---

## 6. View Behaviors

> **"표시 방식을 제어한다"**

### 6.1 Zoomable

```tsx
<Zoomable
  minZoom={0.1}              // 최소 줌
  maxZoom={10}               // 최대 줌
  defaultZoom={1}            // 초기 줌
  zoomStep={0.1}             // 줌 스텝
  zoomOrigin="cursor"        // 'cursor' | 'center'
  pannable={true}            // 패닝 활성화
  onZoomChange={...}         // 줌 변경 콜백
/>
```

**Keyboard & Gesture:**

| Input | Action |
|-------|--------|
| `Ctrl+휠` | 줌 |
| `Ctrl++/-` | 줌 인/아웃 |
| `Ctrl+0` | 100% 리셋 |
| `Ctrl+1` | Fit to view |
| 드래그 (Space+드래그) | 패닝 |
| 핀치 | 줌 (터치) |

**Context:**

```ts
interface ZoomableContext {
  zoom: number;
  center: Point;
  isPanning: boolean;
  
  zoomIn: () => void;
  zoomOut: () => void;
  zoomTo: (level: number) => void;
  resetZoom: () => void;
  fitToView: () => void;
  panTo: (point: Point) => void;
}
```

---

### 6.2 Sortable

```tsx
<Sortable
  sortableFields={['name', 'date', 'size']}  // 정렬 가능 필드
  defaultSort={{ field: 'name', direction: 'asc' }}
  multiSort={false}          // 다중 정렬 허용
  onSortChange={...}         // 정렬 변경 콜백
/>
```

**Keyboard:**

| Key | Action |
|-----|--------|
| `Enter` / `Space` | 정렬 토글 |
| `Shift+클릭` | 다중 정렬에 추가 |

**Context:**

```ts
interface SortableContext {
  sort: SortState | null;
  
  isSorted: (field: string) => boolean;
  getSortDirection: (field: string) => 'asc' | 'desc' | null;
  
  sortBy: (field: string) => void;
  toggleSort: (field: string) => void;
  clearSort: () => void;
}
```

---

### 6.3 Groupable

```tsx
<Groupable
  groupBy="category"         // 그룹 기준 필드
  groupSort="asc"            // 그룹 정렬
  formatGroupLabel={...}     // 그룹 라벨 포맷터
  collapsible={true}         // 그룹 접기 가능
  navigateLabels={false}     // 그룹 헤더 탐색 포함
/>
```

**Context:**

```ts
interface GroupableContext {
  groupBy: string | null;
  groups: Group[];
  collapsedGroups: ReadonlySet<string>;
  
  setGroupBy: (field: string | null) => void;
  toggleGroupCollapse: (groupKey: string) => void;
}
```

---

## 7. Command Behaviors

> **"명령을 실행한다"**

### 7.1 Shortcut

```tsx
<Shortcut
  shortcuts={[
    { key: 'Mod+S', command: 'save', description: '저장' },
    { key: 'Delete', command: () => deleteSelected() },
    { key: 'F2', command: 'rename', when: () => hasSelection },
  ]}
  scope="editor"             // 스코프 (중첩 시 우선순위)
  enableInInputs={false}     // 입력 필드에서도 활성화
/>
```

**Platform-Aware Keys:**

```ts
'Mod+S'      // Mac: Cmd+S, Windows: Ctrl+S
'Ctrl+S'     // 모든 플랫폼: Ctrl+S
'Alt+Enter'  // 모든 플랫폼: Alt+Enter
```

**Context:**

```ts
interface ShortcutContext {
  getShortcutFor: (command: string) => string | null;
  getAllShortcuts: () => ShortcutDef[];
  executeShortcut: (key: string) => void;
}
```

---

### 7.2 ContextMenu

```tsx
<ContextMenu
  buildMenu={(context) => [
    { id: 'copy', label: '복사', shortcut: 'Ctrl+C' },
    { id: 'paste', label: '붙여넣기', shortcut: 'Ctrl+V' },
    { separator: true },
    { id: 'delete', label: '삭제', danger: true },
  ]}
  onCommand={(commandId, context) => {
    // 명령 실행
  }}
/>
```

**Keyboard:**

| Key | Action |
|-----|--------|
| `Shift+F10` / 컨텍스트 키 | 메뉴 열기 |
| `↑↓` | 항목 탐색 |
| `→←` | 서브메뉴 열기/닫기 |
| `Enter` | 실행 |
| `Escape` | 닫기 |

**Context:**

```ts
interface ContextMenuContext {
  isOpen: boolean;
  menuItems: MenuItem[];
  
  open: (e: MouseEvent | KeyboardEvent) => void;
  close: () => void;
  executeCommand: (commandId: string) => void;
}
```

---

### 7.3 CommandPalette

```tsx
<CommandPalette
  commands={[
    { id: 'save', label: '저장', shortcut: 'Ctrl+S', category: 'File' },
    { id: 'format', label: '코드 정리', category: 'Edit' },
  ]}
  trigger="Mod+K"            // 열기 단축키
  placeholder="명령 검색..."
  recentCount={5}            // 최근 사용 명령 수
  onCommand={...}            // 명령 실행 콜백
/>
```

**Keyboard:**

| Key | Action |
|-----|--------|
| `Ctrl+K` / `Cmd+K` | 열기 |
| `↑↓` | 탐색 |
| `Enter` | 실행 |
| `Escape` | 닫기 |

**Context:**

```ts
interface CommandPaletteContext {
  isOpen: boolean;
  query: string;
  filteredCommands: Command[];
  
  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
  executeCommand: (commandId: string) => void;
}
```

---

## 8. Feedback Behaviors

> **"사용자에게 알린다"**

### 8.1 Toast

```tsx
<Toast
  position="bottom-right"    // 위치
  duration={5000}            // 기본 지속 시간
  max={5}                    // 최대 동시 표시
/>
```

**Usage:**

```tsx
const toast = useToast();

toast.success('저장되었습니다');
toast.error('오류가 발생했습니다');
toast.show({
  title: '알림',
  message: '새 메시지가 있습니다',
  action: { label: '보기', onClick: () => {} }
});
```

---

### 8.2 Confirm

```tsx
<Confirm />
```

**Usage:**

```tsx
const confirm = useConfirm();

const ok = await confirm({
  title: '삭제 확인',
  message: '정말 삭제하시겠습니까?',
  confirmLabel: '삭제',
  intent: 'critical',
});

if (ok) {
  deleteItems();
}
```

---

### 8.3 Progress

```tsx
<Progress />
```

**Usage:**

```tsx
const progress = useProgress();

const controller = progress.start({
  title: '업로드 중',
  cancellable: true,
});

for (let i = 0; i < files.length; i++) {
  if (controller.isCancelled()) break;
  await uploadFile(files[i]);
  controller.update((i + 1) / files.length * 100);
}

controller.complete();
```

---

## 9. Window Behaviors

> **"오버레이/모달을 관리한다"**

### 9.1 FocusScope

```tsx
<FocusScope
  trap={true}                // 포커스 트랩
  restoreFocus={true}        // 닫힐 때 포커스 복원
  autoFocus="first"          // 'first' | 'last' | 'none' | elementId
/>
```

**Context:**

```ts
interface FocusScopeContext {
  isActive: boolean;
  
  focusFirst: () => void;
  focusLast: () => void;
  focusNext: () => void;
  focusPrev: () => void;
}
```

---

### 9.2 Dismissable

```tsx
<Dismissable
  onEscape="close"           // 'close' | 'prevent' | 'none' | handler
  onClickOutside="close"     // 'close' | 'prevent' | 'none' | handler
  onDismiss={() => {}}       // 닫힐 때 콜백
  shouldDismiss={() => true} // 닫기 전 확인
/>
```

**Context:**

```ts
interface DismissableContext {
  dismiss: () => void;
}
```

---

## 10. Composition Patterns

### 10.1 Simple List

```tsx
<Behavior>
  <Navigable orientation="vertical" />
  
  <List>
    {items.map(item => <ListItem key={item.id} id={item.id} />)}
  </List>
</Behavior>
```

---

### 10.2 File Explorer

```tsx
<Behavior>
  <FocusScope />
  <Shortcut shortcuts={fileShortcuts} />
  <ContextMenu buildMenu={buildFileMenu} />
  <History />
  <Clipboard onCopy={...} onCut={...} onPaste={...} />
  <Draggable onDrop={handleMove} />
  <Selectable mode="extended" />
  <Navigable orientation="vertical" />
  <Searchable />
  
  <FileList>
    {files.map(file => <FileItem key={file.id} file={file} />)}
  </FileList>
</Behavior>
```

**제공되는 기능:**
- ↑↓ 키보드 탐색
- 클릭/Ctrl+클릭/Shift+클릭 선택
- Ctrl+A 전체 선택
- Ctrl+C/X/V 복사/잘라내기/붙여넣기
- Ctrl+Z/Y Undo/Redo
- 드래그 앤 드롭
- Ctrl+F 검색
- 우클릭 메뉴
- Delete, F2 등 단축키

---

### 10.3 Tree View

```tsx
<Behavior>
  <History />
  <Clipboard />
  <Draggable />
  <Expandable multiple defaultExpanded={['root']} />
  <Selectable mode="extended" />
  <Navigable orientation="vertical" />
  
  <TreeView>
    {renderTree(rootNodes)}
  </TreeView>
</Behavior>
```

---

### 10.4 Data Table

```tsx
<Behavior>
  <Sortable sortableFields={['name', 'size', 'date']} />
  <Groupable groupBy="type" collapsible />
  <Selectable mode="extended" />
  <Navigable orientation="vertical" />
  <Searchable />
  
  <DataTable columns={columns}>
    {rows.map(row => <DataRow key={row.id} row={row} />)}
  </DataTable>
</Behavior>
```

---

### 10.5 Modal Dialog

```tsx
<Behavior>
  <FocusScope trap restoreFocus autoFocus="first" />
  <Dismissable onEscape="close" onClickOutside="close" />
  
  <Dialog onClose={handleClose}>
    <DialogContent />
  </Dialog>
</Behavior>
```

---

### 10.6 Command Palette

```tsx
<Behavior>
  <FocusScope trap restoreFocus />
  <Dismissable onEscape="close" />
  <CommandPalette commands={commands} />
  <Groupable navigateLabels={false} />
  <Selectable mode="single" followFocus />
  <Navigable orientation="vertical" typeahead={false} />
  <Searchable matchStrategy="fuzzy" />
  
  <PaletteUI />
</Behavior>
```

---

### 10.7 Canvas (Design Tool)

```tsx
<Behavior>
  <Shortcut shortcuts={canvasShortcuts} />
  <ContextMenu buildMenu={buildCanvasMenu} />
  <History />
  <Clipboard />
  <Draggable axis="both" />
  <Selectable mode="extended" />
  <Zoomable minZoom={0.1} maxZoom={10} />
  
  <Canvas>
    {objects.map(obj => <CanvasObject key={obj.id} object={obj} />)}
  </Canvas>
</Behavior>
```

---

### 10.8 Tabs

```tsx
<Behavior>
  <Selectable mode="single" followFocus />
  <Navigable orientation="horizontal" loop />
  
  <TabList>
    {tabs.map(tab => <Tab key={tab.id} tab={tab} />)}
  </TabList>
</Behavior>
```

---

## 11. Role → Behavior Mapping

렌더러 개발자를 위한 Role별 권장 Behavior 조합:

| Role | Behaviors |
|------|-----------|
| **List** | Navigable, Selectable, Clipboard, History, Searchable |
| **Tree** | Navigable, Selectable, Expandable, Clipboard, History, Draggable |
| **DataTable** | Navigable, Selectable, Sortable, Groupable, Clipboard, Searchable |
| **Tabs** | Navigable, Selectable (followFocus) |
| **Menu** | Navigable, Selectable (single), Dismissable |
| **Modal** | FocusScope (trap), Dismissable |
| **Drawer** | FocusScope (trap), Dismissable |
| **Combobox** | Navigable, Selectable, Searchable, Dismissable |
| **Canvas** | Zoomable, Selectable, Draggable, Clipboard, History |
| **Accordion** | Expandable (multiple=false), Navigable |
| **CommandPalette** | FocusScope, Dismissable, Navigable, Selectable, Searchable |

---

## 12. TypeScript Interfaces

### 12.1 Behavior Container

```ts
interface BehaviorProps {
  behaviors?: BehaviorDeclaration[];
  scope?: string;
  disabled?: boolean;
  children: React.ReactNode;
}

// Behavior 컴포넌트
declare const Behavior: React.FC<BehaviorProps>;
```

### 12.2 Behavior Declarations (JSX)

```tsx
// Self-closing 태그로 선언
declare const Selectable: React.FC<SelectableProps>;
declare const Navigable: React.FC<NavigableProps>;
declare const History: React.FC<HistoryProps>;
declare const Clipboard: React.FC<ClipboardProps>;
declare const Draggable: React.FC<DraggableProps>;
declare const Expandable: React.FC<ExpandableProps>;
declare const Searchable: React.FC<SearchableProps>;
declare const Zoomable: React.FC<ZoomableProps>;
declare const Sortable: React.FC<SortableProps>;
declare const Groupable: React.FC<GroupableProps>;
declare const Shortcut: React.FC<ShortcutProps>;
declare const ContextMenu: React.FC<ContextMenuProps>;
declare const CommandPalette: React.FC<CommandPaletteProps>;
declare const Toast: React.FC<ToastProps>;
declare const Confirm: React.FC<ConfirmProps>;
declare const Progress: React.FC<ProgressProps>;
declare const FocusScope: React.FC<FocusScopeProps>;
declare const Dismissable: React.FC<DismissableProps>;
```

### 12.3 Hooks

```ts
// 통합 Item Hook
declare function useBehaviorItem(id: string): {
  // Navigable
  isFocused: boolean;
  // Selectable
  isSelected: boolean;
  // Expandable
  isExpanded: boolean;
  hasChildren: boolean;
  // Draggable
  isDragging: boolean;
  isDropTarget: boolean;
  // Searchable
  isFiltered: boolean;
  isCurrentMatch: boolean;
  // Combined Props
  itemProps: CombinedItemProps;
  itemRef: React.RefCallback<HTMLElement>;
};

// 개별 Context Hooks
declare function useSelectableContext(): SelectableContext | null;
declare function useNavigableContext(): NavigableContext | null;
declare function useHistoryContext(): HistoryContext | null;
declare function useClipboardContext(): ClipboardContext | null;
declare function useDraggableContext(): DraggableContext | null;
declare function useExpandableContext(): ExpandableContext | null;
declare function useSearchableContext(): SearchableContext | null;
declare function useZoomableContext(): ZoomableContext | null;
declare function useSortableContext(): SortableContext | null;
declare function useGroupableContext(): GroupableContext | null;
declare function useShortcutContext(): ShortcutContext | null;
declare function useContextMenuContext(): ContextMenuContext | null;
declare function useCommandPaletteContext(): CommandPaletteContext | null;
declare function useFocusScopeContext(): FocusScopeContext | null;
declare function useDismissableContext(): DismissableContext | null;

// Feedback Hooks
declare function useToast(): ToastContext;
declare function useConfirm(): ConfirmContext;
declare function useProgress(): ProgressContext;
```

### 12.4 Combined Item Props

```ts
interface CombinedItemProps {
  // Identity
  id: string;
  
  // Navigable
  tabIndex: -1;
  'data-focused': boolean;
  
  // Selectable
  'aria-selected': boolean;
  'data-selected': boolean;
  
  // Expandable (optional)
  'aria-expanded'?: boolean;
  
  // Draggable (optional)
  draggable?: boolean;
  'data-dragging'?: boolean;
  'data-drop-target'?: boolean;
  
  // Searchable (optional)
  'data-filtered'?: boolean;
  'data-current-match'?: boolean;
  
  // Event handlers (merged)
  onClick: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onMouseEnter: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}
```

---

## Appendix A: Migration from v2

### Before (v2 Nested)

```tsx
<History>
  <Clipboard>
    <Selectable mode="extended">
      <Navigable orientation="vertical">
        <List>{children}</List>
      </Navigable>
    </Selectable>
  </Clipboard>
</History>
```

### After (v3 Flat)

```tsx
<Behavior>
  <History />
  <Clipboard />
  <Selectable mode="extended" />
  <Navigable orientation="vertical" />
  
  <List>{children}</List>
</Behavior>
```

---

## Appendix B: Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-11 | v3.0 Draft | Flat declaration syntax with `<Behavior>` container |
| 2026-01-11 | v2.0 Draft | 6-category reorganization |

---

*End of Document*
