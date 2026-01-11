# IDDL Block Specification

**Draft Community Group Report, 11 January 2026**

---

## Abstract

이 문서는 IDDL(Intent-Driven Design Language)의 Block을 정의합니다. Block은 **Element들을 담는 컨테이너**로, 레이아웃 구조와 인터랙션 동작(선택, 탐색 등)을 관리합니다.

**핵심 원칙**: "자식을 담으면 Block, 클릭 타겟이면 Action"

---

## Status of This Document

This document is a **Working Draft**.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Conformance](#2-conformance)
3. [Block Categories](#3-block-categories)
4. [Common Properties](#4-common-properties)
5. [Behavior Integration](#5-behavior-integration)
6. [Block Roles](#6-block-roles)
7. [Renderer Requirements](#7-renderer-requirements)
8. [Accessibility](#8-accessibility)
9. [Examples](#9-examples)

---

## 1. Introduction

### 1.1 Block의 정의

Block은 IDDL 계층 구조에서 **컨테이너 역할**을 합니다.

```
Page
  └─ Section (페이지 영역)
       └─ Block (컨테이너) ← 이 문서의 범위
            ├─ Block (중첩 가능)
            └─ Element (Text, Image, Field, Action, Separator)
```

### 1.2 Block vs Action

| 구분 | Block | Action |
|------|-------|--------|
| 역할 | 컨테이너 | 인터랙티브 leaf |
| 자식 | Block 또는 Element | 없음 (slot으로 구성) |
| 인터랙션 | 자식의 선택/탐색 관리 | 단일 클릭 타겟 |
| 예시 | List, Menu, Tabs | ListItem, MenuItem, Tab |

### 1.3 Design Goals

1. **최소 Block 집합**: Action으로 처리 가능한 것은 Action으로
2. **Behavior 통합**: 선택/탐색 동작을 Block 수준에서 선언
3. **레이아웃 분리**: 시각적 스타일은 Renderer에 위임
4. **계층적 일관성**: Section → Block → Element 구조 유지

---

## 2. Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHOULD", "MAY" in this document are to be interpreted as described in [RFC 2119].

A conforming IDDL renderer:

1. MUST recognize all Block roles defined in this specification
2. MUST enforce child type constraints
3. MUST implement Behavior Primitives for applicable Blocks
4. MUST render appropriate ARIA roles and properties
5. SHOULD provide default layout for each Block role

---

## 3. Block Categories

Block은 5가지 카테고리로 분류됩니다.

### 3.1 Category Overview

| Category | 목적 | 특징 |
|----------|------|------|
| **Layout** | 공간 배치 | 순수 레이아웃 컨테이너 |
| **Collection** | 아이템 목록 | selection, navigation 지원 |
| **Navigation** | 탐색 UI | 페이지/앱 내 이동 |
| **Form** | 입력 그룹 | Field 컨테이너 |
| **Overlay** | 부유 콘텐츠 | 오버레이 컨텍스트 |

### 3.2 Category Mapping

```
Block
├── Layout      : Stack, Grid, Card, ScrollArea, Divider
├── Collection  : List, TreeView, DataTable, Menu, Listbox, 
│                 CommandPalette, Calendar, Carousel
├── Navigation  : Navigation, NavGroup, Tabs, TabPanel, 
│                 Breadcrumbs, Pagination, Stepper
├── Form        : Form, FieldGroup, FilterBar
├── Overlay     : Popover, Tooltip, Toast, ContextMenu
└── Grouping    : Group, Toolbar, ButtonGroup, ChipGroup,
                  Accordion, AccordionItem, AccordionPanel
```

---

## 4. Common Properties

모든 Block에 공통으로 적용되는 속성입니다.

### 4.1 Base Properties

```ts
interface BlockProps extends BaseProps {
  /** Block의 기능적 역할 */
  role?: BlockRole;
  
  /** 고유 식별자 */
  id?: string;
  
  /** 접근성 이름 (랜드마크, 그룹) */
  name?: string;
  
  /** 접근성 설명 */
  description?: string;
  
  /** 자식 노드들 */
  children: (Block | Element)[];
}
```

### 4.2 Intent Axes

```ts
interface BlockAxes {
  /** 의미 맥락 */
  intent?: 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';
  
  /** 중요도 */
  prominence?: 'Hero' | 'Standard' | 'Subtle' | 'Hidden';
  
  /** 밀도 */
  density?: 'Standard' | 'Comfortable' | 'Compact';
}
```

### 4.3 Layout Properties (공통)

Layout 관련 속성은 **prominence × density**로 자동 계산됩니다.

```ts
// ❌ IDDL 위반: 직접 지정하지 마세요
// gap, padding, align, justify 등은 모두 prominence × density로 자동 계산됩니다.

// ✅ IDDL 준수: prominence와 density만 선언하세요
interface BlockProps {
  prominence?: Prominence;  // Hero | Standard | Subtle | Hidden
  density?: Density;        // Comfortable | Standard | Compact
}

// 시스템이 자동으로 계산:
// - gap: prominence × density → 4~96px (allowed values로 snap)
// - padding: prominence × density → 4~96px (allowed values로 snap)
// - align/justify: role에 따라 자동 결정
```

---

## 5. Behavior Integration

Block은 Behavior Primitives를 통해 인터랙션을 제공합니다.

### 5.1 Behavior Properties

```ts
interface BlockBehaviorProps {
  /** 선택 모드 */
  selection?: 'none' | 'single' | 'multiple' | 'extended';
  
  /** 탐색 시 자동 선택 */
  followFocus?: boolean;
  
  /** 탐색 방향 */
  orientation?: 'vertical' | 'horizontal' | 'both';
  
  /** 끝에서 순환 */
  loop?: boolean;
  
  /** 타입어헤드 */
  typeahead?: boolean;
}
```

### 5.2 Block-Behavior Mapping

| Block Role | Navigable | Selectable | FocusScope |
|------------|-----------|------------|------------|
| List | ✓ vertical | ✓ configurable | - |
| TreeView | ✓ vertical | ✓ configurable | - |
| Menu | ✓ vertical | ✓ single | ✓ (submenu) |
| Tabs | ✓ horizontal | ✓ single, followFocus | - |
| DataTable | ✓ both | ✓ configurable | - |
| CommandPalette | ✓ vertical | ✓ single, followFocus | ✓ trap |
| Calendar | ✓ both | ✓ configurable | - |
| Listbox | ✓ vertical | ✓ configurable | - |
| Navigation | ✓ vertical | - | - |

### 5.3 Selection Mode Details

| Mode | Behavior | Use Case |
|------|----------|----------|
| `none` | 탐색만, 선택 없음 | 읽기 전용 리스트 |
| `single` | 하나만 선택 | Tabs, Radio-like |
| `multiple` | Ctrl+클릭 토글 | 태그 선택 |
| `extended` | Shift 범위, Ctrl+A 전체 | 파일 탐색기 |

---

## 6. Block Roles

### 6.1 Layout Category

#### 6.1.1 `Stack`

**ARIA**: `none` (레이아웃 전용)

수직/수평 스택 레이아웃입니다.

```ts
interface StackSpec {
  /** 배치 방향 */
  direction?: 'vertical' | 'horizontal';
  
  /** 줄바꿈 허용 */
  wrap?: boolean;
  
  /** 역순 배치 */
  reverse?: boolean;
}
```

**기본값**: `direction: 'vertical'`

```tsx
<Block role="Stack" spec={{ direction: 'horizontal', gap: 'md' }}>
  <Action role="Button" label="취소" />
  <Action role="Button" label="저장" intent="Brand" />
</Block>
```

#### 6.1.2 `Grid`

**ARIA**: `none` 또는 `grid` (인터랙티브 시)

그리드 레이아웃입니다.

```ts
interface GridSpec {
  /** 열 개수 또는 템플릿 */
  columns?: number | string;
  
  /** 행 개수 또는 템플릿 */
  rows?: number | string;
  
  /** 자동 맞춤 최소 너비 */
  autoFit?: string;
  
  /** 행 간격 */
  rowGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /** 열 간격 */
  columnGap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
```

```tsx
<Block role="Grid" spec={{ columns: 3, gap: 'md' }}>
  <Action role="CardItem" id="1" label="Card 1" />
  <Action role="CardItem" id="2" label="Card 2" />
  <Action role="CardItem" id="3" label="Card 3" />
</Block>
```

#### 6.1.3 `Card`

**ARIA**: `article` 또는 `region`

콘텐츠를 그룹화하는 카드 컨테이너입니다.

```ts
interface CardSpec {
  /** 카드 변형 */
  variant?: 'elevated' | 'outlined' | 'filled';
  
  /** 클릭 가능 여부 (전체가 링크/버튼) */
  interactive?: boolean;
  
  /** 미디어 위치 */
  mediaPosition?: 'top' | 'bottom' | 'left' | 'right';
}
```

**Note**: `interactive: true`인 경우 Block 대신 `Action role="CardItem"` 사용 권장

```tsx
<Block role="Card" spec={{ variant: 'outlined' }}>
  <Image src="/header.jpg" alt="Header" />
  <Block role="Stack" padding="md">
    <Text role="Heading">카드 제목</Text>
    <Text role="Body">카드 내용입니다.</Text>
  </Block>
  <Block role="Toolbar" padding="md">
    <Action role="Button" label="자세히" />
    <Action role="IconButton" label="공유" icon="share" />
  </Block>
</Block>
```

#### 6.1.4 `ScrollArea`

**ARIA**: `none`

스크롤 가능한 영역입니다.

```ts
interface ScrollAreaSpec {
  /** 스크롤 방향 */
  direction?: 'vertical' | 'horizontal' | 'both';
  
  /** 스크롤바 표시 */
  scrollbar?: 'auto' | 'always' | 'hover' | 'never';
  
  /** 최대 높이/너비 */
  maxHeight?: string;
  maxWidth?: string;
}
```

```tsx
<Block role="ScrollArea" spec={{ maxHeight: '400px' }}>
  <Block role="List">
    {/* 많은 아이템들 */}
  </Block>
</Block>
```

---

### 6.2 Collection Category

#### 6.2.1 `List`

**ARIA**: `listbox` 또는 `list`

범용 리스트 컨테이너입니다.

```ts
interface ListSpec {
  /** 선택 모드 */
  selection?: 'none' | 'single' | 'multiple' | 'extended';
  
  /** 탐색 시 자동 선택 */
  followFocus?: boolean;
  
  /** 순환 탐색 */
  loop?: boolean;
  
  /** 구분선 표시 */
  dividers?: boolean;
  
  /** 가상화 */
  virtualized?: boolean;
  
  /** 빈 상태 메시지 */
  emptyMessage?: string;
}
```

**자식 허용**: `Action` (ListItem, FileItem, UserItem 등), `Separator`

**Behavior**: `Navigable(vertical)`, `Selectable(mode)`

```tsx
<Block role="List" spec={{ selection: 'extended', dividers: true }}>
  <Action role="ListItem" id="1" label="항목 1" />
  <Action role="ListItem" id="2" label="항목 2" />
  <Action role="ListItem" id="3" label="항목 3" />
</Block>
```

#### 6.2.2 `TreeView`

**ARIA**: `tree`

계층 구조 트리입니다.

```ts
interface TreeViewSpec {
  /** 선택 모드 */
  selection?: 'none' | 'single' | 'multiple' | 'extended';
  
  /** 다중 확장 허용 */
  multipleExpand?: boolean;
  
  /** 기본 확장 노드들 */
  defaultExpanded?: string[];
  
  /** 확장된 노드들 (제어 모드) */
  expanded?: string[];
  
  /** 들여쓰기 크기 */
  indentSize?: 'sm' | 'md' | 'lg';
}
```

**자식 허용**: `Action role="TreeItem"`

**Behavior**: `Navigable(vertical)`, `Selectable`, `Expandable`

```tsx
<Block role="TreeView" spec={{ selection: 'single' }}>
  <Action role="TreeItem" id="root" label="Root" icon="folder" expanded>
    <Action role="TreeItem" id="child1" label="Child 1" icon="file" />
    <Action role="TreeItem" id="child2" label="Child 2" icon="folder">
      <Action role="TreeItem" id="grandchild" label="Grandchild" icon="file" />
    </Action>
  </Action>
</Block>
```

#### 6.2.3 `DataTable`

**ARIA**: `table` with `grid` interactions

데이터 테이블입니다.

```ts
interface DataTableSpec {
  /** 선택 모드 (행 단위) */
  selection?: 'none' | 'single' | 'multiple' | 'extended';
  
  /** 셀 탐색 모드 */
  cellNavigation?: boolean;
  
  /** 정렬 가능 */
  sortable?: boolean;
  
  /** 현재 정렬 */
  sort?: { column: string; direction: 'asc' | 'desc' };
  
  /** 열 크기 조절 */
  resizable?: boolean;
  
  /** 고정 헤더 */
  stickyHeader?: boolean;
  
  /** 가상화 */
  virtualized?: boolean;
  
  /** 빈 상태 메시지 */
  emptyMessage?: string;
}
```

**자식 구조**:
```tsx
<Block role="DataTable">
  <Block role="TableHeader">
    <Action role="ColumnHeader" />
  </Block>
  <Block role="TableBody">
    <Action role="TableRow" />
  </Block>
</Block>
```

**Behavior**: `Navigable(both)`, `Selectable`

```tsx
<Block role="DataTable" spec={{ selection: 'extended', sortable: true, stickyHeader: true }}>
  <Block role="TableHeader">
    <Action role="ColumnHeader" id="name" label="이름" spec={{ sortable: true }} />
    <Action role="ColumnHeader" id="size" label="크기" spec={{ sortable: true, align: 'right' }} />
    <Action role="ColumnHeader" id="modified" label="수정일" />
  </Block>
  <Block role="TableBody">
    <Action role="TableRow" id="r1" label="file1.txt" spec={{ cells: [...] }} />
    <Action role="TableRow" id="r2" label="file2.txt" spec={{ cells: [...] }} />
  </Block>
</Block>
```

#### 6.2.4 `TableHeader`

**ARIA**: `rowgroup`

테이블 헤더 컨테이너입니다.

**자식 허용**: `Action role="ColumnHeader"`

#### 6.2.5 `TableBody`

**ARIA**: `rowgroup`

테이블 바디 컨테이너입니다.

**자식 허용**: `Action role="TableRow"`

#### 6.2.6 `Menu`

**ARIA**: `menu`

메뉴 컨테이너입니다.

```ts
interface MenuSpec {
  /** 메뉴 변형 */
  variant?: 'default' | 'compact';
}
```

**자식 허용**: `Action role="MenuItem"`, `Block role="MenuGroup"`, `Separator`

**Behavior**: `Navigable(vertical)`, `Selectable(single)`, `FocusScope`

```tsx
<Block role="Menu">
  <Action role="MenuItem" label="새 파일" icon="file-plus" spec={{ trailing: [{ type: 'shortcut', keys: '⌘N' }] }} />
  <Action role="MenuItem" label="열기" icon="folder-open" spec={{ trailing: [{ type: 'shortcut', keys: '⌘O' }] }} />
  <Separator />
  <Block role="MenuGroup" spec={{ label: "최근 파일" }}>
    <Action role="MenuItem" label="document.txt" />
    <Action role="MenuItem" label="image.png" />
  </Block>
  <Separator />
  <Action role="MenuItem" label="종료" />
</Block>
```

#### 6.2.7 `MenuGroup`

**ARIA**: `group`

메뉴 아이템 그룹입니다.

```ts
interface MenuGroupSpec {
  /** 그룹 라벨 */
  label?: string;
}
```

**자식 허용**: `Action role="MenuItem"`, `Separator`

#### 6.2.8 `Listbox`

**ARIA**: `listbox`

Select/Combobox의 옵션 목록입니다.

```ts
interface ListboxSpec {
  /** 다중 선택 */
  multiple?: boolean;
  
  /** 가상화 */
  virtualized?: boolean;
}
```

**자식 허용**: `Action role="Option"`, `Block role="OptionGroup"`

**Behavior**: `Navigable(vertical)`, `Selectable`

```tsx
<Block role="Listbox" spec={{ multiple: false }}>
  <Action role="Option" id="opt1" label="옵션 1" />
  <Action role="Option" id="opt2" label="옵션 2" />
  <Action role="Option" id="opt3" label="옵션 3" />
</Block>
```

#### 6.2.9 `OptionGroup`

**ARIA**: `group`

옵션 그룹입니다.

```ts
interface OptionGroupSpec {
  /** 그룹 라벨 */
  label: string;
}
```

#### 6.2.10 `CommandPalette`

**ARIA**: `dialog` with `listbox`

커맨드 팔레트입니다.

```ts
interface CommandPaletteSpec {
  /** 검색 플레이스홀더 */
  placeholder?: string;
  
  /** 검색어 */
  query?: string;
  
  /** 빈 상태 메시지 */
  emptyMessage?: string;
}
```

**자식 허용**: `Field role="SearchInput"`, `Block role="CommandGroup"`, `Action role="CommandItem"`

**Behavior**: `FocusScope(trap)`, `Navigable(vertical)`, `Selectable(single, followFocus)`

```tsx
<Block role="CommandPalette" spec={{ placeholder: "명령어 검색..." }}>
  <Block role="CommandGroup" spec={{ label: "파일" }}>
    <Action role="CommandItem" id="new" label="새 파일" icon="file-plus" />
    <Action role="CommandItem" id="open" label="파일 열기" icon="folder-open" />
  </Block>
</Block>
```

#### 6.2.11 `CommandGroup`

**ARIA**: `group`

커맨드 그룹입니다.

```ts
interface CommandGroupSpec {
  /** 그룹 라벨 */
  label: string;
}
```

**자식 허용**: `Action role="CommandItem"`

#### 6.2.12 `Calendar`

**ARIA**: `grid`

캘린더 그리드입니다.

```ts
interface CalendarSpec {
  /** 선택 모드 */
  selection?: 'single' | 'multiple' | 'range';
  
  /** 표시 월 */
  month?: string; // YYYY-MM
  
  /** 선택된 날짜(들) */
  selected?: string | string[];
  
  /** 범위 선택 */
  range?: { start: string; end: string };
  
  /** 최소 날짜 */
  min?: string;
  
  /** 최대 날짜 */
  max?: string;
  
  /** 비활성 날짜들 */
  disabled?: string[];
  
  /** 주 시작요일 (0: 일, 1: 월) */
  firstDayOfWeek?: number;
  
  /** 로케일 */
  locale?: string;
}
```

**자식 구조**: 렌더러가 자동 생성 (`Action role="CalendarDay"`)

**Behavior**: `Navigable(both)`, `Selectable`

```tsx
<Block role="Calendar" spec={{ 
  selection: 'range',
  month: '2026-01',
  min: '2026-01-01',
  max: '2026-12-31'
}} />
```

#### 6.2.13 `Carousel`

**ARIA**: `region` with custom navigation

캐러셀/슬라이더입니다.

```ts
interface CarouselSpec {
  /** 자동 재생 */
  autoPlay?: boolean;
  
  /** 자동 재생 간격 (ms) */
  interval?: number;
  
  /** 무한 순환 */
  loop?: boolean;
  
  /** 표시 아이템 수 */
  slidesToShow?: number;
  
  /** 이동 아이템 수 */
  slidesToScroll?: number;
  
  /** 네비게이션 표시 */
  showNavigation?: boolean;
  
  /** 페이지 표시 */
  showPagination?: boolean;
}
```

**자식 허용**: `Block role="CarouselSlide"` 또는 Element/Action

**Behavior**: `Navigable(horizontal)`

```tsx
<Block role="Carousel" spec={{ autoPlay: true, loop: true }}>
  <Block role="CarouselSlide">
    <Image src="/slide1.jpg" alt="Slide 1" />
  </Block>
  <Block role="CarouselSlide">
    <Image src="/slide2.jpg" alt="Slide 2" />
  </Block>
</Block>
```

#### 6.2.14 `CarouselSlide`

캐러셀 개별 슬라이드입니다.

---

### 6.3 Navigation Category

#### 6.3.1 `Navigation`

**ARIA**: `navigation`

메인 네비게이션 컨테이너입니다.

```ts
interface NavigationSpec {
  /** 축소 가능 */
  collapsible?: boolean;
  
  /** 축소 상태 */
  collapsed?: boolean;
}
```

**자식 허용**: `Action role="NavItem"`, `Block role="NavGroup"`, `Separator`

**Behavior**: `Navigable(vertical)`

```tsx
<Block role="Navigation">
  <Action role="NavItem" id="home" label="홈" icon="home" />
  <Action role="NavItem" id="docs" label="문서" icon="file-text" />
  <Block role="NavGroup" spec={{ label: "설정" }}>
    <Action role="NavItem" id="profile" label="프로필" />
    <Action role="NavItem" id="security" label="보안" />
  </Block>
</Block>
```

#### 6.3.2 `NavGroup`

**ARIA**: `group`

네비게이션 그룹입니다.

```ts
interface NavGroupSpec {
  /** 그룹 라벨 */
  label?: string;
  
  /** 축소 가능 */
  collapsible?: boolean;
  
  /** 축소 상태 */
  collapsed?: boolean;
}
```

**자식 허용**: `Action role="NavItem"`

#### 6.3.3 `Tabs`

**ARIA**: `tablist`

탭 목록입니다.

```ts
interface TabsSpec {
  /** 선택된 탭 ID */
  selected?: string;
  
  /** 기본 선택 탭 */
  defaultSelected?: string;
  
  /** 탭 변형 */
  variant?: 'line' | 'enclosed' | 'pills';
  
  /** 꽉 채우기 */
  fitted?: boolean;
  
  /** 방향 */
  orientation?: 'horizontal' | 'vertical';
}
```

**자식 허용**: `Action role="Tab"`

**Behavior**: `Navigable(horizontal/vertical)`, `Selectable(single, followFocus: true)`

```tsx
<Block role="Tabs" spec={{ variant: 'line' }}>
  <Action role="Tab" id="tab1" label="프로필" />
  <Action role="Tab" id="tab2" label="보안" />
  <Action role="Tab" id="tab3" label="알림" />
</Block>

<Block role="TabPanel" spec={{ tabId: 'tab1' }}>
  {/* 프로필 내용 */}
</Block>
```

#### 6.3.4 `TabPanel`

**ARIA**: `tabpanel`

탭 패널입니다.

```ts
interface TabPanelSpec {
  /** 연결된 탭 ID */
  tabId: string;
}
```

**자식 허용**: Block, Element

#### 6.3.5 `Breadcrumbs`

**ARIA**: `navigation` with `breadcrumb`

경로 탐색입니다.

```ts
interface BreadcrumbsSpec {
  /** 구분자 */
  separator?: string;
  
  /** 최대 표시 개수 (나머지는 축약) */
  maxItems?: number;
}
```

**자식 허용**: `Action role="BreadcrumbItem"`

```tsx
<Block role="Breadcrumbs">
  <Action role="BreadcrumbItem" label="홈" behavior={{ type: 'navigate', to: '/' }} />
  <Action role="BreadcrumbItem" label="문서" behavior={{ type: 'navigate', to: '/docs' }} />
  <Action role="BreadcrumbItem" label="IDDL" current />
</Block>
```

#### 6.3.6 `Pagination`

**ARIA**: `navigation`

페이지네이션입니다.

```ts
interface PaginationSpec {
  /** 현재 페이지 */
  page: number;
  
  /** 전체 페이지 수 */
  totalPages: number;
  
  /** 표시할 페이지 버튼 수 */
  siblingCount?: number;
  
  /** 처음/끝 버튼 표시 */
  showFirstLast?: boolean;
  
  /** 변형 */
  variant?: 'default' | 'simple' | 'compact';
}
```

**자식 허용**: `Action role="PageButton"` (또는 렌더러 자동 생성)

**Behavior**: `Navigable(horizontal)`

```tsx
<Block role="Pagination" spec={{ page: 1, totalPages: 10 }}>
  <Action role="PageButton" label="이전" spec={{ type: 'prev' }} disabled />
  <Action role="PageButton" label="1" spec={{ type: 'page' }} current />
  <Action role="PageButton" label="2" spec={{ type: 'page' }} />
  <Action role="PageButton" label="3" spec={{ type: 'page' }} />
  <Action role="PageButton" label="..." spec={{ type: 'ellipsis' }} disabled />
  <Action role="PageButton" label="10" spec={{ type: 'page' }} />
  <Action role="PageButton" label="다음" spec={{ type: 'next' }} />
</Block>
```

#### 6.3.7 `Stepper`

**ARIA**: `list` 또는 `navigation`

단계 표시기입니다.

```ts
interface StepperSpec {
  /** 현재 단계 */
  current: string | number;
  
  /** 방향 */
  orientation?: 'horizontal' | 'vertical';
  
  /** 클릭으로 이동 가능 */
  clickable?: boolean;
  
  /** 변형 */
  variant?: 'default' | 'simple' | 'dots';
}
```

**자식 허용**: `Action role="StepItem"`

```tsx
<Block role="Stepper" spec={{ current: 2, orientation: 'horizontal' }}>
  <Action role="StepItem" id="1" label="계정 정보" spec={{ status: 'completed' }} />
  <Action role="StepItem" id="2" label="프로필 설정" spec={{ status: 'current' }} />
  <Action role="StepItem" id="3" label="완료" spec={{ status: 'pending' }} />
</Block>
```

---

### 6.4 Form Category

#### 6.4.1 `Form`

**ARIA**: `form`

폼 컨테이너입니다.

```ts
interface FormSpec {
  /** 제출 동작 */
  action?: string;
  
  /** HTTP 메서드 */
  method?: 'get' | 'post';
  
  /** 레이아웃 */
  layout?: 'vertical' | 'horizontal' | 'inline';
  
  /** 라벨 너비 (horizontal) */
  labelWidth?: string;
  
  /** 필수 표시 */
  requiredIndicator?: 'asterisk' | 'label' | 'none';
}
```

**자식 허용**: `Field`, `Block role="FieldGroup"`, `Action`, `Separator`

```tsx
<Block role="Form" spec={{ layout: 'vertical' }}>
  <Field role="TextInput" label="이름" model="name" required />
  <Field role="TextInput" label="이메일" model="email" spec={{ format: 'email' }} required />
  
  <Block role="FieldGroup" spec={{ label: "선택 사항" }}>
    <Field role="TextArea" label="소개" model="bio" />
    <Field role="Select" label="국가" model="country" spec={{ options: [...] }} />
  </Block>
  
  <Block role="Stack" spec={{ direction: 'horizontal', justify: 'end' }}>
    <Action role="Button" label="취소" prominence="Subtle" />
    <Action role="Button" label="저장" intent="Brand" behavior={{ type: 'submit' }} />
  </Block>
</Block>
```

#### 6.4.2 `FieldGroup`

**ARIA**: `group` or `fieldset`

필드 그룹입니다.

```ts
interface FieldGroupSpec {
  /** 그룹 라벨 (legend) */
  label?: string;
  
  /** 설명 */
  description?: string;
  
  /** 축소 가능 */
  collapsible?: boolean;
  
  /** 축소 상태 */
  collapsed?: boolean;
}
```

**자식 허용**: `Field`, `Block role="FieldGroup"`

```tsx
<Block role="FieldGroup" spec={{ label: "주소 정보" }}>
  <Field role="TextInput" label="주소" model="address.street" />
  <Block role="Grid" spec={{ columns: 2 }}>
    <Field role="TextInput" label="도시" model="address.city" />
    <Field role="TextInput" label="우편번호" model="address.zip" />
  </Block>
</Block>
```

#### 6.4.3 `FilterBar`

**ARIA**: `search` 또는 `form`

필터/검색 바입니다.

```ts
interface FilterBarSpec {
  /** 레이아웃 */
  layout?: 'inline' | 'stacked';
  
  /** 액션 버튼 위치 */
  actionsPosition?: 'end' | 'bottom';
}
```

**자식 허용**: `Field`, `Action`

```tsx
<Block role="FilterBar" spec={{ layout: 'inline' }}>
  <Field role="SearchInput" label="검색" model="query" />
  <Field role="Select" label="상태" model="status" spec={{ options: [...] }} />
  <Field role="DateInput" label="날짜" model="date" />
  <Action role="Button" label="검색" intent="Brand" />
  <Action role="Button" label="초기화" prominence="Subtle" />
</Block>
```

---

### 6.5 Overlay Category

#### 6.5.1 `Popover`

**ARIA**: `dialog` (non-modal)

팝오버입니다.

```ts
interface PopoverSpec {
  /** 트리거 요소 ID */
  triggerId?: string;
  
  /** 위치 */
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto';
  
  /** 정렬 */
  align?: 'start' | 'center' | 'end';
  
  /** 화살표 표시 */
  arrow?: boolean;
  
  /** 외부 클릭 시 닫기 */
  closeOnClickOutside?: boolean;
  
  /** Escape 키로 닫기 */
  closeOnEscape?: boolean;
}
```

**자식 허용**: Block, Element

**Behavior**: `FocusScope`, `Dismissable`

```tsx
<Action role="Button" id="trigger" label="더보기" behavior={{ type: 'open', target: 'popover-1' }} />
<Block role="Popover" id="popover-1" spec={{ triggerId: 'trigger', placement: 'bottom' }}>
  <Block role="Menu">
    <Action role="MenuItem" label="편집" />
    <Action role="MenuItem" label="삭제" />
  </Block>
</Block>
```

#### 6.5.2 `Tooltip`

**ARIA**: `tooltip`

툴팁입니다.

```ts
interface TooltipSpec {
  /** 툴팁 내용 */
  content: string;
  
  /** 위치 */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  
  /** 표시 딜레이 (ms) */
  delay?: number;
  
  /** 화살표 표시 */
  arrow?: boolean;
}
```

**Note**: Tooltip은 보통 트리거 요소의 spec으로 정의됨

```tsx
<Action role="IconButton" label="설정" icon="settings" 
  spec={{ tooltip: { content: '설정 열기', placement: 'bottom' } }} />
```

#### 6.5.3 `Toast`

**ARIA**: `status` 또는 `alert`

토스트 알림입니다.

```ts
interface ToastSpec {
  /** 메시지 */
  message: string;
  
  /** 제목 */
  title?: string;
  
  /** 의미 */
  intent?: 'Neutral' | 'Positive' | 'Caution' | 'Critical' | 'Info';
  
  /** 자동 닫힘 (ms, 0이면 수동) */
  duration?: number;
  
  /** 닫기 버튼 */
  closable?: boolean;
  
  /** 액션 버튼 */
  action?: { label: string; behavior: ActionBehavior };
}
```

**Note**: Toast는 보통 프로그래매틱하게 생성됨

```tsx
// 선언적 사용
<Block role="Toast" spec={{ 
  title: "저장 완료",
  message: "변경사항이 저장되었습니다.",
  intent: "Positive",
  duration: 3000,
  closable: true
}} />
```

#### 6.5.4 `ContextMenu`

**ARIA**: `menu`

컨텍스트 메뉴 (우클릭)입니다.

```ts
interface ContextMenuSpec {
  /** 트리거 요소/영역 ID */
  triggerId?: string;
  
  /** 위치 (마우스 위치 기준) */
  position?: 'cursor' | 'center';
}
```

**자식 허용**: `Action role="MenuItem"`, `Block role="MenuGroup"`, `Separator`

**Behavior**: `FocusScope`, `Navigable(vertical)`, `Dismissable`

---

### 6.6 Grouping Category

#### 6.6.1 `Group`

**ARIA**: `group` 또는 `none`

범용 그룹 컨테이너입니다.

```ts
interface GroupSpec {
  /** 라벨 */
  label?: string;
}
```

```tsx
<Block role="Group" spec={{ label: "옵션" }}>
  <Action role="Chip" id="1" label="React" />
  <Action role="Chip" id="2" label="Vue" />
  <Action role="Chip" id="3" label="Angular" />
</Block>
```

#### 6.6.2 `Toolbar`

**ARIA**: `toolbar`

도구 모음입니다.

```ts
interface ToolbarSpec {
  /** 방향 */
  orientation?: 'horizontal' | 'vertical';
  
  /** 구분선 표시 */
  dividers?: boolean;
}
```

**자식 허용**: `Action`, `Separator`, `Block role="ButtonGroup"`

**Behavior**: `Navigable(horizontal/vertical)`

```tsx
<Block role="Toolbar">
  <Block role="ButtonGroup">
    <Action role="ToggleButton" label="굵게" icon="bold" />
    <Action role="ToggleButton" label="기울임" icon="italic" />
    <Action role="ToggleButton" label="밑줄" icon="underline" />
  </Block>
  <Separator orientation="vertical" />
  <Action role="IconButton" label="링크" icon="link" />
  <Action role="IconButton" label="이미지" icon="image" />
</Block>
```

#### 6.6.3 `ButtonGroup`

**ARIA**: `group`

버튼 그룹입니다.

```ts
interface ButtonGroupSpec {
  /** 연결된 버튼 스타일 */
  attached?: boolean;
  
  /** 방향 */
  orientation?: 'horizontal' | 'vertical';
}
```

**자식 허용**: `Action` (Button, IconButton, ToggleButton)

```tsx
<Block role="ButtonGroup" spec={{ attached: true }}>
  <Action role="Button" label="좌" />
  <Action role="Button" label="중" />
  <Action role="Button" label="우" />
</Block>
```

#### 6.6.4 `ChipGroup`

**ARIA**: `group`

칩/태그 그룹입니다.

```ts
interface ChipGroupSpec {
  /** 선택 모드 */
  selection?: 'none' | 'single' | 'multiple';
  
  /** 줄바꿈 */
  wrap?: boolean;
}
```

**자식 허용**: `Action role="Chip"`

**Behavior**: `Navigable(horizontal)`, `Selectable`

```tsx
<Block role="ChipGroup" spec={{ selection: 'multiple', wrap: true }}>
  <Action role="Chip" id="react" label="React" selected />
  <Action role="Chip" id="typescript" label="TypeScript" selected />
  <Action role="Chip" id="nextjs" label="Next.js" />
</Block>
```

#### 6.6.5 `Accordion`

**ARIA**: none (자식이 ARIA 제공)

아코디언 컨테이너입니다.

```ts
interface AccordionSpec {
  /** 다중 펼침 허용 */
  multiple?: boolean;
  
  /** 항상 하나 이상 펼침 */
  collapsible?: boolean;
  
  /** 펼쳐진 아이템들 */
  expanded?: string[];
  
  /** 기본 펼침 */
  defaultExpanded?: string[];
}
```

**자식 허용**: `Block role="AccordionItem"`

```tsx
<Block role="Accordion" spec={{ multiple: false }}>
  <Block role="AccordionItem" id="item1">
    <Action role="AccordionTrigger" label="섹션 1" />
    <Block role="AccordionPanel">
      <Text role="Body">섹션 1 내용</Text>
    </Block>
  </Block>
  <Block role="AccordionItem" id="item2">
    <Action role="AccordionTrigger" label="섹션 2" />
    <Block role="AccordionPanel">
      <Text role="Body">섹션 2 내용</Text>
    </Block>
  </Block>
</Block>
```

#### 6.6.6 `AccordionItem`

아코디언 개별 아이템입니다.

```ts
interface AccordionItemSpec {
  /** 펼침 상태 */
  expanded?: boolean;
  
  /** 비활성화 */
  disabled?: boolean;
}
```

**자식 구조**: `Action role="AccordionTrigger"` + `Block role="AccordionPanel"`

#### 6.6.7 `AccordionPanel`

**ARIA**: `region`

아코디언 패널 (콘텐츠)입니다.

**자식 허용**: Block, Element

---

## 7. Renderer Requirements

### 7.1 Required Block Support

Conforming renderer MUST support:

**Layout**: `Stack`, `Grid`, `Card`
**Collection**: `List`, `Menu`, `DataTable`
**Navigation**: `Tabs`, `TabPanel`, `Breadcrumbs`
**Form**: `Form`, `FieldGroup`
**Grouping**: `Group`, `Toolbar`

### 7.2 Recommended Block Support

Renderer SHOULD support:

`TreeView`, `CommandPalette`, `Calendar`, `Carousel`, `Navigation`, `NavGroup`, `Pagination`, `Stepper`, `FilterBar`, `Popover`, `Tooltip`, `Toast`, `ContextMenu`, `ButtonGroup`, `ChipGroup`, `Accordion`

### 7.3 Child Type Enforcement

Renderer MUST enforce:

| Block | Allowed Children |
|-------|------------------|
| `List` | ListItem, FileItem, UserItem, etc. (Action) |
| `Menu` | MenuItem (Action), MenuGroup (Block), Separator |
| `Tabs` | Tab (Action) |
| `TreeView` | TreeItem (Action) |
| `DataTable` | TableHeader, TableBody (Block) |
| `Form` | Field, FieldGroup (Block), Action |

### 7.4 Behavior Implementation

Renderer MUST implement Behavior Primitives for:

| Block | Required Behaviors |
|-------|-------------------|
| `List` | Navigable, Selectable |
| `Menu` | Navigable, Selectable, FocusScope |
| `Tabs` | Navigable, Selectable (followFocus) |
| `TreeView` | Navigable, Selectable, Expandable |
| `CommandPalette` | FocusScope, Navigable, Selectable |

### 7.5 Default Layouts

Renderer SHOULD provide sensible default layouts:

| Block | Default Layout |
|-------|---------------|
| `Stack` | flex-column, gap: md |
| `Grid` | CSS Grid, columns: auto |
| `List` | flex-column |
| `Toolbar` | flex-row, gap: sm |
| `Form` | flex-column, gap: md |

---

## 8. Accessibility

### 8.1 ARIA Role Mapping

| Block Role | ARIA Role | Additional ARIA |
|------------|-----------|-----------------|
| `Stack` | none | presentation |
| `Grid` | none or grid | aria-rowcount, aria-colcount |
| `Card` | article or region | aria-labelledby |
| `List` | listbox or list | aria-multiselectable |
| `TreeView` | tree | aria-multiselectable |
| `DataTable` | table | aria-rowcount, aria-colcount |
| `Menu` | menu | - |
| `Listbox` | listbox | aria-multiselectable |
| `Tabs` | tablist | aria-orientation |
| `TabPanel` | tabpanel | aria-labelledby |
| `Navigation` | navigation | aria-label |
| `Breadcrumbs` | navigation | aria-label="breadcrumb" |
| `Form` | form | aria-labelledby |
| `Toolbar` | toolbar | aria-orientation |
| `Accordion` | none | - |
| `Popover` | dialog | aria-modal=false |
| `Tooltip` | tooltip | - |

### 8.2 Landmark Usage

| Block | Landmark Role | When |
|-------|---------------|------|
| `Navigation` | navigation | 항상 |
| `Form` | form | aria-labelledby 있을 때 |
| `Breadcrumbs` | navigation | 항상 |

### 8.3 Focus Management

- Collection Block은 roving tabindex 또는 aria-activedescendant 사용
- Overlay Block은 FocusScope로 포커스 관리
- 키보드 탐색은 Navigable로 구현

---

## 9. Examples

### 9.1 파일 관리자 사이드바

```tsx
<Section role="Sidebar">
  <Block role="Navigation">
    <Action role="NavItem" id="all" label="전체 파일" icon="folder" selected />
    <Action role="NavItem" id="recent" label="최근" icon="clock" />
    <Action role="NavItem" id="starred" label="중요" icon="star" />
    <Action role="NavItem" id="trash" label="휴지통" icon="trash" />
    
    <Separator />
    
    <Block role="NavGroup" spec={{ label: "태그" }}>
      <Action role="NavItem" id="work" label="업무" 
        spec={{ leading: { type: 'indicator', color: 'blue' } }} />
      <Action role="NavItem" id="personal" label="개인" 
        spec={{ leading: { type: 'indicator', color: 'green' } }} />
    </Block>
  </Block>
</Section>
```

### 9.2 설정 화면

```tsx
<Section role="Main">
  <Block role="Tabs" spec={{ variant: 'line' }}>
    <Action role="Tab" id="general" label="일반" selected />
    <Action role="Tab" id="appearance" label="외관" />
    <Action role="Tab" id="notifications" label="알림" />
    <Action role="Tab" id="security" label="보안" />
  </Block>
  
  <Block role="TabPanel" spec={{ tabId: 'general' }}>
    <Block role="Card">
      <Block role="Form" spec={{ layout: 'vertical' }}>
        <Block role="FieldGroup" spec={{ label: "프로필" }}>
          <Field role="TextInput" label="이름" model="profile.name" />
          <Field role="TextInput" label="이메일" model="profile.email" 
            spec={{ format: 'email' }} />
        </Block>
        
        <Block role="FieldGroup" spec={{ label: "환경설정" }}>
          <Field role="Select" label="언어" model="settings.language" 
            spec={{ options: [
              { label: '한국어', value: 'ko' },
              { label: 'English', value: 'en' }
            ]}} />
          <Field role="Select" label="시간대" model="settings.timezone" 
            spec={{ options: [...] }} />
        </Block>
        
        <Block role="Stack" spec={{ direction: 'horizontal', justify: 'end' }}>
          <Action role="Button" label="저장" intent="Brand" behavior={{ type: 'submit' }} />
        </Block>
      </Block>
    </Block>
  </Block>
</Section>
```

### 9.3 데이터 대시보드

```tsx
<Section role="Main">
  <Block role="FilterBar" spec={{ layout: 'inline' }}>
    <Field role="SearchInput" label="검색" model="query" placeholder="이름으로 검색..." />
    <Field role="Select" label="상태" model="status" spec={{ options: [
      { label: '전체', value: 'all' },
      { label: '활성', value: 'active' },
      { label: '비활성', value: 'inactive' }
    ]}} />
    <Field role="DateInput" label="날짜" model="date" spec={{ range: true }} />
    <Action role="Button" label="필터 적용" intent="Brand" />
    <Action role="Button" label="초기화" prominence="Subtle" />
  </Block>
  
  <Block role="DataTable" spec={{ selection: 'extended', sortable: true, stickyHeader: true }}>
    <Block role="TableHeader">
      <Action role="ColumnHeader" id="name" label="이름" spec={{ sortable: true, sortDirection: 'asc' }} />
      <Action role="ColumnHeader" id="email" label="이메일" spec={{ sortable: true }} />
      <Action role="ColumnHeader" id="role" label="역할" />
      <Action role="ColumnHeader" id="status" label="상태" />
      <Action role="ColumnHeader" id="actions" label="" spec={{ width: 80 }} />
    </Block>
    <Block role="TableBody">
      <Action role="TableRow" id="1" label="John Doe" spec={{
        cells: [
          { value: 'John Doe' },
          { value: 'john@example.com' },
          { value: 'Admin' },
          { value: 'Active', intent: 'Positive' },
          { value: '...' }
        ]
      }} />
      <Action role="TableRow" id="2" label="Jane Smith" spec={{
        cells: [
          { value: 'Jane Smith' },
          { value: 'jane@example.com' },
          { value: 'User' },
          { value: 'Pending', intent: 'Caution' },
          { value: '...' }
        ]
      }} />
    </Block>
  </Block>
  
  <Block role="Pagination" spec={{ page: 1, totalPages: 10 }} />
</Section>
```

### 9.4 모달 폼

```tsx
<Section role="Modal" name="새 프로젝트 만들기">
  <Block role="Card">
    <Block role="Stack" padding="lg">
      <Text role="Heading">새 프로젝트</Text>
      <Text role="Body" prominence="Subtle">프로젝트 정보를 입력하세요.</Text>
    </Block>
    
    <Separator />
    
    <Block role="Form" spec={{ layout: 'vertical' }} padding="lg">
      <Field role="TextInput" label="프로젝트 이름" model="name" required />
      <Field role="TextArea" label="설명" model="description" />
      <Field role="Select" label="템플릿" model="template" spec={{ options: [
        { label: '빈 프로젝트', value: 'blank' },
        { label: '웹 애플리케이션', value: 'webapp' },
        { label: 'API 서버', value: 'api' }
      ]}} />
      
      <Block role="ChipGroup" spec={{ selection: 'multiple', wrap: true }}>
        <Text role="Label">태그</Text>
        <Action role="Chip" id="frontend" label="Frontend" />
        <Action role="Chip" id="backend" label="Backend" />
        <Action role="Chip" id="mobile" label="Mobile" />
      </Block>
    </Block>
    
    <Separator />
    
    <Block role="Toolbar" padding="lg" spec={{ justify: 'end' }}>
      <Action role="Button" label="취소" prominence="Subtle" behavior={{ type: 'close' }} />
      <Action role="Button" label="생성" intent="Brand" behavior={{ type: 'submit' }} />
    </Block>
  </Block>
</Section>
```

---

## Appendix A: Block Role Summary

| Role | Category | ARIA | Children | Behavior |
|------|----------|------|----------|----------|
| `Stack` | Layout | none | any | - |
| `Grid` | Layout | none/grid | any | Navigable (if interactive) |
| `Card` | Layout | article | any | - |
| `ScrollArea` | Layout | none | any | - |
| `List` | Collection | listbox | ListItem, etc. | Navigable, Selectable |
| `TreeView` | Collection | tree | TreeItem | Navigable, Selectable, Expandable |
| `DataTable` | Collection | table | TableHeader, TableBody | Navigable, Selectable |
| `TableHeader` | Collection | rowgroup | ColumnHeader | - |
| `TableBody` | Collection | rowgroup | TableRow | - |
| `Menu` | Collection | menu | MenuItem | Navigable, Selectable, FocusScope |
| `MenuGroup` | Collection | group | MenuItem | - |
| `Listbox` | Collection | listbox | Option | Navigable, Selectable |
| `OptionGroup` | Collection | group | Option | - |
| `CommandPalette` | Collection | dialog | CommandItem | FocusScope, Navigable, Selectable |
| `CommandGroup` | Collection | group | CommandItem | - |
| `Calendar` | Collection | grid | CalendarDay | Navigable, Selectable |
| `Carousel` | Collection | region | CarouselSlide | Navigable |
| `CarouselSlide` | Collection | none | any | - |
| `Navigation` | Navigation | navigation | NavItem | Navigable |
| `NavGroup` | Navigation | group | NavItem | - |
| `Tabs` | Navigation | tablist | Tab | Navigable, Selectable |
| `TabPanel` | Navigation | tabpanel | any | - |
| `Breadcrumbs` | Navigation | navigation | BreadcrumbItem | - |
| `Pagination` | Navigation | navigation | PageButton | Navigable |
| `Stepper` | Navigation | list | StepItem | - |
| `Form` | Form | form | Field, FieldGroup | - |
| `FieldGroup` | Form | group | Field | - |
| `FilterBar` | Form | search | Field, Action | - |
| `Popover` | Overlay | dialog | any | FocusScope, Dismissable |
| `Tooltip` | Overlay | tooltip | Text | - |
| `Toast` | Overlay | status | Text, Action | - |
| `ContextMenu` | Overlay | menu | MenuItem | FocusScope, Navigable |
| `Group` | Grouping | group | any | - |
| `Toolbar` | Grouping | toolbar | Action | Navigable |
| `ButtonGroup` | Grouping | group | Button | - |
| `ChipGroup` | Grouping | group | Chip | Navigable, Selectable |
| `Accordion` | Grouping | none | AccordionItem | - |
| `AccordionItem` | Grouping | none | Trigger, Panel | - |
| `AccordionPanel` | Grouping | region | any | - |

---

## Appendix B: Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-11 | Draft 0.1 | Initial draft |

---

*End of Document*
