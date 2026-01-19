# 2차 토큰(2-Tier Tokens): 업계 표준 Composite & Semantic Patterns

**Date**: 2026-01-18
**Tags**: `#2tier-tokens` `#composite-tokens` `#semantic-tokens` `#design-system`
**Status**: Research & Documentation

---

## 목차

1. [개요](#개요)
2. [W3C Design Tokens Format 2025.10 표준](#w3c-design-tokens-format-202510-표준)
3. [업계 대표 2차 토큰 카테고리](#업계-대표-2차-토큰-카테고리)
4. [MDK 현재 상태와 비교](#mdk-현재-상태와-비교)
5. [구현 가이드라인](#구현-가이드라인)
6. [참고 자료](#참고-자료)

---

## 개요

### 2차 토큰(2-Tier Tokens)이란?

**2차 토큰**은 여러 1차 토큰(Primitive Tokens)을 조합하여 **특정 목적이나 컴포넌트에 최적화된 의미를 가진 토큰**입니다.

#### 토큰 계층 구조

```
1차 토큰 (Primitive Tokens)
  ├─ Space: n8 (8px), n16 (16px), n24 (24px)
  ├─ Size: n32 (32px), n40 (40px), n48 (48px)
  └─ FontSize: n12 (12px), n14 (14px), n16 (16px)
           ↓
2차 토큰 (Composite/Semantic Tokens)
  └─ ActionSize.md: { height: Size.n40, padding: Space.n10, fontSize: FontSize.n14 }
           ↓
컴포넌트 사용
  └─ <Action size="md">Save</Action>
```

#### 1차 vs 2차 토큰 비교

| 구분 | 1차 토큰 (Primitive) | 2차 토큰 (Composite/Semantic) |
|------|---------------------|------------------------------|
| **정의** | 원자적 디자인 값 | 1차 토큰의 조합 또는 의미론적 별칭 |
| **예시** | `Space.n8`, `Size.n40` | `ActionSize.md`, `Radius2.lg` |
| **목적** | 디자인 시스템의 기본 단위 | 특정 컨텍스트/컴포넌트 최적화 |
| **변경 빈도** | 낮음 (시스템 전체 영향) | 중간 (컴포넌트별 조정 가능) |
| **AI 선택** | 복잡 (너무 많은 선택지) | 간단 (목적 기반 선택) |

#### 2차 토큰의 두 가지 타입

1. **Composite Tokens**: 여러 속성을 하나의 객체로 묶음
   ```typescript
   ActionSize.md = {
     height: Size.n40,
     padding: Space.n10,
     fontSize: FontSize.n14,
     icon: IconSize.n20
   }
   ```

2. **Semantic Tokens**: 1차 토큰에 의미론적 이름을 부여
   ```typescript
   Radius2.md = Radius.n6  // "medium radius"의 의미를 부여
   ```

---

## W3C Design Tokens Format 2025.10 표준

**출처**: [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/drafts/format/)

W3C는 **6가지 공식 Composite Token 타입**을 정의합니다:

### 1. Shadow Token

**목적**: 그림자 효과를 정의 (box-shadow, text-shadow)

**구조**:
```json
{
  "shadow-raised": {
    "$type": "shadow",
    "$value": {
      "color": "#00000026",
      "offsetX": "0px",
      "offsetY": "2px",
      "blur": "4px",
      "spread": "0px"
    }
  }
}
```

**TypeScript 구현**:
```typescript
export const Shadow = {
  sm: {
    color: "rgba(0, 0, 0, 0.1)",
    offsetX: "0px",
    offsetY: "1px",
    blur: "2px",
    spread: "0px"
  },
  md: {
    color: "rgba(0, 0, 0, 0.15)",
    offsetX: "0px",
    offsetY: "2px",
    blur: "4px",
    spread: "0px"
  },
  lg: {
    color: "rgba(0, 0, 0, 0.2)",
    offsetX: "0px",
    offsetY: "4px",
    blur: "8px",
    spread: "0px"
  }
} as const;
```

### 2. Border Token

**목적**: 테두리 속성을 하나로 묶음 (border-width, border-style, border-color)

**구조**:
```json
{
  "border-emphasis": {
    "$type": "border",
    "$value": {
      "color": "{color.primary}",
      "width": "2px",
      "style": "solid"
    }
  }
}
```

**TypeScript 구현**:
```typescript
export const Border = {
  default: {
    width: BorderWidth.n1,
    style: "solid" as const,
    color: "var(--border-color)"
  },
  emphasis: {
    width: BorderWidth.n2,
    style: "solid" as const,
    color: "var(--primary-bg)"
  }
} as const;
```

### 3. Typography Token

**목적**: 텍스트 스타일을 완전히 정의 (font-family, size, weight, line-height, letter-spacing)

**구조**:
```json
{
  "typography-heading": {
    "$type": "typography",
    "$value": {
      "fontFamily": "{font.family.heading}",
      "fontSize": "{font.size.5}",
      "fontWeight": "{font.weight.bold}",
      "lineHeight": "1.2",
      "letterSpacing": "-0.02em"
    }
  }
}
```

**TypeScript 구현**:
```typescript
export const Typography = {
  heading: {
    fontFamily: "var(--font-family-heading)",
    fontSize: FontSize.n24,
    fontWeight: FontWeight.n600,
    lineHeight: LineHeight.n120,
    letterSpacing: "-0.02em"
  },
  body: {
    fontFamily: "var(--font-family-body)",
    fontSize: FontSize.n16,
    fontWeight: FontWeight.n400,
    lineHeight: LineHeight.n160,
    letterSpacing: "0em"
  }
} as const;
```

### 4. Transition Token

**목적**: CSS transition 속성 정의 (duration, timing-function, delay)

**구조**:
```json
{
  "transition-fast": {
    "$type": "transition",
    "$value": {
      "duration": "150ms",
      "timingFunction": "ease-in-out",
      "delay": "0ms"
    }
  }
}
```

### 5. Gradient Token

**목적**: 그라데이션 정의 (linear, radial)

**구조**:
```json
{
  "gradient-primary": {
    "$type": "gradient",
    "$value": {
      "type": "linear",
      "angle": "45deg",
      "stops": [
        { "color": "{color.primary}", "position": "0%" },
        { "color": "{color.secondary}", "position": "100%" }
      ]
    }
  }
}
```

### 6. Stroke Style Token

**목적**: 선 스타일 정의 (dashed, dotted 등)

---

## 업계 대표 2차 토큰 카테고리

### 3.1 Component Size Tokens (가장 보편적)

#### 개념

컴포넌트의 크기를 **T-shirt sizing** (xs, sm, md, lg, xl)로 추상화하여 일관된 크기 체계를 제공합니다.

#### 업계 사례

**Chakra UI, Tailwind, Radix, shadcn/ui** 등 거의 모든 디자인 시스템에서 사용:
- Button size: `sm`, `md`, `lg`
- Input size: `sm`, `md`, `lg`
- Icon size: `sm`, `md`, `lg`

#### 구조 패턴

하나의 size token은 다음 속성들을 포함:
- **height**: 컴포넌트 높이
- **padding**: 내부 여백 (좌우)
- **fontSize**: 텍스트 크기
- **iconSize**: 아이콘 크기 (optional)
- **borderRadius**: 모서리 둥글기 (optional)

#### 예시: ActionSize (MDK 현재 구현)

```typescript
export const ActionSize = {
  xs: {
    height: Size.n24,      // 24px
    icon: IconSize.n14,    // 14px
    padding: Space.n6,     // 6px
    fontSize: FontSize.n12 // 12px
  },
  sm: {
    height: Size.n32,      // 32px
    icon: IconSize.n16,    // 16px
    padding: Space.n8,     // 8px
    fontSize: FontSize.n13 // 13px
  },
  md: {
    height: Size.n40,      // 40px
    icon: IconSize.n20,    // 20px
    padding: Space.n10,    // 10px
    fontSize: FontSize.n14 // 14px
  },
  lg: {
    height: Size.n48,      // 48px
    icon: IconSize.n24,    // 24px
    padding: Space.n12,    // 12px
    fontSize: FontSize.n16 // 16px
  },
  xl: {
    height: Size.n56,      // 56px
    icon: IconSize.n28,    // 28px
    padding: Space.n16,    // 16px
    fontSize: FontSize.n18 // 18px
  }
} as const;
```

#### 사용 예시

```tsx
// AI가 직접 픽셀 값을 선택할 필요 없이 의미로 선택
<Action size="md">Save</Action>
<Action size="lg">Primary CTA</Action>
<Action size="sm" icon={IconPlus}>Add Item</Action>
```

#### 확장 가능한 컴포넌트

같은 패턴을 다른 컴포넌트에 적용 가능:

**InputSize**:
```typescript
export const InputSize = {
  sm: {
    height: Size.n32,
    padding: Space.n8,
    fontSize: FontSize.n13,
    iconSize: IconSize.n16
  },
  md: {
    height: Size.n40,
    padding: Space.n12,
    fontSize: FontSize.n14,
    iconSize: IconSize.n20
  },
  lg: {
    height: Size.n48,
    padding: Space.n16,
    fontSize: FontSize.n16,
    iconSize: IconSize.n24
  }
} as const;
```

**AvatarSize**:
```typescript
export const AvatarSize = {
  xs: { size: Size.n24, fontSize: FontSize.n10 },
  sm: { size: Size.n32, fontSize: FontSize.n12 },
  md: { size: Size.n40, fontSize: FontSize.n14 },
  lg: { size: Size.n48, fontSize: FontSize.n18 },
  xl: { size: Size.n64, fontSize: FontSize.n24 }
} as const;
```

---

### 3.2 Spacing Scale Tokens (Semantic Naming)

#### 개념

4px/8px 기반 spacing scale을 **의미론적 이름**으로 추상화합니다.

#### 업계 표준 패턴

**USWDS (U.S. Web Design System)**:
```typescript
export const SpacingScale = {
  xxs: Space.n4,   // 4px
  xs: Space.n8,    // 8px
  sm: Space.n12,   // 12px
  md: Space.n16,   // 16px
  lg: Space.n24,   // 24px
  xl: Space.n32,   // 32px
  xxl: Space.n48,  // 48px
  xxxl: Space.n64  // 64px
} as const;
```

**Carbon Design System**:
```typescript
export const Spacing = {
  spacing01: Space.n2,   // 2px
  spacing02: Space.n4,   // 4px
  spacing03: Space.n8,   // 8px
  spacing04: Space.n12,  // 12px
  spacing05: Space.n16,  // 16px
  spacing06: Space.n24,  // 24px
  spacing07: Space.n32,  // 32px
  spacing08: Space.n40,  // 40px
  spacing09: Space.n48,  // 48px
  spacing10: Space.n64,  // 64px
  spacing11: Space.n80,  // 80px
  spacing12: Space.n96   // 96px
} as const;
```

#### 사용 이점

```tsx
// ❌ Before: AI가 임의의 spacing 값 선택
<Frame override={{ gap: Space.n14, p: Space.n18 }}>

// ✅ After: 의미론적으로 선택
<Frame override={{ gap: SpacingScale.sm, p: SpacingScale.md }}>
```

---

### 3.3 Radius Tokens (Semantic Aliases)

#### 개념

border-radius 값에 **의미론적 크기 이름**을 부여합니다.

#### MDK 현재 구현 (Radius2)

```typescript
export const Radius2 = {
  none: Radius.n0,      // 0px
  sm: Radius.n4,        // 4px
  md: Radius.n6,        // 6px
  lg: Radius.n12,       // 12px
  xl: Radius.n16,       // 16px
  "2xl": Radius.n20,    // 20px
  "3xl": Radius.n24,    // 24px
  full: Radius.n9999    // 9999px (완전한 원)
} as const;
```

#### 업계 사례

**Tailwind CSS**:
- `rounded-none`, `rounded-sm`, `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`

**Material Design**:
- `none`, `extra-small`, `small`, `medium`, `large`, `extra-large`, `full`

#### 컨텍스트별 Radius

일부 디자인 시스템은 **컨텍스트별 radius**를 정의:

```typescript
export const RadiusContext = {
  card: Radius2.lg,
  button: Radius2.md,
  input: Radius2.md,
  modal: Radius2.xl,
  avatar: Radius2.full
} as const;
```

---

### 3.4 Elevation Tokens (Shadow + Z-Index)

#### 개념

**Elevation = Shadow + Z-Index** 조합으로 요소의 "높이" 표현합니다.

#### Shopify Polaris 패턴

```typescript
export const Elevation = {
  flat: {
    shadow: "none",
    zIndex: ZIndex.n0
  },
  raised: {
    shadow: "0 1px 3px rgba(0,0,0,0.1)",
    zIndex: ZIndex.n10
  },
  floating: {
    shadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: ZIndex.n20
  },
  overlay: {
    shadow: "0 8px 24px rgba(0,0,0,0.2)",
    zIndex: ZIndex.n30
  }
} as const;
```

#### Material Design Elevation Scale

Material Design은 0~24까지의 elevation 숫자 시스템 사용:
- `elevation-0`: flat (no shadow)
- `elevation-1`: 1dp 높이
- `elevation-2`: 2dp 높이
- ...
- `elevation-24`: 최대 높이 (modal, dialog)

#### 사용 예시

```tsx
<Card elevation="raised">
  <Text>Slightly elevated card</Text>
</Card>

<Modal elevation="overlay">
  <Text>Modal content</Text>
</Modal>
```

---

### 3.5 Typography Tokens (Font Combinations)

#### 개념

**font-family, size, weight, line-height, letter-spacing**을 하나의 토큰으로 묶습니다.

#### Atlassian Design System 패턴

```typescript
export const TypographyStyle = {
  h1: {
    fontFamily: "var(--font-family-heading)",
    fontSize: FontSize.n32,
    fontWeight: FontWeight.n700,
    lineHeight: LineHeight.n120,
    letterSpacing: "-0.03em"
  },
  h2: {
    fontFamily: "var(--font-family-heading)",
    fontSize: FontSize.n24,
    fontWeight: FontWeight.n600,
    lineHeight: LineHeight.n130,
    letterSpacing: "-0.02em"
  },
  body: {
    fontFamily: "var(--font-family-body)",
    fontSize: FontSize.n16,
    fontWeight: FontWeight.n400,
    lineHeight: LineHeight.n160,
    letterSpacing: "0em"
  },
  caption: {
    fontFamily: "var(--font-family-body)",
    fontSize: FontSize.n12,
    fontWeight: FontWeight.n500,
    lineHeight: LineHeight.n150,
    letterSpacing: "0.05em"
  }
} as const;
```

#### MDK Prose System 비교

MDK는 이미 **Prose 토큰 시스템**을 사용 중:
```css
--prose-h1-size: 80px;
--prose-h1-height: 1.1;
--prose-h1-spacing: -0.03em;
--prose-h1-weight: 700;
```

이를 2차 토큰으로 추상화 가능:
```typescript
export const ProseStyle = {
  h1: {
    fontSize: "var(--prose-h1-size)",
    lineHeight: "var(--prose-h1-height)",
    letterSpacing: "var(--prose-h1-spacing)",
    fontWeight: "var(--prose-h1-weight)"
  },
  // ... 기타 스타일
} as const;
```

---

### 3.6 Layout Recipe Patterns (Panda CSS)

#### 개념

**Panda CSS의 Recipe 시스템**: 여러 CSS 속성을 묶어 variant 시스템으로 제공합니다.

#### Recipe 구조

```typescript
const button = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  variants: {
    size: {
      sm: { padding: Space.n4, fontSize: FontSize.n12 },
      md: { padding: Space.n8, fontSize: FontSize.n14 },
      lg: { padding: Space.n12, fontSize: FontSize.n16 }
    },
    variant: {
      solid: { bg: 'primary', color: 'white' },
      outline: { border: '1px solid', borderColor: 'primary' },
      ghost: { bg: 'transparent' }
    }
  },
  compoundVariants: [
    {
      size: 'sm',
      variant: 'solid',
      css: { minWidth: Size.n64 }
    }
  ],
  defaultVariants: {
    size: 'md',
    variant: 'solid'
  }
})
```

#### MDK Layout 시스템과 비교

MDK는 이미 **Layout 프리셋 시스템**을 사용 중:
```typescript
Layout.Row.Middle.Center  // 2-tier semantic layout
```

Panda CSS의 recipe는 **런타임 variant 선택**에 더 적합하고, MDK Layout은 **정적 프리셋**에 더 적합합니다.

---

### 3.7 Container Size Tokens

#### 개념

콘텐츠 너비를 **의미론적 breakpoint**로 추상화합니다.

#### 업계 표준 패턴

**Tailwind CSS Container Sizes**:
```typescript
export const Container = {
  sm: ContainerSize.n640,   // 640px
  md: ContainerSize.n768,   // 768px
  lg: ContainerSize.n1024,  // 1024px
  xl: ContainerSize.n1280,  // 1280px
  "2xl": ContainerSize.n1536 // 1536px
} as const;
```

**Bootstrap Grid**:
```typescript
export const GridContainer = {
  xs: ContainerSize.n100p,  // 100% (fluid)
  sm: ContainerSize.n540,   // 540px
  md: ContainerSize.n720,   // 720px
  lg: ContainerSize.n960,   // 960px
  xl: ContainerSize.n1140,  // 1140px
  xxl: ContainerSize.n1320  // 1320px
} as const;
```

#### MDK 현재 상태

MDK는 이미 `ContainerSize` 1차 토큰을 사용 중:
```typescript
export const ContainerSize = {
  n640: "var(--container-n640)" as ContainerSizeToken,
  n768: "var(--container-n768)" as ContainerSizeToken,
  n1024: "var(--container-n1024)" as ContainerSizeToken,
  n1280: "var(--container-n1280)" as ContainerSizeToken
}
```

2차 토큰으로 semantic alias 추가 가능:
```typescript
export const Container2 = {
  narrow: ContainerSize.n640,
  content: ContainerSize.n768,
  wide: ContainerSize.n1024,
  full: ContainerSize.n1280
} as const;
```

---

### 3.8 Transition/Animation Tokens

#### 개념

**duration + timing-function + delay**를 하나의 토큰으로 묶습니다.

#### 업계 패턴

**Material Design Motion**:
```typescript
export const Motion = {
  instant: {
    duration: "0ms",
    timingFunction: "linear",
    delay: "0ms"
  },
  fast: {
    duration: "150ms",
    timingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    delay: "0ms"
  },
  moderate: {
    duration: "250ms",
    timingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    delay: "0ms"
  },
  slow: {
    duration: "400ms",
    timingFunction: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    delay: "0ms"
  }
} as const;
```

**Chakra UI Transition**:
```typescript
export const Transition = {
  "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
  "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
} as const;

export const Duration = {
  "ultra-fast": "50ms",
  "faster": "100ms",
  "fast": "150ms",
  "normal": "200ms",
  "slow": "300ms",
  "slower": "400ms",
  "ultra-slow": "500ms"
} as const;
```

---

## MDK 현재 상태와 비교

### 현재 구현된 2차 토큰

| 토큰 | 타입 | 구현 상태 | 비고 |
|------|------|-----------|------|
| `ActionSize` | Composite | ✅ 완료 | xs~xl, height/icon/padding/fontSize 조합 |
| `Radius2` | Semantic Alias | ✅ 완료 | sm~3xl, full |
| `Layout` | Composite | ✅ 완료 | Row/Col + Cross/Main axis 조합 (자동 생성) |

### 업계 표준 대비 커버리지

| 카테고리 | 업계 사용 빈도 | MDK 구현 상태 | 우선순위 |
|----------|---------------|---------------|----------|
| Component Size (Button, Input 등) | 🔥🔥🔥 매우 높음 | ✅ ActionSize 구현됨 | - |
| Spacing Scale (sm, md, lg) | 🔥🔥🔥 매우 높음 | ❌ 미구현 (1차 토큰만 존재) | **HIGH** |
| Radius Semantic | 🔥🔥 높음 | ✅ Radius2 구현됨 | - |
| Typography Composite | 🔥🔥 높음 | ⚠️ 부분 구현 (Prose CSS vars) | **MEDIUM** |
| Elevation (Shadow + Z-Index) | 🔥 중간 | ❌ 미구현 | **MEDIUM** |
| Container Size | 🔥 중간 | ⚠️ 1차 토큰만 (semantic alias 없음) | **LOW** |
| Border Composite | 🔥 중간 | ❌ 미구현 | **LOW** |
| Transition/Motion | 🔥 중간 | ❌ 미구현 | **LOW** |

### 추가 고려 가능한 2차 토큰

#### 1. SpacingScale (우선순위: HIGH)

**이유**: AI가 `Space.n8`, `Space.n12`, `Space.n16` 중 선택하는 것보다 `SpacingScale.sm`, `SpacingScale.md`로 선택하는 것이 명확함

**구현 제안**:
```typescript
export const SpacingScale = {
  xxs: Space.n4,   // 4px
  xs: Space.n8,    // 8px
  sm: Space.n12,   // 12px
  md: Space.n16,   // 16px
  lg: Space.n24,   // 24px
  xl: Space.n32,   // 32px
  xxl: Space.n48,  // 48px
  xxxl: Space.n64  // 64px
} as const;
```

#### 2. InputSize (우선순위: HIGH)

**이유**: Form field는 Button만큼 자주 사용되는 컴포넌트

**구현 제안**:
```typescript
export const InputSize = {
  sm: {
    height: Size.n32,
    padding: Space.n8,
    fontSize: FontSize.n13,
    iconSize: IconSize.n16
  },
  md: {
    height: Size.n40,
    padding: Space.n12,
    fontSize: FontSize.n14,
    iconSize: IconSize.n20
  },
  lg: {
    height: Size.n48,
    padding: Space.n16,
    fontSize: FontSize.n16,
    iconSize: IconSize.n24
  }
} as const;
```

#### 3. Elevation (우선순위: MEDIUM)

**이유**: Modal, Dropdown, Card 등에서 depth 표현 필요

**구현 제안**:
```typescript
export const Elevation = {
  flat: {
    shadow: "none",
    zIndex: ZIndex.n0
  },
  raised: {
    shadow: "var(--shadow-sm)",
    zIndex: ZIndex.n10
  },
  floating: {
    shadow: "var(--shadow-md)",
    zIndex: ZIndex.n20
  },
  overlay: {
    shadow: "var(--shadow-lg)",
    zIndex: ZIndex.n30
  }
} as const;
```

#### 4. TypographyStyle (우선순위: MEDIUM)

**이유**: 현재 Prose CSS vars를 TypeScript 토큰으로 추상화하면 일관성 향상

**구현 제안**:
```typescript
export const TypographyStyle = {
  h1: {
    fontSize: "var(--prose-h1-size)",
    lineHeight: "var(--prose-h1-height)",
    letterSpacing: "var(--prose-h1-spacing)",
    fontWeight: "var(--prose-h1-weight)"
  },
  body: {
    fontSize: "var(--prose-body-size)",
    lineHeight: "var(--prose-body-height)",
    letterSpacing: "var(--prose-body-spacing)",
    fontWeight: "var(--prose-body-weight)"
  }
  // ... 기타
} as const;
```

---

## 구현 가이드라인

### TypeScript 구현 패턴

#### 1. Composite Token (객체 조합)

```typescript
// Step 1: Scale 정의 (검증용)
export const ActionSizeScale = ["xs", "sm", "md", "lg", "xl"] as const;
export type ActionSizeScale = (typeof ActionSizeScale)[number];

// Step 2: Token 객체 정의
export const ActionSize = {
  xs: {
    height: Size.n24,
    icon: IconSize.n14,
    padding: Space.n6,
    fontSize: FontSize.n12
  },
  sm: {
    height: Size.n32,
    icon: IconSize.n16,
    padding: Space.n8,
    fontSize: FontSize.n13
  },
  md: {
    height: Size.n40,
    icon: IconSize.n20,
    padding: Space.n10,
    fontSize: FontSize.n14
  },
  lg: {
    height: Size.n48,
    icon: IconSize.n24,
    padding: Space.n12,
    fontSize: FontSize.n16
  },
  xl: {
    height: Size.n56,
    icon: IconSize.n28,
    padding: Space.n16,
    fontSize: FontSize.n18
  }
} as const;

// Step 3: Type export
export type ActionSizeToken = keyof typeof ActionSize;
```

#### 2. Semantic Alias Token (단순 매핑)

```typescript
// Step 1: Scale 정의
export const Radius2Scale = [
  "none", "sm", "md", "lg", "xl", "2xl", "3xl", "full"
] as const;
export type Radius2Scale = (typeof Radius2Scale)[number];

// Step 2: Branded type 정의 (optional, 더 강한 타입 안전성)
export type Radius2Token = Brand<string, "Radius2">;

// Step 3: Token 객체 정의
export const Radius2 = {
  none: Radius.n0 as unknown as Radius2Token,
  sm: Radius.n4 as unknown as Radius2Token,
  md: Radius.n6 as unknown as Radius2Token,
  lg: Radius.n12 as unknown as Radius2Token,
  xl: Radius.n16 as unknown as Radius2Token,
  "2xl": Radius.n20 as unknown as Radius2Token,
  "3xl": Radius.n24 as unknown as Radius2Token,
  full: Radius.n9999 as unknown as Radius2Token
} as const;
```

#### 3. Branded Type 적용 (선택 사항)

**목적**: AI가 임의의 숫자나 문자열을 사용하지 못하도록 강제

```typescript
import type { Brand } from "./lib/brand";

// Branded type 정의
export type SpacingScaleToken = Brand<string, "SpacingScale">;

// 1차 토큰을 Branded type으로 캐스팅
export const SpacingScale = {
  xxs: Space.n4 as unknown as SpacingScaleToken,
  xs: Space.n8 as unknown as SpacingScaleToken,
  sm: Space.n12 as unknown as SpacingScaleToken,
  md: Space.n16 as unknown as SpacingScaleToken,
  lg: Space.n24 as unknown as SpacingScaleToken,
  xl: Space.n32 as unknown as SpacingScaleToken
} as const;

// 사용 예시
function setGap(gap: SpacingScaleToken) { ... }

setGap(SpacingScale.md);  // ✅ OK
setGap(Space.n16);        // ❌ Error: SpaceToken is not SpacingScaleToken
setGap("16px");           // ❌ Error: string is not SpacingScaleToken
```

### 네이밍 컨벤션

#### 1. Composite Token 네이밍

**패턴**: `{Component}{Property}` or `{Context}{Property}`

```typescript
ActionSize    // Button/Action 컴포넌트의 Size
InputSize     // Input 컴포넌트의 Size
AvatarSize    // Avatar 컴포넌트의 Size
TypographyStyle  // Typography 스타일
Elevation     // Elevation 컨텍스트
```

#### 2. Semantic Alias 네이밍

**패턴**: `{Property}2` (2차 토큰임을 명시)

```typescript
Radius2       // Radius의 semantic alias
Spacing2      // Spacing의 semantic alias (제안)
Container2    // Container의 semantic alias (제안)
```

#### 3. Scale 값 네이밍

**T-shirt sizing** (가장 보편적):
```typescript
"xs" | "sm" | "md" | "lg" | "xl" | "xxl"
```

**숫자 스케일** (Carbon, IBM 스타일):
```typescript
"01" | "02" | "03" | "04" | "05" | "06"
```

**의미론적 네이밍** (Material Design 스타일):
```typescript
"none" | "extra-small" | "small" | "medium" | "large" | "extra-large"
```

**MDK 권장**: T-shirt sizing (`xs`, `sm`, `md`, `lg`, `xl`)
- 업계 표준
- 간결함
- AI가 이해하기 쉬움

---

## 구현 우선순위 제안

### Phase 1: Essential (즉시 구현 권장)

1. **SpacingScale** - T-shirt sizing으로 spacing 추상화
2. **InputSize** - Form 컴포넌트에 필수적

### Phase 2: Important (중기 구현)

3. **Elevation** - Modal, Dropdown 등에 필요
4. **TypographyStyle** - Prose CSS vars를 TypeScript로 마이그레이션

### Phase 3: Nice to Have (장기 구현)

5. **Container2** - Semantic container aliases
6. **Border** - Composite border token
7. **Transition** - Animation/transition presets

---

## 참고 자료

### W3C 공식 표준
- [Design Tokens Format Module 2025.10](https://www.designtokens.org/tr/drafts/format/)

### 주요 디자인 시스템 문서
- [Atlassian Design System - Design Tokens](https://atlassian.design/foundations/design-tokens)
- [Shopify Polaris - Shadow & Elevation Tokens](https://polaris-react.shopify.com/design/depth/shadow-tokens)
- [USWDS - Design Tokens](https://designsystem.digital.gov/design-tokens/)
- [Carbon Design System - Spacing](https://carbondesignsystem.com/elements/spacing/overview/)
- [Chakra UI - Design Tokens](https://chakra-ui.com/docs/theming/tokens)
- [Panda CSS - Recipes](https://panda-css.com/docs/concepts/recipes)

### 참고 아티클
- [The Pyramid Design Token Structure](https://stefaniefluin.medium.com/the-pyramid-design-token-structure-the-best-way-to-format-organize-and-name-your-design-tokens-ca81b9d8836d)
- [Design Tokens Beyond Colors, Typography, and Spacing](https://medium.com/bumble-tech/design-tokens-beyond-colors-typography-and-spacing-ad7c98f4f228)
- [Semantic Colour Tokens in Action](https://www.fourzerothree.in/p/semantic-colour-tokens-in-action)

### MDK 내부 문서
- `src/design-system/token/token.const.1tier.ts` - 1차 토큰 정의
- `src/design-system/token/token.const.2tier.ts` - 2차 토큰 정의 (현재)
- `layout.config.ts` - Layout 2차 토큰 설정

---

## 결론

**2차 토큰의 핵심 가치**:
1. **AI 의사결정 단순화**: 100개의 1차 토큰 대신 10개의 의미론적 2차 토큰 선택
2. **일관성 향상**: 컴포넌트별 최적화된 값 조합 제공
3. **유지보수성**: 하나의 토큰 수정으로 전체 시스템 업데이트
4. **DX 개선**: 개발자가 "왜 이 값인지" 이해하기 쉬움

**MDK의 다음 단계**:
- ✅ ActionSize, Radius2, Layout은 이미 우수한 구현
- 🚀 SpacingScale, InputSize 추가로 커버리지 확대
- 🎯 장기적으로 Elevation, TypographyStyle 등으로 완성도 향상

이 문서가 MDK의 2차 토큰 확장에 도움이 되기를 바랍니다! 🎨
