# IDDL Section Type Specification

**Draft Community Group Report, 11 January 2026**

---

## Abstract

이 문서는 IDDL Section의 **Type** 속성을 정의합니다. Type은 Section의 **물리적 형태와 디자인 제약**을 나타내며, Role(의미적 역할)과 분리된 개념입니다.

IDDL의 적응형 디자인 시스템에서 Type은 핵심 역할을 합니다. 동일한 Element라도 어떤 Type의 Section에 위치하느냐에 따라 **다른 스케일과 형태로 렌더링**됩니다.

---

## Status of This Document

This document is a **Working Draft**.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Role vs Type](#2-role-vs-type)
3. [Section Types](#3-section-types)
4. [Type Scale System](#4-type-scale-system)
5. [Page Template Integration](#5-page-template-integration)
6. [Contextual Rendering](#6-contextual-rendering)
7. [Renderer Requirements](#7-renderer-requirements)
8. [Examples](#8-examples)

---

## 1. Introduction

### 1.1 Problem Statement

기존 디자인 시스템에서 `prominence="Hero"`는 절대적인 값(예: 48px)을 의미했습니다. 그러나 실제 UI에서는:

```tsx
// Main 영역의 Hero → 48px가 적절
<Section role="Main">
  <Text role="Heading" prominence="Hero">대시보드</Text>
</Section>

// Sidebar의 Hero → 48px는 너무 큼, 18px가 적절
<Section role="Sidebar">
  <Text role="Heading" prominence="Hero">필터</Text>
</Section>
```

**Prominence는 절대값이 아니라 "이 컨텍스트 안에서의 상대적 위계"**를 의미해야 합니다.

### 1.2 Solution: Section Type

Section Type은 **물리적 형태에서 오는 디자인 제약**을 정의합니다.

- Header가 compact한 이유는 "Header라서"가 아니라 **"가로로 길고 세로가 좁아서"**
- Sidebar가 작은 이유는 "Sidebar라서"가 아니라 **"세로로 길고 가로가 좁아서"**

Type은 6개로 고정되어 디자인 시스템의 복잡도를 통제합니다.

### 1.3 Design Goals

1. **Predictable**: 6개 Type으로 모든 레이아웃 패턴 커버
2. **Adaptive**: 같은 Element가 Type에 따라 다르게 렌더링
3. **Scalable**: Role은 확장 가능, Type은 고정 (조합 폭발 방지)
4. **Flexible**: Page Template이 Role → Type 매핑을 결정

---

## 2. Role vs Type

### 2.1 정의

| 개념 | 질문 | 성격 | 확장성 |
|------|------|------|--------|
| **Role** | "이 영역은 무슨 역할인가?" | 의미적 (Semantic) | 확장 가능 |
| **Type** | "이 영역은 어떤 형태인가?" | 물리적 (Physical) | 6개 고정 |

### 2.2 분리의 필요성

같은 Role이 다른 Type으로 렌더링될 수 있습니다:

```tsx
// Desktop: Navigation이 Rail (왼쪽 세로 아이콘 메뉴)
<Page template="Desktop">
  <Section role="Navigation" />  // → Rail type
</Page>

// Mobile: Navigation이 Bar (하단 가로 탭)
<Page template="Mobile">
  <Section role="Navigation" />  // → Bar type
</Page>
```

### 2.3 Role → Type 기본 매핑

Renderer는 기본 매핑을 제공해야 합니다 (SHOULD):

| Role | Default Type | 비고 |
|------|--------------|------|
| `Header` | Bar | |
| `Footer` | Bar | |
| `Navigation` | Rail | Template에 따라 Bar 가능 |
| `Sidebar` | Panel | Rail일 수도 있음 |
| `Main` | Stage | |
| `Region` | Stage | |
| `Modal` | Layer | |
| `Drawer` | Layer | Template에 따라 Panel 가능 |
| `Search` | Bar | 전체화면일 때 Layer |

### 2.4 Type Override

명시적 type 지정이 기본 매핑보다 우선합니다:

```tsx
// 기본: Navigation → Rail
<Section role="Navigation" />

// Override: Navigation을 Bar로 강제
<Section role="Navigation" type="Bar" />
```

---

## 3. Section Types

### 3.1 Type Overview

| Type | 차원성 | 방향 | 핵심 제약 |
|------|--------|------|----------|
| **Bar** | 선 (Line) | 가로 | 높이 제한 |
| **Rail** | 선 (Line) | 세로 | 너비 극히 제한 |
| **Panel** | 면 (Surface) | 세로 우세 | 너비 적당히 제한 |
| **Stage** | 면 (Surface) | 자유 | 제한 없음 |
| **Layer** | 면 (Surface) | 떠있음 | 크기 제한 + 고립 |
| **Float** | 점 (Point) | 떠있음 | 최소 크기 |

### 3.2 Visual Overview

```
Bar    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   가로로 긴 "선"

Rail   ┃                                      세로로 좁은 "선"
       ┃
       ┃

Panel  ┌─────────┐                            세로로 긴 "면"
       │         │
       │         │
       └─────────┘

Stage  ┌───────────────────────────────┐      자유로운 "면"
       │                               │
       │                               │
       │                               │
       └───────────────────────────────┘

Layer        ┌─────────────┐                  위에 뜬 "면"
             │             │
             │             │
             └─────────────┘

Float              ┌───┐                      작게 뜬 "점"
                   └───┘
```

---

### 3.3 Bar

**정의**: 가로로 길고 세로가 짧은 선형(Line) 영역

**물리적 특성**:
- 높이: 48-64px (고정)
- 너비: 전체 너비 (100%)
- 방향: 가로

**디자인 제약**:
- 수평 레이아웃 (flex-row)
- 아이콘 중심, 텍스트 최소화
- 단일 행만 허용
- 스크롤 없음

**일반적 용도**:
- Header
- Footer
- Top Navigation
- Bottom Tab Bar
- Search Bar

**시각적 예시**:
```
┌────────────────────────────────────────────────────────────┐
│  ☰   Logo        [  Search...  ]        🔔  👤  [Action]  │  48-64px
└────────────────────────────────────────────────────────────┘
```

---

### 3.4 Rail

**정의**: 세로로 길고 가로가 극히 좁은 선형(Line) 영역

**물리적 특성**:
- 너비: 48-64px (collapsed), 160-200px (expanded)
- 높이: 전체 높이 (100%)
- 방향: 세로
- 접힘 상태 지원

**디자인 제약**:
- 수직 레이아웃 (flex-col)
- 아이콘 필수, 텍스트 선택적
- 단일 열만 허용
- 스크롤 가능 (세로)

**일반적 용도**:
- Icon Navigation
- Activity Bar (VSCode)
- Tool Palette

**시각적 예시**:
```
┌──────┐     ┌──────────────┐
│  ☰   │     │  ☰  Menu     │
├──────┤     ├──────────────┤
│  🏠  │     │  🏠  Home    │
│  📁  │     │  📁  Files   │
│  🔍  │     │  🔍  Search  │
│  ⚙️  │     │  ⚙️  Settings │
│      │     │              │
│      │     │              │
├──────┤     ├──────────────┤
│  👤  │     │  👤  Profile │
└──────┘     └──────────────┘
 collapsed      expanded
 (64px)         (200px)
```

---

### 3.5 Panel

**정의**: 세로로 길고 가로가 적당히 넓은 면형(Surface) 영역

**물리적 특성**:
- 너비: 240-400px
- 높이: 전체 높이 또는 콘텐츠에 맞춤
- 방향: 세로 우세

**디자인 제약**:
- 수직 스택 기본, 다중 열 가능
- 폼, 필드, 레이블 수용 가능
- 문장, 설명 텍스트 가능
- 스크롤 가능 (세로)

**일반적 용도**:
- Properties Panel (Figma)
- Inspector (Browser DevTools)
- Detail View
- Filter Panel
- Settings Panel

**시각적 예시**:
```
┌────────────────────────┐
│  Properties            │
├────────────────────────┤
│  Position              │
│  ┌─────┐  ┌─────┐     │
│  │ X   │  │ Y   │     │
│  │ 100 │  │ 200 │     │
│  └─────┘  └─────┘     │
│                        │
│  Size                  │
│  ┌─────┐  ┌─────┐     │
│  │ W   │  │ H   │     │
│  │ 300 │  │ 150 │     │
│  └─────┘  └─────┘     │
│                        │
│  Fill                  │
│  ┌──────────────┐     │
│  │ 🔵 #2563EB   │     │
│  └──────────────┘     │
│                        │
│  [Apply]  [Reset]      │
└────────────────────────┘
        280px
```

---

### 3.6 Stage

**정의**: 양방향으로 자유롭게 확장되는 메인 면형(Surface) 영역

**물리적 특성**:
- 너비: 남은 공간 전체
- 높이: 남은 공간 전체 또는 콘텐츠에 맞춤
- 방향: 제한 없음

**디자인 제약**:
- 자유 레이아웃
- 모든 요소 크기 사용 가능
- 스크롤 가능 (양방향)
- Hero 스케일 사용 가능

**일반적 용도**:
- Main Content
- Canvas
- Document Body
- Dashboard

**시각적 예시**:
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   Welcome Back, John                                │  ← Hero 가능
│                                                     │
│   ┌───────────────┐   ┌───────────────┐           │
│   │               │   │               │           │
│   │    Card A     │   │    Card B     │           │
│   │               │   │               │           │
│   └───────────────┘   └───────────────┘           │
│                                                     │
│   ┌─────────────────────────────────────────┐     │
│   │                                         │     │
│   │              Data Table                 │     │
│   │                                         │     │
│   └─────────────────────────────────────────┘     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 3.7 Layer

**정의**: 콘텐츠 위에 떠있는 고립된 면형(Surface) 영역

**물리적 특성**:
- 너비: 제한됨 (max-width: 480-640px)
- 높이: 콘텐츠에 맞춤 또는 제한 (max-height)
- z-index: 상위
- 위치: 중앙 또는 지정된 위치

**디자인 제약**:
- 집중된 단일 태스크
- 포커스 트랩 (focus trap)
- Backdrop dimming
- 명시적 닫기 필요

**일반적 용도**:
- Modal / Dialog
- Drawer (overlay 모드)
- Command Palette
- Full-screen Overlay

**시각적 예시**:
```
┌─────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░┌─────────────────────┐░░░░░░░░░░░░│
│░░░░░░░░░░│                     │░░░░░░░░░░░░│
│░░░░░░░░░░│   Confirm Delete    │░░░░░░░░░░░░│
│░░░░░░░░░░│                     │░░░░░░░░░░░░│
│░░░░░░░░░░│   Are you sure?     │░░░░░░░░░░░░│
│░░░░░░░░░░│                     │░░░░░░░░░░░░│
│░░░░░░░░░░│   [Cancel] [Delete] │░░░░░░░░░░░░│
│░░░░░░░░░░│                     │░░░░░░░░░░░░│
│░░░░░░░░░░└─────────────────────┘░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└─────────────────────────────────────────────┘
              backdrop (dimmed)
```

---

### 3.8 Float

**정의**: 특정 요소에 앵커된 작은 점형(Point) 영역

**물리적 특성**:
- 크기: 콘텐츠에 맞춤 (최소)
- max-width: 240-320px
- z-index: 최상위
- 위치: 앵커 요소 기준

**디자인 제약**:
- 최소한의 정보만
- 일시적 (자동 사라짐 또는 외부 클릭으로 닫힘)
- 포커스 트랩 없음
- Backdrop 없음

**일반적 용도**:
- Tooltip
- Popover
- Dropdown Menu
- Toast / Notification
- Context Menu

**시각적 예시**:
```
Tooltip:
                ┌─────────────────┐
  [Button] ───▶ │ Click to submit │
                └─────────────────┘

Dropdown:
  [Select ▼]
      │
      ▼
  ┌──────────────┐
  │ Option 1     │
  │ Option 2     │
  │ Option 3     │
  └──────────────┘

Toast:
  ┌──────────────────────┐
  │ ✓ Changes saved      │
  └──────────────────────┘
```

---

## 4. Type Scale System

### 4.1 Scale Token Structure

각 Type은 자신만의 스케일 토큰 세트를 정의합니다:

```ts
interface TypeScaleTokens {
  // 크기 제약
  dimensions: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    fixedWidth?: number;
    fixedHeight?: number;
  };
  
  // 텍스트 스케일 (prominence별)
  text: {
    Hero: number;
    Standard: number;
    Subtle: number;
  };
  
  // 간격 스케일
  space: {
    base: number;
    tight: number;
    loose: number;
  };
  
  // Action 스케일
  action: {
    height: number;
    minWidth?: number;
    iconOnly?: boolean;
    variant?: 'icon' | 'menuItem' | 'button' | 'default';
  };
  
  // Field 스케일
  field?: {
    height: number;
    labelPosition: 'top' | 'left' | 'hidden';
  };
  
  // 기본 density
  defaultDensity: 'Comfortable' | 'Standard' | 'Compact';
}
```

### 4.2 Default Type Scale Tokens

#### Bar

```ts
const BarScale: TypeScaleTokens = {
  dimensions: {
    fixedHeight: 56,    // 48-64px 범위
  },
  text: {
    Hero: 20,           // Bar의 Hero는 Stage의 Standard보다 작음
    Standard: 14,
    Subtle: 12,
  },
  space: {
    base: 12,
    tight: 8,
    loose: 16,
  },
  action: {
    height: 36,
    iconOnly: true,     // 기본적으로 아이콘만
    variant: 'icon',
  },
  defaultDensity: 'Compact',
};
```

#### Rail

```ts
const RailScale: TypeScaleTokens = {
  dimensions: {
    minWidth: 48,
    maxWidth: 200,
  },
  text: {
    Hero: 16,
    Standard: 14,
    Subtle: 12,
  },
  space: {
    base: 8,
    tight: 4,
    loose: 12,
  },
  action: {
    height: 40,
    variant: 'menuItem',
  },
  defaultDensity: 'Compact',
};
```

#### Panel

```ts
const PanelScale: TypeScaleTokens = {
  dimensions: {
    minWidth: 240,
    maxWidth: 400,
  },
  text: {
    Hero: 18,
    Standard: 14,
    Subtle: 12,
  },
  space: {
    base: 12,
    tight: 8,
    loose: 16,
  },
  action: {
    height: 36,
    variant: 'button',
  },
  field: {
    height: 32,
    labelPosition: 'top',
  },
  defaultDensity: 'Compact',
};
```

#### Stage

```ts
const StageScale: TypeScaleTokens = {
  dimensions: {
    // 제한 없음
  },
  text: {
    Hero: 48,
    Standard: 16,
    Subtle: 14,
  },
  space: {
    base: 24,
    tight: 16,
    loose: 32,
  },
  action: {
    height: 44,
    variant: 'default',
  },
  field: {
    height: 40,
    labelPosition: 'top',
  },
  defaultDensity: 'Standard',
};
```

#### Layer

```ts
const LayerScale: TypeScaleTokens = {
  dimensions: {
    maxWidth: 560,
    maxHeight: '90vh',
  },
  text: {
    Hero: 24,
    Standard: 16,
    Subtle: 14,
  },
  space: {
    base: 20,
    tight: 12,
    loose: 24,
  },
  action: {
    height: 44,
    variant: 'default',
  },
  field: {
    height: 40,
    labelPosition: 'top',
  },
  defaultDensity: 'Standard',
};
```

#### Float

```ts
const FloatScale: TypeScaleTokens = {
  dimensions: {
    maxWidth: 320,
  },
  text: {
    Hero: 14,
    Standard: 13,
    Subtle: 12,
  },
  space: {
    base: 8,
    tight: 4,
    loose: 12,
  },
  action: {
    height: 28,
    variant: 'menuItem',
  },
  defaultDensity: 'Compact',
};
```

### 4.3 Scale Comparison Table

| Type | Hero | Standard | Subtle | Action Height | Density |
|------|------|----------|--------|---------------|---------|
| Bar | 20px | 14px | 12px | 36px | Compact |
| Rail | 16px | 14px | 12px | 40px | Compact |
| Panel | 18px | 14px | 12px | 36px | Compact |
| Stage | 48px | 16px | 14px | 44px | Standard |
| Layer | 24px | 16px | 14px | 44px | Standard |
| Float | 14px | 13px | 12px | 28px | Compact |

**핵심 통찰**: Panel의 Hero(18px) < Stage의 Standard(16px)가 아닌 이유는 Panel 안에서도 계층 구조가 필요하기 때문. 그러나 Stage의 Hero(48px)와는 큰 차이.

---

## 5. Page Template Integration

### 5.1 Template의 역할

Page Template은 Role을 Type에 배정하고 배치를 결정합니다.

```ts
interface PageTemplate {
  name: string;
  layout: TemplateLayout;
  sections: Record<SectionRole, SectionTypeConfig>;
}

interface SectionTypeConfig {
  type: SectionType;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  order?: number;
}
```

### 5.2 Built-in Templates

#### Desktop Sidebar

```ts
const DesktopSidebarTemplate: PageTemplate = {
  name: 'DesktopSidebar',
  layout: {
    structure: `
      ┌─────────────────────────────────────────┐
      │ Header (Bar)                            │
      ├──────────┬──────────────────────────────┤
      │   Rail   │          Stage               │
      │  (Nav)   │          (Main)              │
      └──────────┴──────────────────────────────┘
    `,
  },
  sections: {
    Header: { type: 'Bar', position: 'top' },
    Navigation: { type: 'Rail', position: 'left' },
    Main: { type: 'Stage', position: 'center' },
  },
};
```

#### Desktop Panel

```ts
const DesktopPanelTemplate: PageTemplate = {
  name: 'DesktopPanel',
  layout: {
    structure: `
      ┌───────────────────────────────────────────────────┐
      │ Header (Bar)                                      │
      ├────────┬─────────────────────────────┬────────────┤
      │  Rail  │          Stage              │   Panel    │
      │ (Nav)  │          (Main)             │  (Sidebar) │
      └────────┴─────────────────────────────┴────────────┘
    `,
  },
  sections: {
    Header: { type: 'Bar', position: 'top' },
    Navigation: { type: 'Rail', position: 'left' },
    Main: { type: 'Stage', position: 'center' },
    Sidebar: { type: 'Panel', position: 'right' },
  },
};
```

#### Studio (Figma-like)

```ts
const StudioTemplate: PageTemplate = {
  name: 'Studio',
  layout: {
    structure: `
      ┌─────────────────────────────────────────────────────┐
      │ Header (Bar)                                        │
      ├────────┬───────────────────────────────┬────────────┤
      │ Panel  │            Stage              │   Panel    │
      │(Layers)│           (Canvas)            │  (Props)   │
      └────────┴───────────────────────────────┴────────────┘
    `,
  },
  sections: {
    Header: { type: 'Bar', position: 'top' },
    Sidebar: { type: 'Panel', position: 'left' },  // Layers
    Main: { type: 'Stage', position: 'center' },   // Canvas
    Region: { type: 'Panel', position: 'right' },  // Properties
  },
};
```

#### Mobile

```ts
const MobileTemplate: PageTemplate = {
  name: 'Mobile',
  layout: {
    structure: `
      ┌─────────────────┐
      │  Header (Bar)   │
      ├─────────────────┤
      │                 │
      │  Stage (Main)   │
      │                 │
      ├─────────────────┤
      │Navigation (Bar) │
      └─────────────────┘
    `,
  },
  sections: {
    Header: { type: 'Bar', position: 'top' },
    Main: { type: 'Stage', position: 'center' },
    Navigation: { type: 'Bar', position: 'bottom' },  // Rail이 아닌 Bar
  },
};
```

### 5.3 Template 사용

```tsx
// Template이 Type을 결정
<Page template="DesktopPanel">
  <Section role="Header">...</Section>
  <Section role="Navigation">...</Section>    {/* → Rail */}
  <Section role="Main">...</Section>          {/* → Stage */}
  <Section role="Sidebar">...</Section>       {/* → Panel */}
</Page>

// 또는 명시적 Type 지정
<Page>
  <Section role="Navigation" type="Bar">...</Section>  {/* 명시적 override */}
</Page>
```

---

## 6. Contextual Rendering

### 6.1 개념

동일한 Element가 **부모 Section의 Type에 따라 다르게 렌더링**됩니다.

```tsx
// 같은 <Action label="검색" />이 완전히 다른 모양으로 렌더링

// Bar 안: 아이콘 버튼
<Section role="Header" type="Bar">
  <Action label="검색" />
</Section>
// → 🔍 (원형, 투명 배경, 36px)

// Rail 안: 메뉴 아이템
<Section role="Navigation" type="Rail">
  <Action label="검색" />
</Section>
// → 🔍 검색 (전체 너비, 좌측 정렬, 40px)

// Panel 안: 컴팩트 버튼
<Section role="Sidebar" type="Panel">
  <Action label="검색" />
</Section>
// → [ 🔍 검색 ] (pill, 테두리, 36px)

// Stage 안: 표준 버튼
<Section role="Main" type="Stage">
  <Action label="검색" />
</Section>
// → [    🔍 검색    ] (표준 버튼, 44px)
```

### 6.2 Context Provider 구조

```tsx
// Renderer 내부 구현
<Page template="DesktopPanel">
  <SectionTypeContext.Provider value="Bar">
    <Section role="Header">
      {/* 이 안의 모든 Element는 Bar 스케일 적용 */}
    </Section>
  </SectionTypeContext.Provider>
  
  <SectionTypeContext.Provider value="Rail">
    <Section role="Navigation">
      {/* Rail 스케일 적용 */}
    </Section>
  </SectionTypeContext.Provider>
  
  <SectionTypeContext.Provider value="Stage">
    <Section role="Main">
      {/* Stage 스케일 적용 */}
    </Section>
  </SectionTypeContext.Provider>
</Page>
```

### 6.3 Element Resolver 패턴

```ts
// Renderer가 정의하는 컨텍스트별 Element 변형
const elementResolvers: Record<ElementType, Record<SectionType, ComponentType>> = {
  Action: {
    Bar: IconButton,
    Rail: MenuItem,
    Panel: CompactButton,
    Stage: Button,
    Layer: DialogButton,
    Float: MenuButton,
  },
  
  Text: {
    Bar: BarText,
    Rail: RailText,
    Panel: PanelText,
    Stage: Text,
    Layer: DialogText,
    Float: TooltipText,
  },
  
  Field: {
    Bar: null,           // Bar에는 Field 없음
    Rail: null,
    Panel: CompactField,
    Stage: Field,
    Layer: DialogField,
    Float: null,
  },
};
```

### 6.4 Prominence Resolution

```ts
// prominence는 Type의 Scale 안에서 해석됨
function resolveTextSize(
  type: SectionType,
  prominence: Prominence
): number {
  const scale = typeScales[type];
  
  switch (prominence) {
    case 'Hero': return scale.text.Hero;
    case 'Standard': return scale.text.Standard;
    case 'Subtle': return scale.text.Subtle;
    case 'Hidden': return 0;
  }
}

// Stage의 Hero: 48px
// Panel의 Hero: 18px
// Bar의 Hero: 20px
```

---

## 7. Renderer Requirements

### 7.1 Type Support (MUST)

Renderer는 6개 Type 모두 지원해야 합니다 (MUST):

1. **Bar**: 고정 높이 수평 레이아웃
2. **Rail**: 좁은 너비 수직 레이아웃 (접힘 상태 포함)
3. **Panel**: 중간 너비 수직 레이아웃
4. **Stage**: 자유 레이아웃
5. **Layer**: 오버레이 + 포커스 트랩
6. **Float**: 앵커 기반 포지셔닝

### 7.2 Scale Token Implementation (MUST)

Renderer는 각 Type별 Scale Token을 구현해야 합니다 (MUST):

- 텍스트 크기 (prominence별)
- 간격
- Action 높이 및 변형
- Field 스타일 (해당되는 경우)

### 7.3 Contextual Rendering (MUST)

Renderer는 Section Type에 따라 Element를 다르게 렌더링해야 합니다 (MUST):

- Action의 형태 변경 (icon-only, menu-item, button 등)
- Text의 크기 스케일 적용
- Field의 밀도 및 레이블 위치 적용

### 7.4 Template Support (SHOULD)

Renderer는 기본 Page Template을 제공해야 합니다 (SHOULD):

- Desktop Sidebar
- Desktop Panel
- Mobile
- Article/Document

### 7.5 Type Override (MUST)

명시적 `type` prop은 Template의 기본 매핑보다 우선해야 합니다 (MUST).

---

## 8. Examples

### 8.1 Figma-like Studio

```tsx
<Page template="Studio">
  <Section role="Header">
    <Block role="Toolbar">
      <Action label="파일" />           {/* Bar → icon menu trigger */}
      <Action label="편집" />
      <Separator />
      <Action label="이동" icon="move" /> {/* icon only */}
      <Action label="프레임" icon="frame" />
    </Block>
  </Section>

  <Section role="Sidebar" name="Layers">
    <Block role="TreeView">
      {/* Panel → 중간 크기 트리 */}
    </Block>
  </Section>

  <Section role="Main">
    <Block role="Canvas">
      {/* Stage → 자유 레이아웃 */}
    </Block>
  </Section>

  <Section role="Region" name="Properties">
    <Block role="Form">
      {/* Panel → compact 폼 필드 */}
      <Field role="NumberInput" label="X" />
      <Field role="NumberInput" label="Y" />
    </Block>
  </Section>
</Page>
```

### 8.2 Mobile App

```tsx
<Page template="Mobile">
  <Section role="Header">
    <Block role="Toolbar">
      <Action label="뒤로" icon="back" />
      <Text role="Title" prominence="Hero">설정</Text>  {/* Bar Hero: 20px */}
      <Action label="저장" />
    </Block>
  </Section>

  <Section role="Main">
    <Block role="List">
      {/* Stage scale 적용 */}
      <Text role="Heading" prominence="Hero">계정</Text>  {/* Stage Hero: 48px */}
    </Block>
  </Section>

  <Section role="Navigation">
    {/* Bar (bottom) */}
    <Action label="홈" icon="home" />
    <Action label="검색" icon="search" />
    <Action label="설정" icon="settings" />
  </Section>
</Page>
```

### 8.3 Modal Dialog

```tsx
<Section role="Modal" type="Layer">
  {/* Layer scale 적용 */}
  <Block role="Card">
    <Text role="Heading" prominence="Hero">파일 삭제</Text>  {/* Layer Hero: 24px */}
    <Text role="Body">정말 삭제하시겠습니까?</Text>
    
    <Block role="Toolbar">
      <Action prominence="Subtle">취소</Action>
      <Action intent="Critical">삭제</Action>  {/* Layer action: 44px */}
    </Block>
  </Block>
</Section>
```

### 8.4 Tooltip

```tsx
<Section type="Float">
  {/* Float scale 적용 */}
  <Text role="Body">이 버튼을 클릭하면 저장됩니다</Text>
  {/* Float Standard: 13px, max-width: 320px */}
</Section>
```

---

## Appendix A: TypeScript Definitions

```ts
// Section Type
export type SectionType = 'Bar' | 'Rail' | 'Panel' | 'Stage' | 'Layer' | 'Float';

// Section Props (확장)
export interface SectionProps extends BaseProps {
  role: SectionRole;
  type?: SectionType;  // 명시적 override
  name?: string;       // accessible name
}

// Type Scale Tokens
export interface TypeScaleTokens {
  dimensions: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number | string;
    fixedWidth?: number;
    fixedHeight?: number;
  };
  
  text: Record<'Hero' | 'Standard' | 'Subtle', number>;
  
  space: {
    base: number;
    tight: number;
    loose: number;
  };
  
  action: {
    height: number;
    minWidth?: number;
    iconOnly?: boolean;
    variant?: 'icon' | 'menuItem' | 'button' | 'default';
  };
  
  field?: {
    height: number;
    labelPosition: 'top' | 'left' | 'hidden';
  };
  
  defaultDensity: Density;
}

// Page Template
export interface PageTemplate {
  name: string;
  layout: {
    structure: string;  // ASCII diagram (informative)
  };
  sections: Record<string, {
    type: SectionType;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    order?: number;
  }>;
}

// Type Scales (Renderer 구현)
export type TypeScales = Record<SectionType, TypeScaleTokens>;

// Section Type Context
export interface SectionTypeContextValue {
  type: SectionType;
  scale: TypeScaleTokens;
}
```

---

## Appendix B: Role → Type Default Mapping

| Section Role | Default Type | Rationale |
|--------------|--------------|-----------|
| Header | Bar | 상단 고정, 수평 레이아웃 |
| Footer | Bar | 하단 고정, 수평 레이아웃 |
| Navigation | Rail | 세로 메뉴가 기본 (Mobile은 Bar로 override) |
| Sidebar | Panel | 속성/상세 패널이 기본 (간단하면 Rail) |
| Main | Stage | 메인 콘텐츠 영역 |
| Region | Stage | 부가 콘텐츠 영역 |
| Modal | Layer | 오버레이 다이얼로그 |
| Drawer | Layer | 오버레이 패널 (inline이면 Panel) |
| Search | Bar | 검색바 (전체화면이면 Layer) |

---

## Appendix C: Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-11 | Draft 0.1 | Initial draft |

---

*End of Document*
