# IDDL Section Specification

**Draft Community Group Report, 11 January 2026**

---

## Abstract

이 문서는 IDDL(Intent-Driven Design Language)의 Section 레벨을 정의합니다. Section은 Page 내의 **물리적 구획(Physical Region)**을 나타내며, 그 안에 포함된 Block과 Element에 **디자인 컨텍스트(Design Context)**를 제공합니다.

IDDL의 핵심 원칙 중 하나는 **"같은 Block이라도 어디에 있느냐에 따라 다르게 렌더링된다"**는 것입니다. Section은 이 "어디"를 정의합니다.

---

## Status of This Document

This document is a **Working Draft**. It is inappropriate to cite this document as other than work in progress.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Conformance](#2-conformance)
3. [Section의 역할](#3-section의-역할)
4. [Section Role 분류](#4-section-role-분류)
5. [Design Context](#5-design-context)
6. [Compatibility Rules](#6-compatibility-rules)
7. [Validation](#7-validation)
8. [Renderer Implementation](#8-renderer-implementation)
9. [Examples](#9-examples)
10. [Type Definitions](#10-type-definitions)

---

## 1. Introduction

### 1.1 Problem Statement

웹/앱 UI에서 같은 컴포넌트도 **위치에 따라 다르게 표현**되어야 합니다:

```
같은 <Block role="Card">라도:

┌─────────────────────────────────────────────────────────────┐
│ Main                                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Card: 넓은 패딩, 그림자, 여유로운 타이포그래피              │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐
│ Sidebar      │
│ ┌──────────┐ │
│ │ Card:    │ │  좁은 패딩, 그림자 없음, 텍스트 축약
│ │ compact  │ │
│ └──────────┘ │
└──────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
│ [Card] [Card] [Card] ← 인라인, 최소 높이, 아이콘만            │
└─────────────────────────────────────────────────────────────┘
```

기존 접근 방식은 개발자가 직접 props로 변형을 지정하거나 CSS로 컨텍스트를 감지해야 했습니다. IDDL은 이를 **Section이 자동으로 제공하는 Design Context**로 해결합니다.

### 1.2 Design Goals

1. **컨텍스트 자동 전달**: Section이 하위 Block/Element에 디자인 힌트 제공
2. **수렴진화 패턴 표준화**: 실제 앱들에서 반복되는 레이아웃 패턴 정의
3. **호환성 검증**: Section에 부적합한 콘텐츠를 빌드 타임에 검출
4. **렌더러 자율성 유지**: 힌트만 제공, 최종 결정은 렌더러의 몫

### 1.3 Scope

이 문서에서 다루는 것:
- Section Role의 정의와 분류
- 각 Section이 제공하는 Design Context
- Section × Block/Element 호환성 규칙
- Validation 규칙

이 문서에서 다루지 않는 것:
- Section의 시각적 스타일링 (렌더러 책임)
- 레이아웃 배치 알고리즘 (렌더러 책임)
- 반응형 브레이크포인트 (Part 2 예정)

---

## 2. Conformance

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC 2119].

A conforming IDDL document:
1. MUST use only defined Section Roles
2. MUST NOT place forbidden Block/Element combinations in Sections
3. SHOULD respect Design Context constraints

A conforming IDDL Renderer:
1. MUST provide Design Context to descendant components
2. MUST apply appropriate ARIA landmarks
3. SHOULD adapt Block rendering based on Section context
4. MAY override Design Context defaults with explicit props

A conforming IDDL Validator:
1. MUST detect forbidden Block/Element combinations
2. SHOULD warn about discouraged patterns
3. MAY provide auto-fix suggestions

---

## 3. Section의 역할

### 3.1 계층 구조에서의 위치

```
Page
  └─ Section (← 이 문서의 범위)
       └─ Block
            └─ Element
```

Section은 Page의 직접 자식이며, Block의 부모입니다.

### 3.2 Section이 제공하는 것

| 제공 항목 | 설명 |
|----------|------|
| **Design Context** | 하위 요소의 기본 밀도, 방향, 제약 조건 |
| **ARIA Landmark** | 접근성을 위한 역할 정보 |
| **레이아웃 힌트** | 방향, 스크롤, 크기 제약 |
| **호환성 규칙** | 허용/금지되는 Block/Element |

### 3.3 핵심 원칙

**Section은 "이 안의 것들은 이런 맥락이다"를 선언합니다.**

```tsx
// Section이 컨텍스트를 제공하므로
<Section role="Sidebar">
  <Block role="Card">  {/* 자동으로 compact하게 렌더링 */}
    <Text role="Title">Settings</Text>
  </Block>
</Section>

// 개발자가 일일이 지정할 필요 없음
// ❌ <Block role="Card" density="compact" maxWidth={280} truncate>
```

---

## 4. Section Role 분류

### 4.1 분류 체계

Section Role은 **용도와 레이아웃 특성**에 따라 5개 카테고리로 분류됩니다.

```
Section Roles
├── Bar (수평, 고정 높이)
│   ├── Header
│   ├── Footer
│   ├── Toolbar
│   ├── Statusbar
│   └── Tabbar
├── Panel (분할 영역)
│   ├── Sidebar
│   ├── Aside
│   ├── Panel
│   └── Rail
├── Main (주요 콘텐츠)
│   ├── Main
│   ├── Canvas
│   └── Content
├── Overlay (부유 레이어)
│   ├── Modal
│   ├── Drawer
│   ├── Sheet
│   ├── Popover
│   └── Toast
└── Landmark (ARIA 호환)
    ├── Navigation
    ├── Search
    └── Region
```

### 4.2 Bar 카테고리

수평 방향, 고정 높이의 영역입니다.

#### 4.2.1 Header

페이지/앱의 최상단 영역.

| 속성 | 값 |
|------|-----|
| ARIA Role | `banner` |
| 방향 | horizontal |
| 크기 | 고정 높이 |
| 대표 콘텐츠 | 로고, 네비게이션, 사용자 메뉴 |

```tsx
<Section role="Header">
  <Block role="Toolbar">
    <Image src="logo.svg" alt="Logo" />
    <Block role="Navigation">
      <Action>Home</Action>
      <Action>Products</Action>
    </Block>
    <Action icon="user" prominence="Subtle" />
  </Block>
</Section>
```

#### 4.2.2 Footer

페이지/앱의 최하단 영역.

| 속성 | 값 |
|------|-----|
| ARIA Role | `contentinfo` |
| 방향 | horizontal |
| 크기 | 고정 높이 |
| 대표 콘텐츠 | 링크, 저작권, 상태 정보 |

#### 4.2.3 Toolbar

컨텍스트별 도구 모음.

| 속성 | 값 |
|------|-----|
| ARIA Role | `toolbar` |
| 방향 | horizontal |
| 크기 | 고정 높이 |
| 대표 콘텐츠 | 아이콘 버튼, 드롭다운 |

#### 4.2.4 Statusbar

상태 정보 표시 영역.

| 속성 | 값 |
|------|-----|
| ARIA Role | `status` |
| 방향 | horizontal |
| 크기 | 고정 높이 (작음) |
| 대표 콘텐츠 | 텍스트, 아이콘, 진행 상태 |

#### 4.2.5 Tabbar

모바일 하단 탭 네비게이션.

| 속성 | 값 |
|------|-----|
| ARIA Role | `navigation` |
| 방향 | horizontal |
| 크기 | 고정 높이 |
| 대표 콘텐츠 | 탭 아이콘, 라벨 |

### 4.3 Panel 카테고리

화면을 분할하는 영역입니다.

#### 4.3.1 Sidebar

측면 고정 네비게이션/정보 패널.

| 속성 | 값 |
|------|-----|
| ARIA Role | `complementary` |
| 방향 | vertical |
| 크기 | 좁은 고정/가변 폭 |
| 대표 콘텐츠 | 네비게이션, 트리뷰, 리스트 |

```tsx
<Section role="Sidebar">
  <Block role="Navigation">
    <Action icon="home">Dashboard</Action>
    <Action icon="folder">Projects</Action>
    <Action icon="settings">Settings</Action>
  </Block>
</Section>
```

#### 4.3.2 Aside

보조 정보 패널 (우측 등).

| 속성 | 값 |
|------|-----|
| ARIA Role | `complementary` |
| 방향 | vertical |
| 크기 | 좁음~중간 폭 |
| 대표 콘텐츠 | 상세 정보, 속성 패널 |

#### 4.3.3 Panel

리사이즈 가능한 분할 패널.

| 속성 | 값 |
|------|-----|
| ARIA Role | `region` |
| 방향 | vertical 또는 horizontal |
| 크기 | 리사이즈 가능 |
| 대표 콘텐츠 | 터미널, 출력 패널, 미리보기 |

#### 4.3.4 Rail

아이콘 전용 네비게이션 레일.

| 속성 | 값 |
|------|-----|
| ARIA Role | `navigation` |
| 방향 | vertical |
| 크기 | 매우 좁은 고정 폭 (48-72px) |
| 대표 콘텐츠 | 아이콘 버튼만 |

```tsx
<Section role="Rail">
  <Action icon="home" label="Home" />      {/* label은 tooltip으로 */}
  <Action icon="search" label="Search" />
  <Action icon="settings" label="Settings" />
</Section>
```

### 4.4 Main 카테고리

주요 콘텐츠 영역입니다.

#### 4.4.1 Main

주요 콘텐츠 영역 (가장 일반적).

| 속성 | 값 |
|------|-----|
| ARIA Role | `main` |
| 방향 | vertical |
| 크기 | 유연 (남은 공간) |
| 대표 콘텐츠 | 모든 종류 |

```tsx
<Section role="Main">
  <Block role="Card" prominence="Hero">
    <Text role="Title">Welcome</Text>
  </Block>
  <Block role="DataTable">
    {/* ... */}
  </Block>
</Section>
```

#### 4.4.2 Canvas

자유 배치 영역 (디자인 도구, 화이트보드 등).

| 속성 | 값 |
|------|-----|
| ARIA Role | `application` |
| 방향 | none (자유 배치) |
| 크기 | 무한 (패닝 가능) |
| 대표 콘텐츠 | 자유 배치 노드 |

#### 4.4.3 Content

문서형 콘텐츠 영역 (읽기 최적화).

| 속성 | 값 |
|------|-----|
| ARIA Role | `article` 또는 `main` |
| 방향 | vertical |
| 크기 | 읽기 적합 최대 폭 (65ch 권장) |
| 대표 콘텐츠 | 문서, 기사, 블로그 |

### 4.5 Overlay 카테고리

기본 레이어 위에 부유하는 영역입니다.

#### 4.5.1 Modal

중앙 모달 다이얼로그.

| 속성 | 값 |
|------|-----|
| ARIA Role | `dialog` |
| 레이어 | modal |
| 크기 | 중간 (콘텐츠 기반) |
| 포커스 | trap |

```tsx
<Section role="Modal" name="Confirm Delete">
  <Block role="Card">
    <Text role="Heading">Delete this item?</Text>
    <Text role="Body">This action cannot be undone.</Text>
    <Block role="Toolbar">
      <Action prominence="Subtle">Cancel</Action>
      <Action intent="Critical">Delete</Action>
    </Block>
  </Block>
</Section>
```

#### 4.5.2 Drawer

측면에서 슬라이드되는 패널.

| 속성 | 값 |
|------|-----|
| ARIA Role | `dialog` 또는 `complementary` |
| 레이어 | overlay |
| 크기 | 좁음~중간 |
| 포커스 | trap |

#### 4.5.3 Sheet

모바일 바텀 시트.

| 속성 | 값 |
|------|-----|
| ARIA Role | `dialog` |
| 레이어 | overlay |
| 크기 | 가변 높이 |
| 포커스 | trap |

#### 4.5.4 Popover

요소에 앵커된 팝업.

| 속성 | 값 |
|------|-----|
| ARIA Role | `dialog` 또는 없음 |
| 레이어 | popover |
| 크기 | 콘텐츠 기반 |
| 포커스 | 선택적 |

#### 4.5.5 Toast

알림 메시지 영역.

| 속성 | 값 |
|------|-----|
| ARIA Role | `status` 또는 `alert` |
| 레이어 | toast |
| 크기 | 콘텐츠 기반 |
| 포커스 | 없음 |

### 4.6 Landmark 카테고리

ARIA 랜드마크와 직접 매핑되는 역할입니다.

#### 4.6.1 Navigation

네비게이션 영역.

| 속성 | 값 |
|------|-----|
| ARIA Role | `navigation` |
| 사용 | 주요 네비게이션 그룹 |

#### 4.6.2 Search

검색 영역.

| 속성 | 값 |
|------|-----|
| ARIA Role | `search` |
| 사용 | 검색 폼과 결과 |

#### 4.6.3 Region

명명된 일반 영역.

| 속성 | 값 |
|------|-----|
| ARIA Role | `region` |
| 사용 | 기타 명명된 영역 (name 필수) |

---

## 5. Design Context

### 5.1 정의

Design Context는 Section이 하위 요소에 제공하는 **렌더링 힌트**입니다.

```ts
interface SectionDesignContext {
  // === 레이아웃 ===
  /** 주 방향 */
  direction: 'horizontal' | 'vertical' | 'none';
  
  /** 크기 특성 */
  sizeMode: 'fixed' | 'narrow' | 'medium' | 'wide' | 'flexible' | 'readable';
  
  /** 스크롤 축 */
  scrollAxis: 'x' | 'y' | 'both' | 'none';
  
  // === 밀도 ===
  /** 기본 밀도 */
  defaultDensity: 'compact' | 'standard' | 'comfortable';
  
  // === 제약 조건 ===
  /** Hero prominence 허용 여부 */
  allowHero: boolean;
  
  /** Block 중첩 최대 깊이 */
  maxDepth: number;
  
  // === 콘텐츠 힌트 ===
  /** 아이콘 우선 모드 */
  preferIconOnly: boolean;
  
  /** 텍스트 축약 권장 */
  truncateText: boolean;
  
  /** 아이콘에 툴팁 필수 */
  tooltipRequired: boolean;
  
  // === 레이어 ===
  /** 레이어 레벨 */
  layer: 'base' | 'overlay' | 'modal' | 'popover' | 'toast';
  
  // === 동작 ===
  /** 접기 가능 */
  collapsible: boolean;
  
  /** 리사이즈 가능 */
  resizable: boolean;
  
  /** 포커스 트랩 */
  focusTrap: boolean;
}
```

### 5.2 각 Section Role의 Design Context

#### 5.2.1 Bar 카테고리

| Property | Header | Footer | Toolbar | Statusbar | Tabbar |
|----------|--------|--------|---------|-----------|--------|
| direction | horizontal | horizontal | horizontal | horizontal | horizontal |
| sizeMode | fixed | fixed | fixed | fixed | fixed |
| scrollAxis | none | none | none | none | none |
| defaultDensity | compact | compact | compact | compact | compact |
| allowHero | false | false | false | false | false |
| maxDepth | 2 | 2 | 1 | 1 | 1 |
| preferIconOnly | true | false | true | false | true |
| truncateText | true | true | true | true | true |
| tooltipRequired | true | false | true | false | true |
| layer | base | base | base | base | base |
| collapsible | false | false | false | false | false |
| resizable | false | false | false | false | false |
| focusTrap | false | false | false | false | false |

#### 5.2.2 Panel 카테고리

| Property | Sidebar | Aside | Panel | Rail |
|----------|---------|-------|-------|------|
| direction | vertical | vertical | vertical | vertical |
| sizeMode | narrow | medium | medium | fixed |
| scrollAxis | y | y | y | y |
| defaultDensity | compact | standard | standard | compact |
| allowHero | false | false | false | false |
| maxDepth | 3 | 4 | 4 | 1 |
| preferIconOnly | false | false | false | true |
| truncateText | true | false | false | true |
| tooltipRequired | false | false | false | true |
| layer | base | base | base | base |
| collapsible | true | true | true | false |
| resizable | false | true | true | false |
| focusTrap | false | false | false | false |

#### 5.2.3 Main 카테고리

| Property | Main | Canvas | Content |
|----------|------|--------|---------|
| direction | vertical | none | vertical |
| sizeMode | flexible | flexible | readable |
| scrollAxis | y | both | y |
| defaultDensity | comfortable | comfortable | comfortable |
| allowHero | true | true | true |
| maxDepth | unlimited | unlimited | unlimited |
| preferIconOnly | false | false | false |
| truncateText | false | false | false |
| tooltipRequired | false | false | false |
| layer | base | base | base |
| collapsible | false | false | false |
| resizable | false | false | false |
| focusTrap | false | false | false |

#### 5.2.4 Overlay 카테고리

| Property | Modal | Drawer | Sheet | Popover | Toast |
|----------|-------|--------|-------|---------|-------|
| direction | vertical | vertical | vertical | vertical | vertical |
| sizeMode | medium | narrow | flexible | auto | auto |
| scrollAxis | y | y | y | none | none |
| defaultDensity | comfortable | standard | standard | compact | compact |
| allowHero | true | false | false | false | false |
| maxDepth | 4 | 3 | 3 | 2 | 1 |
| preferIconOnly | false | false | false | false | false |
| truncateText | false | true | false | false | true |
| tooltipRequired | false | false | false | false | false |
| layer | modal | overlay | overlay | popover | toast |
| collapsible | false | false | false | false | false |
| resizable | false | false | true | false | false |
| focusTrap | true | true | true | false | false |

#### 5.2.5 Landmark 카테고리

| Property | Navigation | Search | Region |
|----------|------------|--------|--------|
| direction | horizontal | vertical | vertical |
| sizeMode | auto | medium | flexible |
| scrollAxis | none | y | y |
| defaultDensity | compact | standard | standard |
| allowHero | false | false | false |
| maxDepth | 2 | 3 | 4 |
| preferIconOnly | false | false | false |
| truncateText | true | false | false |
| tooltipRequired | false | false | false |
| layer | base | base | base |
| collapsible | false | false | false |
| resizable | false | false | false |
| focusTrap | false | false | false |

### 5.3 Context 상속과 Override

Design Context는 **상속되지 않습니다**. 각 Section이 독립적으로 Context를 제공합니다.

그러나 **명시적 props는 Context를 override**할 수 있습니다:

```tsx
// Sidebar의 기본 density는 compact
<Section role="Sidebar">
  <Block role="Card">  {/* density: compact 적용 */}
  
  {/* 명시적 override */}
  <Block role="Card" density="comfortable">  {/* density: comfortable 적용 */}
</Section>
```

Override 규칙:
- 명시적 `density` prop → Context의 `defaultDensity` override
- 명시적 `prominence` prop → Context의 `allowHero` 제약 무시 (경고 발생 가능)

---

## 6. Compatibility Rules

### 6.1 Block 카테고리 분류

```ts
type BlockCategory =
  | 'navigation'  // Toolbar, Breadcrumbs, Tabs, Pagination, Navigation
  | 'layout'      // Card, Stack, GridLayout, Row, Group, ScrollArea
  | 'data'        // List, DataTable, TreeView
  | 'form'        // Form, FieldGroup, FilterBar
  | 'content'     // EmptyState
  | 'feedback';   // Toast (Block으로 사용 시)
```

### 6.2 호환성 매트릭스

#### 6.2.1 Bar 카테고리

| Section | navigation | layout | data | form | content | feedback |
|---------|:----------:|:------:|:----:|:----:|:-------:|:--------:|
| Header | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Footer | ✅ | ⚠️ | ❌ | ❌ | ❌ | ✅ |
| Toolbar | ✅ | ❌ | ❌ | ⚠️ | ❌ | ❌ |
| Statusbar | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Tabbar | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

**범례**: ✅ 허용 | ⚠️ 제한적 허용 | ❌ 금지

#### 6.2.2 Panel 카테고리

| Section | navigation | layout | data | form | content | feedback |
|---------|:----------:|:------:|:----:|:----:|:-------:|:--------:|
| Sidebar | ✅ | ✅ | ⚠️ | ⚠️ | ❌ | ✅ |
| Aside | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Panel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Rail | ⚠️ | ❌ | ❌ | ❌ | ❌ | ❌ |

#### 6.2.3 Main 카테고리

| Section | navigation | layout | data | form | content | feedback |
|---------|:----------:|:------:|:----:|:----:|:-------:|:--------:|
| Main | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Canvas | ❌ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| Content | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

#### 6.2.4 Overlay 카테고리

| Section | navigation | layout | data | form | content | feedback |
|---------|:----------:|:------:|:----:|:----:|:-------:|:--------:|
| Modal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Drawer | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ |
| Sheet | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Popover | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ❌ |
| Toast | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 6.3 세부 규칙

#### 6.3.1 Header Rules

```ts
const HeaderRules: SectionRules = {
  allowed: {
    blocks: ['Toolbar', 'Breadcrumbs', 'Tabs', 'Navigation', 'Group', 'Row'],
    elements: ['Text:Title', 'Text:Label', 'Action', 'Image'],
  },
  forbidden: {
    blocks: ['Form', 'DataTable', 'TreeView', 'Card', 'EmptyState'],
    elements: ['Field:TextArea', 'Video'],
    prominences: ['Hero'],
  },
  constraints: {
    maxDepth: 2,
    maxActions: 5,
  },
};
```

#### 6.3.2 Sidebar Rules

```ts
const SidebarRules: SectionRules = {
  allowed: {
    blocks: ['List', 'TreeView', 'Card', 'Stack', 'Group', 'Navigation'],
    elements: ['Text', 'Action', 'Image', 'Field:SearchInput', 'Separator'],
  },
  forbidden: {
    blocks: ['DataTable', 'GridLayout'],
    prominences: ['Hero'],
  },
  restricted: {
    // List만 허용, DataTable 금지
    'data': ['List', 'TreeView'],
    // 간단한 폼만 허용
    'form': ['FilterBar'],
  },
  constraints: {
    maxDepth: 3,
    maxWidth: 320,  // 힌트
  },
};
```

#### 6.3.3 Toolbar Rules

```ts
const ToolbarRules: SectionRules = {
  allowed: {
    blocks: ['Group', 'Row'],
    elements: ['Action', 'Field:Select', 'Field:SearchInput', 'Separator'],
  },
  forbidden: {
    blocks: ['Card', 'List', 'Form', 'DataTable', 'TreeView'],
    elements: ['Text:Body', 'Text:Heading', 'Field:TextArea', 'Image', 'Video'],
  },
  constraints: {
    maxDepth: 1,
    direction: 'horizontal',
    iconOnly: true,
    tooltipRequired: true,
  },
};
```

#### 6.3.4 Rail Rules

```ts
const RailRules: SectionRules = {
  allowed: {
    blocks: ['Stack', 'Group'],
    elements: ['Action', 'Separator', 'Image:Avatar'],
  },
  forbidden: {
    blocks: ['*'],  // Stack, Group 외 모든 Block
    elements: ['Text', 'Field', 'Video'],
  },
  constraints: {
    maxDepth: 1,
    iconOnly: true,
    tooltipRequired: true,
    fixedWidth: 64,
  },
};
```

#### 6.3.5 Toast Rules

```ts
const ToastRules: SectionRules = {
  allowed: {
    blocks: ['Group', 'Row'],
    elements: ['Text:Body', 'Text:Caption', 'Action', 'Image:Icon'],
  },
  forbidden: {
    blocks: ['Card', 'List', 'Form', 'DataTable', 'TreeView'],
    elements: ['Field', 'Video', 'Text:Title', 'Text:Heading'],
  },
  constraints: {
    maxDepth: 1,
    maxActions: 2,
    maxTextLength: 100,
    autoDismiss: true,
  },
};
```

#### 6.3.6 Modal Rules

```ts
const ModalRules: SectionRules = {
  allowed: {
    blocks: ['*'],
    elements: ['*'],
  },
  forbidden: {
    blocks: ['Canvas'],  // 무한 영역 금지
  },
  required: {
    closeAction: true,  // 닫기 수단 필수
    name: true,         // 접근성 이름 필수
  },
  constraints: {
    maxWidth: 640,      // 기본 최대 폭 (override 가능)
    focusTrap: true,
  },
};
```

#### 6.3.7 Popover Rules

```ts
const PopoverRules: SectionRules = {
  allowed: {
    blocks: ['Menu', 'List', 'Group', 'Stack'],
    elements: ['Action', 'Text:Label', 'Text:Caption', 'Field:Select', 'Separator'],
  },
  forbidden: {
    blocks: ['DataTable', 'Form', 'Card', 'TreeView'],
    elements: ['Video', 'Image:Large'],
  },
  restricted: {
    'layout': ['Group', 'Stack'],  // 복잡한 레이아웃 금지
    'form': ['FieldGroup'],        // 간단한 입력만
  },
  constraints: {
    maxDepth: 2,
    maxItems: 10,
  },
};
```

### 6.4 Prominence 제약

| Section | Hero | Standard | Subtle | Hidden |
|---------|:----:|:--------:|:------:|:------:|
| Header | ❌ | ✅ | ✅ | ✅ |
| Footer | ❌ | ✅ | ✅ | ✅ |
| Toolbar | ❌ | ✅ | ✅ | ✅ |
| Statusbar | ❌ | ❌ | ✅ | ✅ |
| Sidebar | ❌ | ✅ | ✅ | ✅ |
| Rail | ❌ | ❌ | ✅ | ✅ |
| **Main** | ✅ | ✅ | ✅ | ✅ |
| **Content** | ✅ | ✅ | ✅ | ✅ |
| **Modal** | ✅ | ✅ | ✅ | ✅ |
| Drawer | ❌ | ✅ | ✅ | ✅ |
| Sheet | ❌ | ✅ | ✅ | ✅ |
| Popover | ❌ | ✅ | ✅ | ✅ |
| Toast | ❌ | ✅ | ✅ | ✅ |

---

## 7. Validation

### 7.1 Validation Levels

| Level | 설명 | 처리 |
|-------|------|------|
| **Error** | 규칙 위반 | 빌드 실패 또는 런타임 경고 |
| **Warning** | 권장하지 않는 패턴 | 경고 표시 |
| **Info** | 개선 제안 | 선택적 표시 |

### 7.2 Validation Rules

#### 7.2.1 Error: Forbidden Content

```ts
// ❌ Error: DataTable is not allowed in Header
<Section role="Header">
  <Block role="DataTable">...</Block>
</Section>

// ❌ Error: Form is not allowed in Toast
<Section role="Toast">
  <Block role="Form">...</Block>
</Section>

// ❌ Error: Field is not allowed in Rail
<Section role="Rail">
  <Field role="TextInput" label="Search" />
</Section>
```

#### 7.2.2 Warning: Discouraged Patterns

```ts
// ⚠️ Warning: Hero prominence not recommended in Sidebar
<Section role="Sidebar">
  <Block role="Card" prominence="Hero">...</Block>
</Section>

// ⚠️ Warning: DataTable in Drawer may cause layout issues
<Section role="Drawer">
  <Block role="DataTable">...</Block>
</Section>

// ⚠️ Warning: Complex Form in Popover - consider using Modal instead
<Section role="Popover">
  <Block role="Form">
    <Field ... />
    <Field ... />
    <Field ... />
  </Block>
</Section>
```

#### 7.2.3 Info: Suggestions

```ts
// ℹ️ Info: Action in Toolbar should have tooltip for accessibility
<Section role="Toolbar">
  <Action icon="save" />  // tooltip 없음
</Section>

// ℹ️ Info: Consider using Rail instead of Sidebar for icon-only navigation
<Section role="Sidebar">
  <Action icon="home" />
  <Action icon="search" />
  // 텍스트 없이 아이콘만 사용
</Section>
```

### 7.3 Validator Implementation

```ts
interface ValidationResult {
  valid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
  info: ValidationMessage[];
}

interface ValidationMessage {
  type: string;
  message: string;
  path: string;        // e.g., "Page > Section[Header] > Block[DataTable]"
  suggestion?: string; // 수정 제안
}

function validateSection(section: SectionNode): ValidationResult {
  const rules = SECTION_RULES[section.role];
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
    info: [],
  };

  for (const block of section.children) {
    // 1. Forbidden Block Check
    if (rules.forbidden.blocks.includes(block.role)) {
      result.valid = false;
      result.errors.push({
        type: 'forbidden-block',
        message: `${block.role} is not allowed in ${section.role}`,
        path: getPath(section, block),
        suggestion: getSuggestion(section.role, block.role),
      });
    }

    // 2. Prominence Check
    if (block.prominence && !rules.allowedProminences?.includes(block.prominence)) {
      result.warnings.push({
        type: 'discouraged-prominence',
        message: `${block.prominence} prominence not recommended in ${section.role}`,
        path: getPath(section, block),
      });
    }

    // 3. Depth Check
    const depth = getBlockDepth(block);
    if (depth > rules.constraints.maxDepth) {
      result.warnings.push({
        type: 'max-depth-exceeded',
        message: `Block depth ${depth} exceeds max ${rules.constraints.maxDepth}`,
        path: getPath(section, block),
      });
    }

    // 4. Element Check (recursive)
    validateElements(block, rules, result);
  }

  return result;
}
```

---

## 8. Renderer Implementation

### 8.1 Design Context Provider

렌더러는 Section Context를 하위 컴포넌트에 제공해야 합니다 (MUST).

```tsx
// React 예시
const SectionContext = React.createContext<SectionDesignContext | null>(null);

function SectionRenderer({ role, children, ...props }: SectionProps) {
  const context = SECTION_DESIGN_CONTEXTS[role];
  
  return (
    <SectionContext.Provider value={context}>
      <section
        {...getAriaProps(role, props)}
        className={getSectionClassName(role)}
      >
        {children}
      </section>
    </SectionContext.Provider>
  );
}

// Block에서 Context 사용
function CardRenderer({ children, density, ...props }: BlockProps) {
  const sectionContext = React.useContext(SectionContext);
  
  // 명시적 density가 없으면 Section의 defaultDensity 사용
  const effectiveDensity = density ?? sectionContext?.defaultDensity ?? 'standard';
  
  // Section의 힌트에 따른 스타일 조정
  const styles = getCardStyles({
    density: effectiveDensity,
    truncate: sectionContext?.truncateText,
    iconOnly: sectionContext?.preferIconOnly,
  });
  
  return (
    <div className={styles} {...props}>
      {children}
    </div>
  );
}
```

### 8.2 ARIA Landmark Mapping

렌더러는 Section Role을 적절한 ARIA landmark로 매핑해야 합니다 (MUST).

```ts
const ARIA_LANDMARK_MAP: Record<SectionRole, string | null> = {
  // Bar
  Header: 'banner',
  Footer: 'contentinfo',
  Toolbar: 'toolbar',
  Statusbar: 'status',
  Tabbar: 'navigation',
  
  // Panel
  Sidebar: 'complementary',
  Aside: 'complementary',
  Panel: 'region',
  Rail: 'navigation',
  
  // Main
  Main: 'main',
  Canvas: 'application',
  Content: 'article',  // or 'main'
  
  // Overlay
  Modal: 'dialog',
  Drawer: 'dialog',
  Sheet: 'dialog',
  Popover: null,  // 상황에 따라 다름
  Toast: 'status',
  
  // Landmark
  Navigation: 'navigation',
  Search: 'search',
  Region: 'region',
};

function getAriaProps(role: SectionRole, props: SectionProps) {
  const landmark = ARIA_LANDMARK_MAP[role];
  
  return {
    role: landmark,
    'aria-label': props.name,
    'aria-modal': role === 'Modal' ? true : undefined,
  };
}
```

### 8.3 Responsive Adaptation

렌더러는 Section의 Design Context를 반응형으로 조정할 수 있습니다 (MAY).

```ts
// 모바일에서 Sidebar → Sheet로 변환
function ResponsiveSidebar({ children, ...props }) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return (
      <Section role="Sheet" {...props}>
        {children}
      </Section>
    );
  }
  
  return (
    <Section role="Sidebar" {...props}>
      {children}
    </Section>
  );
}
```

---

## 9. Examples

### 9.1 전형적인 앱 레이아웃

```tsx
<Page title="Dashboard">
  {/* 상단 바 */}
  <Section role="Header">
    <Block role="Toolbar">
      <Image src="logo.svg" alt="Logo" />
      <Block role="Navigation">
        <Action>Dashboard</Action>
        <Action>Projects</Action>
        <Action>Settings</Action>
      </Block>
      <Action icon="bell" prominence="Subtle" />
      <Action icon="user" prominence="Subtle" />
    </Block>
  </Section>
  
  {/* 사이드바 */}
  <Section role="Sidebar">
    <Block role="Navigation">
      <Action icon="home">Overview</Action>
      <Action icon="folder">Projects</Action>
      <Action icon="chart">Analytics</Action>
      <Separator />
      <Action icon="settings">Settings</Action>
    </Block>
  </Section>
  
  {/* 메인 콘텐츠 */}
  <Section role="Main">
    <Block role="Card" prominence="Hero">
      <Text role="Title">Welcome back</Text>
      <Text role="Body">Here's what's happening today.</Text>
    </Block>
    
    <Block role="GridLayout" spec={{ columns: 3 }}>
      <Block role="Card">
        <Text role="Heading">Revenue</Text>
        <Text role="Title">$12,450</Text>
      </Block>
      <Block role="Card">
        <Text role="Heading">Users</Text>
        <Text role="Title">1,234</Text>
      </Block>
      <Block role="Card">
        <Text role="Heading">Orders</Text>
        <Text role="Title">567</Text>
      </Block>
    </Block>
    
    <Block role="DataTable">
      {/* ... */}
    </Block>
  </Section>
  
  {/* 상태 바 */}
  <Section role="Statusbar">
    <Text role="Caption">Last updated: 2 minutes ago</Text>
    <Text role="Caption">v1.2.3</Text>
  </Section>
</Page>
```

### 9.2 모달 다이얼로그

```tsx
<Section role="Modal" name="Delete Confirmation">
  <Block role="Card">
    <Text role="Heading">Delete Project?</Text>
    <Text role="Body">
      This will permanently delete "My Project" and all its contents.
      This action cannot be undone.
    </Text>
    
    <Block role="Toolbar">
      <Action prominence="Subtle" behavior={{ type: 'command', id: 'cancel' }}>
        Cancel
      </Action>
      <Action intent="Critical" behavior={{ type: 'command', id: 'delete' }}>
        Delete Project
      </Action>
    </Block>
  </Block>
</Section>
```

### 9.3 VSCode 스타일 레이아웃

```tsx
<Page title="Code Editor">
  {/* 타이틀 바 */}
  <Section role="Header">
    <Block role="Toolbar">
      <Image src="logo.svg" alt="VSCode" />
      <Block role="Navigation">
        <Action>File</Action>
        <Action>Edit</Action>
        <Action>View</Action>
      </Block>
      <Field role="SearchInput" placeholder="Search" />
    </Block>
  </Section>
  
  {/* 액티비티 바 (Rail) */}
  <Section role="Rail">
    <Action icon="files" label="Explorer" />
    <Action icon="search" label="Search" />
    <Action icon="git" label="Source Control" />
    <Action icon="debug" label="Debug" />
    <Action icon="extensions" label="Extensions" />
  </Section>
  
  {/* 사이드바 */}
  <Section role="Sidebar">
    <Text role="Label">EXPLORER</Text>
    <Block role="TreeView">
      {/* 파일 트리 */}
    </Block>
  </Section>
  
  {/* 에디터 영역 */}
  <Section role="Main">
    <Block role="Tabs">
      <Action role="Tab" selected>index.ts</Action>
      <Action role="Tab">App.tsx</Action>
    </Block>
    <Block role="Card">
      {/* 코드 에디터 */}
    </Block>
  </Section>
  
  {/* 패널 */}
  <Section role="Panel">
    <Block role="Tabs">
      <Action role="Tab" selected>Terminal</Action>
      <Action role="Tab">Problems</Action>
      <Action role="Tab">Output</Action>
    </Block>
    <Block role="Card">
      {/* 터미널 */}
    </Block>
  </Section>
  
  {/* 상태 바 */}
  <Section role="Statusbar">
    <Text role="Caption">main</Text>
    <Text role="Caption">UTF-8</Text>
    <Text role="Caption">TypeScript</Text>
    <Text role="Caption">Ln 42, Col 15</Text>
  </Section>
</Page>
```

### 9.4 모바일 앱 레이아웃

```tsx
<Page title="Mobile App">
  {/* 상단 바 */}
  <Section role="Header">
    <Block role="Toolbar">
      <Action icon="menu" prominence="Subtle" />
      <Text role="Title">Messages</Text>
      <Action icon="search" prominence="Subtle" />
    </Block>
  </Section>
  
  {/* 메인 콘텐츠 */}
  <Section role="Main">
    <Block role="List">
      <Action role="ListItem">
        <Image role="Avatar" src="user1.jpg" />
        <Block role="Stack">
          <Text role="Label">Alice</Text>
          <Text role="Caption">Hey, are you free tomorrow?</Text>
        </Block>
      </Action>
      {/* ... more items */}
    </Block>
  </Section>
  
  {/* 하단 탭 바 */}
  <Section role="Tabbar">
    <Action icon="chat" selected>Messages</Action>
    <Action icon="phone">Calls</Action>
    <Action icon="contacts">Contacts</Action>
    <Action icon="settings">Settings</Action>
  </Section>
</Page>
```

---

## 10. Type Definitions

### 10.1 Section Role Types

```ts
/**
 * Section Role - 모든 허용된 Section 역할
 */
export type SectionRole =
  // Bar (수평, 고정 높이)
  | 'Header'
  | 'Footer'
  | 'Toolbar'
  | 'Statusbar'
  | 'Tabbar'
  // Panel (분할 영역)
  | 'Sidebar'
  | 'Aside'
  | 'Panel'
  | 'Rail'
  // Main (주요 콘텐츠)
  | 'Main'
  | 'Canvas'
  | 'Content'
  // Overlay (부유 레이어)
  | 'Modal'
  | 'Drawer'
  | 'Sheet'
  | 'Popover'
  | 'Toast'
  // Landmark (ARIA 호환)
  | 'Navigation'
  | 'Search'
  | 'Region';

/**
 * Section Role 카테고리
 */
export type SectionCategory = 'bar' | 'panel' | 'main' | 'overlay' | 'landmark';

/**
 * Section Role을 카테고리로 분류
 */
export const SECTION_CATEGORIES: Record<SectionRole, SectionCategory> = {
  Header: 'bar',
  Footer: 'bar',
  Toolbar: 'bar',
  Statusbar: 'bar',
  Tabbar: 'bar',
  Sidebar: 'panel',
  Aside: 'panel',
  Panel: 'panel',
  Rail: 'panel',
  Main: 'main',
  Canvas: 'main',
  Content: 'main',
  Modal: 'overlay',
  Drawer: 'overlay',
  Sheet: 'overlay',
  Popover: 'overlay',
  Toast: 'overlay',
  Navigation: 'landmark',
  Search: 'landmark',
  Region: 'landmark',
};
```

### 10.2 Design Context Types

```ts
/**
 * Section이 제공하는 Design Context
 */
export interface SectionDesignContext {
  /** Section Role */
  role: SectionRole;
  
  // === 레이아웃 ===
  /** 주 방향 */
  direction: 'horizontal' | 'vertical' | 'none';
  
  /** 크기 모드 */
  sizeMode: 'fixed' | 'narrow' | 'medium' | 'wide' | 'flexible' | 'readable' | 'auto';
  
  /** 스크롤 축 */
  scrollAxis: 'x' | 'y' | 'both' | 'none';
  
  // === 밀도 ===
  /** 기본 밀도 */
  defaultDensity: Density;
  
  // === 제약 조건 ===
  /** Hero prominence 허용 여부 */
  allowHero: boolean;
  
  /** Block 중첩 최대 깊이 (0 = unlimited) */
  maxDepth: number;
  
  // === 콘텐츠 힌트 ===
  /** 아이콘 우선 모드 */
  preferIconOnly: boolean;
  
  /** 텍스트 축약 권장 */
  truncateText: boolean;
  
  /** 아이콘에 툴팁 필수 */
  tooltipRequired: boolean;
  
  // === 레이어 ===
  /** 레이어 레벨 */
  layer: 'base' | 'overlay' | 'modal' | 'popover' | 'toast';
  
  // === 동작 ===
  /** 접기 가능 */
  collapsible: boolean;
  
  /** 리사이즈 가능 */
  resizable: boolean;
  
  /** 포커스 트랩 */
  focusTrap: boolean;
}
```

### 10.3 Section Rules Types

```ts
/**
 * Block 카테고리
 */
export type BlockCategory =
  | 'navigation'
  | 'layout'
  | 'data'
  | 'form'
  | 'content'
  | 'feedback';

/**
 * Element 패턴 (Element 또는 Element:Role 형태)
 */
export type ElementPattern =
  | 'Text' | `Text:${TextRole}`
  | 'Action' | 'Action:IconOnly'
  | 'Field' | `Field:${FieldRole}`
  | 'Image' | `Image:${string}`
  | 'Separator'
  | 'Video';

/**
 * Section 호환성 규칙
 */
export interface SectionRules {
  /** 허용되는 콘텐츠 */
  allowed: {
    blocks: BlockRole[] | '*';
    elements: ElementPattern[] | '*';
  };
  
  /** 금지되는 콘텐츠 */
  forbidden: {
    blocks: BlockRole[];
    elements: ElementPattern[];
    prominences?: Prominence[];
  };
  
  /** 제한적으로 허용되는 콘텐츠 (카테고리별) */
  restricted?: Partial<Record<BlockCategory, BlockRole[]>>;
  
  /** 필수 요소 */
  required?: {
    closeAction?: boolean;
    name?: boolean;
  };
  
  /** 제약 조건 */
  constraints: {
    maxDepth: number;
    maxActions?: number;
    maxItems?: number;
    maxTextLength?: number;
    direction?: 'horizontal' | 'vertical';
    iconOnly?: boolean;
    tooltipRequired?: boolean;
    autoDismiss?: boolean;
    focusTrap?: boolean;
    maxWidth?: number;
    fixedWidth?: number;
  };
}

/**
 * 모든 Section Role의 규칙
 */
export const SECTION_RULES: Record<SectionRole, SectionRules>;
```

### 10.4 Section Props Types

```ts
/**
 * Section 컴포넌트 Props
 */
export interface SectionProps extends BaseProps {
  /** Section 역할 (필수) */
  role: SectionRole;
  
  /** 접근성 이름 (Region, Modal 등에서 필수) */
  name?: string;
  
  /** 초기 열림 상태 (collapsible Section용) */
  defaultOpen?: boolean;
  
  /** 열림 상태 (제어 모드) */
  open?: boolean;
  
  /** 열림 상태 변경 콜백 */
  onOpenChange?: (open: boolean) => void;
  
  /** 자식 요소 */
  children: React.ReactNode;
}
```

---

## Appendix A: ARIA Landmark Reference

| Section Role | ARIA Role | Notes |
|--------------|-----------|-------|
| Header | `banner` | 페이지당 1개 권장 |
| Footer | `contentinfo` | 페이지당 1개 권장 |
| Toolbar | `toolbar` | `aria-label` 권장 |
| Statusbar | `status` | live region |
| Tabbar | `navigation` | `aria-label` 권장 |
| Sidebar | `complementary` | `aria-label` 권장 |
| Aside | `complementary` | `aria-label` 권장 |
| Panel | `region` | `aria-label` 필수 |
| Rail | `navigation` | `aria-label` 권장 |
| Main | `main` | 페이지당 1개 권장 |
| Canvas | `application` | 키보드 처리 직접 구현 필요 |
| Content | `article` 또는 `main` | 문맥에 따라 선택 |
| Modal | `dialog` | `aria-modal="true"` |
| Drawer | `dialog` | `aria-modal="true"` |
| Sheet | `dialog` | `aria-modal="true"` |
| Popover | `dialog` 또는 없음 | 상황에 따라 |
| Toast | `status` 또는 `alert` | live region |
| Navigation | `navigation` | - |
| Search | `search` | - |
| Region | `region` | `aria-label` 필수 |

---

## Appendix B: Migration from HTML/CSS

### B.1 Traditional Approach

```html
<!-- HTML + CSS 방식 -->
<header class="app-header">
  <nav class="header-nav">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>

<aside class="sidebar sidebar--compact">
  <nav class="sidebar-nav">
    <a href="/dashboard" class="nav-item nav-item--active">
      <svg>...</svg>
      <span>Dashboard</span>
    </a>
  </nav>
</aside>

<main class="main-content">
  <div class="card card--hero">
    <h1>Welcome</h1>
  </div>
</main>

<style>
.sidebar--compact .card {
  padding: 8px;
}
.main-content .card {
  padding: 24px;
}
.card--hero {
  /* Hero 스타일 */
}
</style>
```

### B.2 IDDL Approach

```tsx
// IDDL 방식 - Section이 컨텍스트 제공
<Page>
  <Section role="Header">
    <Block role="Navigation">
      <Action>Home</Action>
      <Action>About</Action>
    </Block>
  </Section>

  <Section role="Sidebar">
    <Block role="Navigation">
      <Action icon="dashboard" selected>Dashboard</Action>
      {/* 자동으로 compact 스타일 적용 */}
    </Block>
  </Section>

  <Section role="Main">
    <Block role="Card" prominence="Hero">
      <Text role="Title">Welcome</Text>
      {/* 자동으로 comfortable 스타일 + Hero 처리 */}
    </Block>
  </Section>
</Page>
```

---

## Appendix C: Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-11 | Draft 0.1 | Initial draft |

---

*End of Document*
