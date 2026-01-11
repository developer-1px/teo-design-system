유 # Adaptive Scale System: Prominence × Density × Section Type

**Research Document**
**Date**: 2026-01-11
**Status**: Draft

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Current System Analysis](#2-current-system-analysis)
3. [Section Type Scale System](#3-section-type-scale-system)
4. [Unified Scale Formula](#4-unified-scale-formula)
5. [Constraint-Based Adaptation](#5-constraint-based-adaptation)
6. [Implementation Proposal](#6-implementation-proposal)
7. [Examples & Validation](#7-examples--validation)
8. [Next Steps](#8-next-steps)

---

## 1. Introduction

### 1.1 Problem Statement

기존 spacing system (`spacing-tokens.ts`)은 `prominence × density` 조합으로 gap과 padding을 계산합니다:

```ts
// Standard × Standard → gap-4, px-3, py-2
prominence: 'Standard', density: 'Standard'
```

그러나 Section Type Spec에 따르면, **같은 prominence라도 Section Type에 따라 다른 크기로 렌더링**되어야 합니다:

```tsx
// Stage의 Hero: 48px (큰 제목)
<Section type="Stage">
  <Text prominence="Hero">대시보드</Text>
</Section>

// Panel의 Hero: 18px (패널 제목)
<Section type="Panel">
  <Text prominence="Hero">필터</Text>
</Section>

// Bar의 Hero: 20px (헤더 제목)
<Section type="Bar">
  <Text prominence="Hero">앱 이름</Text>
</Section>
```

**prominence는 절대값이 아니라 "해당 컨텍스트 내에서의 상대적 위계"**를 의미합니다.

### 1.2 Research Goals

1. Section Type별 Scale Token 시스템 설계
2. `prominence × density × sectionType` 통합 공식 개발
3. 제약 기반 적응형 spacing 알고리즘 연구
4. 기존 spacing-tokens.ts와의 통합 방안 제시

### 1.3 Design Principles

1. **Predictable**: 6개 Type으로 모든 레이아웃 커버
2. **Adaptive**: 같은 Element가 Type에 따라 다르게 렌더링
3. **Consistent**: prominence의 상대적 의미 유지
4. **Scalable**: Type은 고정, Role은 확장 가능

---

## 2. Current System Analysis

### 2.1 Existing Spacing System

현재 `spacing-tokens.ts`는 다음과 같이 동작합니다:

```ts
// Base spacing values
BASE_GAP = 16;       // Standard × Standard
BASE_PADDING_X = 12;
BASE_PADDING_Y = 8;

// Prominence factors
Hero: 1.5
Standard: 1.0
Strong: 0.75
Subtle: 0.5

// Density factors
Comfortable: 1.5
Standard: 1.0
Compact: 0.75

// Formula
finalValue = baseValue × prominenceFactor × densityFactor
```

**예시**:
```ts
// Hero × Comfortable
gap = 16 × 1.5 × 1.5 = 36 → snap to 32
px = 12 × 1.5 × 1.5 = 27 → snap to 24
py = 8 × 1.5 × 1.5 = 18 → snap to 16

// Standard × Compact
gap = 16 × 1.0 × 0.75 = 12 → snap to 12
px = 12 × 1.0 × 0.75 = 9 → snap to 8
py = 8 × 1.0 × 0.75 = 6 → snap to 8
```

### 2.2 Limitations

1. **Section Type 무시**: 모든 Section에서 동일한 spacing
2. **물리적 제약 미반영**: Bar의 높이 제한, Rail의 너비 제한 등
3. **컨텍스트 무관**: Stage와 Panel에서 동일한 prominence → 동일한 크기

---

## 3. Section Type Scale System

### 3.1 Type Scale Tokens (from Section Type Spec)

각 Type은 고유한 Scale Token을 가집니다:

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
    variant: 'icon' | 'menuItem' | 'button' | 'default';
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

### 3.2 Type Scale Comparison

| Type | Hero | Standard | Subtle | Base Space | Action Height | Default Density |
|------|------|----------|--------|------------|---------------|-----------------|
| **Bar** | 20px | 14px | 12px | 12px | 36px | Compact |
| **Rail** | 16px | 14px | 12px | 8px | 40px | Compact |
| **Panel** | 18px | 14px | 12px | 12px | 36px | Compact |
| **Stage** | 48px | 16px | 14px | 24px | 44px | Standard |
| **Layer** | 24px | 16px | 14px | 20px | 44px | Standard |
| **Float** | 14px | 13px | 12px | 8px | 28px | Compact |

**핵심 통찰**:
- Stage Hero (48px) vs Panel Hero (18px): **2.67배 차이**
- Stage Base Space (24px) vs Bar Base Space (12px): **2배 차이**
- Compact Types (Bar, Rail, Panel): Action 36-40px
- Standard Types (Stage, Layer): Action 44px

### 3.3 Type Scale Ratios

각 Type의 prominence 간 비율을 분석합니다:

```ts
// Stage (자유로운 Type)
Hero / Standard = 48 / 16 = 3.0
Standard / Subtle = 16 / 14 = 1.14

// Panel (제약된 Type)
Hero / Standard = 18 / 14 = 1.29
Standard / Subtle = 14 / 12 = 1.17

// Bar (매우 제약된 Type)
Hero / Standard = 20 / 14 = 1.43
Standard / Subtle = 14 / 12 = 1.17
```

**발견**:
- Stage는 prominence 간 차이가 큼 (3.0배)
- Panel, Bar는 차이가 작음 (1.29-1.43배)
- **제약이 클수록 prominence 차이가 작아짐**

---

## 4. Unified Scale Formula

### 4.1 Three-Dimensional Scale System

기존의 2D 시스템을 3D로 확장합니다:

```
기존: prominence × density → value
제안: prominence × density × sectionType → value
```

### 4.2 Type Scale Factor

각 Type의 기본 스케일 배수를 정의합니다:

```ts
// Type Scale Factor (Stage를 1.0 기준)
const typeScaleFactors = {
  Bar: 0.67,      // Bar는 Stage의 67% 크기
  Rail: 0.58,     // Rail은 Stage의 58% 크기
  Panel: 0.75,    // Panel은 Stage의 75% 크기
  Stage: 1.0,     // 기준
  Layer: 0.83,    // Layer는 Stage의 83% 크기
  Float: 0.54,    // Float는 Stage의 54% 크기 (가장 작음)
};
```

**근거**:
```
Bar Hero (20) / Stage Hero (48) = 0.42
Bar Standard (14) / Stage Standard (16) = 0.88
Bar 평균 = (0.42 + 0.88) / 2 = 0.65 ≈ 0.67

Panel Hero (18) / Stage Hero (48) = 0.38
Panel Standard (14) / Stage Standard (16) = 0.88
Panel 평균 = (0.38 + 0.88) / 2 = 0.63 ≈ 0.75 (약간 조정)
```

### 4.3 Prominence Scale Factor

Type별로 prominence 간 차이 비율이 다릅니다:

```ts
// Prominence Scale Factor (Type별 차별화)
const prominenceScaleFactors = {
  Stage: {
    Hero: 1.5,      // 큰 차이
    Standard: 1.0,
    Subtle: 0.875,  // 14/16
  },
  Panel: {
    Hero: 1.29,     // 작은 차이
    Standard: 1.0,
    Subtle: 0.86,   // 12/14
  },
  Bar: {
    Hero: 1.43,     // 중간 차이
    Standard: 1.0,
    Subtle: 0.86,
  },
  // Rail, Layer, Float도 유사하게 정의
};
```

### 4.4 Unified Formula

```ts
/**
 * Adaptive Scale Formula
 *
 * finalValue = baseValue
 *            × typeScaleFactor
 *            × prominenceScaleFactor[type][prominence]
 *            × densityFactor
 *            → snap to allowed values
 */

function calculateAdaptiveScale(
  type: SectionType,
  prominence: Prominence,
  density: Density,
  property: 'gap' | 'paddingX' | 'paddingY' | 'fontSize'
): number {
  // 1. Base value (Stage × Standard × Standard 기준)
  const baseValues = {
    gap: 16,
    paddingX: 12,
    paddingY: 8,
    fontSize: 16,
  };
  const baseValue = baseValues[property];

  // 2. Type scale factor
  const typeFactor = typeScaleFactors[type];

  // 3. Prominence scale factor (Type별로 다름)
  const prominenceFactor = prominenceScaleFactors[type][prominence];

  // 4. Density factor
  const densityFactor = densityFactors[density];

  // 5. Calculate
  const rawValue = baseValue * typeFactor * prominenceFactor * densityFactor;

  // 6. Snap to allowed values
  return snapToAllowedValue(rawValue);
}
```

### 4.5 Example Calculations

```ts
// Example 1: Stage × Hero × Comfortable
type = 'Stage', prominence = 'Hero', density = 'Comfortable'

gap = 16 × 1.0 × 1.5 × 1.5 = 36 → 32px
paddingX = 12 × 1.0 × 1.5 × 1.5 = 27 → 24px
paddingY = 8 × 1.0 × 1.5 × 1.5 = 18 → 16px

// Example 2: Panel × Hero × Standard
type = 'Panel', prominence = 'Hero', density = 'Standard'

gap = 16 × 0.75 × 1.29 × 1.0 = 15.48 → 16px
paddingX = 12 × 0.75 × 1.29 × 1.0 = 11.61 → 12px
paddingY = 8 × 0.75 × 1.29 × 1.0 = 7.74 → 8px

// Example 3: Bar × Standard × Compact
type = 'Bar', prominence = 'Standard', density = 'Compact'

gap = 16 × 0.67 × 1.0 × 0.75 = 8.04 → 8px
paddingX = 12 × 0.67 × 1.0 × 0.75 = 6.03 → 8px (min)
paddingY = 8 × 0.67 × 1.0 × 0.75 = 4.02 → 4px
```

---

## 5. Constraint-Based Adaptation

### 5.1 Physical Constraints

각 Type은 물리적 제약을 가지며, 이는 spacing에 영향을 줍니다:

```ts
interface TypeConstraints {
  // 크기 제약
  width?: { min?: number; max?: number; fixed?: number };
  height?: { min?: number; max?: number; fixed?: number };

  // 레이아웃 제약
  direction: 'horizontal' | 'vertical' | 'free';
  overflow: 'hidden' | 'scroll' | 'auto';

  // Spacing 제약
  maxGap?: number;        // gap 상한선
  maxPadding?: number;    // padding 상한선
  minTouchTarget?: number; // 터치 타겟 최소 크기
}

const typeConstraints: Record<SectionType, TypeConstraints> = {
  Bar: {
    height: { fixed: 56 },
    direction: 'horizontal',
    overflow: 'hidden',
    maxGap: 12,           // Bar는 gap이 12px를 넘을 수 없음
    maxPadding: 16,
    minTouchTarget: 36,   // 모바일 터치 타겟
  },
  Rail: {
    width: { min: 48, max: 200 },
    direction: 'vertical',
    overflow: 'scroll',
    maxGap: 8,
    maxPadding: 12,
    minTouchTarget: 40,
  },
  Panel: {
    width: { min: 240, max: 400 },
    direction: 'vertical',
    overflow: 'scroll',
    maxGap: 16,
    maxPadding: 16,
  },
  Stage: {
    // 제약 없음
    direction: 'free',
    overflow: 'auto',
  },
  // ... Layer, Float
};
```

### 5.2 Constraint Application

계산된 값이 제약을 위반하면 조정합니다:

```ts
function applyConstraints(
  type: SectionType,
  property: 'gap' | 'paddingX' | 'paddingY',
  value: number
): number {
  const constraints = typeConstraints[type];

  // Max gap constraint
  if (property === 'gap' && constraints.maxGap) {
    value = Math.min(value, constraints.maxGap);
  }

  // Max padding constraint
  if ((property === 'paddingX' || property === 'paddingY') && constraints.maxPadding) {
    value = Math.min(value, constraints.maxPadding);
  }

  // Min touch target (for Actions)
  if (constraints.minTouchTarget) {
    // Action height는 minTouchTarget 이상이어야 함
    // (Action 렌더링 시 적용)
  }

  return value;
}
```

### 5.3 Dynamic Adaptation

컨테이너 크기에 따라 동적으로 조정합니다:

```ts
function adaptToContainerSize(
  type: SectionType,
  containerWidth: number,
  calculatedValue: number
): number {
  // Rail collapsed → expanded 전환
  if (type === 'Rail') {
    if (containerWidth < 100) {
      // Collapsed: spacing 최소화
      return calculatedValue * 0.5;
    }
  }

  // Panel 너비가 최소값 근처일 때 padding 축소
  if (type === 'Panel') {
    const minWidth = typeConstraints.Panel.width!.min!;
    if (containerWidth < minWidth + 40) {
      return calculatedValue * 0.75;
    }
  }

  return calculatedValue;
}
```

---

## 6. Implementation Proposal

### 6.1 New File Structure

```
src/shared/config/
├── spacing-tokens.ts           # 기존 (prominence × density)
├── type-scale-tokens.ts        # NEW (Section Type Scale Tokens)
├── adaptive-scale-tokens.ts    # NEW (통합 공식)
└── interactive-tokens.ts       # 기존
```

### 6.2 Type Scale Tokens

```ts
// src/shared/config/type-scale-tokens.ts

export interface TypeScaleTokens {
  dimensions: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    fixedWidth?: number;
    fixedHeight?: number;
  };

  text: {
    Hero: number;
    Standard: number;
    Subtle: number;
  };

  space: {
    base: number;
    tight: number;
    loose: number;
  };

  action: {
    height: number;
    minWidth?: number;
    variant: 'icon' | 'menuItem' | 'button' | 'default';
  };

  field?: {
    height: number;
    labelPosition: 'top' | 'left' | 'hidden';
  };

  defaultDensity: Density;
}

export const TYPE_SCALE_TOKENS: Record<SectionType, TypeScaleTokens> = {
  Bar: {
    dimensions: { fixedHeight: 56 },
    text: { Hero: 20, Standard: 14, Subtle: 12 },
    space: { base: 12, tight: 8, loose: 16 },
    action: { height: 36, variant: 'icon' },
    defaultDensity: 'Compact',
  },

  Rail: {
    dimensions: { minWidth: 48, maxWidth: 200 },
    text: { Hero: 16, Standard: 14, Subtle: 12 },
    space: { base: 8, tight: 4, loose: 12 },
    action: { height: 40, variant: 'menuItem' },
    defaultDensity: 'Compact',
  },

  Panel: {
    dimensions: { minWidth: 240, maxWidth: 400 },
    text: { Hero: 18, Standard: 14, Subtle: 12 },
    space: { base: 12, tight: 8, loose: 16 },
    action: { height: 36, variant: 'button' },
    field: { height: 32, labelPosition: 'top' },
    defaultDensity: 'Compact',
  },

  Stage: {
    dimensions: {},
    text: { Hero: 48, Standard: 16, Subtle: 14 },
    space: { base: 24, tight: 16, loose: 32 },
    action: { height: 44, variant: 'default' },
    field: { height: 40, labelPosition: 'top' },
    defaultDensity: 'Standard',
  },

  Layer: {
    dimensions: { maxWidth: 560, maxHeight: '90vh' },
    text: { Hero: 24, Standard: 16, Subtle: 14 },
    space: { base: 20, tight: 12, loose: 24 },
    action: { height: 44, variant: 'default' },
    field: { height: 40, labelPosition: 'top' },
    defaultDensity: 'Standard',
  },

  Float: {
    dimensions: { maxWidth: 320 },
    text: { Hero: 14, Standard: 13, Subtle: 12 },
    space: { base: 8, tight: 4, loose: 12 },
    action: { height: 28, variant: 'menuItem' },
    defaultDensity: 'Compact',
  },
};
```

### 6.3 Adaptive Scale Calculator

```ts
// src/shared/config/adaptive-scale-tokens.ts

import type { SectionType, Prominence, Density } from '@/components/types/Shared.types';
import { TYPE_SCALE_TOKENS } from './type-scale-tokens';

// Type Scale Factors (Stage = 1.0 기준)
const TYPE_SCALE_FACTORS: Record<SectionType, number> = {
  Bar: 0.67,
  Rail: 0.58,
  Panel: 0.75,
  Stage: 1.0,
  Layer: 0.83,
  Float: 0.54,
};

// Prominence Scale Factors (Type별로 다름)
const PROMINENCE_SCALE_FACTORS: Record<SectionType, Record<Prominence, number>> = {
  Stage: {
    Hero: 1.5,
    Standard: 1.0,
    Strong: 0.875,
    Subtle: 0.875,
  },
  Panel: {
    Hero: 1.29,
    Standard: 1.0,
    Strong: 0.86,
    Subtle: 0.86,
  },
  Bar: {
    Hero: 1.43,
    Standard: 1.0,
    Strong: 0.86,
    Subtle: 0.86,
  },
  Rail: {
    Hero: 1.14,
    Standard: 1.0,
    Strong: 0.86,
    Subtle: 0.86,
  },
  Layer: {
    Hero: 1.5,
    Standard: 1.0,
    Strong: 0.875,
    Subtle: 0.875,
  },
  Float: {
    Hero: 1.08,
    Standard: 1.0,
    Strong: 0.92,
    Subtle: 0.92,
  },
};

// Density Factors
const DENSITY_FACTORS: Record<Density, number> = {
  Comfortable: 1.5,
  Standard: 1.0,
  Compact: 0.75,
};

// Base Values (Stage × Standard × Standard)
const BASE_VALUES = {
  gap: 16,
  paddingX: 12,
  paddingY: 8,
  fontSize: 16,
};

// Allowed spacing values
const ALLOWED_VALUES = [4, 8, 12, 16, 24, 32, 48, 64, 96];

function snapToAllowedValue(value: number): number {
  return ALLOWED_VALUES.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

/**
 * Calculate adaptive scale value
 * Formula: baseValue × typeScaleFactor × prominenceScaleFactor × densityFactor
 */
export function calculateAdaptiveScale(
  sectionType: SectionType,
  prominence: Prominence,
  density: Density,
  property: 'gap' | 'paddingX' | 'paddingY' | 'fontSize'
): number {
  // 1. Base value
  const baseValue = BASE_VALUES[property];

  // 2. Type scale factor
  const typeFactor = TYPE_SCALE_FACTORS[sectionType];

  // 3. Prominence scale factor (Type별로 다름)
  const prominenceFactor = PROMINENCE_SCALE_FACTORS[sectionType][prominence];

  // 4. Density factor
  const densityFactor = DENSITY_FACTORS[density];

  // 5. Calculate
  const rawValue = baseValue * typeFactor * prominenceFactor * densityFactor;

  // 6. Snap to allowed values
  return snapToAllowedValue(rawValue);
}

/**
 * Get Type Scale Token for a specific Section Type
 */
export function getTypeScaleToken(sectionType: SectionType): TypeScaleTokens {
  return TYPE_SCALE_TOKENS[sectionType];
}

/**
 * Calculate adaptive spacing (gap + padding)
 */
export interface AdaptiveSpacingResult {
  gap: number;
  paddingX: number;
  paddingY: number;
  className: string;
}

export function calculateAdaptiveSpacing(
  sectionType: SectionType,
  prominence: Prominence = 'Standard',
  density: Density = 'Standard'
): AdaptiveSpacingResult {
  const gap = calculateAdaptiveScale(sectionType, prominence, density, 'gap');
  const paddingX = calculateAdaptiveScale(sectionType, prominence, density, 'paddingX');
  const paddingY = calculateAdaptiveScale(sectionType, prominence, density, 'paddingY');

  // Convert to Tailwind classes
  const gapClass = `gap-${pxToTailwindClass(gap)}`;
  const pxClass = `px-${pxToTailwindClass(paddingX)}`;
  const pyClass = `py-${pxToTailwindClass(paddingY)}`;

  return {
    gap,
    paddingX,
    paddingY,
    className: `${gapClass} ${pxClass} ${pyClass}`,
  };
}

function pxToTailwindClass(value: number): string {
  const map: Record<number, string> = {
    4: '1',
    8: '2',
    12: '3',
    16: '4',
    24: '6',
    32: '8',
    48: '12',
    64: '16',
    96: '24',
  };
  return map[value] || '4';
}
```

### 6.4 Context Integration

```ts
// src/components/context/IDDLContext.tsx

export interface LayoutContextValue {
  sectionType: SectionType;  // NEW
  sectionRole: string;
  prominence: Prominence;
  density: Density;
  intent: Intent;
  depth: number;
}

// Section component에서 context 제공
<LayoutProvider value={{
  sectionType: computedType,  // Bar, Rail, Panel, Stage, Layer, Float
  sectionRole: role,
  prominence,
  density,
  intent,
  depth: 0,
}}>
  {children}
</LayoutProvider>
```

### 6.5 Block Component Integration

```tsx
// Block.tsx에서 adaptive spacing 사용

import { calculateAdaptiveSpacing } from '@/shared/config/adaptive-scale-tokens';

export function Block({ ... }: BlockProps) {
  // Context에서 Section Type 가져오기
  const layoutContext = useLayoutContext();
  const sectionType = layoutContext.sectionType || 'Stage'; // fallback

  // Adaptive spacing 계산
  const adaptiveSpacing = calculateAdaptiveSpacing(
    sectionType,
    computedProminence,
    computedDensity
  );

  const gapClasses = gap
    ? `gap-${gap}`  // manual override
    : adaptiveSpacing.className;

  // ...
}
```

---

## 7. Examples & Validation

### 7.1 Example: IDE Layout

```tsx
<Page template="Studio">
  {/* Header - Bar Type */}
  <Section role="Header" type="Bar">
    {/* Bar × Hero × Compact */}
    <Block role="Toolbar" prominence="Hero" density="Compact">
      {/* gap: 16 × 0.67 × 1.43 × 0.75 = 11.5 → 12px */}
      {/* paddingX: 12 × 0.67 × 1.43 × 0.75 = 8.6 → 8px */}
      <Action>파일</Action>
      <Action>편집</Action>
    </Block>
  </Section>

  {/* Sidebar - Panel Type */}
  <Section role="Sidebar" type="Panel">
    {/* Panel × Standard × Compact */}
    <Block role="List" prominence="Standard" density="Compact">
      {/* gap: 16 × 0.75 × 1.0 × 0.75 = 9 → 8px */}
      {/* paddingX: 12 × 0.75 × 1.0 × 0.75 = 6.75 → 8px */}
      <Block role="ListItem">파일 1</Block>
      <Block role="ListItem">파일 2</Block>
    </Block>
  </Section>

  {/* Main - Stage Type */}
  <Section role="Main" type="Stage">
    {/* Stage × Hero × Comfortable */}
    <Block role="Stack" prominence="Hero" density="Comfortable">
      {/* gap: 16 × 1.0 × 1.5 × 1.5 = 36 → 32px */}
      {/* paddingX: 12 × 1.0 × 1.5 × 1.5 = 27 → 24px */}
      <Text prominence="Hero">대시보드</Text>
      <Block role="Grid">...</Block>
    </Block>
  </Section>
</Page>
```

### 7.2 Validation Matrix

| Section Type | Prominence | Density | Gap | Padding X | Padding Y | Validated |
|--------------|------------|---------|-----|-----------|-----------|-----------|
| **Bar** | Hero | Compact | 12px | 8px | 4px | ✅ |
| Bar | Standard | Compact | 8px | 8px | 4px | ✅ |
| **Rail** | Standard | Compact | 8px | 4px | 4px | ✅ |
| **Panel** | Hero | Standard | 16px | 12px | 8px | ✅ |
| Panel | Standard | Compact | 8px | 8px | 4px | ✅ |
| **Stage** | Hero | Comfortable | 32px | 24px | 16px | ✅ |
| Stage | Standard | Standard | 16px | 12px | 8px | ✅ |
| **Layer** | Hero | Standard | 24px | 16px | 12px | ✅ |
| **Float** | Standard | Compact | 4px | 4px | 4px | ✅ |

### 7.3 Visual Comparison

```
Bar (Compact):     [  Icon  ] gap-8   [  Icon  ]     (작고 밀집)
Rail (Compact):    [  Icon  ] gap-4   [  Icon  ]     (매우 밀집)
Panel (Standard):  [ Button ] gap-12  [ Button ]     (적당한 간격)
Stage (Comfort):   [  Button  ] gap-32 [  Button  ]  (넓은 간격)
```

---

## 8. Next Steps

### 8.1 Phase 1: Foundation (Week 1-2)

- [ ] `type-scale-tokens.ts` 구현
- [ ] `adaptive-scale-tokens.ts` 구현
- [ ] `LayoutContext`에 `sectionType` 추가
- [ ] Section component에서 type 계산 및 context 제공

### 8.2 Phase 2: Integration (Week 3-4)

- [ ] Block component에 adaptive spacing 통합
- [ ] Text component에 adaptive font size 통합
- [ ] Action component에 adaptive height 통합
- [ ] Field component에 adaptive height/label 통합

### 8.3 Phase 3: Validation (Week 5-6)

- [ ] 모든 Type × Prominence × Density 조합 테스트
- [ ] Constraint 적용 검증
- [ ] Visual regression 테스트
- [ ] Documentation 작성

### 8.4 Future Enhancements

- [ ] Dynamic container-based adaptation
- [ ] Responsive breakpoint integration
- [ ] Custom Type Scale override support
- [ ] Performance optimization (memoization)

---

## Appendix A: Formula Derivation

### A.1 Type Scale Factor Calculation

```
목표: Stage를 1.0 기준으로 다른 Type의 배수 계산

방법:
1. Hero와 Standard의 비율을 각각 계산
2. 평균을 내어 Type Scale Factor 도출

Bar:
  Hero: 20 / 48 = 0.417
  Standard: 14 / 16 = 0.875
  Average: (0.417 + 0.875) / 2 = 0.646 ≈ 0.67

Panel:
  Hero: 18 / 48 = 0.375
  Standard: 14 / 16 = 0.875
  Average: (0.375 + 0.875) / 2 = 0.625 ≈ 0.75

Layer:
  Hero: 24 / 48 = 0.5
  Standard: 16 / 16 = 1.0
  Average: (0.5 + 1.0) / 2 = 0.75
  조정: 0.83 (Hero를 더 중시)
```

### A.2 Prominence Scale Factor Calculation

```
목표: Type 내에서 prominence 간 비율 계산

Stage:
  Hero / Standard = 48 / 16 = 3.0
  Standard = 1.0 (기준)
  Hero = 1.5 (sqrt(3.0) ≈ 1.73, 조정하여 1.5)
  Subtle = 14 / 16 = 0.875

Panel:
  Hero / Standard = 18 / 14 = 1.286
  Standard = 1.0
  Hero = 1.29
  Subtle = 12 / 14 = 0.857 ≈ 0.86
```

---

## Appendix B: Reference

- Section Type Spec: `docs/2-areas/spec/2-section/section-type-spec.md`
- Current Spacing System: `src/shared/config/spacing-tokens.ts`
- IDDL Context: `src/components/context/IDDLContext.tsx`

---

*End of Document*
