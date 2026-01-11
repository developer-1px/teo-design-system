# IDDL Action Specification

**Draft Community Group Report, 11 January 2026**

---

## Abstract

이 문서는 IDDL(Intent-Driven Design Language)의 Action Element를 정의합니다. Action은 **사용자가 트리거하는 인터랙티브 leaf element**로, 버튼부터 복합 아이템(NavItem, ListItem 등)까지 포함합니다.

**핵심 원칙**: "하나의 클릭 타겟으로 동작하면 Action"

---

## Status of This Document

This document is a **Working Draft**.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Conformance](#2-conformance)
3. [Action Categories](#3-action-categories)
4. [Common Properties](#4-common-properties)
5. [Slot System](#5-slot-system)
6. [Action Roles](#6-action-roles)
7. [Renderer Requirements](#7-renderer-requirements)
8. [Accessibility](#8-accessibility)
9. [Examples](#9-examples)

---

## 1. Introduction

### 1.1 Action의 정의

Action은 IDDL의 6가지 Element 중 하나로, **사용자 인터랙션을 받는 leaf 노드**입니다.

```
Element 분류:
├── Text      → 정보 표시 (읽기 전용)
├── Image     → 미디어 표시
├── Video     → 미디어 표시
├── Field     → 사용자 입력
├── Action    → 사용자 트리거 (클릭, 키보드)
└── Separator → 구분
```

### 1.2 Action vs Block

| 구분 | Action | Block |
|------|--------|-------|
| 역할 | 인터랙티브 leaf | 컨테이너 |
| 자식 | 없음 (slot으로 구성) | Block 또는 Element |
| 클릭 | 전체가 하나의 타겟 | 자식 요소가 개별 타겟 |
| 예시 | Button, MenuItem, ListItem | Menu, List, Card |

### 1.3 Design Goals

1. **Block 폭발 방지**: 복합 아이템(NavItem, FileItem 등)을 Action으로 처리
2. **선언적 구조**: slot 기반으로 복잡한 아이템도 직렬화 가능
3. **일관된 인터랙션**: 모든 Action은 동일한 상태/동작 모델 공유
4. **ARIA 자동화**: Role에 따른 접근성 속성 자동 적용

---

## 2. Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHOULD", "MAY" in this document are to be interpreted as described in [RFC 2119].

A conforming IDDL renderer:

1. MUST recognize all Action roles defined in this specification
2. MUST render appropriate ARIA roles and states
3. MUST support the slot system for composite Actions
4. MUST implement keyboard interaction as specified
5. SHOULD provide visual feedback for all interactive states

---

## 3. Action Categories

Action은 3가지 카테고리로 분류됩니다.

### 3.1 Category Overview

| Category | 설명 | 특징 |
|----------|------|------|
| **Basic** | 단순 트리거 | label + icon 정도 |
| **Selection** | 선택 단위 | 부모 Block에 의해 selected 상태 관리 |
| **Composite** | 복합 아이템 | 여러 slot으로 구성된 풍부한 구조 |

### 3.2 Category Determination

```
Action
├── Basic      : Button, IconButton, Link, ToggleButton
├── Selection  : Tab, MenuItem, Option, Chip
└── Composite  : ListItem, NavItem, TreeItem, CardItem, 
                 FileItem, UserItem, CommandItem, 
                 TableRow, BreadcrumbItem, StepItem,
                 NotificationItem, SearchResultItem
```

---

## 4. Common Properties

모든 Action에 공통으로 적용되는 속성입니다.

### 4.1 Core Properties

```ts
interface ActionProps extends BaseProps {
  /** Action의 기능적 역할 (REQUIRED) */
  role: ActionRole;
  
  /** 표시 텍스트 / 접근성 이름 (REQUIRED) */
  label: string;
  
  /** 고유 식별자 (Selection/Composite에서 REQUIRED) */
  id?: string;
  
  /** Leading 아이콘 */
  icon?: string;
  
  /** 클릭 시 동작 */
  behavior?: ActionBehavior;
  
  /** 비활성화 */
  disabled?: boolean;
}
```

### 4.2 State Properties

부모 Block에 의해 제어되는 상태입니다.

```ts
interface ActionStateProps {
  /** 선택됨 (Tab, MenuItem, ListItem 등) */
  selected?: boolean;
  
  /** 눌림 (ToggleButton) */
  pressed?: boolean;
  
  /** 펼쳐짐 (TreeItem, AccordionTrigger) */
  expanded?: boolean;
  
  /** 현재 위치 (BreadcrumbItem, StepItem) */
  current?: boolean;
  
  /** 로딩 중 */
  loading?: boolean;
}
```

### 4.3 Behavior Types

```ts
type ActionBehavior =
  /** 폼 제출 */
  | { type: 'submit' }
  
  /** 페이지/라우트 이동 */
  | { type: 'navigate'; to: string; target?: '_blank' | '_self' }
  
  /** 명령 실행 */
  | { type: 'command'; id: string; params?: Record<string, unknown> }
  
  /** 오버레이 열기 (Modal, Drawer, Popover 등) */
  | { type: 'open'; target: string }
  
  /** 오버레이 닫기 */
  | { type: 'close'; target?: string }
  
  /** 토글 (expanded, pressed 등) */
  | { type: 'toggle'; target?: string }
  
  /** 복사 */
  | { type: 'copy'; value: string }
  
  /** 다운로드 */
  | { type: 'download'; url: string; filename?: string };
```

---

## 5. Slot System

Composite Action은 slot 기반으로 복잡한 구조를 표현합니다.

### 5.1 Common Slots

모든 Composite Action에서 사용 가능한 공통 슬롯입니다.

```ts
interface ActionSlots {
  /** 앞쪽 요소 (아이콘, 아바타, 썸네일) */
  leading?: LeadingSlot;
  
  /** 뒤쪽 요소들 (아이콘, 텍스트, 배지, 버튼) */
  trailing?: TrailingSlot[];
  
  /** 배지 (숫자, 텍스트) */
  badge?: string | number;
  
  /** 부가 정보 (설명, 메타데이터) */
  meta?: string | string[];
  
  /** 보조 텍스트 (두 번째 줄) */
  description?: string;
}
```

### 5.2 Leading Slot

```ts
type LeadingSlot =
  | { type: 'icon'; name: string; intent?: Intent }
  | { type: 'avatar'; src: string; alt?: string; fallback?: string }
  | { type: 'image'; src: string; alt?: string }
  | { type: 'thumbnail'; src: string; alt?: string; aspectRatio?: string }
  | { type: 'checkbox' }   // ListItem에서 체크박스 표시
  | { type: 'radio' }      // ListItem에서 라디오 표시
  | { type: 'indicator'; color?: string };  // 상태 표시 점
```

### 5.3 Trailing Slot

```ts
type TrailingSlot =
  | { type: 'icon'; name: string }
  | { type: 'text'; content: string }
  | { type: 'badge'; value: string | number; intent?: Intent }
  | { type: 'shortcut'; keys: string }  // ⌘K, Ctrl+S 등
  | { type: 'action'; icon: string; label?: string; behavior?: ActionBehavior }
  | { type: 'chevron' }  // 서브메뉴/상세 표시
  | { type: 'switch'; checked?: boolean }
  | { type: 'time'; value: string };  // 상대 시간 (2분 전)
```

### 5.4 Slot 사용 예시

```tsx
// NavItem with badge and more button
<Action 
  role="NavItem"
  label="Documents"
  icon="folder"
  spec={{
    badge: 12,
    trailing: [
      { type: 'action', icon: 'more-vertical', behavior: { type: 'open', target: 'context-menu' } }
    ]
  }}
/>

// UserItem with avatar and actions
<Action
  role="UserItem"
  label="John Doe"
  spec={{
    leading: { type: 'avatar', src: '/avatars/john.png' },
    description: "Product Manager",
    trailing: [
      { type: 'action', icon: 'message' },
      { type: 'action', icon: 'more-vertical' }
    ]
  }}
/>

// CommandItem with shortcut
<Action
  role="CommandItem"
  label="Open File"
  icon="file"
  spec={{
    trailing: [{ type: 'shortcut', keys: '⌘O' }]
  }}
/>
```

---

## 6. Action Roles

### 6.1 Basic Category

#### 6.1.1 `Button`

**ARIA**: `button`

기본 버튼입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 버튼 텍스트 (REQUIRED) |
| `icon` | string | Leading 아이콘 |
| `behavior` | ActionBehavior | 클릭 동작 |

**spec options**: 없음

```tsx
<Action role="Button" label="저장" icon="save" intent="Brand" />
<Action role="Button" label="삭제" intent="Critical" behavior={{ type: 'command', id: 'delete' }} />
```

#### 6.1.2 `IconButton`

**ARIA**: `button`

아이콘만 있는 버튼입니다. `label`은 접근성 이름으로 사용됩니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 접근성 이름 (REQUIRED, 화면에 미표시) |
| `icon` | string | 아이콘 (REQUIRED) |

**Renderer MUST**: 툴팁으로 label 표시

```tsx
<Action role="IconButton" label="설정" icon="settings" />
<Action role="IconButton" label="닫기" icon="x" behavior={{ type: 'close' }} />
```

#### 6.1.3 `Link`

**ARIA**: `link`

텍스트 링크입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 링크 텍스트 (REQUIRED) |
| `behavior` | ActionBehavior | navigate 타입 권장 |

```tsx
<Action role="Link" label="자세히 보기" behavior={{ type: 'navigate', to: '/details' }} />
<Action role="Link" label="외부 링크" behavior={{ type: 'navigate', to: 'https://...', target: '_blank' }} />
```

#### 6.1.4 `ToggleButton`

**ARIA**: `button` with `aria-pressed`

눌림 상태를 가지는 토글 버튼입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 버튼 텍스트 (REQUIRED) |
| `icon` | string | 아이콘 |
| `pressed` | boolean | 눌림 상태 |

```tsx
<Action role="ToggleButton" label="굵게" icon="bold" pressed={true} />
<Action role="ToggleButton" label="북마크" icon="bookmark" pressed={false} />
```

---

### 6.2 Selection Category

Selection Action은 부모 Block의 selection 모델에 참여합니다.

#### 6.2.1 `Tab`

**ARIA**: `tab`

탭 네비게이션의 탭입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 탭 텍스트 (REQUIRED) |
| `id` | string | 탭 ID (REQUIRED) |
| `icon` | string | 아이콘 |
| `selected` | boolean | 선택 상태 (부모가 관리) |

**Parent Block**: `Tabs`

```tsx
<Block role="Tabs">
  <Action role="Tab" id="profile" label="프로필" selected />
  <Action role="Tab" id="security" label="보안" />
  <Action role="Tab" id="notifications" label="알림" icon="bell" />
</Block>
```

#### 6.2.2 `MenuItem`

**ARIA**: `menuitem`, `menuitemcheckbox`, or `menuitemradio`

메뉴 아이템입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 메뉴 텍스트 (REQUIRED) |
| `id` | string | 메뉴 ID |
| `icon` | string | Leading 아이콘 |
| `selected` | boolean | 체크 상태 (checkbox/radio 모드) |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `variant` | 'default' \| 'checkbox' \| 'radio' | 메뉴 아이템 타입 |
| `trailing` | TrailingSlot[] | 단축키, 서브메뉴 표시 등 |

**Parent Block**: `Menu`

```tsx
<Block role="Menu">
  <Action role="MenuItem" label="복사" icon="copy" spec={{ trailing: [{ type: 'shortcut', keys: '⌘C' }] }} />
  <Action role="MenuItem" label="붙여넣기" icon="clipboard" />
  <Separator />
  <Action role="MenuItem" label="삭제" icon="trash" intent="Critical" />
</Block>
```

#### 6.2.3 `Option`

**ARIA**: `option`

Select/Listbox의 옵션입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 옵션 텍스트 (REQUIRED) |
| `id` | string | 옵션 값/ID (REQUIRED) |
| `selected` | boolean | 선택 상태 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `leading` | LeadingSlot | 아이콘, 아바타 등 |
| `description` | string | 보조 설명 |

**Parent Block**: `Listbox` (또는 Field role="Combobox"의 팝업)

```tsx
<Block role="Listbox">
  <Action role="Option" id="kr" label="대한민국" spec={{ leading: { type: 'icon', name: 'flag-kr' } }} />
  <Action role="Option" id="us" label="미국" spec={{ leading: { type: 'icon', name: 'flag-us' } }} />
  <Action role="Option" id="jp" label="일본" spec={{ leading: { type: 'icon', name: 'flag-jp' } }} />
</Block>
```

#### 6.2.4 `Chip`

**ARIA**: `button` (removable) or `option` (selectable)

태그/칩입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 칩 텍스트 (REQUIRED) |
| `id` | string | 칩 ID |
| `icon` | string | Leading 아이콘 |
| `selected` | boolean | 선택 상태 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `removable` | boolean | 제거 버튼 표시 |
| `avatar` | string | 아바타 이미지 URL |
| `onRemove` | ActionBehavior | 제거 시 동작 |

**Parent Block**: `ChipGroup` 또는 자유 배치

```tsx
<Block role="ChipGroup">
  <Action role="Chip" id="react" label="React" selected />
  <Action role="Chip" id="vue" label="Vue" />
  <Action role="Chip" id="angular" label="Angular" spec={{ removable: true }} />
</Block>
```

---

### 6.3 Composite Category

Composite Action은 slot system을 활용하여 복잡한 아이템을 표현합니다.

#### 6.3.1 `ListItem`

**ARIA**: `option` (in listbox) or `listitem` (in list)

범용 리스트 아이템입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 주요 텍스트 (REQUIRED) |
| `id` | string | 아이템 ID (REQUIRED) |
| `selected` | boolean | 선택 상태 |

**spec options (extends ActionSlots)**:

| Property | Type | Description |
|----------|------|-------------|
| `leading` | LeadingSlot | 아이콘, 아바타, 체크박스 등 |
| `description` | string | 두 번째 줄 텍스트 |
| `meta` | string[] | 메타 정보 |
| `trailing` | TrailingSlot[] | 뒤쪽 요소들 |
| `divider` | boolean | 아래 구분선 표시 |

**Parent Block**: `List`

```tsx
<Block role="List" spec={{ selection: 'extended' }}>
  <Action 
    role="ListItem" 
    id="1" 
    label="프로젝트 미팅"
    spec={{
      leading: { type: 'checkbox' },
      description: "오후 2시 회의실 A",
      meta: ["오늘", "중요"],
      trailing: [{ type: 'action', icon: 'more-vertical' }]
    }}
  />
</Block>
```

#### 6.3.2 `NavItem`

**ARIA**: `link` or `button`

사이드바/네비게이션 아이템입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 메뉴 텍스트 (REQUIRED) |
| `id` | string | 아이템 ID |
| `icon` | string | Leading 아이콘 |
| `selected` | boolean | 현재 선택/활성 상태 |
| `expanded` | boolean | 하위 메뉴 펼침 상태 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `badge` | string \| number | 배지 (알림 수 등) |
| `trailing` | TrailingSlot[] | 더보기 버튼 등 |
| `indent` | number | 들여쓰기 레벨 (중첩 메뉴) |

**Parent Block**: `Navigation` 또는 `NavGroup`

```tsx
<Block role="Navigation">
  <Action role="NavItem" id="home" label="홈" icon="home" selected />
  <Action role="NavItem" id="docs" label="문서" icon="file-text" spec={{ badge: 3 }} />
  <Action role="NavItem" id="settings" label="설정" icon="settings" 
    spec={{ trailing: [{ type: 'chevron' }] }} 
    expanded={false}
  />
</Block>
```

#### 6.3.3 `TreeItem`

**ARIA**: `treeitem`

트리 구조의 노드입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 노드 텍스트 (REQUIRED) |
| `id` | string | 노드 ID (REQUIRED) |
| `icon` | string | 아이콘 |
| `selected` | boolean | 선택 상태 |
| `expanded` | boolean | 펼침 상태 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `level` | number | 트리 깊이 (자동 계산됨) |
| `hasChildren` | boolean | 자식 존재 여부 (화살표 표시) |
| `trailing` | TrailingSlot[] | 뒤쪽 요소 |

**Parent Block**: `TreeView`

```tsx
<Block role="TreeView">
  <Action role="TreeItem" id="docs" label="Documents" icon="folder" expanded>
    <Action role="TreeItem" id="doc1" label="report.pdf" icon="file" />
    <Action role="TreeItem" id="doc2" label="notes.txt" icon="file-text" />
  </Action>
  <Action role="TreeItem" id="images" label="Images" icon="folder" />
</Block>
```

**Note**: TreeItem은 예외적으로 자식 TreeItem을 가질 수 있습니다.

#### 6.3.4 `CardItem`

**ARIA**: `article` or `option` (in grid)

그리드/갤러리의 카드형 아이템입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 카드 제목 (REQUIRED) |
| `id` | string | 카드 ID |
| `selected` | boolean | 선택 상태 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `thumbnail` | { src: string; alt?: string; aspectRatio?: string } | 썸네일 이미지 |
| `description` | string | 설명 텍스트 |
| `meta` | string[] | 메타 정보 (조회수, 날짜 등) |
| `avatar` | { src: string; label: string } | 작성자 아바타 |
| `badges` | Array<{ label: string; intent?: Intent }> | 태그/배지들 |
| `trailing` | TrailingSlot[] | 액션 버튼들 |

**Parent Block**: `Grid` 또는 `List` (variant: 'cards')

```tsx
<Block role="Grid" spec={{ columns: 3 }}>
  <Action 
    role="CardItem" 
    id="card1" 
    label="IDDL 소개"
    spec={{
      thumbnail: { src: '/thumb1.png', aspectRatio: '16:9' },
      description: "Intent-Driven Design Language 시작하기",
      meta: ["1.2k views", "3일 전"],
      avatar: { src: '/avatar.png', label: 'John' }
    }}
  />
</Block>
```

#### 6.3.5 `FileItem`

**ARIA**: `option`

파일/문서 아이템입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 파일명 (REQUIRED) |
| `id` | string | 파일 ID (REQUIRED) |
| `icon` | string | 파일 타입 아이콘 |
| `selected` | boolean | 선택 상태 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `thumbnail` | string | 미리보기 이미지 (이미지 파일) |
| `size` | string | 파일 크기 |
| `modified` | string | 수정일 |
| `type` | string | 파일 타입/확장자 |
| `meta` | string[] | 추가 메타 정보 |
| `trailing` | TrailingSlot[] | 액션 버튼 |

**Parent Block**: `List` 또는 `Grid`

```tsx
<Block role="List" spec={{ selection: 'extended' }}>
  <Action 
    role="FileItem" 
    id="f1" 
    label="report.pdf"
    icon="file-text"
    spec={{
      size: "2.4 MB",
      modified: "2026-01-10",
      trailing: [{ type: 'action', icon: 'more-vertical' }]
    }}
  />
</Block>
```

#### 6.3.6 `UserItem`

**ARIA**: `option` or `listitem`

사용자/멤버 아이템입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 사용자 이름 (REQUIRED) |
| `id` | string | 사용자 ID |
| `selected` | boolean | 선택 상태 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `avatar` | string | 아바타 이미지 URL |
| `status` | 'online' \| 'offline' \| 'busy' \| 'away' | 상태 표시 |
| `role` | string | 역할/직책 |
| `email` | string | 이메일 |
| `meta` | string[] | 추가 정보 |
| `trailing` | TrailingSlot[] | 액션 버튼 |

**Parent Block**: `List`

```tsx
<Block role="List">
  <Action 
    role="UserItem" 
    id="u1" 
    label="John Doe"
    spec={{
      avatar: "/avatars/john.png",
      status: "online",
      role: "Product Manager",
      trailing: [
        { type: 'action', icon: 'message' },
        { type: 'action', icon: 'more-vertical' }
      ]
    }}
  />
</Block>
```

#### 6.3.7 `CommandItem`

**ARIA**: `option`

커맨드 팔레트의 명령 아이템입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 명령어 이름 (REQUIRED) |
| `id` | string | 명령어 ID (REQUIRED) |
| `icon` | string | 아이콘 |
| `selected` | boolean | 현재 포커스/선택 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `shortcut` | string | 단축키 표시 (⌘K, Ctrl+Shift+P) |
| `description` | string | 명령어 설명 |
| `category` | string | 카테고리 (검색용) |
| `keywords` | string[] | 검색 키워드 |

**Parent Block**: `CommandPalette` 또는 `CommandGroup`

```tsx
<Block role="CommandPalette">
  <Block role="CommandGroup" spec={{ label: "파일" }}>
    <Action role="CommandItem" id="open" label="파일 열기" icon="file" spec={{ shortcut: "⌘O" }} />
    <Action role="CommandItem" id="save" label="저장" icon="save" spec={{ shortcut: "⌘S" }} />
  </Block>
  <Block role="CommandGroup" spec={{ label: "편집" }}>
    <Action role="CommandItem" id="find" label="찾기" icon="search" spec={{ shortcut: "⌘F" }} />
  </Block>
</Block>
```

#### 6.3.8 `TableRow`

**ARIA**: `row`

테이블 행입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 행 접근성 이름 |
| `id` | string | 행 ID (REQUIRED) |
| `selected` | boolean | 선택 상태 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `cells` | TableCell[] | 셀 데이터 |
| `expandable` | boolean | 확장 가능 여부 |
| `expanded` | boolean | 확장 상태 |

```ts
type TableCell = {
  value: string | number;
  align?: 'left' | 'center' | 'right';
  intent?: Intent;
  link?: ActionBehavior;
};
```

**Parent Block**: `DataTable` 또는 `TableBody`

```tsx
<Block role="DataTable" spec={{ selection: 'extended' }}>
  <Block role="TableHeader">
    <Action role="ColumnHeader" id="name" label="이름" spec={{ sortable: true }} />
    <Action role="ColumnHeader" id="size" label="크기" spec={{ sortable: true }} />
    <Action role="ColumnHeader" id="date" label="수정일" />
  </Block>
  <Block role="TableBody">
    <Action 
      role="TableRow" 
      id="r1"
      label="document.pdf"
      spec={{
        cells: [
          { value: "document.pdf" },
          { value: "2.4 MB", align: "right" },
          { value: "2026-01-10" }
        ]
      }}
    />
  </Block>
</Block>
```

#### 6.3.9 `ColumnHeader`

**ARIA**: `columnheader`

테이블 열 헤더입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 열 이름 (REQUIRED) |
| `id` | string | 열 ID (REQUIRED) |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `sortable` | boolean | 정렬 가능 여부 |
| `sortDirection` | 'asc' \| 'desc' \| 'none' | 현재 정렬 방향 |
| `resizable` | boolean | 너비 조절 가능 |
| `width` | string \| number | 열 너비 |
| `align` | 'left' \| 'center' \| 'right' | 정렬 |

**Parent Block**: `TableHeader`

#### 6.3.10 `BreadcrumbItem`

**ARIA**: `link` or `none` (current)

경로 탐색의 항목입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 경로 이름 (REQUIRED) |
| `current` | boolean | 현재 위치 여부 |
| `behavior` | ActionBehavior | 이동 동작 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `icon` | string | 아이콘 (보통 첫 항목만) |
| `collapsed` | boolean | 축약 표시 (...) |

**Parent Block**: `Breadcrumbs`

```tsx
<Block role="Breadcrumbs">
  <Action role="BreadcrumbItem" label="홈" icon="home" behavior={{ type: 'navigate', to: '/' }} />
  <Action role="BreadcrumbItem" label="문서" behavior={{ type: 'navigate', to: '/docs' }} />
  <Action role="BreadcrumbItem" label="IDDL 스펙" current />
</Block>
```

#### 6.3.11 `StepItem`

**ARIA**: `listitem` or `link`

단계 표시기의 항목입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 단계 이름 (REQUIRED) |
| `id` | string | 단계 ID |
| `current` | boolean | 현재 단계 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `status` | 'pending' \| 'current' \| 'completed' \| 'error' | 단계 상태 |
| `description` | string | 단계 설명 |
| `optional` | boolean | 선택 단계 여부 |
| `icon` | string | 커스텀 아이콘 |

**Parent Block**: `Stepper`

```tsx
<Block role="Stepper">
  <Action role="StepItem" id="s1" label="계정 정보" spec={{ status: 'completed' }} />
  <Action role="StepItem" id="s2" label="프로필 설정" current spec={{ status: 'current' }} />
  <Action role="StepItem" id="s3" label="완료" spec={{ status: 'pending' }} />
</Block>
```

#### 6.3.12 `NotificationItem`

**ARIA**: `article` or `listitem`

알림 아이템입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 알림 제목/메시지 (REQUIRED) |
| `id` | string | 알림 ID |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `leading` | LeadingSlot | 아이콘, 아바타 |
| `description` | string | 상세 내용 |
| `time` | string | 시간 (2분 전, 어제) |
| `unread` | boolean | 읽지 않음 표시 |
| `intent` | Intent | 알림 종류 |
| `trailing` | TrailingSlot[] | 닫기, 액션 버튼 |

**Parent Block**: `List` 또는 `NotificationList`

```tsx
<Block role="List">
  <Action 
    role="NotificationItem" 
    id="n1" 
    label="새 댓글이 달렸습니다"
    spec={{
      leading: { type: 'avatar', src: '/user.png' },
      description: "John님이 회의록에 댓글을 남겼습니다.",
      time: "2분 전",
      unread: true,
      trailing: [{ type: 'action', icon: 'x' }]
    }}
  />
</Block>
```

#### 6.3.13 `SearchResultItem`

**ARIA**: `option` or `link`

검색 결과 아이템입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 결과 제목 (REQUIRED) |
| `id` | string | 결과 ID |
| `behavior` | ActionBehavior | 클릭 시 이동 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `snippet` | string | 내용 미리보기 (하이라이트 가능) |
| `url` | string | URL 표시 |
| `thumbnail` | string | 썸네일 이미지 |
| `meta` | string[] | 메타 정보 (타입, 날짜 등) |
| `badges` | Array<{ label: string }> | 카테고리 태그 |

**Parent Block**: `List` 또는 `SearchResults`

```tsx
<Block role="List">
  <Action 
    role="SearchResultItem" 
    id="sr1" 
    label="IDDL Specification"
    behavior={{ type: 'navigate', to: '/docs/spec' }}
    spec={{
      snippet: "Intent-Driven Design Language는 UI를 의도와 구조로 기술하는...",
      url: "docs.iddl.dev/spec",
      badges: [{ label: "Documentation" }]
    }}
  />
</Block>
```

#### 6.3.14 `AccordionTrigger`

**ARIA**: `button` with `aria-expanded`

아코디언 헤더/트리거입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 섹션 제목 (REQUIRED) |
| `id` | string | 섹션 ID |
| `expanded` | boolean | 펼침 상태 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `icon` | string | 커스텀 아이콘 |
| `description` | string | 부가 설명 |
| `trailing` | TrailingSlot[] | 뒤쪽 요소 |

**Parent Block**: `AccordionItem`

```tsx
<Block role="Accordion">
  <Block role="AccordionItem">
    <Action role="AccordionTrigger" id="faq1" label="IDDL이란 무엇인가요?" expanded />
    <Block role="AccordionPanel">
      <Text role="Body">Intent-Driven Design Language는...</Text>
    </Block>
  </Block>
</Block>
```

#### 6.3.15 `PageButton`

**ARIA**: `button` or `link`

페이지네이션 버튼입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 페이지 번호 또는 "이전"/"다음" |
| `id` | string | 버튼 ID |
| `current` | boolean | 현재 페이지 여부 |
| `disabled` | boolean | 비활성화 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `type` | 'page' \| 'prev' \| 'next' \| 'first' \| 'last' \| 'ellipsis' | 버튼 타입 |

**Parent Block**: `Pagination`

```tsx
<Block role="Pagination">
  <Action role="PageButton" label="이전" spec={{ type: 'prev' }} disabled />
  <Action role="PageButton" label="1" spec={{ type: 'page' }} current />
  <Action role="PageButton" label="2" spec={{ type: 'page' }} />
  <Action role="PageButton" label="..." spec={{ type: 'ellipsis' }} disabled />
  <Action role="PageButton" label="10" spec={{ type: 'page' }} />
  <Action role="PageButton" label="다음" spec={{ type: 'next' }} />
</Block>
```

#### 6.3.16 `CalendarDay`

**ARIA**: `gridcell` with `button`

캘린더의 날짜 셀입니다.

| Property | Type | Description |
|----------|------|-------------|
| `label` | string | 날짜 (REQUIRED) |
| `id` | string | 날짜 ID (ISO date) |
| `selected` | boolean | 선택 상태 |
| `disabled` | boolean | 선택 불가 |

**spec options**:

| Property | Type | Description |
|----------|------|-------------|
| `today` | boolean | 오늘 표시 |
| `outsideMonth` | boolean | 다른 달 날짜 |
| `rangeStart` | boolean | 범위 시작 |
| `rangeEnd` | boolean | 범위 끝 |
| `inRange` | boolean | 범위 내 |
| `events` | Array<{ color?: string }> | 이벤트 표시 |

**Parent Block**: `Calendar` 또는 `CalendarGrid`

---

## 7. Renderer Requirements

### 7.1 Required Action Support

Conforming renderer MUST support:

**Basic**: `Button`, `IconButton`, `Link`, `ToggleButton`
**Selection**: `Tab`, `MenuItem`, `Option`, `Chip`
**Composite**: `ListItem`, `NavItem`, `TreeItem`

### 7.2 Recommended Action Support

Renderer SHOULD support:

`CardItem`, `FileItem`, `UserItem`, `CommandItem`, `TableRow`, `ColumnHeader`, `BreadcrumbItem`, `StepItem`, `NotificationItem`, `SearchResultItem`, `AccordionTrigger`, `PageButton`, `CalendarDay`

### 7.3 Slot Rendering

Renderer MUST:

1. Leading slot을 왼쪽에 렌더링
2. Label/Description을 중앙에 렌더링
3. Trailing slots를 오른쪽에 순서대로 렌더링
4. Trailing action의 클릭 이벤트가 부모 Action에 전파되지 않도록 처리

### 7.4 State Styling

Renderer MUST provide visual distinction for:

| State | Visual Feedback |
|-------|-----------------|
| `hover` | 배경색 변경 등 |
| `focus` | Focus ring |
| `selected` | 강조 배경/테두리 |
| `pressed` | 눌린 상태 표시 |
| `expanded` | 화살표 회전 등 |
| `disabled` | 흐리게 + 커서 변경 |
| `loading` | 스피너 또는 스켈레톤 |
| `current` | 현재 위치 표시 |

---

## 8. Accessibility

### 8.1 ARIA Role Mapping

| Action Role | ARIA Role | Additional ARIA |
|-------------|-----------|-----------------|
| `Button` | `button` | - |
| `IconButton` | `button` | `aria-label` |
| `Link` | `link` | `href` |
| `ToggleButton` | `button` | `aria-pressed` |
| `Tab` | `tab` | `aria-selected`, `aria-controls` |
| `MenuItem` | `menuitem` / `menuitemcheckbox` / `menuitemradio` | `aria-checked` |
| `Option` | `option` | `aria-selected` |
| `Chip` | `button` / `option` | `aria-pressed` / `aria-selected` |
| `ListItem` | `option` / `listitem` | `aria-selected` |
| `NavItem` | `link` / `button` | `aria-current` |
| `TreeItem` | `treeitem` | `aria-expanded`, `aria-selected`, `aria-level` |
| `CardItem` | `article` / `option` | `aria-selected` |
| `TableRow` | `row` | `aria-selected`, `aria-rowindex` |
| `ColumnHeader` | `columnheader` | `aria-sort` |
| `BreadcrumbItem` | `link` / `none` | `aria-current` |
| `StepItem` | `listitem` | `aria-current` |
| `AccordionTrigger` | `button` | `aria-expanded`, `aria-controls` |
| `PageButton` | `button` | `aria-current` |
| `CalendarDay` | `gridcell` > `button` | `aria-selected`, `aria-disabled` |

### 8.2 Keyboard Interaction

모든 Action은 다음 키보드 인터랙션을 지원해야 합니다:

| Key | Action |
|-----|--------|
| `Enter` | Action 활성화 |
| `Space` | Action 활성화 (Button, Toggle) |
| `Tab` | 다음 포커스 가능 요소로 |

Selection/Composite Action은 부모 Block의 Navigable/Selectable에 의해 추가 키보드 지원을 받습니다.

### 8.3 Focus Management

- 모든 Action은 기본적으로 `tabIndex={-1}`
- 부모 Block의 Navigable이 `aria-activedescendant` 또는 roving tabindex 관리
- Disabled Action은 포커스에서 제외

---

## 9. Examples

### 9.1 사이드바 네비게이션

```tsx
<Section role="Sidebar">
  <Block role="Navigation">
    <Action role="NavItem" id="home" label="홈" icon="home" selected />
    <Action role="NavItem" id="inbox" label="받은편지함" icon="inbox" 
      spec={{ badge: 12 }} />
    <Action role="NavItem" id="drafts" label="임시보관함" icon="file" />
    
    <Separator />
    
    <Block role="NavGroup" spec={{ label: "프로젝트" }}>
      <Action role="NavItem" id="p1" label="IDDL" icon="folder" 
        spec={{ 
          trailing: [{ type: 'action', icon: 'more-vertical' }],
          indent: 1 
        }} 
      />
      <Action role="NavItem" id="p2" label="Website" icon="folder" 
        spec={{ indent: 1 }} />
    </Block>
    
    <Separator />
    
    <Action role="NavItem" id="settings" label="설정" icon="settings" />
  </Block>
</Section>
```

### 9.2 파일 탐색기

```tsx
<Block role="List" spec={{ selection: 'extended' }}>
  <Action 
    role="FileItem" 
    id="f1" 
    label="Documents"
    icon="folder"
    spec={{ 
      modified: "2026-01-10",
      trailing: [{ type: 'action', icon: 'more-vertical' }]
    }}
    behavior={{ type: 'navigate', to: '/documents' }}
  />
  <Action 
    role="FileItem" 
    id="f2" 
    label="report.pdf"
    icon="file-text"
    spec={{ 
      size: "2.4 MB",
      modified: "2026-01-09"
    }}
  />
  <Action 
    role="FileItem" 
    id="f3" 
    label="photo.jpg"
    icon="image"
    spec={{ 
      thumbnail: "/thumbnails/photo.jpg",
      size: "1.8 MB",
      modified: "2026-01-08"
    }}
  />
</Block>
```

### 9.3 커맨드 팔레트

```tsx
<Block role="CommandPalette">
  <Field role="SearchInput" label="검색" placeholder="명령어 검색..." />
  
  <Block role="CommandGroup" spec={{ label: "최근 사용" }}>
    <Action role="CommandItem" id="recent1" label="파일 열기" icon="file" 
      spec={{ shortcut: "⌘O" }} />
    <Action role="CommandItem" id="recent2" label="새 파일" icon="plus" 
      spec={{ shortcut: "⌘N" }} />
  </Block>
  
  <Block role="CommandGroup" spec={{ label: "모든 명령어" }}>
    <Action role="CommandItem" id="save" label="저장" icon="save" 
      spec={{ shortcut: "⌘S", description: "현재 파일 저장" }} />
    <Action role="CommandItem" id="format" label="코드 포맷팅" icon="code" 
      spec={{ shortcut: "⌘⇧F" }} />
    <Action role="CommandItem" id="settings" label="설정 열기" icon="settings" 
      spec={{ shortcut: "⌘," }} />
  </Block>
</Block>
```

### 9.4 데이터 테이블

```tsx
<Block role="DataTable" spec={{ selection: 'extended' }}>
  <Block role="TableHeader">
    <Action role="ColumnHeader" id="name" label="이름" 
      spec={{ sortable: true, sortDirection: 'asc' }} />
    <Action role="ColumnHeader" id="email" label="이메일" 
      spec={{ sortable: true }} />
    <Action role="ColumnHeader" id="role" label="역할" />
    <Action role="ColumnHeader" id="status" label="상태" />
    <Action role="ColumnHeader" id="actions" label="액션" 
      spec={{ width: 80, align: 'center' }} />
  </Block>
  
  <Block role="TableBody">
    <Action 
      role="TableRow" 
      id="u1"
      label="John Doe"
      spec={{
        cells: [
          { value: "John Doe" },
          { value: "john@example.com" },
          { value: "Admin" },
          { value: "Active", intent: "Positive" },
          { value: "..." }
        ]
      }}
    />
    <Action 
      role="TableRow" 
      id="u2"
      label="Jane Smith"
      spec={{
        cells: [
          { value: "Jane Smith" },
          { value: "jane@example.com" },
          { value: "User" },
          { value: "Pending", intent: "Caution" },
          { value: "..." }
        ]
      }}
    />
  </Block>
</Block>
```

---

## Appendix A: Action Role Summary

| Role | Category | ARIA | Parent Block | Key Features |
|------|----------|------|--------------|--------------|
| `Button` | Basic | button | any | label, icon, behavior |
| `IconButton` | Basic | button | any | icon only, tooltip required |
| `Link` | Basic | link | any | navigate behavior |
| `ToggleButton` | Basic | button | any | pressed state |
| `Tab` | Selection | tab | Tabs | selected, panel control |
| `MenuItem` | Selection | menuitem* | Menu | checkbox/radio variants |
| `Option` | Selection | option | Listbox | select options |
| `Chip` | Selection | button/option | ChipGroup | removable, selectable |
| `ListItem` | Composite | option | List | full slot support |
| `NavItem` | Composite | link | Navigation | badge, indent |
| `TreeItem` | Composite | treeitem | TreeView | expandable, nested |
| `CardItem` | Composite | article | Grid | thumbnail, rich content |
| `FileItem` | Composite | option | List | file metadata |
| `UserItem` | Composite | option | List | avatar, status |
| `CommandItem` | Composite | option | CommandPalette | shortcut |
| `TableRow` | Composite | row | DataTable | cells |
| `ColumnHeader` | Composite | columnheader | TableHeader | sortable |
| `BreadcrumbItem` | Composite | link | Breadcrumbs | current |
| `StepItem` | Composite | listitem | Stepper | status |
| `NotificationItem` | Composite | article | List | unread, time |
| `SearchResultItem` | Composite | option | List | snippet, url |
| `AccordionTrigger` | Composite | button | AccordionItem | expanded |
| `PageButton` | Composite | button | Pagination | current, type |
| `CalendarDay` | Composite | gridcell | Calendar | date states |

---

## Appendix B: Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-11 | Draft 0.1 | Initial draft |

---

*End of Document*
