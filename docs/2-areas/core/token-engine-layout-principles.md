# Token Engine 레이아웃 원칙: Padding, Border, Radius 관계

> **"시각적 분리 방법에 따라 padding과 radius가 결정된다"**
>
> Padding, Border, Radius는 독립적이지 않습니다. 시각적 분리 방법(border vs background)에 따라 자동으로 결정되어야 합니다.

---

## 목차

1. [핵심 원칙](#1-핵심-원칙)
2. [현재 문제점](#2-현재-문제점)
3. [개선된 공식](#3-개선된-공식)
4. [Overflow-hidden 제거 전략](#4-overflow-hidden-제거-전략)
5. [구현 제안](#5-구현-제안)

---

## 1. 핵심 원칙

### 1.1 시각적 분리 방법론

UI 요소를 구분하는 방법은 **3가지**입니다:

#### Method 1: Border 분리 (선으로 구분)

```
┌─────────────────────┐
│ Content             │  ← No padding
├─────────────────────┤  ← Border로 구분
│ Content             │
└─────────────────────┘
```

**특징**:
- ✅ **Padding 없음** (border가 경계 역할)
- ✅ **Radius 없음** (직선 강조)
- ✅ 공간 절약 (정보 밀도 높음)
- ✅ 예: Table, List, Divider

#### Method 2: Surface 분리 (면으로 구분)

```
╔═════════════════════╗
║  ░░░░░░░░░░░░░░░░  ║  ← Padding 있음
║  ░  Content    ░  ║  ← Background로 구분
║  ░░░░░░░░░░░░░░░░  ║
╚═════════════════════╝
```

**특징**:
- ✅ **Padding 있음** (콘텐츠와 배경 분리)
- ✅ **Radius 있음** (부드러운 모서리)
- ✅ **Border 없음** (배경이 경계 역할)
- ✅ 예: Card, Button, Modal

#### Method 3: Hybrid (면 + 선)

```
╔═════════════════════╗
║  ░░░░░░░░░░░░░░░░  ║  ← Padding 있음
║  ░  Content    ░  ║  ← Background
║  ░░░░░░░░░░░░░░░░  ║
╠═════════════════════╣  ← Border 추가
║  Footer             ║
╚═════════════════════╝
```

**특징**:
- ✅ **Padding 있음**
- ✅ **Radius 있음** (외곽만)
- ✅ **Border 있음** (내부 구분선)
- ✅ 예: Card with sections

### 1.2 결정 규칙 (Decision Tree)

```
시각적 분리가 필요한가?
    │
    ├─ Yes → 어떤 방법으로?
    │         │
    │         ├─ Border (선) → padding: 0, radius: 0, border: 1px
    │         │
    │         └─ Surface (면) → padding: 있음, radius: 있음, border: 0
    │
    └─ No → padding: 0, radius: 0, border: 0
```

### 1.3 핵심 공식

```typescript
// Surface 분리 사용 시
if (hasSurface) {
  padding = calculate(prominence, density);
  radius = calculate(prominence, role);
  border = 0;
}

// Border 분리 사용 시
else if (hasBorder) {
  padding = 0;
  radius = 0;
  border = 1px;
}

// 분리 없음
else {
  padding = 0;
  radius = 0;
  border = 0;
}
```

---

## 2. 현재 문제점

### 2.1 Padding과 Border의 충돌

**문제**: 현재 코드에서 padding과 border가 **독립적으로 계산**됨

```tsx
// ❌ 현재: padding과 border가 동시에 적용됨
<Block role="Card" prominence="Standard">
  {/* padding: 12px, border: 1px */}
  {/* Surface(배경)로 이미 구분되는데 border도 있음 */}
</Block>
```

**결과**:
- 불필요한 border (배경만으로 충분)
- 과도한 공간 (padding + border)
- 시각적 혼란

### 2.2 Radius 누락

**문제**: Surface 분리를 사용하는데 **radius가 없음**

```tsx
// ❌ 현재: padding은 있는데 radius가 없음
<Block role="Card" className="p-4">
  {/* 배경색은 있는데 모서리가 직각 */}
  {/* 부드러운 느낌이 없음 */}
</Block>
```

**결과**:
- 딱딱한 느낌
- 현대적인 디자인과 불일치
- padding과 radius의 관계 무시

### 2.3 Overflow-hidden 남발

**문제**: radius를 적용하면서 **overflow-hidden 자동 추가**

```tsx
// ❌ 현재: radius가 있으면 overflow-hidden
<Block role="Card" className="rounded-lg overflow-hidden">
  {/* 자식 요소가 잘림 */}
  {/* Tooltip, Dropdown이 숨겨짐 */}
</Block>
```

**결과**:
- Tooltip이 Card 밖으로 나가면 **잘림**
- Dropdown이 Card 경계에서 **숨겨짐**
- Sticky 요소가 **작동 안 함**

---

## 3. 개선된 공식

### 3.1 Surface Strategy (면 분리)

#### 공식

```typescript
interface SurfaceStrategy {
  // 1. Padding 계산
  padding = baseValue × prominenceFactor × densityFactor;

  // 2. Radius 계산 (padding과 비례)
  radius = padding × radiusRatio;

  // 3. Border 제거
  border = 0;

  // 4. Overflow 처리
  overflow = 'visible'; // 기본적으로 visible
}
```

#### Radius Ratio (역할별)

```typescript
const RADIUS_RATIO: Record<Role, number> = {
  // Container - 큰 radius
  Card: 0.75,        // padding 12px → radius 9px (rounded-lg)
  Modal: 1.0,        // padding 32px → radius 32px (rounded-2xl)
  Panel: 0.5,        // padding 12px → radius 6px (rounded-md)

  // Action - 중간 radius
  Button: 0.67,      // padding 12px → radius 8px (rounded-lg)
  Chip: 999,         // padding 8px → radius 9999px (rounded-full)

  // Inline - 작은 radius
  Badge: 0.33,       // padding 6px → radius 2px (rounded-sm)
  Tag: 0.5,          // padding 8px → radius 4px (rounded)

  // No radius
  Input: 0.5,        // padding 12px → radius 6px (rounded-md)
};
```

**근거**:
- **Padding이 클수록 radius도 커야 함** (비례 관계)
- Container는 넓은 padding → 큰 radius (부드러움 강조)
- Inline 요소는 좁은 padding → 작은 radius (섬세함)

#### 계산 예시

```typescript
// Card (Surface Strategy)
prominence = 'Standard';  // factor: 1.0
density = 'Standard';     // factor: 1.0

// Step 1: Padding
padding = 12 × 1.0 × 1.0 = 12px  // px-3

// Step 2: Radius (Card ratio: 0.75)
radius = 12 × 0.75 = 9px → snap to 8px  // rounded-lg

// Step 3: Border
border = 0

// Output
className = "px-3 py-2 rounded-lg"  // border 없음, overflow-hidden 없음
```

```typescript
// Modal (Surface Strategy)
prominence = 'Hero';      // factor: 1.5
density = 'Standard';     // factor: 1.0

// Step 1: Padding
padding = 32 × 1.5 × 1.0 = 48px  // p-12

// Step 2: Radius (Modal ratio: 1.0)
radius = 48 × 1.0 = 48px  // rounded-[48px]

// Step 3: Border
border = 0

// Output
className = "p-12 rounded-[48px]"  // 매우 부드러운 모서리
```

### 3.2 Border Strategy (선 분리)

#### 공식

```typescript
interface BorderStrategy {
  // 1. Padding 제거
  padding = 0;

  // 2. Radius 제거
  radius = 0;

  // 3. Border 적용
  border = {
    width: 1px,
    color: 'border-default',
  };

  // 4. Overflow 처리
  overflow = 'visible';
}
```

#### 적용 대상

```typescript
const BORDER_STRATEGY_ROLES = [
  'Table',
  'TableRow',
  'TableCell',
  'List',
  'ListItem',
  'Divider',
  'Separator',
  'Tree',
  'TreeNode',
];
```

**근거**:
- 정보 밀도가 높은 요소
- 공간 절약이 중요
- 직선으로 명확히 구분 필요

#### 계산 예시

```typescript
// Table (Border Strategy)

// Step 1: Padding
padding = 0

// Step 2: Radius
radius = 0

// Step 3: Border
border = 1px

// Output
className = "border border-default"  // padding 없음, radius 없음
```

### 3.3 Hybrid Strategy (면 + 선)

#### 공식

```typescript
interface HybridStrategy {
  // 1. Outer Padding (외곽)
  outerPadding = calculate(prominence, density);

  // 2. Outer Radius (외곽만)
  outerRadius = outerPadding × radiusRatio;

  // 3. Inner Border (내부 구분선)
  innerBorder = {
    width: 1px,
    color: 'border-default',
  };

  // 4. Inner Padding
  innerPadding = 0;  // 내부는 border로 구분

  // 5. Overflow
  overflow = 'visible';
}
```

#### 적용 예시

```tsx
// Card with Sections
<Block role="Card" className="p-4 rounded-lg">  {/* Outer: padding + radius */}
  <Section role="Header" className="border-b">   {/* Inner: border, no padding */}
    <Text>Title</Text>
  </Section>
  <Section role="Content" className="border-b">  {/* Inner: border, no padding */}
    <Text>Content</Text>
  </Section>
  <Section role="Footer">                        {/* Inner: no border */}
    <Action>OK</Action>
  </Section>
</Block>
```

**결과**:
- Outer: 부드러운 모서리 (padding + radius)
- Inner: 명확한 구분 (border, no padding)
- 공간 효율적

---

## 4. Overflow-hidden 제거 전략

### 4.1 왜 Overflow-hidden을 피해야 하는가?

#### 문제 사례 1: Tooltip 잘림

```tsx
// ❌ 현재: overflow-hidden으로 Tooltip 잘림
<Block role="Card" className="rounded-lg overflow-hidden">
  <Action>
    Hover me
    <Tooltip>This tooltip is cut off!</Tooltip>  {/* 잘림! */}
  </Action>
</Block>
```

**해결**:
```tsx
// ✅ 개선: overflow-visible
<Block role="Card" className="rounded-lg">  {/* overflow-hidden 제거 */}
  <Action>
    Hover me
    <Tooltip>This tooltip is visible!</Tooltip>  {/* 보임! */}
  </Action>
</Block>
```

#### 문제 사례 2: Dropdown 숨김

```tsx
// ❌ 현재: overflow-hidden으로 Dropdown 숨김
<Block role="Panel" className="overflow-hidden">
  <Select>
    <Option>Option 1</Option>  {/* Panel 밖으로 나가면 숨김 */}
  </Select>
</Block>
```

**해결**:
```tsx
// ✅ 개선: Dropdown을 Portal로 분리
<Block role="Panel">  {/* overflow-hidden 제거 */}
  <Select>
    <Portal>  {/* body에 render */}
      <Option>Option 1</Option>  {/* 항상 보임 */}
    </Portal>
  </Select>
</Block>
```

#### 문제 사례 3: Sticky 작동 안 함

```tsx
// ❌ 현재: overflow-hidden으로 sticky 작동 안 함
<Block role="Container" className="overflow-hidden">
  <Block className="sticky top-0">Header</Block>  {/* sticky 안 됨! */}
  <Block>Content</Block>
</Block>
```

**해결**:
```tsx
// ✅ 개선: overflow-hidden 제거
<Block role="Container">  {/* overflow-hidden 제거 */}
  <Block className="sticky top-0">Header</Block>  {/* sticky 작동! */}
  <Block>Content</Block>
</Block>
```

### 4.2 Overflow-hidden이 필요한 경우

**예외적으로 필요한 경우**만 명시적으로 추가:

#### Case 1: Image Crop

```tsx
// ✅ 이미지 crop 시에만 overflow-hidden
<Block role="Card" className="rounded-lg">
  <div className="overflow-hidden rounded-t-lg">  {/* 이미지만 crop */}
    <img src="..." className="w-full" />
  </div>
  <Block className="p-4">
    <Text>Content</Text>  {/* 여기서는 overflow-visible */}
  </Block>
</Block>
```

#### Case 2: Text Ellipsis

```tsx
// ✅ Text truncate 시에만 overflow-hidden
<Block role="ListItem">
  <Text className="truncate overflow-hidden">  {/* 텍스트만 ellipsis */}
    Very long text that needs truncation
  </Text>
</Block>
```

#### Case 3: Scrollable Area

```tsx
// ✅ Scroll 영역만 overflow-auto
<Block role="Panel" className="rounded-lg">
  <Block className="p-4">
    <Text>Header</Text>  {/* overflow-visible */}
  </Block>
  <Block className="overflow-auto h-96">  {/* Scroll 영역만 overflow */}
    <Text>Scrollable content</Text>
  </Block>
</Block>
```

### 4.3 기본 원칙

```typescript
// ❌ 절대 하지 말 것
className = `rounded-lg overflow-hidden`;  // radius + overflow-hidden 동시 적용

// ✅ 기본 원칙
className = `rounded-lg`;  // radius만 (overflow는 기본 visible)

// ✅ 필요 시에만 명시적 추가
className = `rounded-lg ${needsOverflowHidden ? 'overflow-hidden' : ''}`;
```

---

## 5. 구현 제안

### 5.1 Strategy 자동 선택

```typescript
/**
 * 역할에 따라 자동으로 Strategy 선택
 */
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

### 5.2 Geometry Token Generator 개선

```typescript
export function generateGeometry(input: TokenInput): GeometryTokens {
  const { role, prominence = 'Standard', density = 'Standard' } = input;

  // 1. Strategy 선택
  const strategy = getLayoutStrategy(role);

  if (strategy === 'surface') {
    // Surface Strategy: padding → radius, no border

    // 1-1. Padding 계산
    const padding = calculatePadding(prominence, density);

    // 1-2. Radius 계산 (padding 비례)
    const radiusRatio = RADIUS_RATIO[role] || 0.5;
    const rawRadius = padding.x * radiusRatio;
    const radius = snapToAllowedRadius(rawRadius);

    return {
      padding: `${padding.y}px ${padding.x}px`,
      radius: `${radius}px`,
      border: 'none',
      overflow: 'visible',  // 기본 visible
    };
  }

  else if (strategy === 'border') {
    // Border Strategy: no padding, no radius, border

    return {
      padding: '0',
      radius: '0',
      border: '1px solid var(--border-default)',
      overflow: 'visible',
    };
  }
}
```

### 5.3 Radius Snapping

```typescript
const ALLOWED_RADIUS = [0, 2, 4, 6, 8, 12, 16, 24, 9999];

function snapToAllowedRadius(value: number): number {
  if (value > 100) return 9999; // rounded-full
  return ALLOWED_RADIUS.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}
```

**Radius Mapping**:

| Raw Radius | Snap | Tailwind |
|-----------|------|----------|
| 2px | 2px | rounded-sm |
| 4px | 4px | rounded |
| 6px | 6px | rounded-md |
| 9px | 8px | rounded-lg |
| 12px | 12px | rounded-xl |
| 24px | 24px | rounded-2xl |
| 48px | 48px | rounded-[48px] |
| 100px+ | 9999px | rounded-full |

### 5.4 Overflow 제어

```typescript
interface GeometryTokens {
  padding: string;
  radius: string;
  border: string;
  overflow: 'visible' | 'hidden' | 'auto' | 'scroll';  // 명시적 제어
}

// 기본값: visible
export function generateGeometry(input: TokenInput): GeometryTokens {
  // ...

  return {
    // ...
    overflow: input.overflow || 'visible',  // 기본 visible
  };
}

// 필요 시에만 override
<Block role="Card" overflow="hidden">  {/* 명시적으로 지정 */}
```

### 5.5 CVA Variants 예시

```typescript
import { cva } from 'class-variance-authority';

export const geometryVariants = cva('', {
  variants: {
    role: {
      // Surface Strategy
      Card: 'rounded-lg',      // padding과 함께 사용
      Button: 'rounded-lg',
      Modal: 'rounded-2xl',
      Badge: 'rounded-sm',
      Chip: 'rounded-full',

      // Border Strategy
      Table: 'rounded-none',   // border와 함께 사용
      TableRow: 'rounded-none',
      List: 'rounded-none',
      ListItem: 'rounded-none',
      Divider: 'rounded-none',
    },
    prominence: {
      Hero: '',
      Standard: '',
      Subtle: '',
    },
  },
  compoundVariants: [
    // Surface Strategy: prominence에 따라 radius 조정
    { role: 'Card', prominence: 'Hero', class: 'rounded-xl' },      // 더 큰 radius
    { role: 'Card', prominence: 'Standard', class: 'rounded-lg' },
    { role: 'Card', prominence: 'Subtle', class: 'rounded-md' },    // 더 작은 radius

    // Border Strategy: prominence 무관하게 radius 0
    { role: 'Table', prominence: 'Hero', class: 'rounded-none' },
    { role: 'Table', prominence: 'Standard', class: 'rounded-none' },
  ],
});

export const overflowVariants = cva('', {
  variants: {
    overflow: {
      visible: 'overflow-visible',  // 기본값
      hidden: 'overflow-hidden',
      auto: 'overflow-auto',
      scroll: 'overflow-scroll',
    },
  },
  defaultVariants: {
    overflow: 'visible',  // 기본은 항상 visible
  },
});
```

### 5.6 사용 예시

```tsx
// Surface Strategy (자동)
<Block role="Card" prominence="Standard">
  {/* 자동: px-3 py-2 rounded-lg (border 없음, overflow-visible) */}
  <Text>Content</Text>
  <Tooltip>This is visible!</Tooltip>  {/* 잘리지 않음 */}
</Block>

// Border Strategy (자동)
<Block role="Table">
  {/* 자동: border border-default (padding 없음, radius 없음) */}
  <Block role="TableRow">
    <Block role="TableCell">Cell</Block>
  </Block>
</Block>

// Hybrid Strategy (수동 조합)
<Block role="Card" prominence="Standard">  {/* px-3 py-2 rounded-lg */}
  <Section role="Header" className="border-b">  {/* border, no padding */}
    <Text>Header</Text>
  </Section>
  <Section role="Content">
    <Text>Content</Text>
  </Section>
</Block>

// 필요 시에만 overflow-hidden 명시
<Block role="Card" overflow="hidden">  {/* 명시적으로 지정 */}
  <img src="..." className="w-full h-full object-cover" />
</Block>
```

---

## 요약

### 핵심 원칙

1. **Surface 분리 = Padding + Radius, No Border**
   - 배경으로 구분
   - 부드러운 모서리
   - 예: Card, Button, Modal

2. **Border 분리 = No Padding, No Radius, Border**
   - 선으로 구분
   - 공간 절약
   - 예: Table, List, Divider

3. **Overflow는 기본 Visible**
   - Tooltip/Dropdown 잘림 방지
   - Sticky 작동 보장
   - 필요 시에만 명시적 추가

### 개선된 공식

```typescript
// Surface Strategy
if (role === 'Card' || 'Button' || 'Modal') {
  padding = calculate(prominence, density);
  radius = padding × radiusRatio[role];
  border = 0;
  overflow = 'visible';
}

// Border Strategy
if (role === 'Table' || 'List' || 'Divider') {
  padding = 0;
  radius = 0;
  border = 1px;
  overflow = 'visible';
}
```

### 기대 효과

- ✅ **시각적 일관성**: 분리 방법에 따라 자동으로 padding/radius 결정
- ✅ **공간 효율**: Border Strategy에서 불필요한 padding 제거
- ✅ **사용성 개선**: Tooltip/Dropdown 잘림 없음
- ✅ **코드 단순화**: overflow-hidden 남발 제거

---

**작성일**: 2026-01-12
**작성자**: Claude (AI Assistant)
**버전**: Layout Principles v1.0
**관련 문서**: token-engine-formula-report.md
