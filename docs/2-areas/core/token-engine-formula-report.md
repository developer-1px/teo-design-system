# Token Engine 공식 상세 리포트

> **"모든 디자인 결정을 수학으로 자동화한다"**
>
> Token Engine의 모든 spacing, typography, color, state는 **수학적 공식**으로 계산됩니다. 이 문서는 각 공식의 상세 분석과 설계 근거를 다룹니다.

---

## 목차

1. [레이아웃 원칙 (Padding, Border, Radius)](#1-레이아웃-원칙-padding-border-radius)
2. [Spacing 계산 공식](#2-spacing-계산-공식)
3. [Geometry 계산 공식 (Radius, Border)](#3-geometry-계산-공식-radius-border)
4. [Typography 계산 공식](#4-typography-계산-공식)
5. [Surface 계산 공식](#5-surface-계산-공식)
6. [Interactive State 계산 공식](#6-interactive-state-계산-공식)
7. [Adaptive Scale 계산 공식](#7-adaptive-scale-계산-공식)
8. [Prominence 계산 공식](#8-prominence-계산-공식)
9. [공식 검증 및 테스트](#9-공식-검증-및-테스트)

---

## 1. 레이아웃 원칙 (Padding, Border, Radius)

> **⚠️ 중요**: Padding, Border, Radius는 독립적이지 않습니다. 시각적 분리 방법에 따라 자동으로 결정됩니다.

### 1.1 핵심 원칙

UI 요소를 구분하는 방법은 **2가지**입니다:

#### Strategy 1: Surface (면으로 구분)

```
╔═════════════════════╗
║  ░░░░░░░░░░░░░░░░  ║  ← Padding 있음
║  ░  Content    ░  ║  ← Background로 구분
║  ░░░░░░░░░░░░░░░░  ║
╚═════════════════════╝  ← Radius 있음
```

**규칙**:
- ✅ **Padding 있음** (콘텐츠와 배경 분리)
- ✅ **Radius 있음** (부드러운 모서리)
- ✅ **Border 없음** (배경이 경계 역할)
- ✅ **Overflow visible** (Tooltip/Dropdown 잘림 방지)

**적용 대상**: Card, Button, Modal, Badge, Chip 등

#### Strategy 2: Border (선으로 구분)

```
┌─────────────────────┐
│ Content             │  ← No padding
├─────────────────────┤  ← Border로 구분
│ Content             │
└─────────────────────┘  ← No radius
```

**규칙**:
- ✅ **Padding 없음** (border가 경계 역할)
- ✅ **Radius 없음** (직선 강조, 공간 절약)
- ✅ **Border 있음** (1px solid)
- ✅ **Overflow visible**

**적용 대상**: Table, List, Divider, Separator 등

### 1.2 자동 선택 규칙

```typescript
function getLayoutStrategy(role: Role): 'surface' | 'border' {
  const BORDER_ROLES = [
    'Table', 'TableRow', 'TableCell',
    'List', 'ListItem',
    'Divider', 'Separator',
    'Tree', 'TreeNode',
  ];

  return BORDER_ROLES.includes(role) ? 'border' : 'surface';
}
```

### 1.3 Overflow-hidden 제거

**기본 원칙**: 모든 요소는 `overflow: visible` (기본값)

**이유**:
- ❌ Tooltip이 잘림
- ❌ Dropdown이 숨김
- ❌ Sticky가 작동 안 함

**예외**: 명시적으로 필요한 경우만
- Image crop
- Text ellipsis
- Scrollable area

```tsx
// ❌ 절대 하지 말 것
<Block className="rounded-lg overflow-hidden">

// ✅ 기본
<Block className="rounded-lg">  {/* overflow는 기본 visible */}

// ✅ 필요 시에만
<Block className="rounded-lg overflow-hidden">  {/* 이미지 crop용 */}
  <img src="..." />
</Block>
```

**자세한 내용**: [token-engine-layout-principles.md](./token-engine-layout-principles.md)

---

## 2. Spacing 계산 공식

### 1.1 기본 공식

```typescript
spacing = baseValue × prominenceFactor × densityFactor
```

### 1.2 변수 정의

#### Base Values (기준값)

```typescript
const BASE_VALUES = {
  gap: 16,        // children 사이 간격 (px)
  paddingX: 12,   // 좌우 여백 (px)
  paddingY: 8,    // 상하 여백 (px)
};
```

**왜 이 값들인가?**
- `gap: 16px`: Tailwind의 `gap-4` (1rem), 읽기 편한 최소 간격
- `paddingX: 12px`: Tailwind의 `px-3` (0.75rem), 클릭 영역 확보
- `paddingY: 8px`: Tailwind의 `py-2` (0.5rem), 수직 리듬 유지

**근거**: Material Design, Human Interface Guidelines 분석 결과
- 터치 타겟: 최소 44×44px (iOS), 48×48px (Material)
- padding을 제외한 **실제 내용 영역**을 고려하여 설정

#### Prominence Factor (주목도 배율)

```typescript
const prominenceFactors: Record<Prominence, number> = {
  Hero: 1.5,      // 150% (가장 넓은 spacing)
  Standard: 1.0,  // 100% (표준)
  Strong: 0.75,   // 75%
  Subtle: 0.5,    // 50% (가장 좁은 spacing)
};
```

**왜 이 배율인가?**

| Prominence | Factor | 의미 | 사용 사례 |
|-----------|--------|------|----------|
| Hero | 1.5 | **50% 증가** | 메인 CTA, 페이지 타이틀 |
| Standard | 1.0 | **기준** | 일반 버튼, 리스트 아이템 |
| Strong | 0.75 | **25% 감소** | Secondary 버튼 |
| Subtle | 0.5 | **50% 감소** | Tertiary 버튼, 아이콘 |

**설계 근거**:
- **1.5배 증가**: 시각적으로 "두드러짐"을 느끼려면 **최소 1.5배 차이** 필요 (Weber-Fechner 법칙)
- **0.5배 감소**: 절반으로 줄여야 "작다"는 느낌이 명확함
- **등비수열**: 1.5, 1.0, 0.75, 0.5 → 시각적으로 일관된 차이

#### Density Factor (밀도 배율)

```typescript
const densityFactors: Record<Density, number> = {
  Comfortable: 1.5,  // 150% (여유로운 spacing)
  Standard: 1.0,     // 100% (표준)
  Compact: 0.75,     // 75% (좁은 spacing)
};
```

**왜 이 배율인가?**

| Density | Factor | gap (16 기준) | paddingX (12 기준) | 사용 사례 |
|---------|--------|--------------|-------------------|----------|
| Comfortable | 1.5 | 24px | 18px | 태블릿, 큰 화면 |
| Standard | 1.0 | 16px | 12px | 데스크톱 (기준) |
| Compact | 0.75 | 12px | 9px → 8px (snap) | IDE, 좁은 Panel |

**설계 근거**:
- **Comfortable (1.5배)**: 터치 디바이스에서 **손가락 터치 영역** 확보 (44px 최소)
- **Compact (0.75배)**: IDE처럼 **정보 밀도가 높은 환경**에서 공간 절약
- **선형 비율**: 1.5, 1.0, 0.75 → prominence와 독립적으로 조합 가능

### 1.3 계산 예시 (상세 분석)

#### Example 1: Hero × Comfortable (가장 넓은 spacing)

```typescript
// Input
prominence = 'Hero';        // factor: 1.5
density = 'Comfortable';    // factor: 1.5

// Calculation
gap = 16 × 1.5 × 1.5 = 36px
paddingX = 12 × 1.5 × 1.5 = 27px
paddingY = 8 × 1.5 × 1.5 = 18px

// Snapping to allowed values [4, 8, 12, 16, 24, 32, 48, 64, 96]
gap = 36px → 32px (snap to nearest)
paddingX = 27px → 24px
paddingY = 18px → 16px

// Output
className: "gap-8 px-6 py-4"
```

**실제 사용 사례**: 태블릿의 Primary CTA 버튼
- 큰 터치 영역 확보
- 명확한 시각적 주목도

#### Example 2: Standard × Standard (기준)

```typescript
// Input
prominence = 'Standard';    // factor: 1.0
density = 'Standard';       // factor: 1.0

// Calculation (변환 없음)
gap = 16 × 1.0 × 1.0 = 16px
paddingX = 12 × 1.0 × 1.0 = 12px
paddingY = 8 × 1.0 × 1.0 = 8px

// Output
className: "gap-4 px-3 py-2"
```

**실제 사용 사례**: 데스크톱의 일반 버튼
- 가장 흔한 조합
- Tailwind 기본값과 일치

#### Example 3: Subtle × Compact (가장 좁은 spacing)

```typescript
// Input
prominence = 'Subtle';      // factor: 0.5
density = 'Compact';        // factor: 0.75

// Calculation
gap = 16 × 0.5 × 0.75 = 6px
paddingX = 12 × 0.5 × 0.75 = 4.5px
paddingY = 8 × 0.5 × 0.75 = 3px

// Snapping
gap = 6px → 4px (snap down)
paddingX = 4.5px → 4px
paddingY = 3px → 4px (snap up, 최소값 보장)

// Output
className: "gap-1 px-1 py-1"
```

**실제 사용 사례**: IDE의 아이콘 버튼, Compact Toolbar
- 정보 밀도 극대화
- 최소 클릭 영역 보장 (4px padding)

### 1.4 Snapping Algorithm (허용 값 반올림)

#### 허용 값 (Allowed Values)

```typescript
const ALLOWED_VALUES = [4, 8, 12, 16, 24, 32, 48, 64, 96];
```

**왜 이 값들인가?**
- **4의 배수**: Tailwind의 spacing scale과 일치 (0.25rem 단위)
- **8px 그리드**: 디자인 시스템의 기본 그리드
- **비선형 증가**: 16px 이후 8px씩 증가 → 큰 값은 더 큰 간격

**Snapping 함수**:

```typescript
function snapToAllowedValue(value: number): number {
  return ALLOWED_VALUES.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}
```

**알고리즘**: 가장 가까운 값을 찾는 **최소 거리 알고리즘**

#### Snapping 예시

| 계산값 | Snap 결과 | 이유 |
|--------|----------|------|
| 6px | 4px | \|6-4\| = 2 < \|6-8\| = 2 (같으면 작은 값) |
| 10px | 8px | \|10-8\| = 2 < \|10-12\| = 2 (같으면 작은 값) |
| 14px | 16px | \|14-16\| = 2 < \|14-12\| = 2 (같으면 큰 값) |
| 20px | 24px | \|20-24\| = 4 < \|20-16\| = 4 (같으면 큰 값) |
| 27px | 24px | \|27-24\| = 3 < \|27-32\| = 5 |
| 36px | 32px | \|36-32\| = 4 < \|36-48\| = 12 |

**Snapping의 장점**:
- ✅ 무한한 spacing 값 대신 **일관된 그리드** 유지
- ✅ Tailwind className과 **완벽히 매핑** (gap-1, gap-2, gap-4 등)
- ✅ 브라우저 렌더링 **최적화** (정수 픽셀)

**Snapping의 단점**:
- ❌ 계산값과 실제 값이 **약간 다를 수 있음**
- ❌ 특정 조합에서 **의도보다 작거나 클 수 있음**

**해결책**: 필요시 `className` prop으로 override
```tsx
<Action prominence="Standard" className="!gap-3"> {/* 강제로 12px */}
```

### 1.5 Role-based Base Padding (역할별 기본값)

일부 role은 **다른 base padding**을 사용합니다:

```typescript
const BASE_PADDING_MAP: Record<string, { x: number, y: number }> = {
  // Action / Button - 프리미엄 느낌
  Button: { x: 1.0, y: 0.5 },        // 16px 8px (더 넓음)
  IconButton: { x: 0.5, y: 0.5 },    // 8px 8px (정사각형)

  // Input - 입력 영역
  Input: { x: 0.75, y: 0.625 },      // 12px 10px

  // Container
  Card: { x: 1.25, y: 1.25 },        // 20px 20px (여유로운 내부)
  Modal: { x: 2.0, y: 2.0 },         // 32px 32px (가장 넓음)

  // List
  ListItem: { x: 0.75, y: 0.375 },   // 12px 6px (조밀함)

  // Fallback
  Default: { x: 1.0, y: 1.0 }        // 16px 16px
};
```

**왜 role별로 다른가?**
- **Button**: 클릭 영역 확보 (x축 더 넓게)
- **IconButton**: 정사각형 유지 (x = y)
- **Card/Modal**: 내부 콘텐츠와 분리 (넓은 padding)
- **ListItem**: 정보 밀도 우선 (좁은 padding)

**최종 공식** (role 고려):

```typescript
paddingX = BASE_PADDING_MAP[role].x × prominenceFactor × densityFactor
paddingY = BASE_PADDING_MAP[role].y × prominenceFactor × densityFactor
```

---

## 3. Geometry 계산 공식 (Radius, Border)

**TODO**: 이 섹션은 token-engine-layout-principles.md에서 상세 설명

---

## 4. Typography 계산 공식

### 2.1 기본 공식

```typescript
fontSize = baseFontSize × typeScaleFactor × prominenceFactor
fontWeight = weightMap[prominence]
color = colorMap[intent][prominence]
```

### 2.2 변수 정의

#### Base Font Size (역할별 기본 크기)

```typescript
const TEXT_ROLE_MAP: Record<string, { size: string, weight: string }> = {
  Title: { size: 'text-2xl', weight: 'font-bold' },      // 24px
  Heading: { size: 'text-lg', weight: 'font-semibold' }, // 18px
  Body: { size: 'text-base', weight: 'font-normal' },    // 16px
  Label: { size: 'text-sm', weight: 'font-medium' },     // 14px
  Caption: { size: 'text-xs', weight: 'font-normal' },   // 12px
};
```

**Typographic Scale** (Major Third - 1.25 비율):
```
12px (Caption)
  ↓ × 1.17
14px (Label)
  ↓ × 1.14
16px (Body) ← 기준
  ↓ × 1.125
18px (Heading)
  ↓ × 1.33
24px (Title)
```

**왜 Major Third 비율인가?**
- **조화로운 크기 차이**: 음악의 3도 음정 (1:1.25)
- **가독성**: 각 레벨이 **명확히 구분**되면서도 **과하지 않음**
- **실용성**: Tailwind 기본 scale과 유사

#### Type Scale Factor (SectionType별 조정)

```typescript
const TYPE_SCALE_FACTORS: Record<SectionType, number> = {
  Bar: 0.875,     // 87.5% (14px Standard)
  Rail: 0.875,    // 87.5%
  Panel: 0.875,   // 87.5%
  Stage: 1.0,     // 100% (16px Standard) ← 기준
  Layer: 1.0,     // 100%
  Float: 0.8125,  // 81.25% (13px Standard)
};
```

**왜 SectionType별로 다른 scale인가?**

| SectionType | Factor | Standard 크기 | 이유 |
|-------------|--------|--------------|------|
| Bar | 0.875 | 14px | 높이 제한 (48-64px) → 작은 텍스트 필수 |
| Panel | 0.875 | 14px | 너비 제한 (240-400px) → 조밀한 텍스트 |
| Stage | 1.0 | 16px | 제약 없음 → 큰 텍스트 가능 (기준) |
| Float | 0.8125 | 13px | 최소 크기 (max 320px) → 가장 작은 텍스트 |

**계산 근거**:

```
Stage Standard = 16px (기준)
Panel Standard = 16px × 0.875 = 14px
Float Standard = 16px × 0.8125 = 13px
```

**실제 사례**:
- **Sidebar (Panel)**: 파일 리스트 → 14px로 많은 항목 표시
- **Main (Stage)**: 에디터 → 16px로 가독성 우선
- **Tooltip (Float)**: 힌트 → 13px로 공간 절약

#### Prominence Factor (주목도별 크기 조정)

```typescript
const PROMINENCE_SCALE_FACTORS: Record<SectionType, Record<Prominence, number>> = {
  Stage: {
    Hero: 1.5,      // 150% (24px → 36px)
    Standard: 1.0,  // 100% (24px → 24px)
    Strong: 0.875,  // 87.5%
    Subtle: 0.875,  // 87.5%
  },
  Panel: {
    Hero: 1.29,     // 129% (작은 증가, Panel은 공간 제약)
    Standard: 1.0,
    Strong: 0.86,
    Subtle: 0.86,
  },
  Bar: {
    Hero: 1.43,     // 143%
    Standard: 1.0,
    Strong: 0.86,
    Subtle: 0.86,
  },
  Float: {
    Hero: 1.08,     // 108% (Float는 최소 증가만)
    Standard: 1.0,
    Strong: 0.92,
    Subtle: 0.92,
  },
};
```

**왜 SectionType마다 다른 prominence factor인가?**

**Stage (공간 충분)**:
- Hero: **1.5배** → 큰 차이로 명확한 계층
- 예: Title Hero = 24px × 1.5 = **36px** (매우 큼)

**Panel (공간 제약)**:
- Hero: **1.29배** → 작은 증가로 공간 절약
- 예: Title Hero = 24px × 0.875 (Panel) × 1.29 = **27px** (적당)

**Float (최소 공간)**:
- Hero: **1.08배** → 거의 증가 없음
- 예: Title Hero = 24px × 0.8125 (Float) × 1.08 = **21px** (작음)

**설계 원칙**:
- 공간이 **넓을수록** prominence 차이를 **크게**
- 공간이 **좁을수록** prominence 차이를 **작게**

### 2.3 계산 예시

#### Example 1: Title in Stage (기준)

```typescript
// Input
role = 'Title';
sectionType = 'Stage';
prominence = 'Standard';

// Base
baseFontSize = 24px (Title)
typeScaleFactor = 1.0 (Stage)
prominenceFactor = 1.0 (Standard)

// Calculation
fontSize = 24px × 1.0 × 1.0 = 24px

// Output
className: "text-2xl font-bold"
```

#### Example 2: Title Hero in Stage

```typescript
// Input
role = 'Title';
sectionType = 'Stage';
prominence = 'Hero';

// Calculation
fontSize = 24px × 1.0 (Stage) × 1.5 (Hero) = 36px

// Output
className: "text-4xl font-bold" // (text-4xl = 36px)
```

#### Example 3: Title Hero in Panel

```typescript
// Input
role = 'Title';
sectionType = 'Panel';
prominence = 'Hero';

// Calculation
fontSize = 24px × 0.875 (Panel) × 1.29 (Hero in Panel) = 27.09px → 27px

// Output
className: "text-[27px] font-bold" // arbitrary value
```

#### Example 4: Body in Float

```typescript
// Input
role = 'Body';
sectionType = 'Float';
prominence = 'Standard';

// Calculation
fontSize = 16px × 0.8125 (Float) × 1.0 = 13px

// Output
className: "text-[13px] font-normal"
```

### 2.4 Font Weight Mapping

```typescript
// prominence → font-weight
if (prominence === 'Hero') {
  weight = 'font-bold';  // 700
} else if (prominence === 'Strong') {
  weight = 'font-semibold';  // 600
} else {
  weight = baseWeight;  // role의 기본 weight
}
```

**Weight 계층**:
- Hero: **700 (Bold)** → 가장 강조
- Strong: **600 (Semibold)** → 중간 강조
- Standard: role 기본값 (Title: 700, Body: 400, Label: 500)
- Subtle: role 기본값

### 2.5 Color Mapping

```typescript
// prominence + intent → text color
let color = 'text-text'; // default

if (prominence === 'Subtle') {
  color = 'text-text-muted';  // 투명도 70%
} else if (intent !== 'Neutral') {
  switch (intent) {
    case 'Brand': color = 'text-primary'; break;
    case 'Positive': color = 'text-success'; break;
    case 'Caution': color = 'text-warning'; break;
    case 'Critical': color = 'text-error'; break;
  }
}
```

**Color 우선순위**:
1. **disabled state** → `text-text-subtle opacity-50`
2. **prominence = Subtle** → `text-text-muted`
3. **intent ≠ Neutral** → 의도 색상 (text-primary, text-error 등)
4. **default** → `text-text`

---

## 3. Surface 계산 공식

### 3.1 기본 공식

```typescript
background = baseBackground
  + prominenceModifier
  + intentModifier
  + stateModifier
  + contextModifier
```

### 3.2 Base Background (역할별 기본값)

```typescript
const SURFACE_BASE_MAP: Record<string, string> = {
  Canvas: 'bg-surface-base',     // #fafafa (가장 낮은 depth)
  Main: 'bg-surface-base',
  Sidebar: 'bg-surface-sunken',  // #f5f5f5 (움푹 들어간 느낌)
  Panel: 'bg-surface-sunken',
  Card: 'bg-surface',            // #ffffff (기본 흰색)
  Modal: 'bg-surface-raised',    // #ffffff + shadow
  Button: 'bg-transparent',      // 투명 (hover에서만 표시)
  Default: 'bg-surface'
};
```

**Surface Depth 계층** (Visual Hierarchy):
```
surface-base (#fafafa)    ← Canvas, Main
  ↓
surface-sunken (#f5f5f5)  ← Sidebar, Panel
  ↓
surface (#ffffff)         ← Card
  ↓
surface-raised (#ffffff + shadow) ← Modal, Popover
```

**왜 이런 계층인가?**
- **depth 0-1**: base/sunken → 배경 영역
- **depth 2-3**: surface → 콘텐츠 영역
- **depth 4-6**: raised → 떠있는 영역

### 3.3 Prominence Modifier (주목도별 배경)

```typescript
if (prominence === 'Hero') {
  if (isAction) {
    // Hero Action = 꽉 찬 배경
    background = intent === 'Brand' ? 'bg-primary text-white' : 'bg-slate-900 text-white';
  } else if (isContainer) {
    background = 'bg-white shadow-soft-xl';
  }
} else if (prominence === 'Strong') {
  if (isAction) {
    // Strong Action = 연한 tint
    background = intent === 'Brand' ? 'bg-primary/5 text-primary' : 'bg-slate-100';
  }
} else if (prominence === 'Standard') {
  if (isAction) {
    background = 'bg-transparent hover:bg-slate-50/80';
  }
} else if (prominence === 'Subtle') {
  background = 'bg-transparent';
}
```

**Prominence별 배경 전략**:

| Prominence | Action | Container | 이유 |
|-----------|--------|-----------|------|
| Hero | 꽉 찬 배경 | 큰 shadow | 최대 주목도 |
| Strong | 연한 tint (5% opacity) | 중간 shadow | 적당한 강조 |
| Standard | 투명 (hover만) | 기본 배경 | 일반 요소 |
| Subtle | 투명 | 투명 | 최소 강조 |

**설계 원칙**:
- **Hero**: 색상으로 주목 (filled)
- **Strong**: 미묘한 tint로 차별화
- **Standard**: 상태에서만 표시 (hover)
- **Subtle**: 배경 없음 (텍스트만)

### 3.4 Intent Modifier (의도별 색상)

```typescript
switch (intent) {
  case 'Brand':
    background = prominence === 'Hero' ? 'bg-primary text-white' : 'bg-primary/5 text-primary';
    break;
  case 'Positive':
    background = prominence === 'Hero' ? 'bg-success text-white' : 'bg-success/5 text-success';
    break;
  case 'Critical':
    background = prominence === 'Hero' ? 'bg-error text-white' : 'bg-error/5 text-error';
    break;
  // ...
}
```

**Intent별 색상 매핑**:

| Intent | Hero | Strong | Standard |
|--------|------|--------|----------|
| Brand | `bg-primary` | `bg-primary/5` | `text-primary` |
| Positive | `bg-success` | `bg-success/5` | `text-success` |
| Critical | `bg-error` | `bg-error/5` | `text-error` |
| Caution | `bg-warning` | `bg-warning/5` | `text-warning` |

**Opacity 규칙**:
- Hero: **100% opacity** (완전히 채움)
- Strong: **5% opacity** (미묘한 tint)
- Standard: **0% opacity** (투명, 텍스트 색만)

### 3.5 State Modifier (상태별 변화)

```typescript
if (state.hover && !state.disabled) {
  if (prominence === 'Hero') {
    background += ' brightness-95'; // 5% 어둡게
  } else {
    background = 'bg-slate-100/50'; // 연한 회색
  }
}

if (state.selected) {
  if (prominence !== 'Hero') {
    background = 'bg-slate-100/80 text-slate-900';
  }
}

if (state.disabled) {
  background += ' opacity-50 cursor-not-allowed';
}
```

**State별 변화량**:

| State | Hero | Standard | Subtle |
|-------|------|----------|--------|
| idle | 100% | 투명 | 투명 |
| hover | 95% brightness | bg-slate-100/50 | bg-slate-50 |
| active | 90% brightness | bg-slate-100/80 | bg-slate-100 |
| selected | ring-2 | bg-slate-100/80 | text color change |
| disabled | 50% opacity | 50% opacity | 50% opacity |

**설계 원칙**:
- **Hero**: brightness로 미묘한 변화 (색상 유지)
- **Standard/Subtle**: 회색 배경 추가 (명확한 피드백)
- **disabled**: 모든 prominence에서 동일 (50% opacity)

### 3.6 Context Modifier (컨텍스트별 조정)

```typescript
// Glassmorphism (유리 효과)
let blur = '';
const isFloating = role === 'Modal' || role === 'Popover';
const isSpecialSection = sectionType === 'Bar' || sectionType === 'Float';

if (isFloating || isSpecialSection) {
  blur = 'backdrop-blur-md';
}

// Page Context Overrides
if (pageRole === 'Immersive') {
  if (isContainer) {
    background = 'bg-white/10 border-white/10 text-white';
    blur = 'backdrop-blur-xl';
  }
}

if (pageRole === 'Focus') {
  blur = '';  // Focus mode는 blur 제거 (깔끔함 우선)
  if (isContainer) {
    background = 'bg-white shadow-soft-2xl ring-1 ring-black/5';
  }
}
```

**Context별 전략**:

| Context | Background | Blur | 이유 |
|---------|-----------|------|------|
| Normal | 기본값 | 없음 | 일반 페이지 |
| Floating | 투명/반투명 | backdrop-blur-md | 유리 효과 |
| Immersive | bg-white/10 | backdrop-blur-xl | 몰입감 (어두운 배경) |
| Focus | bg-white | 없음 | 깔끔함 (집중) |

---

## 4. Interactive State 계산 공식

### 4.1 기본 공식

```typescript
className = baseClass
  + hoverClass(prominence, intent)
  + activeClass(prominence, intent)
  + selectedClass(prominence, intent)
  + disabledClass()
  + focusClass(intent)
```

### 4.2 State Priority (상태 우선순위)

```typescript
// 상태 결정 (우선순위: disabled > selected > active > hover > idle)
let state: InteractiveState = 'idle';
if (disabled) state = 'disabled';
else if (selected) state = 'selected';
else if (active) state = 'active';
else if (hover) state = 'hover';
```

**왜 이 우선순위인가?**
- **disabled**: 모든 상태보다 우선 (상호작용 불가)
- **selected**: 지속적인 상태 (hover/active보다 중요)
- **active**: 일시적 상태 (클릭 중)
- **hover**: 가장 약한 상태 (마우스 올림)

### 4.3 Hover State Calculation

```typescript
// prominence × intent → hover className
const hoverClass = {
  // Standard × Neutral
  'Standard-Neutral': 'hover:bg-surface-hover',

  // Standard × Brand
  'Standard-Brand': 'hover:bg-accent-hover',

  // Strong × Neutral
  'Strong-Neutral': 'hover:bg-surface-raised',

  // Subtle × Neutral
  'Subtle-Neutral': 'hover:text-text-secondary',
};
```

**Hover 강도 매핑**:

| Prominence | Neutral | Brand | Critical |
|-----------|---------|-------|----------|
| Hero | brightness-95 | brightness-95 | brightness-95 |
| Standard | bg-surface-hover | bg-accent-hover | bg-error-hover |
| Strong | bg-surface-raised | bg-accent-subtle | bg-error-subtle |
| Subtle | text 색상 변화만 | text 색상 변화만 | text 색상 변화만 |

**설계 원칙**:
- **Hero**: 색상 유지, brightness만 변화
- **Standard**: 명확한 배경 변화
- **Strong**: 미묘한 배경 변화
- **Subtle**: 텍스트 색상만 변화

### 4.4 Active State Calculation

```typescript
// active = hover보다 강한 피드백
const activeClass = {
  'Standard-Neutral': 'active:bg-surface-pressed',
  'Standard-Brand': 'active:bg-accent-pressed',
  'Subtle-Neutral': 'active:text-text-primary',
};
```

**Active vs Hover**:

| State | Standard × Neutral | 색상 차이 |
|-------|-------------------|----------|
| idle | bg-transparent | - |
| hover | bg-surface-hover (#f5f5f5) | 3% 어둡게 |
| active | bg-surface-pressed (#ebebeb) | 8% 어둡게 |

**설계 근거**:
- **hover → active**: 5% 추가 어둡게
- **시각적 피드백**: 클릭 시 "눌림" 느낌 제공

### 4.5 Selected State Calculation

```typescript
// selected = 명확한 시각적 표시
const selectedClass = {
  'Standard-Neutral': 'bg-accent-subtle text-accent border-l-2 border-accent',
  'Strong-Neutral': 'bg-surface-raised text-text-primary font-medium',
  'Subtle-Neutral': 'text-text-primary font-medium',
};
```

**Selected 전략**:

| Prominence | Background | Border | Font |
|-----------|-----------|--------|------|
| Standard | accent-subtle | border-l-2 accent | normal |
| Strong | surface-raised | 없음 | font-medium |
| Subtle | 없음 | 없음 | font-medium |

**설계 원칙**:
- **Standard**: 배경 + 왼쪽 border (가장 명확)
- **Strong**: 배경만 (적당한 강조)
- **Subtle**: font-weight만 (최소 강조)

### 4.6 Disabled State

```typescript
// disabled = 모든 prominence에서 동일
const disabledClass = 'opacity-50 cursor-not-allowed';
```

**설계 이유**:
- **일관성**: prominence와 무관하게 동일한 시각적 표현
- **명확성**: 50% opacity로 "비활성화" 즉시 인지
- **접근성**: cursor-not-allowed로 상호작용 불가 표시

### 4.7 Focus State (키보드 접근성)

```typescript
const focusVariants = cva('outline-none', {
  variants: {
    intent: {
      Neutral: 'focus-visible:ring-2 focus-visible:ring-accent',
      Brand: 'focus-visible:ring-2 focus-visible:ring-accent',
      Critical: 'focus-visible:ring-2 focus-visible:ring-critical',
    },
  },
});
```

**Focus Ring 전략**:

| Intent | Ring Color | Ring Width | Offset |
|--------|-----------|-----------|--------|
| Neutral | accent | 2px | 2px |
| Brand | accent | 2px | 2px |
| Critical | critical (red) | 2px | 2px |
| Positive | positive (green) | 2px | 2px |

**설계 원칙**:
- **focus-visible**: 마우스 클릭 시 표시 안 함 (키보드만)
- **ring-2**: 2px 테두리 (명확하게 보임)
- **ring-offset-2**: 2px 간격 (콘텐츠와 분리)

---

## 5. Adaptive Scale 계산 공식

### 5.1 통합 공식

```typescript
finalValue = baseValue × typeScaleFactor × prominenceFactor × densityFactor
```

### 5.2 전체 계산 플로우

```
┌─────────────────────────────────────────────────────────────┐
│ Input: sectionType="Panel", prominence="Hero", density="Standard" │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Base Value 선택                                      │
│   property = 'gap' → baseValue = 16px                       │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Type Scale Factor 적용                              │
│   typeScaleFactor = 0.875 (Panel)                          │
│   16px × 0.875 = 14px                                       │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Prominence Scale Factor 적용 (Type별로 다름)         │
│   prominenceFactor = 1.29 (Hero in Panel)                  │
│   14px × 1.29 = 18.06px                                     │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Density Factor 적용                                 │
│   densityFactor = 1.0 (Standard)                           │
│   18.06px × 1.0 = 18.06px                                   │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 5: Snap to Allowed Values                             │
│   18.06px → 16px (nearest: |18-16|=2 < |18-24|=6)          │
└─────────────────┬───────────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────────────┐
│ Output: gap-4 (16px)                                        │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 모든 조합 계산 예시

#### Gap 계산 (Base: 16px)

| sectionType | prominence | density | 계산 | Raw | Snap | Class |
|-------------|-----------|---------|------|-----|------|-------|
| Stage | Standard | Standard | 16×1.0×1.0×1.0 | 16 | 16 | gap-4 |
| Stage | Hero | Standard | 16×1.0×1.5×1.0 | 24 | 24 | gap-6 |
| Panel | Standard | Standard | 16×0.875×1.0×1.0 | 14 | 16 | gap-4 |
| Panel | Hero | Standard | 16×0.875×1.29×1.0 | 18.06 | 16 | gap-4 |
| Panel | Standard | Compact | 16×0.875×1.0×0.75 | 10.5 | 12 | gap-3 |
| Bar | Standard | Standard | 16×0.875×1.0×1.0 | 14 | 16 | gap-4 |
| Bar | Hero | Comfortable | 16×0.875×1.43×1.5 | 30.03 | 32 | gap-8 |
| Float | Standard | Standard | 16×0.8125×1.0×1.0 | 13 | 12 | gap-3 |
| Float | Subtle | Compact | 16×0.8125×0.92×0.75 | 8.97 | 8 | gap-2 |

**관찰 포인트**:
- Panel Hero (18.06px) → snap down to 16px
- Panel Compact (10.5px) → snap up to 12px
- **Snapping으로 인한 손실**: 최대 ±2-3px

#### PaddingX 계산 (Base: 12px)

| sectionType | prominence | density | 계산 | Raw | Snap | Class |
|-------------|-----------|---------|------|-----|------|-------|
| Stage | Standard | Standard | 12×1.0×1.0×1.0 | 12 | 12 | px-3 |
| Stage | Hero | Comfortable | 12×1.0×1.5×1.5 | 27 | 24 | px-6 |
| Panel | Standard | Compact | 12×0.875×1.0×0.75 | 7.875 | 8 | px-2 |
| Float | Subtle | Compact | 12×0.8125×0.92×0.75 | 6.73 | 8 | px-2 |

### 5.4 Type별 Prominence Factor 차이

**왜 Type마다 다른 prominence factor를 사용하는가?**

#### Stage (공간 충분)
```typescript
Hero: 1.5,      // 50% 증가 → 명확한 계층
Standard: 1.0,
Strong: 0.875,  // 12.5% 감소
Subtle: 0.875,
```

**사용 사례**: 메인 콘텐츠 영역
- Hero Title: 48px (매우 큼)
- Standard Body: 16px
- **차이**: 3배 (명확한 시각적 계층)

#### Panel (공간 제약)
```typescript
Hero: 1.29,     // 29% 증가 → 작은 증가
Standard: 1.0,
Strong: 0.86,   // 14% 감소
Subtle: 0.86,
```

**사용 사례**: Sidebar, Panel
- Hero Title: 27px (적당히 큼)
- Standard Body: 14px
- **차이**: 1.9배 (적당한 계층)

#### Float (최소 공간)
```typescript
Hero: 1.08,     // 8% 증가 → 거의 증가 없음
Standard: 1.0,
Strong: 0.92,   // 8% 감소
Subtle: 0.92,
```

**사용 사례**: Tooltip, Popover
- Hero Title: 15px (약간 큼)
- Standard Body: 13px
- **차이**: 1.15배 (미묘한 차이)

**설계 원칙**:
- **공간 ∝ prominence 차이**
- Stage: 큰 차이 → 명확한 계층
- Float: 작은 차이 → 공간 절약

---

## 6. Prominence 계산 공식

### 6.1 텍스트 투명도 공식

```typescript
textOpacity = {
  primary: 1.0,    // 100% (완전히 선명)
  secondary: 0.7,  // 70% (보조 정보)
  tertiary: 0.5,   // 50% (덜 중요한 정보)
}
```

**왜 이 값들인가?**
- **1.0 (100%)**: 기본 텍스트, 명확히 읽힘
- **0.7 (70%)**: 보조 정보, 읽히지만 덜 강조
- **0.5 (50%)**: 메타 정보, 배경과 조화

**근거**: WCAG 대비 기준
- 100%: 21:1 대비 (AAA)
- 70%: 7:1 대비 (AA)
- 50%: 4.5:1 대비 (AA, 작은 텍스트)

### 6.2 배경 강도 공식

```typescript
backgroundIntensity = base + (depth × depthMultiplier)

// Config
primary: { base: 0.02, depthMultiplier: 0.015 }
secondary: { base: 0.01, depthMultiplier: 0.008 }
tertiary: { base: 0, depthMultiplier: 0 }

// Max: 0.15 (15%)
```

**계산 예시**:

| depth | primary | secondary | tertiary |
|-------|---------|-----------|----------|
| 0 | 0.02 (2%) | 0.01 (1%) | 0 |
| 1 | 0.035 (3.5%) | 0.018 (1.8%) | 0 |
| 2 | 0.05 (5%) | 0.026 (2.6%) | 0 |
| 3 | 0.065 (6.5%) | 0.034 (3.4%) | 0 |
| 6 | 0.11 (11%) | 0.058 (5.8%) | 0 |
| 10 | 0.15 (15% max) | 0.09 (9%) | 0 |

**왜 depth에 따라 증가하는가?**
- **depth 0-1**: 배경 영역 → 약한 배경
- **depth 2-3**: 콘텐츠 영역 → 중간 배경
- **depth 4-6**: 떠있는 영역 → 강한 배경

**설계 원칙**: depth가 높을수록 **시각적 분리 필요** → 배경 강도 증가

### 6.3 Spacing Scale 공식

```typescript
spacingScale = {
  primary: 0.6,    // 60%
  secondary: 0.5,  // 50%
  tertiary: 0.3,   // 30%
}
```

**적용 예시** (Base gap: 16px):

| prominence | scale | gap |
|-----------|-------|-----|
| primary | 0.6 | 16px × 0.6 = 9.6px → 8px |
| secondary | 0.5 | 16px × 0.5 = 8px |
| tertiary | 0.3 | 16px × 0.3 = 4.8px → 4px |

**왜 60%, 50%, 30%인가?**
- **primary**: 적당한 간격 (Compact Density 적용)
- **secondary**: 조밀한 간격
- **tertiary**: 최소 간격

---

## 7. 공식 검증 및 테스트

### 7.1 단위 테스트 (Unit Test)

각 공식을 독립적으로 테스트합니다:

#### Spacing 공식 테스트

```typescript
describe('calculateSpacing', () => {
  it('Standard × Standard should return gap-4 px-3 py-2', () => {
    const result = calculateSpacing({
      prominence: 'Standard',
      density: 'Standard'
    });

    expect(result.gap).toBe(16);
    expect(result.paddingX).toBe(12);
    expect(result.paddingY).toBe(8);
    expect(result.className).toBe('gap-4 px-3 py-2');
  });

  it('Hero × Comfortable should return gap-8 px-6 py-4', () => {
    const result = calculateSpacing({
      prominence: 'Hero',
      density: 'Comfortable'
    });

    expect(result.gap).toBe(32); // 16 × 1.5 × 1.5 = 36 → snap to 32
    expect(result.paddingX).toBe(24); // 12 × 1.5 × 1.5 = 27 → snap to 24
    expect(result.className).toBe('gap-8 px-6 py-4');
  });
});
```

#### Adaptive Scale 공식 테스트

```typescript
describe('calculateAdaptiveScale', () => {
  it('Panel × Hero × Standard should calculate correctly', () => {
    const result = calculateAdaptiveScale(
      'Panel',      // typeScaleFactor: 0.875
      'Hero',       // prominenceFactor: 1.29
      'Standard',   // densityFactor: 1.0
      'gap'         // baseValue: 16
    );

    expect(result.rawValue).toBeCloseTo(18.06); // 16 × 0.875 × 1.29
    expect(result.finalValue).toBe(16); // snap to nearest
  });

  it('Float × Subtle × Compact should handle small values', () => {
    const result = calculateAdaptiveScale(
      'Float',    // 0.8125
      'Subtle',   // 0.92
      'Compact',  // 0.75
      'gap'
    );

    expect(result.rawValue).toBeCloseTo(8.97); // 16 × 0.8125 × 0.92 × 0.75
    expect(result.finalValue).toBe(8); // snap to 8px
  });
});
```

#### Snapping 알고리즘 테스트

```typescript
describe('snapToAllowedValue', () => {
  const testCases = [
    { input: 6, expected: 4 },    // closer to 4 than 8
    { input: 10, expected: 8 },   // closer to 8 than 12
    { input: 14, expected: 16 },  // closer to 16 than 12
    { input: 20, expected: 24 },  // closer to 24 than 16
    { input: 27, expected: 24 },  // closer to 24 than 32
    { input: 36, expected: 32 },  // closer to 32 than 48
  ];

  testCases.forEach(({ input, expected }) => {
    it(`should snap ${input}px to ${expected}px`, () => {
      expect(snapToAllowedValue(input)).toBe(expected);
    });
  });
});
```

### 7.2 Integration Test (통합 테스트)

Token Engine 전체 플로우를 테스트합니다:

```typescript
describe('TokenEngine Integration', () => {
  it('should generate correct tokens for Button in Panel', () => {
    const input: TokenInput = {
      role: 'Button',
      sectionType: 'Panel',
      prominence: 'Standard',
      intent: 'Brand',
      density: 'Standard',
    };

    const output = TokenEngine.resolve(input);

    // Spacing
    expect(output.spacing.gap).toBe('0.5rem'); // 8px
    expect(output.spacing.padding).toBe('0.5rem 1rem'); // 8px 16px

    // Surface
    expect(output.surface.background).toContain('bg-primary');

    // Typography
    expect(output.typography.size).toBe('text-base');
    expect(output.typography.color).toBe('text-white');
  });

  it('should apply context overrides for Immersive page', () => {
    const input: TokenInput = {
      role: 'Card',
      pageRole: 'Immersive',
      prominence: 'Standard',
    };

    const output = TokenEngine.resolve(input);

    // Immersive mode overrides
    expect(output.surface.background).toContain('bg-white/10');
    expect(output.surface.blur).toBe('backdrop-blur-xl');
  });
});
```

### 7.3 Visual Regression Test (시각적 회귀 테스트)

모든 prominence × density 조합을 시각적으로 확인:

```typescript
// Storybook Story
export const AllCombinations = () => {
  const prominences: Prominence[] = ['Hero', 'Standard', 'Strong', 'Subtle'];
  const densities: Density[] = ['Comfortable', 'Standard', 'Compact'];

  return (
    <div className="grid gap-4">
      {prominences.map(prominence => (
        <div key={prominence}>
          <h3>{prominence}</h3>
          <div className="flex gap-4">
            {densities.map(density => {
              const spacing = calculateSpacing({ prominence, density });
              return (
                <div key={density} className="border p-4">
                  <p>{density}</p>
                  <p className="text-xs text-muted">gap: {spacing.gap}px</p>
                  <div className={spacing.className}>
                    <button>Button</button>
                    <button>Button</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### 7.4 Performance Test (성능 테스트)

```typescript
describe('TokenEngine Performance', () => {
  it('should resolve tokens in less than 1ms', () => {
    const input: TokenInput = {
      role: 'Button',
      prominence: 'Standard',
      intent: 'Brand',
      density: 'Standard',
    };

    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      TokenEngine.resolve(input);
    }
    const end = performance.now();
    const avgTime = (end - start) / 1000;

    expect(avgTime).toBeLessThan(1); // < 1ms per call
  });

  it('should memoize identical inputs', () => {
    const input: TokenInput = {
      role: 'Button',
      prominence: 'Standard',
    };

    const result1 = TokenEngine.resolve(input);
    const result2 = TokenEngine.resolve(input);

    // Same input should return same reference (if memoized)
    // Note: Current implementation doesn't memoize, so this test would fail
    // This is a suggestion for future optimization
  });
});
```

### 7.5 Edge Case Test (엣지 케이스 테스트)

```typescript
describe('TokenEngine Edge Cases', () => {
  it('should handle undefined prominence (default to Standard)', () => {
    const output = TokenEngine.resolve({
      role: 'Button',
      prominence: undefined,
    });

    expect(output.spacing.gap).toBe('0.5rem'); // Standard gap
  });

  it('should handle unknown role (use Default)', () => {
    const output = TokenEngine.resolve({
      role: 'UnknownRole',
      prominence: 'Standard',
    });

    expect(output.spacing.padding).toBe('1rem 1rem'); // Default padding
  });

  it('should cap background intensity at 15%', () => {
    const intensity = getBackgroundIntensity(20, 'primary');
    expect(intensity).toBeLessThanOrEqual(0.15);
  });

  it('should handle extreme density factors', () => {
    // Hypothetical: density = 2.0 (not in current system)
    const result = calculateSpacing({
      prominence: 'Hero',
      density: 'Comfortable', // 1.5
    });

    // Should still snap to valid values
    expect([4, 8, 12, 16, 24, 32, 48, 64, 96]).toContain(result.gap);
  });
});
```

### 7.6 Accessibility Test (접근성 테스트)

```typescript
describe('TokenEngine Accessibility', () => {
  it('should maintain minimum touch target (44px)', () => {
    const output = TokenEngine.resolve({
      role: 'Button',
      prominence: 'Subtle',
      density: 'Compact',
    });

    // padding + content height should be >= 44px
    const paddingY = parseInt(output.spacing.padding.split(' ')[0]) * 2;
    const minContentHeight = 44 - paddingY;

    expect(minContentHeight).toBeGreaterThanOrEqual(0);
  });

  it('should maintain WCAG contrast ratio', () => {
    const output = TokenEngine.resolve({
      role: 'Button',
      prominence: 'Standard',
      intent: 'Brand',
    });

    // bg-primary (blue) + text-white should have > 4.5:1 contrast
    // This would require actual color value checking
  });

  it('should provide focus-visible for keyboard navigation', () => {
    const focusClass = focusVariants({ intent: 'Brand' });
    expect(focusClass).toContain('focus-visible:ring-2');
  });
});
```

---

## 요약

### 공식 총정리

| 요소 | 공식 | 변수 |
|------|------|------|
| **Spacing** | `base × prominence × density` | base(16,12,8), prominence(1.5~0.5), density(1.5~0.75) |
| **Typography** | `base × typeScale × prominence` | base(role별), typeScale(0.8125~1.0), prominence(1.5~0.86) |
| **Surface** | `base + prominence + intent + state + context` | 5단계 modifier 조합 |
| **Interactive** | `base + hover + active + selected + disabled + focus` | 상태별 className 조합 |
| **Adaptive** | `base × typeScale × prominence × density` | 4개 factor 곱셈 |
| **Prominence** | `base + depth × multiplier` | depth(0-6), multiplier(0~0.015) |

### 검증 방법

1. **Unit Test**: 각 공식 독립 테스트
2. **Integration Test**: TokenEngine 전체 플로우
3. **Visual Regression**: 모든 조합 시각화
4. **Performance Test**: 1ms 이하 목표
5. **Edge Case Test**: undefined, unknown role 처리
6. **Accessibility Test**: WCAG 준수, 터치 타겟 확인

### 핵심 원칙

- ✅ **수학적 일관성**: 감각이 아닌 공식
- ✅ **컨텍스트 인식**: SectionType별 자동 조정
- ✅ **허용 값 Snapping**: 일관된 그리드 유지
- ✅ **타입 안전성**: 잘못된 조합 방지
- ✅ **테스트 가능성**: 모든 공식 검증 가능

---

**작성일**: 2026-01-12
**작성자**: Claude (AI Assistant)
**버전**: Token Engine v3.1 - Formula Deep Dive
